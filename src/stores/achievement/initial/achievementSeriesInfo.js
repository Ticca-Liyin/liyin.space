import { ref } from 'vue'
import { defineStore } from 'pinia'
import { achievementSeriesVersion } from '@/utils/version.js'

export const useAchievementSeriesInfoStore = defineStore('achievementSeriesInfo', () => {
    //多选一成就列表
    const achievementSeriesInfo = ref({})

    const initialAchievementSeriesInfo = async () => {
        return fetch(`/src/jsons/AchievementSeries.json?v=${achievementSeriesVersion}`)
        .then(response => response.json())
        .then(data => {
            achievementSeriesInfo.value = data
            return data
        })
        .catch(error => {
            console.error(error)
            throw error
        })
    }
    
    return {
        achievementSeriesInfo,
        initialAchievementSeriesInfo,
    }
})