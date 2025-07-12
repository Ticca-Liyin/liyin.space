import {ref, watchEffect, computed } from 'vue'
import { defineStore } from 'pinia'

export const useAchievementSettingStore = defineStore('achievementSetting', () => { 
    //#region  成就全选二次确认
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
    //#endregion

    //#region  成就筛选配置缓存
    const ACHIEVEMENT_FILTER_CACHE_CONFIG_KEY = 'achievement-filter-cache-config'

    const achievementFilterCacheConfig = ref(JSON.parse(localStorage.getItem(ACHIEVEMENT_FILTER_CACHE_CONFIG_KEY) ?? false))

    const filterCacheConfigList = [
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
        localStorage.setItem(ACHIEVEMENT_FILTER_CACHE_CONFIG_KEY, JSON.stringify(achievementFilterCacheConfig.value))
    })
    //#endregion

    //#region  本页成就隐藏配置
    const CURRENT_PAGE_ACHIEVEMENT_WINDOW_DISPLAY_KEY = 'current-page-achievement-window-display'

    const currentPageAchievementWindowDisplay = ref(JSON.parse(localStorage.getItem(CURRENT_PAGE_ACHIEVEMENT_WINDOW_DISPLAY_KEY) ?? true))

    const currentPageAchievementWindowDiaplayList = [
        {
            label: '显示',
            value: true
        },
        {
            label: '隐藏',
            value: false
        }
    ]

    watchEffect(() => {
        localStorage.setItem(CURRENT_PAGE_ACHIEVEMENT_WINDOW_DISPLAY_KEY, JSON.stringify(currentPageAchievementWindowDisplay.value))
    })
    //#endregion

    //#region  隐藏完成成就系列 HiddenCompleteAchievementSeries
    const HIDDEN_COMPLETE_ACHIEVEMENT_SERIES = 'hidden-complete-achievement-series'

    const hiddenCompleteAchievementSeries = ref(JSON.parse(localStorage.getItem(HIDDEN_COMPLETE_ACHIEVEMENT_SERIES) ?? false))

    const hiddenCompleteAchievementSeriesList = [
        {
            label: '显示',
            value: false
        },
        {
            label: '隐藏',
            value: true
        }
    ]

    watchEffect(() => {
        localStorage.setItem(HIDDEN_COMPLETE_ACHIEVEMENT_SERIES, JSON.stringify(hiddenCompleteAchievementSeries.value))
    })
    //#endregion

    return {
        achievementSelectAllSecondConfirmation,
        secondConfirmationList,
        achievementFilterCacheConfig,
        filterCacheConfigList,
        currentPageAchievementWindowDisplay,
        currentPageAchievementWindowDiaplayList,
        hiddenCompleteAchievementSeries,
        hiddenCompleteAchievementSeriesList
    }
})