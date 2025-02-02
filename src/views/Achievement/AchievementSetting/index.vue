<script setup>
import AchievementSelectAll from '@/views/Achievement/AchievementSetting/basicsSetting/AchievementSelectAllSecondConfirmation.vue'
import AchievementFilterCache from '@/views/Achievement/AchievementSetting/basicsSetting/AchievementFelterCache.vue'
import CurrentPageAchievementFloatingWindowDisplay from '@/views/Achievement/AchievementSetting/basicsSetting/CurrentPageAchievementFloatingWindowDisplay.vue';
import ImportByCookieSetting from '@/views/Achievement/AchievementSetting/importByCookieSetting/index.vue';
import TextjoinSetting from '@/views/Achievement/AchievementSetting/TextjoinSetting.vue'
import { ref, computed } from 'vue';
import { storeToRefs } from 'pinia'
import { useIsMobileStore } from '@/stores/isMobile'

const showSettingDrawer = ref(false);

const isMobileStore = useIsMobileStore()
const { isMobile } = storeToRefs(isMobileStore)

const handleClose = () => {
    showSettingDrawer.value = false;
}

const handleOpen = () => {
    showSettingDrawer.value = true;
}

const activeName = ref('basics')

defineExpose({ handleOpen, handleClose })

</script>

<template>
    <el-drawer
        v-model="showSettingDrawer"
        title="成就设置"
        direction='rtl'
        size='320px'
        :z-index="150"
        :style="isMobile ? 'padding-top: 50px;' : 'padding-top: 60px;'"
    >
        <div style="margin-top: -25px;">
            <el-tabs v-model="activeName" class="achievement-setting-tabs">
                <el-tab-pane label="基础" name="basics">
                    <AchievementSelectAll />

                    <AchievementFilterCache />

                    <CurrentPageAchievementFloatingWindowDisplay />
                </el-tab-pane>
                <el-tab-pane label="特殊文本" name="textjoin">
                    <TextjoinSetting />
                </el-tab-pane>
                <el-tab-pane label="cookie 导入" name="cookie">
                    <ImportByCookieSetting />
                </el-tab-pane>
            </el-tabs>
        </div>
    </el-drawer>
</template>

<style>
.achievement-setting-tabs .el-tabs__item{
    padding: 0 10px;
}
</style>