<script setup>
import { useSettingStore } from '@/stores/setting.js'

const settingStore = useSettingStore()

</script>

<template>
    <div class="setting-title"> 成就筛选配置缓存： </div>
    <div class="setting-view">
        <el-select
            v-model="settingStore.achievementFilterCacheConfig"
            placeholder="请选择操作状态"
            size="large"
            style="width: 240px"
        >
            <el-option
                v-for="item in settingStore.filterCacheConfigList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
            />
        </el-select>
    </div>
</template>

<style scoped>
.setting-title {
    color: var(--liyin-text-color);
    font-size: 16px;
    margin: 10px 10px;
}
.setting-view{
    margin: 0 10px;
}

</style>