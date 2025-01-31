import { Achievement, pattern2 } from '@/types/achievement'
import { AchievementSeries } from '@/types/achievementSeries'
import { ref } from 'vue'
import { defineStore, storeToRefs } from 'pinia'
import { useUserAchievementStore } from '@/stores/userAchievement'
import { useTextjoinStore } from '@/stores/textjoin'
import { useAchievementSelectVersionListStore } from '@/stores/achievementSelectVersionList'
import { useAchievementCustomNotAchievedStore } from '@/stores/achievementCustomNotAchieved'
import { useAchievementInfoStore } from '@/stores/achievementInfo'
import { useAchievementSeriesInfoStore } from '@/stores/achievementSeriesInfo'
import { useAchievementMultipleChoiceStore } from '@/stores/achievementMultipleChoice'
import { useAchievementNotAvailableStore } from '@/stores/achievementNotAvailable'
import { useAchievementStrategyStore } from '@/stores/achievementStrategy'

const userAchievementStore = useUserAchievementStore()
const { findUserAchievementList, handleUserAchievementList } = userAchievementStore

const textjoinStore = useTextjoinStore();
const { textjoinSelectList } = textjoinStore;

const achievementSelectVersionListStore = useAchievementSelectVersionListStore()
const { handleSelectVersionList } = achievementSelectVersionListStore

const achievementCustomNotAchievedStore = useAchievementCustomNotAchievedStore()
const { findUserCustomNotAchievedList, handleUserCustomNotAchievedList } = achievementCustomNotAchievedStore

const achievementInfoStore = useAchievementInfoStore()
const { initialAchievementInfo } = achievementInfoStore

const achievementSeriesInfoStore = useAchievementSeriesInfoStore()
const { initialAchievementSeriesInfo } = achievementSeriesInfoStore

const achievementMultipleChoiceStore = useAchievementMultipleChoiceStore()
const { multipleChoice } = storeToRefs(achievementMultipleChoiceStore)
const { initialAchievementMultipleChoice } = achievementMultipleChoiceStore

const achievementNotAvailableStore = useAchievementNotAvailableStore()
const { notAvailable } = storeToRefs(achievementNotAvailableStore)
const { initialAchievementNotAvailable } = achievementNotAvailableStore

const achievementStrategyStore = useAchievementStrategyStore()
const { initialAchievementStrategy, initialStrategyInfo } = achievementStrategyStore;

export const useAchievementStore = defineStore('achievement', () => {
    const StellarJadeImg= "https://webstatic.mihoyo.com/upload/event/2023/03/28/77cb5426637574ba524ac458fa963da0_8938800417123864478.png"

    //初始化成就状态列表
    const initialAchievementsStatus = () => {
        const userAchievementList = findUserAchievementList()?.list ?? []
        
        achievements.value.forEach(achievement => {
            const userAch_ = userAchievementList[achievement.AchievementID]
            // console.log(userAch_)
            if(!userAch_) achievement.Status = 1
            else if(userAch_.status === 2 && !achievement?.MultipleID){
                achievement.Status = 1
                handleUserAchievementList(achievement.AchievementID, achievement.Status)
            }
            else if(userAch_.status === 3 && achievement?.MultipleID) {
                achievement.Status = userAch_.status
                
                multipleChoice.value[achievement.MultipleID].forEach(AchievementID => {
                    if(AchievementID !== achievement.AchievementID){
                        const ach_ = achievements.value.find(ach => ach.AchievementID === AchievementID)
                        if(ach_ && ach_.Status !== 2){
                            ach_.Status = 2
                            handleUserAchievementList(ach_.AchievementID, ach_.Status)
                        } 
                    }
                })
            }
            else achievement.Status = userAch_.status
        })
    }

    //初始化多选一成就列表
    const initialMultipleChoice = () => {
        for(const [multipleID, achievementIDs] of Object.entries(multipleChoice.value)){
            for(const achievementID of achievementIDs) {
                const ach_ = achievements.value.find(ach => ach.AchievementID === achievementID)
                if(!ach_) continue
                ach_.MultipleID = multipleID
                // console.log(ach_)
            }
        }
    }

    //初始化暂时无法获得成就列表
    const initialNotAvailable = () => {
        for(const notAvailableAchievement of Object.values(notAvailable.value)){
            const ach_ = achievements.value.find(ach => ach.AchievementID === notAvailableAchievement.AchievementID)
            if(!ach_) continue
            // 添加暂不可获得时间戳
            ach_.timestamp = notAvailableAchievement.timestamp
            // console.log(ach_)
            if(!ach_.isNotAvailable) continue

            // 如果暂不可获得，判断当前状态，若状态为非未完成状态则进行修正
            if(ach_.Status !== 1){
                ach_.Status = 1
                handleUserAchievementList(ach_.AchievementID, ach_.Status)
            }
        }
    }

    //初始化自定义暂不可获取
    const initialAchievementsCustomNotAchievedStatus = () => {
        const userCustomNotAchievedList = findUserCustomNotAchievedList()?.list ?? []
        
        const isMultipleCustomNotAchievedList = []  // 已设为自定义暂不可获取的多选一成就 ID 列表

        achievements.value.forEach(achievement => {
            const userAch_ = userCustomNotAchievedList[achievement.AchievementID]
            // console.log(userAch_)
            if(isMultipleCustomNotAchievedList.includes(achievement.AchievementID)) return
            else if(!userAch_) achievement.CustomNotAchieved = false
            else if(userAch_.status === false) {
                achievement.CustomNotAchieved = userAch_.status
            }
            else if(userAch_.status === true && achievement?.MultipleID) {
                achievement.CustomNotAchieved = userAch_.status
                isMultipleCustomNotAchievedList.push(achievement.AchievementID)

                // 自定义暂不可获得，判断当前状态，若状态为非未完成状态则进行修正
                if(achievement.Status !== 1){
                    achievement.Status = 1
                    handleUserAchievementList(achievement.AchievementID, achievement.Status)
                }

                multipleChoice.value[achievement.MultipleID].forEach(AchievementID => {
                    if(AchievementID === achievement.AchievementID) return

                    const ach_ = achievements.value.find(ach => ach.AchievementID === AchievementID)

                    if(!ach_) return

                    ach_.CustomNotAchieved = true

                    if(userCustomNotAchievedList[AchievementID] !== true){
                        handleUserCustomNotAchievedList(ach_.AchievementID, ach_.CustomNotAchieved)
                    }

                    isMultipleCustomNotAchievedList.push(AchievementID)                    
                    
                    // 自定义暂不可获得，判断当前状态，若状态为非未完成状态则进行修正
                    if(ach_.Status !== 1){
                        ach_.Status = 1
                        handleUserAchievementList(ach_.AchievementID, ach_.Status)
                    }
                })
            }
            else {
                achievement.CustomNotAchieved = userAch_.status

                // 自定义暂不可获得，判断当前状态，若状态为非未完成状态则进行修正
                if(achievement.Status !== 1){
                    achievement.Status = 1
                    handleUserAchievementList(achievement.AchievementID, achievement.Status)
                }
            }
        })
    }

    const achievements = ref([])
    const achievementSeries = ref([])

    const initialAchievementsInfo = async () => {
        return Promise.all([
            initialAchievementInfo(),
            initialAchievementSeriesInfo(),
            initialAchievementMultipleChoice(),
            initialAchievementNotAvailable(),
            initialAchievementStrategy(),
            initialStrategyInfo()
        ])
        .then(([achievementInfo, achievementseries, multiplechoice, notavailable, achievementsteategy, strategyinfo]) => {
            achievements.value = []
            achievementSeries.value = []

            // 打印转换后的数据
            // console.log(achievementInfo, achievementSeries)
            const ALLTEXTJOIN = new Set()

            Object.values(achievementInfo).forEach(value => {
                if (process.env.NODE_ENV === 'development') {
                    const matches = value.AchievementDesc.match(pattern2)

                    if(matches){
                        matches.forEach(match => {
                            ALLTEXTJOIN.add(match.substring(1, match.length - 1))
                        })
                    }
                }
    
                achievements.value.push(new Achievement(value))
            })

            if (process.env.NODE_ENV === 'development') {
                console.log(ALLTEXTJOIN)
                const textjoinIDs = Object.keys(textjoinSelectList)

                function arraysHaveSameElements(arr1, arr2) {
                    return new Set(arr1).size === new Set(arr2).size && [...arr1].every(element => new Set(arr2).has(element));
                }

                if(!arraysHaveSameElements(ALLTEXTJOIN, textjoinIDs)) {
                    ElMessage({
                        showClose: true,
                        message: 'TEXTJOIN 数据存在异常，请及时检查',
                        type: 'error',
                    })
                } 
            }

            initialMultipleChoice()
            initialAchievementsStatus()
            initialNotAvailable()
            initialAchievementsCustomNotAchievedStatus()

            achievements.value.sort((a, b) => {
                const SeriesPriorityA = achievementseries[a.SeriesID].Priority
                const SeriesPriorityB = achievementseries[b.SeriesID].Priority
                if (SeriesPriorityA !== SeriesPriorityB) 
                    return SeriesPriorityB - SeriesPriorityA 
                return b.Priority - a.Priority 
            })

            achievementSeries.value.push(new AchievementSeries({
                SeriesID: 0,
                SeriesTitle: "ALL",
                imagePath: "/src/images/series/achievement.png",
                imageDarkPath: "/src/images/series-dark/achievement.png",
                Priority: 10
            }, achievements.value))
            handleSelectVersionList(0, achievements.value)

            Object.values(achievementseries).forEach(value => {
                const achs = achievements.value.filter(achievement => achievement.SeriesID === value.SeriesID)
                achievementSeries.value.push(new AchievementSeries(value, achs))
                handleSelectVersionList(value.SeriesID, achs)
            })

            achievementSeries.value.sort((a, b) => {
                return b.Priority - a.Priority 
            })

            return Promise.resolve();
        })
        .catch(error => {
            // 处理加载或转换错误
            console.error(error);
            return Promise.reject(error);
        });
    }

    //#region 成就选中相关逻辑
    const handleAchevementStatus = (achievement, save = true) => {
        if(!(achievement instanceof Achievement)){
            throw new Error("传入achievement不是Achievement类型")
        }
        if (achievement.isNotAvailable) return

        if (achievement.Status === 1) {
            // 修改成就状态为已完成
            achievement.Status = 3
            handleUserAchievementList(achievement.AchievementID, achievement.Status, save)
            if(achievement?.MultipleID){
                // 修改成就状态为无法完成
                multipleChoice.value[achievement.MultipleID].forEach(AchievementID => {
                    if(AchievementID !== achievement.AchievementID){
                        const ach_ = achievements.value.find(ach => ach.AchievementID === AchievementID)
                        if(ach_){
                            ach_.Status = 2
                            handleUserAchievementList(ach_.AchievementID, ach_.Status, save)
                        } 
                    }
                })
            }
            return
        }
        else if (achievement.Status === 3) {
            // 修改成就状态为未完成
            achievement.Status = 1
            handleUserAchievementList(achievement.AchievementID, achievement.Status, save)
            if(achievement?.MultipleID){
                // 修改成就状态为未完成
                multipleChoice.value[achievement.MultipleID].forEach(AchievementID => {
                    if(AchievementID !== achievement.AchievementID){
                        const ach_ = achievements.value.find(ach => ach.AchievementID === AchievementID)
                        if(ach_){
                            ach_.Status = 1
                            handleUserAchievementList(ach_.AchievementID, ach_.Status, save)
                        } 
                    }
                })
            }
            return
        }
    }
    //#endregion

    //#region 自定义暂不可获取成就相关逻辑
    const AchievementToCustomNotAchieved = (achievement) => {
        if (achievement.Status !== 1) {
            achievement.Status = 1
            handleUserAchievementList(achievement.AchievementID, achievement.Status)
        }

        achievement.CustomNotAchieved = true
        handleUserCustomNotAchievedList(achievement.AchievementID, achievement.CustomNotAchieved)

        if(achievement?.MultipleID){
            multipleChoice.value[achievement.MultipleID].forEach(AchievementID => {
                if(AchievementID !== achievement.AchievementID){
                    const ach_ = achievements.value.find(ach => ach.AchievementID === AchievementID)
                    if(ach_){
                        if(ach_.Status !== 1){
                            ach_.Status = 1
                            handleUserAchievementList(ach_.AchievementID, ach_.Status)
                        }

                        ach_.CustomNotAchieved = true
                        handleUserCustomNotAchievedList(ach_.AchievementID, ach_.CustomNotAchieved)
                    } 
                }
            })
        }
    } 

    const AchievementCancelCustomNotAchieved = (achievement) => {
        if (achievement.Status !== 1) {
            achievement.Status = 1
            handleUserAchievementList(achievement.AchievementID, achievement.Status)
        }

        achievement.CustomNotAchieved = false
        handleUserCustomNotAchievedList(achievement.AchievementID, achievement.CustomNotAchieved)

        if(achievement?.MultipleID){
            multipleChoice.value[achievement.MultipleID].forEach(AchievementID => {
                if(AchievementID !== achievement.AchievementID){
                    const ach_ = achievements.value.find(ach => ach.AchievementID === AchievementID)
                    if(ach_){
                        if(ach_.Status !== 1){
                            ach_.Status = 1
                            handleUserAchievementList(ach_.AchievementID, ach_.Status)
                        }

                        ach_.CustomNotAchieved = false
                        handleUserCustomNotAchievedList(ach_.AchievementID, ach_.CustomNotAchieved)
                    } 
                }
            })
        }
    }
    //#endregion

    const getMultipleIDAchievemnetTitles = (achievement) => {
        if(achievement?.MultipleID){
            return multipleChoice.value[achievement.MultipleID].map(AchievementID => {
                const ach_ = achievements.value.find(ach => ach.AchievementID === AchievementID)
                if(ach_){
                    return ach_.AchievementTitle
                }
            })
        }
        else return [achievement.AchievementTitle]
    }

    return {  
        StellarJadeImg, 
        achievements,
        achievementSeries,
        initialAchievementsStatus,
        initialNotAvailable,
        initialAchievementsCustomNotAchievedStatus,
        initialAchievementsInfo,
        handleAchevementStatus,
        AchievementToCustomNotAchieved,
        AchievementCancelCustomNotAchieved,
        getMultipleIDAchievemnetTitles
    }
})
