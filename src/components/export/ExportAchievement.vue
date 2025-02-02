<script setup>
import { ArrowDown } from '@element-plus/icons-vue'
import { useAchievementStore } from '@/stores/achievement/achievement';
import { useUserAchievementStore } from '@/stores/achievement/userAchievement'
import { useIsMobileStore } from '@/stores/isMobile'
import { storeToRefs } from 'pinia';
import saveJson from './saveJson';
import { utils, writeFile } from 'xlsx';
import { useAchievementImportStore } from '@/stores/achievement/import/achievementImport'

const isMobileStore = useIsMobileStore()
const { isMobile } = storeToRefs(isMobileStore)

const achievementStore = useAchievementStore()
const { achievementSeries } = storeToRefs(achievementStore);

const userAchievementStore = useUserAchievementStore()
const { findUserAchievementList } = userAchievementStore

const achievementImport = useAchievementImportStore()
const { isImporting } = storeToRefs(achievementImport)

const doExport = (typeString) => {
    if (isImporting.value){
        ElMessage({
            showClose: true,
            message: "正在导入成就数据中，请稍后...",
            type: 'error',
        })
        return
    }

    if(typeString === 'liyin'){
        exportLiyin()
    }
    else if(typeString === 'excel'){
        exportExcel()
    }
    else {
        exportLiyin()
    }
}

const exportLiyin = () => {
    const nowDate = new Date()
    
    const exportData = {
        info: {
            export_app: "liyin",
            export_timestamp: nowDate.getTime(),
        },
        list: findUserAchievementList()?.list ?? {}
    }

    const filename = `liyin.achievement.${formatDate(nowDate)}.json`

    saveJson(exportData, filename)
}

const exportExcel = () => {
    const nowDate = new Date()

    const filename = `liyin.achievement.${formatDate(nowDate)}.xlsx`
    // 准备数据
    const data = []
    for(let i = 0; i < achievementSeries.value.length; i++){
        if(achievementSeries.value[i].SeriesID === 0) continue
        for(const achievement of achievementSeries.value[i].Achievements){
            const row = {
                ID: achievement.AchievementID,
                特辑: achievementSeries.value[i].SeriesTitle,
                名称: achievement.AchievementTitle,
                描述: achievement.AchievementDesc.replace(/<br>/g, ' ').replace(/<div style="color:#8790abff;">/g,'').replace(/<\/div>/g, ''),
                星琼: achievement.StellarJadeNum,
                成就版本: `V${achievement.Version}`,
                是否隐藏: achievement.ShowType === 'ShowAfterFinish' ? '隐藏' : '',
                获取状态: achievement.StatusDesc,
            }
            data.push(row)
        }
    }

    // 创建工作簿对象
    const workbook = utils.book_new();

    // 创建工作表对象
    const worksheet = utils.json_to_sheet(data);

    const colWidths = [10, 20, 20, 80, 8, 10, 10, 12];
    worksheet['!cols'] = colWidths.map(width => ({ width }));

    // 将工作表添加到工作簿
    utils.book_append_sheet(workbook, worksheet, '星穹铁道成就');

    // 将工作簿写入文件
    writeFile(workbook, filename);

}

const formatDate = (date) => {
    const year = date.getFullYear().toString().padStart(4, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    return `${year}${month}${day}${hours}${minutes}${seconds}`;
}
</script>

<template>
    <el-dropdown class="el-dropdown-main" :trigger="isMobile ? 'click' : 'hover'">
        <div class="export-button">
            导出
            <el-icon class="el-icon--right export-arrow">
                <arrow-down />
            </el-icon>
        </div>
        <template #dropdown>
            <el-dropdown-menu>
                <el-dropdown-item @click="doExport('liyin')">liyin JSON</el-dropdown-item>
                <el-dropdown-item divided @click="doExport('excel')">Excel 文件</el-dropdown-item>
            </el-dropdown-menu>
        </template>
    </el-dropdown>
</template>

<style>
.el-dropdown-main{
    width: 80px;
    padding: 10px;
    /* height: 100%; */
}
.export-button {
    height: 15px;
    line-height: 15px;
    display: flex;
    border: 1px solid var(--liyin-button-border-color);
    font-size: 15px;
    padding: 11px 10px 11px 15px;
    border-radius: 5px;
    cursor: pointer;
    user-select: none;
}
/* .export-arrow{
    color: var(--liyin-arrow-color)
} */
.export-button:hover {
    border: 1px solid var(--el-color-primary);
    color:  var(--el-color-primary);
}

@media (max-width: 768px){
    .export-button {
        font-size: 14px;
        padding: 8px 10px 8px 15px;
    }
}
</style>