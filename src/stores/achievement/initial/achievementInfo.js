import { ref } from 'vue'
import { defineStore } from 'pinia'
import { achievementInfoVersion } from '@/utils/version.js'

export const useAchievementInfoStore = defineStore('achievementInfo', () => {
    //多选一成就列表
    const achievementInfo = ref({})

    const initialAchievementInfo = async () => {
        return fetch(`/src/jsons/AchievementInfo.json?v=${achievementInfoVersion}`)
        .then(response => response.json())
        .then(data => {
            achievementInfo.value = data
            return data
        })
        .catch(error => {
            console.error(error)
            throw error
        })
    }
    
    return {
        achievementInfo,
        initialAchievementInfo,
    }
})