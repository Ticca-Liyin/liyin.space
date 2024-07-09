import {ref, watchEffect, computed } from 'vue'
import { defineStore } from 'pinia'

export const useSettingStore = defineStore('setting', () => { 
    const ACHIEVEMENT_SELECT_ALL_SECOND_CONFIRMATION_KEY = 'achievement-select-all-second-confirmation'

    const achievementSelectAllSecondConfirmation = ref(JSON.parse(localStorage.getItem(ACHIEVEMENT_SELECT_ALL_SECOND_CONFIRMATION_KEY) ?? true))

    const secondConfirmationList = [
        {
            label: '开启',
            value: true
        },
        {
            label: '关闭',
            value: false
        }
    ]

    watchEffect(() => {
        localStorage.setItem(ACHIEVEMENT_SELECT_ALL_SECOND_CONFIRMATION_KEY, JSON.stringify(achievementSelectAllSecondConfirmation.value))
    })

    return {
        achievementSelectAllSecondConfirmation,
        secondConfirmationList
    }
})