import { computed } from 'vue'
import { defineStore, storeToRefs } from 'pinia'
import { useUserAchievementStore } from '@/stores/userAchievement'
import { useShowAchievementsStore } from '@/stores/showAchievements';

export const useAchievementSelectAllStore = defineStore('achievementSelectAll', () => {
    const userAchievementStore = useUserAchievementStore()
    const { handleUserAchievementList, saveUserAchievement } = userAchievementStore;

    const showAchievementsStore = useShowAchievementsStore();
    const { showAchievements } = storeToRefs(showAchievementsStore);

    //全选本页
    const selectAll = computed(() => {
        return showAchievements.value.every(achievement => {
            if (achievement?.MultipleID) return true
            if (achievement.CustomNotAchieved) return true
            if (achievement.isNotAvailable) return true
            return achievement.Status !== 1
        })
    })

    const handleSelectAll = () => {
        if (selectAll.value) {
            showAchievements.value.forEach(achievement => {
                if (achievement?.MultipleID) return
                if (achievement.CustomNotAchieved) return
                if (achievement.isNotAvailable) return
                if (achievement.Status === 1) return

                achievement.Status = 1
                handleUserAchievementList(achievement.AchievementID, achievement.Status, false)
            })
        }
        else{
            showAchievements.value.forEach(achievement => {
                if (achievement?.MultipleID) return
                if (achievement.CustomNotAchieved) return
                if (achievement.isNotAvailable) return
                if (achievement.Status === 3) return

                achievement.Status = 3
                handleUserAchievementList(achievement.AchievementID, achievement.Status, false)
            })
        }

        saveUserAchievement()
    }

    return {
        selectAll, 
        handleSelectAll,
    }
});