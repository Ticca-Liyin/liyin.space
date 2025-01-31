import { computed, ref } from 'vue'
import { defineStore, storeToRefs } from 'pinia'
import { useAuthorStore } from '@/stores/author'
import { useAchievementStore } from '@/stores/achievement/achievement'
import { useAchievementMultipleChoiceStore } from '@/stores/achievement/initial/achievementMultipleChoice'
import { useAchievementStrategyStore } from '@/stores/achievement/strategy/achievementStrategy'

export const useAchievementStrategyDialogStore = defineStore('achievementStrategyDialog', () => {
    const authorStore = useAuthorStore()
    const { authors } = storeToRefs(authorStore)

    const achievementMultipleChoiceStore = useAchievementMultipleChoiceStore()
    const { multipleChoice } = storeToRefs(achievementMultipleChoiceStore)

    const achievementStrategyStore = useAchievementStrategyStore()
    const { achievementStrategy, strategyInfo } = storeToRefs(achievementStrategyStore);

    const achievementStore = useAchievementStore();
    const { achievements } = storeToRefs(achievementStore);
    
    const dialogVisible = ref(false)
    const dialogAchievement = ref(null)
    const dialogMultipleChoiceList = computed(() =>{
        const achievement = dialogAchievement.value
        const tempMultipleChoiceList = []
        if(achievement?.MultipleID){
            multipleChoice.value[achievement.MultipleID].forEach(AchievementID => {
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

    const showStrategyList = computed(() => {
        const strategies = achievementStrategy.value[dialogAchievement?.value.AchievementID] ?? []
        const showStrategyList = []
        for(const index in strategies){
            const strategy = strategyInfo.value[strategies[index]]

            if(!Object.keys(authors.value).includes(String(strategy.author))) continue

            showStrategyList.push(strategy) 
            
        }
        return showStrategyList 
    })

    return {
        dialogVisible,
        dialogAchievement,
        dialogMultipleChoiceList,
        showStrategyDialog,
        showStrategyList,
    }
})