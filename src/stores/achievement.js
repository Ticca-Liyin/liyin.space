import { nextTick, watch, computed, ref } from 'vue'
import { defineStore, storeToRefs } from 'pinia'
import { useAuthorStore } from '@/stores/author'
import { useUserInfoStore } from '@/stores/userInfo'
import { achievementInfoVersion, achievementSeriesVersion, multipleChoiceVersion,
     notAvailableAchievementVersion, achievementStrategyVersion, strategyInfoVersion } 
     from '@/utils/version.js'

const authorStore = useAuthorStore()
const { authors } = storeToRefs(authorStore)

export const useAchievementStore = defineStore('achievement', () => {
    class Achievement {
        constructor(achievement) {
            this.AchievementID = achievement.AchievementID
            this.SeriesID = achievement.SeriesID
            this.AchievementTitle = achievement.AchievementTitle
            this.AchievementDesc = achievement.AchievementDesc
            this.ParamList = achievement.ParamList
            this.Priority = achievement.Priority
            this.Rarity = achievement.Rarity
            this.ShowType = achievement.ShowType
            this.Version = achievement.Version
            this.Status = 1
        }

        get StellarJadeNum(){
            if (this.Rarity == "High") return 20
            if (this.Rarity == "Mid") return 10
            if (this.Rarity == "Low") return 5
            return 0
        }

        get isNotAvailable(){
            if(!this?.timestamp) return false

            const currentTimestamp = Date.now();

            return this.timestamp > currentTimestamp;
        }

        get StatusDesc(){
            if(this.isNotAvailable) return "暂不可获得"
            if(this.Status === 1) return "未完成"
            if(this.Status === 2) return "已选其他"
            if(this.Status === 3) return "已完成"
            return "未知状态"
        }
    }

    class AchievementSeries {
        constructor(achievementSeries, achievements) {
            this.SeriesID = achievementSeries.SeriesID
            this.SeriesTitle = achievementSeries.SeriesTitle
            this.imagePath = achievementSeries.imagePath
            this.imageDarkPath = achievementSeries.imageDarkPath
            this.Priority = achievementSeries.Priority
            this.Achievements = achievements
        }
        //系列相关成就数
        get AchievementsLength(){
            const selectedMultipleIDs = []; // 记录已选择的多选一成就类型
            let totalAchievements = 0; // 记录总共可获得的成就数

            for (const achievement of this.Achievements) {
                if (achievement.isNotAvailable) continue

                const MultipleID = achievement?.MultipleID
                if(!MultipleID){
                    totalAchievements++
                    continue
                } 
                if (selectedMultipleIDs.includes(MultipleID)){
                    continue
                }
                totalAchievements++
                selectedMultipleIDs.push(MultipleID)
            }
            return totalAchievements
        }
        //系列相关成就可获得星琼总数
        get StellarJadeTotal(){
            const selectedMultipleIDs = []; // 记录已选择的多选一成就类型
            let total = 0; // 记录总共可获得的成就数

            for (const achievement of this.Achievements) {
                if (achievement.isNotAvailable) continue

                const MultipleID = achievement?.MultipleID
                if(!MultipleID){
                    total+= achievement.StellarJadeNum
                    continue
                } 
                if (selectedMultipleIDs.includes(MultipleID)){
                    continue
                }
                total+= achievement.StellarJadeNum
                selectedMultipleIDs.push(MultipleID)
            }
            return total
        }
        //系列相关成就已完成数
        get completedAchievementsLength(){
            let count = 0
            // console.log(this.Achievements)
            this.Achievements.forEach(achievement => {
                if (achievement.Status == 3) count++
            })
            return count
        }
        //系列相关成就已获得星琼总数
        get completedStellarJadeTotal(){
            let total = 0
            // console.log(this.Achievements)
            this.Achievements.forEach(achievement => {
                if (achievement.Status == 3) total += achievement.StellarJadeNum
            })
            return total
        }
        //系列成就完成进度
        get completedPercentage(){
            if (this.AchievementsLength === 0) return 0 + '%'
            return Math.min(Math.round(this.completedAchievementsLength / this.AchievementsLength * 100), 100) + '%'
        }

        get completedStellarJadePercentage(){
            if (this.StellarJadeTotal === 0) return 0
            return Math.min(Math.round(this.completedStellarJadeTotal / this.StellarJadeTotal * 100), 100)
        }

        get completedStellarJadePercentageString(){
            return this.completedStellarJadePercentage.toFixed(2) + "%"
        }
        //系列相关暂不可完成成就数
        get notAvailableAchievementsLengeh(){
            const selectedMultipleIDs = []; // 记录已选择的多选一成就类型
            let totalAchievements = 0; // 记录总共可获得的成就数

            for (const achievement of this.Achievements) {
                if (!achievement.isNotAvailable) continue

                const MultipleID = achievement?.MultipleID
                if(!MultipleID){
                    totalAchievements++
                    continue
                } 
                if (selectedMultipleIDs.includes(MultipleID)){
                    continue
                }
                totalAchievements++
                selectedMultipleIDs.push(MultipleID)
            }
            return totalAchievements
        }

        updateAchievements(achievements) {
            this.Achievements = achievements
        }
    }

    const StellarJadeImg= "https://webstatic.mihoyo.com/upload/event/2023/03/28/77cb5426637574ba524ac458fa963da0_8938800417123864478.png"
    // const userInfo = { uid: "100000000", name: "开拓者", tokenID: 1}
    const userInfoStore = useUserInfoStore()
    const { currentUserInfo } = storeToRefs(userInfoStore)
    watch(currentUserInfo, () => {
        initialAchievementsStatus()
        // 对 暂时无法获得但因特殊情况状态时已获得的进行修正 由于会重复赋值 已赋值的 timestamp 若出现性能问题可进行优化
        initialNotAvailable()
        // console.log("userInfoStore", newValue)
    })

    //用户成就状态列表
    let userAchievement = {}
    //获取缓存
    const getUserAchievement = () => {
        // 从缓存中读取名为 "userAchievement" 的数据
        const tempUserAchievement = localStorage.getItem("userAchievement")

        // 检查是否存在名为 "userAchievement" 的数据
        if (tempUserAchievement !== null) {
            // 数据存在，将其从字符串转换为对象
            userAchievement = JSON.parse(tempUserAchievement)
        } else {
            // 数据不存在，执行相应的操作
            userAchievement = {}
        }
    }
    //保存缓存
    const saveUserAchievement = () => {
        // 将对象转换为字符串，并将其存储在缓存中
        localStorage.setItem("userAchievement", JSON.stringify(userAchievement))
    }
    const findUserAchievementList = () => {
        // 查找用户成就列表
        return userAchievement[currentUserInfo?.value.tokenID]
    }  
    const handleUserAchievementList = (achievementID, status) => {
        if(!achievementID || !status) throw new Error("数据不能为空")
        if(status !== 1 && status !== 2 && status !== 3) throw new Error("参数status不能为非1、2或3的值")
        // 修改用户成就列表
        const userAchievementList = findUserAchievementList()

        if (!userAchievementList) {
            // 用户成就列表不存在，创建新的用户成就列表
            userAchievement[currentUserInfo.value.tokenID] = {
                tokenID: currentUserInfo.value.tokenID,
                list: {
                    [achievementID]: {
                        id: achievementID,
                        status: status
                    }
                }
            }
            saveUserAchievement()
            return 
        }
        // 用户成就列表存在，修改成就状态
        userAchievementList.list[achievementID] = {
            id: achievementID,
            status: status
        }
        saveUserAchievement()
        return 
    }   
    const initialAchievementsStatus = () => {
        const userAchievementList = findUserAchievementList()?.list ?? []
        // console.log(userAchievementList)
        // Object.values(userAchievementList).forEach(achievement => {
        //     const ach_ = achievements.value.find(ach => ach.AchievementID === achievement.id)
        //     if(!ach_) return
        //     ach_.Status = achievement.status
        //     // console.log(ach_)
        // })
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
                multipleChoice[achievement.MultipleID].forEach(AchievementID => {
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

    //多选一成就列表
    let multipleChoice = {}
    const initialMultipleChoice = () => {
        for(const [multipleID, achievementIDs] of Object.entries(multipleChoice))
            for(const achievementID of achievementIDs) {
                const ach_ = achievements.value.find(ach => ach.AchievementID === achievementID)
                if(!ach_) continue
                ach_.MultipleID = multipleID
                // console.log(ach_)
            }       
    }

    //暂时无法获得成就列表
    let notAvailable = {} 
    const initialNotAvailable = () => {
        for(const notAvailableAchievement of Object.values(notAvailable)){
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

    const dialogVisible = ref(false)
    const dialogAchievement = ref(null)
    const dialogMultipleChoiceList = computed(() =>{
        const achievement = dialogAchievement.value
        const tempMultipleChoiceList = []
        if(achievement?.MultipleID){
            multipleChoice[achievement.MultipleID].forEach(AchievementID => {
                if(AchievementID !== achievement.AchievementID){
                    const ach_ = achievements.value.find(ach => ach.AchievementID === AchievementID)
                    tempMultipleChoiceList.push(ach_)
                }
            })
        }
        return tempMultipleChoiceList
    })
    const showStrategyDialog = (achievement) =>{
        dialogVisible.value = true
        dialogAchievement.value = achievement
    } 
    
    //成就攻略 url 数据
    let achievementStrategy = {}
    let strategyInfo = {}
    const showStrategyList = computed(() => {
        const strategies = achievementStrategy[dialogAchievement?.value.AchievementID] ?? []
        const showStrategyList = []
        for(const index in strategies){
            const strategy = strategyInfo[strategies[index]]

            if(!Object.keys(authors.value).includes(String(strategy.author))) continue

            showStrategyList.push(strategy) 
            
        }
        return showStrategyList 
    })

    const achievements = ref([])
    const achievementSeries = ref([])

    const initialAchievementsInfo = () => {
        Promise.all([
            fetch(`/src/jsons/AchievementInfo.json?v=${achievementInfoVersion}`).then(response => response.json()),
            fetch(`/src/jsons/AchievementSeries.json?v=${achievementSeriesVersion}`).then(response => response.json()),
            fetch(`/src/jsons/MultipleChoice.json?v=${multipleChoiceVersion}`).then(response => response.json()),
            fetch(`/src/jsons/NotAvailableAchievement.json?v=${notAvailableAchievementVersion}`).then(response => response.json()),
            fetch(`/src/jsons/AchievementStrategy.json?v=${achievementStrategyVersion}`).then(response => response.json()),
            fetch(`/src/jsons/StrategyInfo.json?v=${strategyInfoVersion}`).then(response => response.json()),
        ])
        .then(([achievementInfo, achievementseries, multiplechoice, notavailable, achievementsteategy, strategyinfo]) => {
            achievements.value = []
            achievementSeries.value = []
            multipleChoice = multiplechoice
            notAvailable = notavailable
            achievementStrategy = achievementsteategy
            strategyInfo = strategyinfo

            // 打印转换后的数据
            // console.log(achievementInfo, achievementSeries)
            Object.values(achievementInfo).forEach(value => {
                achievements.value.push(new Achievement(value))
            })

            getUserAchievement()            
            initialMultipleChoice()
            initialAchievementsStatus()
            initialNotAvailable()

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
        })
        .catch(error => {
            // 处理加载或转换错误
            console.error(error);
        });
    }

    const showSeriesId = ref(0)
    const changeShowSeriesID = (seriesID) =>{
        // console.log(seriesID)
        if(seriesID < 0 || seriesID > 9 || isNaN(seriesID))
            seriesID = 0 
        showSeriesId.value = seriesID
        const achievementMain = document.getElementById('achievement-main-scroller')
        // console.log(achievementMain)
        nextTick(() => {
            achievementMain.scrollTop = 0
        })
    }

    //显示版本列表
    const showVersionList = ref([])
    //可选择列表缓存
    const selectVersionListCache = ref({})
    const handleSelectVersionList = (seriesID, achs) => {   
        const VersionSet = new Set()
        achs.forEach(achievement => {
            VersionSet.add(achievement.Version)
        })

        const format = { value: '', label: '' };
        const result = Array.from(VersionSet).map(value => ({ ...format, value, label: value }))
        result.sort((a, b) => b.value - a.value)

        //添加对应系列版本信息缓存
        selectVersionListCache.value[seriesID] = result
    }
    //可选择列表
    const selectVersionList = computed(() => {
        return selectVersionListCache.value[showSeriesId.value]
    })
    //搜索文本
    const searchContent = ref("")
    //隐藏已完成
    const hiddenCompleted = ref(false)
    //隐藏暂不可获得
    const hiddenNotAvailable = ref(false)
    //未完成优先
    const incompletePriority = ref(false)

    const showAchievements = computed(() => {
        const temp_series = achievementSeries.value.find(series => series.SeriesID === showSeriesId.value)
        //找不到对应系列返回全部
        let temp_showAchievements = []
        if(!temp_series) temp_showAchievements = achievements.value
        else temp_showAchievements = temp_series.Achievements

        temp_showAchievements = temp_showAchievements.filter(achievement =>{
            //隐藏已完成成就
            if(hiddenCompleted.value)
                if(achievement.Status !== 1)
                    return false

            //隐藏暂不可获得成就
            if(hiddenNotAvailable.value)
                if(achievement.isNotAvailable)
                    return false

            //版本筛选
            if(showVersionList.value.length > 0)
                if(!showVersionList.value.includes(achievement.Version))
                    return false
                
            //搜索框筛选
            if(!achievement.AchievementTitle.includes(searchContent.value) && 
            !achievement.AchievementDesc.replace(/<br>/g, '').replace(/<div style="color:#8790abff;">/g,'').replace(/<\/div>/g, '').includes(searchContent.value))
                return false

            return true
        })

        //未完成成就优先
        if(incompletePriority.value)
            temp_showAchievements.sort((a, b) => {
                if(a.Status === 1 && b.Status !== 1) return -1
                if(a.Status !== 1 && b.Status === 1) return 1
                return 0
            })
        return temp_showAchievements
    })

    const showAchievementSeries = ref(
        new AchievementSeries({
            SeriesID: 99,
            SeriesTitle: "本页成就",
            imagePath: "/src/images/series/achievement.png",
            imageDarkPath: "/src/images/series-dark/achievement.png",
            Priority: -1
        }, showAchievements.value)
    )

    watch(showAchievements, () => showAchievementSeries.value.updateAchievements(showAchievements.value))

    //获取成就界面筛选设置缓存
    const getAchievementFilterConfig = () => {
        // 从缓存中读取名为 "AchievementFilterConfig" 的数据
        const tempAchievementFilter = localStorage.getItem("AchievementFilterConfig")

        // 检查是否存在名为 "AchievementFilterConfig" 的数据
        if (tempAchievementFilter !== null) {
            // 数据存在，将其从字符串转换为对象
            const data = JSON.parse(tempAchievementFilter)

            hiddenCompleted.value = data?.hiddenCompleted ?? false
            hiddenNotAvailable.value = data?.hiddenNotAvailable ?? false
            incompletePriority.value = data?.incompletePriority ?? false
        } else {
            // 数据不存在，执行相应的操作
            hiddenCompleted.value = false
            hiddenNotAvailable.value = false
            incompletePriority.value = false
        }
    }
    //保存成就界面筛选设置缓存
    const saveAchievementFilterConfig = () => {
        // 将对象转换为字符串，并将其存储在缓存中
        localStorage.setItem("AchievementFilterConfig", JSON.stringify({
            hiddenCompleted: hiddenCompleted.value,
            hiddenNotAvailable: hiddenNotAvailable.value,
            incompletePriority: incompletePriority.value
        }))
    }

    watch([hiddenCompleted, hiddenNotAvailable, incompletePriority], saveAchievementFilterConfig)
    
    // const showAchievements = computed(() => {
    //     const temp_series = achievementSeries.value.find(series => series.SeriesID === showSeriesId.value)
    //     //找不到对应系列返回全部
    //     let temp_showAchievements = []
    //     if(!temp_series) temp_showAchievements = [...achievements.value] 
    //     else temp_showAchievements = [...temp_series.Achievements]

    //     //未完成成就优先
    //     if(incompletePriority.value)
    //         temp_showAchievements.sort((a, b) => {
    //             if(a.Status === 1 && b.Status !== 1) return -1
    //             if(a.Status !== 1 && b.Status === 1) return 1
    //             return 0
    //         })
        
    //     return temp_showAchievements
    // })

    // const isShowAchievement = (achievement) => {
    //     //隐藏已完成成就
    //     if(hiddenCompleted.value)
    //         if(achievement.Status !== 1)
    //             return false
    //     //版本筛选
    //     if(showVersionList.value.length > 0)
    //         if(!showVersionList.value.includes(achievement.Version))
    //             return false
    //     //隐藏暂不可获得成就
    //     if(hiddenNotAvailable.value)
    //         if(achievement.isNotAvailable)
    //             return false
    //     //搜索框筛选
    //     if(!achievement.AchievementTitle.includes(searchContent.value) && 
    //     !achievement.AchievementDesc.replace(/<br>/g, '').replace(/<div style="color:#8790abff;">/g,'').replace(/<\/div>/g, '').includes(searchContent.value))
    //         return false
    //     return true
    // }

    //全选本页
    const selectAll = computed(() => {
        // return true
         return showAchievements.value.every(achievement => {
            if (achievement?.MultipleID) return true
            if (achievement.isNotAvailable) return true
            return achievement.Status !== 1
        })
    })
    const handleSelectAll = (event) => {
        // 阻止原生点击事件的默认行为
        event.preventDefault();
        event.stopPropagation();

        if (selectAll.value) {
            showAchievements.value.forEach(achievement => {
                if (achievement?.MultipleID) return
                if (achievement.isNotAvailable) return
                if (achievement.Status === 1) return

                achievement.Status = 1
                handleUserAchievementList(achievement.AchievementID, achievement.Status)
            })
        }
        else{
            showAchievements.value.forEach(achievement => {
                if (achievement?.MultipleID) return
                if (achievement.isNotAvailable) return
                if (achievement.Status === 3) return

                achievement.Status = 3
                handleUserAchievementList(achievement.AchievementID, achievement.Status)
            })
        }
    }

    const handleAchevementStatus = (achievement) => {
        if(!(achievement instanceof Achievement)){
            throw new Error("传入achievement不是Achievement类型")
        }
        if (achievement.isNotAvailable) return

        if (achievement.Status === 1) {
            // 修改成就状态为已完成
            achievement.Status = 3
            handleUserAchievementList(achievement.AchievementID, achievement.Status)
            if(achievement?.MultipleID){
                // 修改成就状态为无法完成
                multipleChoice[achievement.MultipleID].forEach(AchievementID => {
                    if(AchievementID !== achievement.AchievementID){
                        const ach_ = achievements.value.find(ach => ach.AchievementID === AchievementID)
                        if(ach_){
                            ach_.Status = 2
                            handleUserAchievementList(ach_.AchievementID, ach_.Status)
                        } 
                    }
                })
            }
            return
        }
        else if (achievement.Status === 3) {
            // 修改成就状态为未完成
            achievement.Status = 1
            handleUserAchievementList(achievement.AchievementID, achievement.Status)
            if(achievement?.MultipleID){
                // 修改成就状态为未完成
                multipleChoice[achievement.MultipleID].forEach(AchievementID => {
                    if(AchievementID !== achievement.AchievementID){
                        const ach_ = achievements.value.find(ach => ach.AchievementID === AchievementID)
                        if(ach_){
                            ach_.Status = 1
                            handleUserAchievementList(ach_.AchievementID, ach_.Status)
                        } 
                    }
                })
            }
            return
        }
    }

    return {  
        StellarJadeImg, 
        achievements,
        achievementSeries,
        showStrategyList,
        dialogVisible,
        dialogAchievement,
        dialogMultipleChoiceList,
        showSeriesId, 
        showAchievements,
        showAchievementSeries, 
        showVersionList,
        selectVersionList,
        searchContent,
        hiddenCompleted,
        hiddenNotAvailable,
        incompletePriority,
        selectAll,
        changeShowSeriesID,
        showStrategyDialog,
        // isShowAchievement,
        initialAchievementsInfo,
        handleAchevementStatus,
        handleSelectAll,
        findUserAchievementList,
        handleUserAchievementList,
        getAchievementFilterConfig
    }
})
