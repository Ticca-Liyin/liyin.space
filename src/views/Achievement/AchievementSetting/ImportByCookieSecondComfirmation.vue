<script setup>
import { useAchievementSettingStore } from '@/stores/achievement/setting/achievementSetting.js'

const settingStore = useAchievementSettingStore()

</script>

<template>
    <div class="setting-title"> Cookie 导入二次确认： </div>
    <div class="setting-view">
        <el-select
            v-model="settingStore.importByCookieSecondConfirmation"
            placeholder="请选择操作状态"
            size="large"
            style="width: 240px"
        >
            <el-option
                v-for="item in settingStore.importByCookieSecondConfirmationList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
            />
        </el-select>
    </div>
</template>

<style scoped>
.setting-title {
    color: var(--liyin-textjion-text-color);
    /* font-size: 16px;
    margin: 10px 10px; */
    margin: 10px 0;
}
.setting-view{
    /* margin: 0 10px; */
    margin: 0;
}

</style>