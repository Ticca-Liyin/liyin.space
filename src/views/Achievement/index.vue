<script setup>
import AchievementSeries from './AchievementSeries.vue';
import AchievementFilter from './AchievementFilter.vue';
import AchievementList from './AchievementList.vue';
import AchievementStrategy from './AchievementStrategy.vue';
import CurrentPageAchievementFloatingWindow from './CurrentPageAchievementFloatingWindow.vue'
import ExportAchievement from '@/components/export/ExportAchievement.vue';
import ImportAchievement from '@/components/import/ImportAchievement.vue';
import { DynamicScroller, DynamicScrollerItem } from 'vue-virtual-scroller'
import 'vue-virtual-scroller/dist/vue-virtual-scroller.css'
import { onMounted } from 'vue';
import { useAchievementStore } from '@/stores/achievement';

const achievementStore = useAchievementStore()

onMounted(() => {
   achievementStore.initialAchievementsInfo() 
   achievementStore.getAchievementFilterConfig()
})

</script>

<template>
    <div class="achievement">
        <header class="achievement-header">
            <ImportAchievement />
            <ExportAchievement />
        </header>

        <AchievementSeries/>

        <DynamicScroller
            :items="achievementStore.showAchievements"
            :min-item-size="60"
            :keyField="'AchievementID'"
            class="scroller"
            id="achievement-main-scroller"
        >
            <template #before>
                <AchievementFilter/>
            </template>
            <template v-slot="{ item, active }">
                <DynamicScrollerItem
                    :item="item"
                    :active="active"
                    :size-dependencies="[item.AchievementDesc]"
                >
                    <AchievementList :info="item" />
                </DynamicScrollerItem>
            </template>
            <template #after>
                <div class="bottom">
                    <div class="prompt-concent">
                        已经到底了
                    </div>
                </div>
            </template>
        </DynamicScroller>

        <AchievementStrategy/>

        <CurrentPageAchievementFloatingWindow/>
    </div>
</template>

<style>
.achievement{
    background: var(--liyin-bg-color-1);
    display: flex;
    flex-direction: column;
    /* height: 400px; */
    /* min-height: calc(100vh - 100px);
    height: 400px; */
    height: 100%;
    position: relative;
}
.achievement-header{
    height: 60px;
    /* width: 100%; */
    background: var(--liyin-bg-color-2);
    display: flex;
    align-items: center;
    position: fixed;
    top: 0;
    right: 160px;
    z-index: 30;
}
.scroller{
    flex: 1 0 0;
    overflow: hidden;
    overflow-y: auto;
    position: relative;
}
.vue-recycle-scroller > :first-child {
    position: sticky;
    top: 0;
    z-index: 10;
    background: var(--liyin-bg-color-1);
}
.achievement .scroller::-webkit-scrollbar {
    width: 6px;
    height: 6px;
}   
.achievement .scroller::-webkit-scrollbar-track {
    background-color: transparent;
}
.achievement .scroller::-webkit-scrollbar-thumb {
    background-color: rgba(139, 139, 139, 0.4);
    border-radius: 10px;
}
.achievement .scroller::-webkit-scrollbar-button {
    display: none;
}
.bottom {
    position: relative; 
    display: flex;
    justify-content: center; 
    align-items: center;
    padding: 20px 0;
    margin: 0 15px;
}
.bottom::before {
    content: ""; 
    position: absolute;
    top: 50%; 
    left: 0;
    right: 0;
    height: 1px; 
    background-color: var(--liyin-ach-bottom-text-color); 
    z-index: 1; 
}
.prompt-concent{
    position: relative;
    color: var(--liyin-ach-bottom-text-color);
    z-index: 2;
    background-color: var(--liyin-bg-color-1);
    padding: 0 20px;
}
@media (max-width: 768px){
    /* .scroller::-webkit-scrollbar {
        display: none;
    } */
    .bottom {
        padding: 5px 0;
        margin: 0 10px;
    }
    .prompt-concent{
        padding: 0 10px;
    }
    .achievement-header{
        height: 50px;
        top: 0;
        right: 135px;
        z-index: 30;
    }
    .import-button {
        font-size: 14px;
        padding: 8px 15px 8px 15px;
    }
}
</style>