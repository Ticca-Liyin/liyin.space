import {ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useIsMobileStore = defineStore('isMobile', () => {
    // const browserWidth  = ref(window.innerWidth)
    // const isMobile = computed( () => browserWidth.value <= 768)

    const match = matchMedia('(max-width: 768px)')
    const isMobile = ref(match.matches)

    match.addEventListener('change', () => {
        isMobile.value = match.matches
    })

    // const handleResize = () => {
    //     browserWidth.value = window.innerWidth;
    // };

    return {
        isMobile,
        // handleResize
    }
})
