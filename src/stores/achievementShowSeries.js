import { nextTick, computed, ref } from 'vue'
import { defineStore, storeToRefs } from 'pinia'
import { useAchievementStore } from '@/stores/achievement'

export const useAchievementShowSeriesStore = defineStore('achievementShowSeries', () => {
    const achievementStore = useAchievementStore();
    const { achievements, achievementSeries } = storeToRefs(achievementStore);

    const showSeriesId = ref(0);
    const changeShowSeriesID = (seriesID) => {
        // console.log(seriesID)
        if(seriesID < 0 || seriesID > 9 || isNaN(seriesID)) {
            seriesID = 0 
        }
        showSeriesId.value = seriesID
        const achievementMain = document.getElementById('achievement-main-scroller')
        // console.log(achievementMain)
        nextTick(() => {
            achievementMain.scrollTop = 0
        })
    };

    //当前显示的系列成就
    const showSeriesAllAchievements = computed(() => {
        const showSeries = achievementSeries.value.find(series => series.SeriesID === showSeriesId.value)
        //找不到对应系列返回全部
        let temp_showAchievements = []
        if(!showSeries) temp_showAchievements = achievements.value
        else temp_showAchievements = showSeries.Achievements

        return temp_showAchievements
    })

    return {
        showSeriesId,
        showSeriesAllAchievements,
        changeShowSeriesID,
    }
})