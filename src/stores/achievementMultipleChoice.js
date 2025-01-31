import { ref } from 'vue'
import { defineStore } from 'pinia'
import { multipleChoiceVersion } from '@/utils/version.js'

export const useAchievementMultipleChoiceStore = defineStore('achievementMultipleChoice', () => {
    //多选一成就列表
    const multipleChoice = ref({})

    const initialAchievementMultipleChoice = async () => {
        return fetch(`/src/jsons/MultipleChoice.json?v=${multipleChoiceVersion}`)
        .then(response => response.json())
        .then(data => {
            multipleChoice.value = data
            return data
        })
        .catch(error => {
            console.error(error)
            throw error
        })
    }
    
    return {
        multipleChoice,
        initialAchievementMultipleChoice,
    }
})