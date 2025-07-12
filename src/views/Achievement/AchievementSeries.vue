<script setup>
import { ArrowDown, ArrowUp } from '@element-plus/icons-vue'
import { onMounted, ref, watch, computed } from 'vue';
import { storeToRefs } from 'pinia';
import { useAchievementStore } from '@/stores/achievement/achievement';
import { useAchievementShowSeriesStore } from '@/stores/achievement/achievementShowSeries'
import { useThemeStore } from '@/stores/theme'
import { useAchievementSettingStore } from '@/stores/achievement/setting/achievementSetting.js'
import { useRoute, onBeforeRouteUpdate } from 'vue-router';

const route = useRoute();
// console.log(route.params.id)

const handleScroll = (event) => {
    // 阻止默认的滚动行为，以免影响整个页面的滚动
    event.preventDefault();
    
    // 根据鼠标滚轮的 deltaY 属性来判断滚动方向
    const delta = Math.max(-1, Math.min(1, event.deltaY));
    
    // 根据滚动方向来控制滚动
    const container = document.getElementById('achievement-series');
    container.scrollLeft += delta * 100; // 根据需要调整滚动速度
}

const achievementStore = useAchievementStore()
const { achievementSeries } = storeToRefs(achievementStore)
const { StellarJadeImg } = achievementStore

const achievementShowSeriesStore = useAchievementShowSeriesStore()
const { showSeriesId } = storeToRefs(achievementShowSeriesStore)
const { changeShowSeriesID } = achievementShowSeriesStore

const themeStore = useThemeStore()
const { isDark } = storeToRefs(themeStore)

const settingStore = useAchievementSettingStore()
const { hiddenCompleteAchievementSeries } = storeToRefs(settingStore)

onMounted(() => changeShowSeriesID(+route.params.id))

onBeforeRouteUpdate((to) => changeShowSeriesID(+to.params.id))

const isNavigationFlex = computed(() => {
    return achievementSeries.value.reduce((count, series) => {
        if (series.completedAchievementsLength !== series.AchievementsLength) {
            return ++count;
        } else {
            return count;
        }
    }, 0) === achievementSeries.value.length
})

// 设置行相关折叠功能
const hadFold = ref(false)

//获取折叠缓存
const getAchievementSeriesFold = () => {
    // 从缓存中读取名为 "AchievementSeriesFold" 的数据
    const tempAchievementSeriesFold = localStorage.getItem("AchievementSeriesFold")

    // 检查是否存在名为 "AchievementSeriesFold" 的数据
    if (tempAchievementSeriesFold !== null) {
        // 数据存在，将其从字符串转换为对象
        hadFold.value = JSON.parse(tempAchievementSeriesFold)
    } else {
        // 数据不存在，执行相应的操作
        hadFold.value = false
    }
}
//保存折叠缓存
const saveAchievementSeriesFold = () => {
    // 将对象转换为字符串，并将其存储在缓存中
    localStorage.setItem("AchievementSeriesFold", JSON.stringify(hadFold.value))
}

onMounted(() => {
    getAchievementSeriesFold()
})

watch(hadFold, saveAchievementSeriesFold)

let isSeriesDragging = false
let SeriesStartX = 0;

const startSeriesDrag = (event) => {
    isSeriesDragging = true;
    SeriesStartX = event.clientX;
}

const handleSeriesDrag = (event) => {
    const SeriesContainer = document.getElementById('achievement-series')

    if (isSeriesDragging) {
        const deltaX = event.clientX - SeriesStartX;

        SeriesContainer.scrollLeft -= deltaX;

        SeriesStartX = event.clientX;
    }
}

const endSeriesDrag = () => {
    isSeriesDragging = false;
}

</script>

<template>     
    <div class="achievement-series-fold">
        <div class="achievement-series" id="achievement-series" @wheel="handleScroll" >
            <!-- @mousedown="startSeriesDrag" @mousemove="handleSeriesDrag" @mouseup="endSeriesDrag" @mouseleave="endSeriesDrag" -->
            <template v-for="(series, index) in achievementSeries" :key="series.SeriesID">
                <div v-if="!hiddenCompleteAchievementSeries || (series.completedAchievementsLength !== series.AchievementsLength || index === 0)" 
                    class="series-navigation" 
                    :class="{
                        'series-fold': hadFold,
                        'series-navigation-flex': !hiddenCompleteAchievementSeries || isNavigationFlex
                    }" 
                >
                    <RouterLink :to="`/achievement/${series.SeriesID}`" :class="{'selected': showSeriesId === series.SeriesID}" v-preventDragStart="true">
                        <div class="series" :class="{'series-fold': hadFold}">
                            <div class="series-title">
                                {{series.SeriesTitle}}
                            </div>
                            <div class="series-count">
                                {{series.completedAchievementsLength}} / {{series.AchievementsLength}}
                                <span v-if="series.notAvailableAchievementsLengeh" class="series-count-not-available">+{{ series.notAvailableAchievementsLengeh }}</span>
                                ({{series.completedPercentage}})
                            </div>
                            <div class="series-StellarJade" v-if="!hadFold">
                                {{series.completedStellarJadeTotal}} / {{series.StellarJadeTotal}}
                                <img :src="StellarJadeImg" alt="星琼">
                            </div>
                        </div>
                        <div class="series-bg-image">
                            <img :src="isDark ? series.imageDarkPath : series.imagePath" :alt="series.SeriesTitle">
                        </div>
                    </RouterLink>
                </div>
            </template>
        </div>
        <div class="achievement-series-fold-down" v-if="hadFold"  @click="hadFold = false">
            <el-icon class="el-icon--right">
                <arrow-down />
            </el-icon>
        </div>
        <div class="achievement-series-fold-up" v-else @click="hadFold = true">
            <el-icon class="el-icon--right">
                <arrow-up />
            </el-icon>
        </div>
    </div>
</template>

<style scoped>
.achievement-series-fold{
    display: flex;
    align-items: center;
    background-color: var(--liyin-ach-series-bg-color);
}
.achievement-series{
    display: flex;
    overflow: hidden;
    overflow-x: auto;
    /* width: 100%; */
    flex: 1 0 0;
    color: var(--liyin-ach-series-text-color);
    background-color: var(--liyin-ach-series-bg-color);
    padding-left: 10px;
    /* box-shadow: 0px 5px 8px rgba(60, 60, 60, 0.3); */
    /* margin-bottom: 10px; */
    /* position: sticky;
    top: 0;
    z-index: 10; */
}
.achievement-series::-webkit-scrollbar {
    width: 6px;
    height: 6px;
}   
.achievement-series::-webkit-scrollbar-track {
    background-color: transparent;
}
.achievement-series::-webkit-scrollbar-thumb {
    background-color: rgba(139, 139, 139, 0.4);
    border-radius: 10px;
}
.achievement-series::-webkit-scrollbar-button {
    display: none;
}
.series-navigation{
    height: 90px;
    margin: 0 5px;
    position: relative;
    flex-basis: auto;
}
.series-navigation-flex {
    flex: 1;
}
.series-navigation.series-fold{
    height:60px;
}
.series-navigation a{
    color: var(--liyin-ach-series-text-color);
    user-select: none;
}
.series-navigation a:hover,
.series-navigation .selected{
    color: var(--liyin-ach-selected-color);
}
.series{
    display: flex;
    flex-direction: column;
    justify-content: center;
    min-width: 100px;
    height: 90px;
    line-height: 23px;
    text-align: center;
    cursor: pointer;
    position: relative;
    z-index: 2;
}
.series.series-fold{
    height: 60px;
    min-width: 0px;
    /* margin: 0 10px; */
}
.series-title{
    font-size: 18px;
    font-weight: 800;
    white-space: nowrap;
}
.series-count{
    font-size: 15px;
    font-weight: 600;
    white-space: nowrap;
}
.series-count-not-available{
    color: var(--liyin-ach-series-count-not-available-color); 
    font-weight: 400;
}
.series-StellarJade{
    display: flex;
    align-items: center;
    justify-content: center;
    line-height: 20px;
    font-size: 13px;
    white-space: nowrap;
}
.series-StellarJade img{
    width: 20px;
    height: 20px;
    margin: 0 5px;
}
.series-bg-image{
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    z-index: 1;
}
.series-bg-image img{
    width: 100%;
    height: 100%;
    object-fit: contain;
    opacity: 0.5;
}
.achievement-series-fold-down{
    height: 60px; 
    /* width: 40px;  */
    display: flex; 
    justify-content: center; 
    align-items: center; 
    cursor: pointer; 
    padding-right: 10px;
    color: var(--liyin-arrow-color);
}
.achievement-series-fold-up{
    display: flex; 
    justify-content: center; 
    height: 90px; 
    /* width: 40px; */
    align-items: center; 
    cursor: pointer;
    padding-right: 10px;
    color: var(--liyin-arrow-color);
}
@media (max-width: 768px){
    .achievement-series{
        /* margin-bottom: 10px;
        box-shadow: 0px 3px 5px rgba(60, 60, 60, 0.3); */
        padding-left: 5px;
    }
    
    .series-navigation{
        height: 70px;
        margin: 0 5px;
    }
    .series-navigation.series-fold{
        height:50px;
    }
    .series-navigation a:hover{
        color: var(--liyin-ach-series-text-color);
    }
    .series-navigation a.selected{
        color: var(--liyin-ach-selected-color);
    }
    .series{
        min-width: 80px;
        height: 70px;
        line-height: 18px;
    }
    .series.series-fold{
        height: 50px;
        margin: 0 5px;
    }
    .series-title{
        font-size: 15px;
        font-weight: 700;
    }
    .series-count{
        font-size: 13px;
        font-weight: 600;
    }
    .series-StellarJade{
        line-height: 14px;
        font-size: 11px;
    }
    .series-StellarJade img{
        width: 15px;
        height: 15px;
        margin: 0 5px;
    }
    .achievement-series-fold-down{
        padding-right: 5px;
        height: 50px;;
    }
    .achievement-series-fold-up{
        padding-right: 5px;
        height: 70px;
    }
}
</style>