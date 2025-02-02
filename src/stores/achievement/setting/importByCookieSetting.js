import {ref, watchEffect, computed } from 'vue'
import { defineStore } from 'pinia'

export const useImportByCookieSettingStore = defineStore('importByCookieSetting', () => { 
    //#region  Cookie 导入二次确认
    const IMPORT_BY_COOKIE_SECOND_CONFIRMATION_KEY = 'import-by-cookie-second-confirmation'

    const importByCookieSecondConfirmation = ref(JSON.parse(localStorage.getItem(IMPORT_BY_COOKIE_SECOND_CONFIRMATION_KEY) ?? true))

    const importByCookieSecondConfirmationList = [
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
        localStorage.setItem(IMPORT_BY_COOKIE_SECOND_CONFIRMATION_KEY, JSON.stringify(importByCookieSecondConfirmation.value))
    })
    //#endregion

    //#region  Cookie 自动导入成就形式

    //#endregion

    return {
        importByCookieSecondConfirmation,
        importByCookieSecondConfirmationList
    }
})