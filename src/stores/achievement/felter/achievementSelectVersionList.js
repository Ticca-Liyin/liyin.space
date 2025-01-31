import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useAchievementSelectVersionListStore = defineStore('achievementSelectVersionList', () => {
    //可选择版本列表缓存
    const selectVersionListCache = ref({})

    const handleSelectVersionList = (seriesID, achs) => {   
        const VersionSet = new Set()
        achs.forEach(achievement => {
            VersionSet.add(achievement.Version)
        })
        
        const result = Array.from(VersionSet).map(value => ({ value, label: value }))
        result.sort((a, b) => b.value - a.value)

        //添加对应系列版本信息缓存
        selectVersionListCache.value[seriesID] = result
    }

    return {
        selectVersionListCache,
        handleSelectVersionList,
    }
})