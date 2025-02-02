<script setup>
import FloatingWindow from '@/components/FloatingWindow.vue';
import { useAchievementStore } from '@/stores/achievement/achievement'
import { useShowAchievementsStore } from '@/stores/achievement/showAchievements';
import { useIsMobileStore } from '@/stores/isMobile'
import { useThemeStore } from '@/stores/theme'
import { storeToRefs } from 'pinia';

const achievementStore = useAchievementStore()

const showAchievementsStore = useShowAchievementsStore();
const { showAchievementSeries } = storeToRefs(showAchievementsStore);

const isMobileStore = useIsMobileStore()
const { isMobile } = storeToRefs(isMobileStore)

const themeStore = useThemeStore()  
const { isDark } = storeToRefs(themeStore)
</script>

<template>
  <FloatingWindow :displayPosition="isMobile ? 'left' : 'right'">
    <div class="series-container">
      <div class="series">
        <div class="series-title">
          {{showAchievementSeries.SeriesTitle}}
        </div>
        <div class="series-count">
          {{showAchievementSeries.completedAchievementsLength}} / {{showAchievementSeries.AchievementsLength}}
          <span v-if="showAchievementSeries.notAvailableAchievementsLengeh" class="series-count-not-available">+{{ showAchievementSeries.notAvailableAchievementsLengeh }}</span>
          ({{showAchievementSeries.completedPercentage}})
        </div>
        <div class="series-StellarJade">
          {{showAchievementSeries.completedStellarJadeTotal}} / {{showAchievementSeries.StellarJadeTotal}}
          <img :src="achievementStore.StellarJadeImg" alt="星琼">
        </div>
      </div>
      <div class="series-bg-image">
        <img :src="isDark ? showAchievementSeries.imageDarkPath : showAchievementSeries.imagePath" :alt="showAchievementSeries.SeriesTitle">
      </div>
  </div>
  </FloatingWindow>
</template>

<style scoped>
.series-container{
    height: 90px;
    user-select: none;
    position: relative;
    padding: 0 10px;
    background-color: var(--liyin-ach-current-page-bg-color);
    color: var(--liyin-ach-current-page-text-color);
}
.series{
    display: flex;
    flex-direction: column;
    justify-content: center;
    min-width: 100px;
    height: 90px;
    line-height: 23px;
    text-align: center;
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
    draggable: false;
    -webkit-user-drag: none;
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
    opacity: 0.6;
    draggable: false;
    -webkit-user-drag: none;
}

@media (max-width: 768px){
    .series-container{
      height: 70px;
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