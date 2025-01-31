import { computed, watch, ref } from 'vue'
import { defineStore, storeToRefs } from 'pinia'
import { useAchievementFelterStore } from '@/stores/achievement/felter/achievementFelter'
import { useAchievementShowSeriesStore } from '@/stores/achievement/achievementShowSeries'
import { AchievementSeries } from '@/types/achievementSeries'

export const useShowAchievementsStore = defineStore('showAchievements', () => {
    const achievementShowSeriesStore = useAchievementShowSeriesStore()
    const { showSeriesAllAchievements } = storeToRefs(achievementShowSeriesStore)

    const achievementFelterStore = useAchievementFelterStore();
    const { showHiddenType, showRewardType, showCompletedType, showAvailableType, showVersionList, searchContent, incompletePriority, } = storeToRefs(achievementFelterStore);

    const showAchievements = computed(() => {
        let temp_showAchievements = showSeriesAllAchievements.value.filter(achievement =>{
            // 隐藏类成就筛选
            if(showHiddenType.value !== 'all') {
                if(showHiddenType.value === 'hidden'){
                    if(!achievement.isHidden)
                        return false
                }
                else if(showHiddenType.value === 'unhidden'){
                    if(achievement.isHidden)
                        return false                    
                }
            }

            // 奖励类成就筛选
            if(showRewardType.value !== 'all') {
                if(showRewardType.value === 'gold'){
                    if(achievement.Rarity !== "High")
                        return false
                }
                else if(showRewardType.value === 'silver'){
                    if(achievement.Rarity !== "Mid")
                        return false                    
                }
                else if(showRewardType.value === 'copper'){
                    if(achievement.Rarity !== "Low")
                        return false                    
                }
            }

            // 完成程度类成就筛选
            if(showCompletedType.value !== 'all') {
                if(showCompletedType.value === 'completed'){
                    if(achievement.Status === 1)
                        return false
                }
                else if(showCompletedType.value === 'uncompleted'){
                    if(achievement.Status !== 1)
                        return false
                }
            }

            // 获取状态类成就筛选
            if(showAvailableType.value !== 'all') {
                if(showAvailableType.value === 'available'){
                    if(achievement.CustomNotAchieved || achievement.isNotAvailable)
                        return false
                }
                else if(showAvailableType.value === 'not-available'){
                    if(!achievement.CustomNotAchieved && !achievement.isNotAvailable)
                        return false
                }
            }

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
    
    return {
        showAchievements,
        showAchievementSeries
    }
})