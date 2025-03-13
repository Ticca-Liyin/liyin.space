<script setup>
import { useThemeStore } from '@/stores/theme'

const themeStore = useThemeStore()

</script>

<template>
    <div class="setting-title"> 主题颜色： </div>
    <div class="setting-theme-view">
        <el-select
            v-model="themeStore.theme"
            placeholder="请选择主题颜色"
            size="large"
            style="width: 240px"
        >
            <el-option
                v-for="item in themeStore.themeList"
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
    margin: 10px 0;
}

</style>