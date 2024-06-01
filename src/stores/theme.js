import {ref, watchEffect, computed } from 'vue'
import { defineStore } from 'pinia'

export const useThemeStore = defineStore('theme', () => {
    const THEME_KEY = 'theme'
    const theme  = ref(localStorage.getItem(THEME_KEY) ?? 'system')

    const themeList = [
        {
            label: '跟随浏览器',
            value: 'system'
        },
        {
            label: '浅色',
            value: 'light'
        },
        {
            label: '深色',
            value: 'dark'
        }
    ]

    const match = matchMedia('(prefers-color-scheme: dark)')

    const isDark = ref(theme.value === 'system' ? match.matches : theme.value === 'dark')

    const followSystem = () => {
        if(match.matches) {
            document.documentElement.classList.add('dark')
            isDark.value = true
        }
        else {
            document.documentElement.classList.remove('dark')
            isDark.value = false
        }
    }

    watchEffect(() => {
        localStorage.setItem(THEME_KEY, theme.value)
        if (theme.value === 'system') {
            followSystem()
            match.addEventListener('change', followSystem)
        }
        else {
            if(theme.value === 'dark') {
                document.documentElement.classList.add('dark')
                isDark.value = true
            }
            else {
                document.documentElement.classList.remove('dark')
                isDark.value = false
            }
            match.removeEventListener('change', followSystem)
        }
    })

    return {
        theme,
        themeList,
        isDark
    }
})