import { computed, watch, ref } from 'vue'
import { defineStore, storeToRefs } from 'pinia'
import { useAchievementSelectVersionListStore } from '@/stores/achievementSelectVersionList'
import { useAchievementShowSeriesStore } from '@/stores/achievementShowSeries'
import { useAchievementSettingStore } from '@/stores/achievementSetting'

export const useAchievementFelterStore = defineStore('achievementFelter', () => {
    const achievementSelectVersionListStore = useAchievementSelectVersionListStore()
    const { selectVersionListCache } = storeToRefs(achievementSelectVersionListStore)

    const achievementShowSeriesStore = useAchievementShowSeriesStore()
    const { showSeriesId } = storeToRefs(achievementShowSeriesStore)

    const settingStore = useAchievementSettingStore()
    const { achievementFilterCacheConfig } = storeToRefs(settingStore)

    //显示版本列表
    const showVersionList = ref([])
    //可选择版本列表
    const selectVersionList = computed(() => {
        return selectVersionListCache.value[showSeriesId.value]
    })
    //搜索文本
    const searchContent = ref("")
    //隐藏类成就筛选
    const showHiddenType = ref('all')
    const selectHiddenList = [
        {
            value: 'all',
            label: '全部'
        },
        {
            value: 'hidden',
            label: '隐藏'
        },
        {
            value: 'unhidden',
            label: '非隐藏'
        }
    ]
    //奖励类成就筛选
    const showRewardType = ref('all')
    const selectRewardList = [
        {
            value: 'all',
            label: '全部'
        },
        {
            value: 'gold',
            label: '金'
        },
        {
            value: 'silver',
            label: '银'
        },
        {
            value: 'copper',
            label: '铜'
        }
    ]
    //完成程度类成就筛选
    const showCompletedType = ref('all')
    const selectCompletedList = [
        {
            value: 'all',
            label: '全部'
        },
        {
            value: 'completed',
            label: '已完成'
        },
        {
            value: 'uncompleted',
            label: '未完成'
        }
    ]
    //获取状态类成就筛选
    const showAvailableType = ref('all')
    const selectAvailableList = [
        {
            value: 'all',
            label: '全部'
        },
        {
            value: 'available',
            label: '可获取'
        },
        {
            value: 'not-available',
            label: '暂不可获取'
        }
    ]

    // 是否启用筛选功能
    const hadFilter = computed(() => {
        return showHiddenType.value !== 'all' || showRewardType.value !== 'all' || showCompletedType.value !== 'all' || showAvailableType.value !== 'all'
    })

    //未完成优先
    const incompletePriority = ref(false)

    //获取成就界面筛选设置缓存
    const getAchievementFilterConfig = () => {
        if(!achievementFilterCacheConfig.value) return

        // 从缓存中读取名为 "AchievementFilterConfig" 的数据
        const tempAchievementFilter = localStorage.getItem("AchievementFilterConfig")

        // 检查是否存在名为 "AchievementFilterConfig" 的数据
        if (tempAchievementFilter !== null) {
            // 数据存在，将其从字符串转换为对象
            const data = JSON.parse(tempAchievementFilter)

            showHiddenType.value = data?.showHiddenType ?? "all"
            showRewardType.value = data?.showRewardType ?? "all"
            showCompletedType.value = data?.showCompletedType ?? "all"
            showAvailableType.value = data?.showAvailableType ?? "all"
            incompletePriority.value = data?.incompletePriority ?? false
        } else {
            // 数据不存在，执行相应的操作
            showHiddenType.value = "all"
            showRewardType.value = "all"
            showCompletedType.value = "all"
            showAvailableType.value = "all"
            incompletePriority.value = false
        }
    }
    //保存成就界面筛选设置缓存
    const saveAchievementFilterConfig = () => {
        if(!achievementFilterCacheConfig.value) return

        // 将对象转换为字符串，并将其存储在缓存中
        localStorage.setItem("AchievementFilterConfig", JSON.stringify({
            showHiddenType: showHiddenType.value,
            showRewardType: showRewardType.value,
            showCompletedType: showCompletedType.value,
            showAvailableType: showAvailableType.value,
            incompletePriority: incompletePriority.value
        }))
    }

    watch([showHiddenType, showRewardType, showCompletedType, showAvailableType, incompletePriority, achievementFilterCacheConfig], saveAchievementFilterConfig)

    
    getAchievementFilterConfig();

    return {
        showVersionList,
        selectVersionList,
        searchContent,
        showHiddenType,
        selectHiddenList,
        showRewardType,
        selectRewardList,
        showCompletedType,
        selectCompletedList,
        showAvailableType,
        selectAvailableList,
        hadFilter,
        incompletePriority,
    }
})