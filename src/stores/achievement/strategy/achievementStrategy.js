import { ref } from 'vue'
import { defineStore } from 'pinia'
import { achievementStrategyVersion, strategyInfoVersion } from '@/utils/version.js'

export const useAchievementStrategyStore = defineStore('achievementStrategy', () => {
    //成就攻略 url 数据
    const achievementStrategy = ref({})
    const strategyInfo = ref({})

    const initialAchievementStrategy = async () => {
        return fetch(`/src/jsons/AchievementStrategy.json?v=${achievementStrategyVersion}`)
        .then(response => response.json())
        .then(data => {
            achievementStrategy.value = data
            return data
        })
        .catch(error => {
            console.error(error)
            throw error
        })
    }

    const initialStrategyInfo = async () => {
        return fetch(`/src/jsons/StrategyInfo.json?v=${strategyInfoVersion}`)
        .then(response => response.json())
        .then(data => {
            strategyInfo.value = data
            return data
        })
        .catch(error => {
            console.error(error)
            throw error
        })
    }
    
    return {
        achievementStrategy,
        strategyInfo,
        initialAchievementStrategy,
        initialStrategyInfo,
    }
})