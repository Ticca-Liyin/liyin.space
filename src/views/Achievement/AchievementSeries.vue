<script setup>
import { onMounted } from 'vue';
import { useAchievementStore } from '@/stores/achievement';
import { useRoute, onBeforeRouteUpdate } from 'vue-router';

const route = useRoute();
// console.log(route.params.id)

const handleScroll = (event) => {
    // 阻止默认的滚动行为，以免影响整个页面的滚动
    event.preventDefault();
    
    // 根据鼠标滚轮的 deltaY 属性来判断滚动方向
    const delta = Math.max(-1, Math.min(1, event.deltaY));
    
    // 根据滚动方向来控制滚动
    const container = document.querySelector('.achievement-series');
    container.scrollLeft += delta * 100; // 根据需要调整滚动速度
}

const achievementStore = useAchievementStore();

onMounted(() => achievementStore.changeShowSeriesID(+route.params.id))

onBeforeRouteUpdate((to) => achievementStore.changeShowSeriesID(+to.params.id))
</script>

<template>        
    <div class="achievement-series" @wheel="handleScroll">
        <div class="series-navigation" v-for="series in achievementStore.achievementSeries" :key="series.SeriesID">
            <RouterLink :to="`/achievement/${series.SeriesID}`" active-class="selected">
                <div class="series">
                    <div class="series-title">
                        {{series.SeriesTitle}}
                    </div>
                    <div class="series-count">
                        {{series.completedAchievementsLength}} / {{series.AchievementsLength}}
                        <span v-if="series.notAvailableAchievementsLengeh" style="color: #008080; font-weight: 400;">+{{ series.notAvailableAchievementsLengeh }}</span>
                        ({{series.completedPercentage}})
                    </div>
                    <div class="series-StellarJade">
                        {{series.completedStellarJadeTotal}} / {{series.StellarJadeTotal}}
                        <img :src="achievementStore.StellarJadeImg" alt="星琼">
                    </div>
                </div>
                <div class="series-bg-image">
                    <img :src="series.imagePath" :alt="series.SeriesTitle">
                </div>
            </RouterLink>
        </div>
    </div>
</template>

<style scoped>
.achievement-series{
    display: flex;
    overflow: hidden;
    overflow-x: auto;
    width: 100%;
    color: #5e5e5e;
    background-color: #f5f5f5;
    /* box-shadow: 0px 5px 8px rgba(60, 60, 60, 0.3); */
    /* margin-bottom: 10px; */
    /* position: sticky;
    top: 0;
    z-index: 10; */
}
.series-navigation{
    height: 90px;
    margin: 0 5px;
    position: relative;
    flex: 1;
    flex-basis: auto;
}
.series-navigation a{
    color: #5e5e5e;
    user-select: none;
}
.series-navigation a:hover,
.series-navigation .selected{
    color: #00A8E8;
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
    opacity: 0.9;
}
@media (max-width: 768px){
    /* .achievement-series{
        margin-bottom: 10px;
        box-shadow: 0px 3px 5px rgba(60, 60, 60, 0.3);
    } */
    
    .series-navigation{
        height: 70px;
        margin: 0 5px;
    }
    .series-navigation a:hover{
        color: #5e5e5e;
    }
    .series-navigation a.selected{
        color: #00A8E8;
    }
    .series{
        min-width: 80px;
        height: 70px;
        line-height: 18px;
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
}
</style>