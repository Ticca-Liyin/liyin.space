<script setup>
import { ref } from 'vue';
import AchievementSeries from './AchievementSeries.vue';
import AchievementFilter from './AchievementFilter.vue';
import AchievementList from './AchievementList.vue';
import AchievementStrategy from './AchievementStrategy.vue';
import CurrentPageAchievementFloatingWindow from './CurrentPageAchievementFloatingWindow.vue'
import AchievementSetting from './AchievementSetting/index.vue'
import ExportAchievement from '@/components/export/ExportAchievement.vue';
import ImportAchievement from '@/components/import/importAchievement/index.vue';
import { DynamicScroller, DynamicScrollerItem } from 'vue-virtual-scroller'
import 'vue-virtual-scroller/dist/vue-virtual-scroller.css'
import { onMounted, watch } from 'vue';
import { storeToRefs } from 'pinia'
import { useAchievementStore } from '@/stores/achievement/achievement';
import { useShowAchievementsStore } from '@/stores/achievement/showAchievements';
import { useUserInfoStore } from '@/stores/userInfo';
import { useAchievementImportStore } from '@/stores/achievement/import/achievementImport'

const achievementStore = useAchievementStore()
const { initialAchievementsInfo, initialAchievementsStatus, initialNotAvailable, initialAchievementsCustomNotAchievedStatus } = achievementStore

const showAchievementsStore = useShowAchievementsStore();
const { showAchievements } = storeToRefs(showAchievementsStore);

const userInfoStore = useUserInfoStore()
const { currentUserInfo } = storeToRefs(userInfoStore)

const achievementImport = useAchievementImportStore()
const { isImporting } = storeToRefs(achievementImport)
const { autoImportAchievementsByCookie } = achievementImport

const AchievementSettingRef = ref(null)

onMounted(async () => {
    try {
        await initialAchievementsInfo();
        await autoImportAchievementsByCookie();

    } catch (error) {

    }
})

// 当前用户更改时，将对应数据切换至更改后的用户
watch(currentUserInfo, async () => {
    initialAchievementsStatus()
    // 对 暂时无法获得但因特殊情况状态时已获得的进行修正 由于会重复赋值 已赋值的 timestamp 若出现性能问题可进行优化
    initialNotAvailable()
    
    initialAchievementsCustomNotAchievedStatus()

    try {
        await autoImportAchievementsByCookie();
    } catch (error) {
        
    }
})

</script>

<template>
    <div class="achievement"
        v-loading.fullscreen.lock="isImporting"
        element-loading-text="正在通过 cookie 获取成就数据..."
        element-loading-background="rgba(0, 0, 0, 0.7)"
    >
        <header class="achievement-header">
            <div class="achievement-setting-button" @click="AchievementSettingRef.handleOpen">
                设置
            </div>
            <ImportAchievement />
            <ExportAchievement />
        </header>

        <AchievementSetting ref="AchievementSettingRef"/>

        <AchievementSeries/>

        <DynamicScroller
            :items="showAchievements"
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
    z-index: 600;
}
.achievement-setting-button {
    height: 15px;
    line-height: 15px;
    color: var(--el-text-color-regular);
    border: 1px solid var(--liyin-button-border-color);
    font-size: 15px;
    padding: 11px 15px 11px 15px;
    border-radius: 5px;
    cursor: pointer;
    user-select: none;
    margin-right: 10px;
}
.achievement-setting-button:hover {
    border: 1px solid var(--el-color-primary);
    color: var(--el-color-primary);
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
    .achievement-setting-button {
        font-size: 14px;
        padding: 8px 15px 8px 15px;
    }
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
        z-index: 500;
    }
}
</style>