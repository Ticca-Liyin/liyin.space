<script setup>
import { InfoFilled } from '@element-plus/icons-vue'
import { storeToRefs } from 'pinia'
import { useImportByCookieSettingStore } from '@/stores/achievement/setting/importByCookieSetting'

const importByCookiesettingStore = useImportByCookieSettingStore()
const { importByCookieSecondConfirmation } = storeToRefs(importByCookiesettingStore)
const { importByCookieSecondConfirmationList } = importByCookiesettingStore
</script>

<template>
    <div class="setting-title-main">
        <div class="setting-title"> Cookie 自动导入成就形式： </div>
        <el-icon class="setting-title-tip"><InfoFilled /></el-icon>        
    </div>
    <div class="setting-view">
        <!-- <el-select
            v-model=""
            placeholder="请选择导入形式"
            size="large"
            style="width: 240px"
        >
            <el-option
                v-for=""
                :key="item.value"
                :label="item.label"
                :value="item.value"
            />
        </el-select> -->
    </div>
    <div class="setting-title"> Cookie 自动导入间隔时间： </div>
    <div class="setting-view">
        <!-- <el-select
            v-model=""
            placeholder="请输入间隔时间"
            size="large"
            style="width: 240px"
        >
            <el-option
                v-for=""
                :key="item.value"
                :label="item.label"
                :value="item.value"
            />
        </el-select> -->
    </div>
</template>

<style scoped>
.setting-title-main {
    display: flex;
    align-items: center;
}
.setting-title {
    color: var(--liyin-textjion-text-color);
    /* font-size: 16px;
    margin: 10px 10px; */
    margin: 10px 0;
}
.setting-title-tip {
    color: var(--liyin-info-tip-color);
}
.setting-title-tip:hover {
    color: var(--liyin-info-tip-hover-color);
}
.setting-view{
    /* margin: 0 10px; */
    margin: 0;
}

</style>