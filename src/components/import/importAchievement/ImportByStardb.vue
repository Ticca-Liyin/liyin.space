<script setup>
import { ref } from 'vue';
import { useAchievementStore } from '@/stores/achievement/achievement';
import { useAchievementImportStore } from '@/stores/achievement/import/achievementImport'
import { storeToRefs } from 'pinia';

const achievementStore = useAchievementStore()
const { achievements } = storeToRefs(achievementStore)

const achievementImport = useAchievementImportStore()
const { importAchievementsByIds } = achievementImport

const importData = ref('')
const errorStr = ref('')
const importAchievementList = ref([])

const identifyData = () => {
    errorStr.value = ''
    importAchievementList.value = []

    try {
        // 尝试将用户输入的 JSON 字符串解析为 JavaScript 对象
        const data = JSON.parse(importData.value);

        // 进一步检查解析后的数据是否符合预期
        if (typeof data === 'object' && data !== null && !Array.isArray(data) && 'hsr_achievements' in data && Array.isArray(data.hsr_achievements)) {
            const AchievementIDs = []
            achievements.value.forEach(achievement => AchievementIDs.push(achievement.AchievementID))

            for(const id of data.hsr_achievements){
                if(AchievementIDs.includes(id) && !importAchievementList.value.includes(id)){
                    importAchievementList.value.push(id)
                }
            }
        }
        else {
            errorStr.value = '无法正确识别导入数据'
        }
    } catch (error) {
        errorStr.value = '无法正确识别导入数据'
    }
}

const emit = defineEmits(['import-achievements']);

const importAchievements = () => {
    importAchievementsByIds(importAchievementList.value)

    emit('import-achievements')
}

const reset = () => {
    errorStr.value = ''
    importData.value = ''
    importAchievementList.value = []
}

defineExpose({ reset })
</script>

<template>
    <div class="stardb-import-main"
    @dragenter.prevent
    @dragover.prevent
    @drop="handleDrop"
    >
        <div class="stardb-import-tip">
            <p>将 stardb-exporter 程序导出的数据复制到文本框中进行导入（仅支持 PC 端）</p><br/>
            <p>stardb-exporter 程序主要是通过爬取游戏的网络数据包实现的，目前不清楚该方法是否涉及违规，<span style="color: red;">担心封号的请谨慎使用</span></p><br/>
            <p style="color: #e6a23c;">导入的成就会覆盖当前所选账号原有的所有成就信息，请谨慎导入</p><br/>
            <p>stardb-exporter 程序获取方式：</p>
            <a class="stardb-import-link" href="https://github.com/juliuskreutz/stardb-exporter" target="_blank">github 源文件</a>
            &nbsp; | &nbsp;
            <!-- <a class="stardb-import-link" href="" target="_blank">github 汉化版</a>
            &nbsp; | &nbsp; -->
            <a class="stardb-import-link" href="https://liyinresources.lanzout.com/iiaXJ2lnzesj" target="_blank">蓝奏云下载</a>
            <br/><br/>
            <p>教程视频：<a class="stardb-import-link" href="https://www.bilibili.com/video/BV1rE421N7b5/" target="_blank">点这里</a></p><br/>
            
        </div>
        <div class="stardb-import-data">
            <div class="stardb-import-data-title">导入数据：</div>
            <el-input v-model="importData" class="stardb-import-data-textarea" :rows="3" resize="none" type="textarea" 
            placeholder="请输入 stardb-exporter 程序导出的数据"  @input="identifyData"/> 
        </div>
    </div>
    <div class="stardb-import-footer">
        <div v-if="errorStr" class="stardb-import-footer-error">{{ errorStr }}</div>
        <div v-else-if="!importAchievementList.length" class="stardb-import-footer-tip">未识别到可导入的内容</div>
        <div v-else class="stardb-import-footer-tip">识别到已完成成就 {{ importAchievementList.length }} 个</div>
        <el-button type="primary" plain @click="importAchievements" :disabled="!importAchievementList.length">
        导入
        </el-button>
    </div>
</template>

<style scoped>
.stardb-import-main{
    width:99%;
    border:1px dashed var(--liyin-dashed-border-color);
    border-radius: 5px;
    max-height: 350px;
    overflow-y: auto;
}
.stardb-import-main::-webkit-scrollbar,
.stardb-import-data-textarea ::-webkit-scrollbar {
    width: 6px;
    height: 6px;
}   
.stardb-import-main::-webkit-scrollbar-track,
.stardb-import-data-textarea ::-webkit-scrollbar-track {
    background-color: transparent;
}
.stardb-import-main::-webkit-scrollbar-thumb,
.stardb-import-data-textarea ::-webkit-scrollbar-thumb {
    background-color: rgba(139, 139, 139, 0.4);
    border-radius: 10px;
}
.stardb-import-main::-webkit-scrollbar-button,
.stardb-import-data-textarea ::-webkit-scrollbar-button {
    display: none;
}

.stardb-import-tip{
    color: var(--liyin-text-color);
    font-size: 15px;
    padding: 10px 20px 0 20px;
    line-height: 20px;   
}

.stardb-import-link {
    text-decoration: none;
    color: var(--liyin-url-text-color);
    word-wrap: break-word;
}
.stardb-import-link:hover {
    color: var(--liyin-url-hover-text-color);
}

.stardb-import-data{
    width: calc(100% - 40px);
    padding: 0 20px;
    font-size: 16px;
}
.stardb-import-data-title{
    margin-bottom: 10px;
}
.stardb-import-data-textarea{
    width: 100%;
    margin-bottom: 10px;
}

.stardb-import-footer{
    display: flex; 
    align-items: center;
    justify-content: space-between;
    margin-top: 15px;
}
.stardb-import-footer-error{
    color: red;
    font-size: 15px;
}
.stardb-import-footer-tip{
    color: var(--liyin-text-color);
    font-size: 15px;
}

@media (max-width: 768px){
    .stardb-import-main{
        max-height: 200px;
        overflow-y: auto;
    }

    .stardb-import-tip{
        font-size: 12px;
        line-height: 15px;   
    }

    .stardb-import-data{
        font-size: 14px;
    }

    .stardb-import-footer-error{
        font-size: 12px;
    }
    .stardb-import-footer-tip{
        font-size: 12px;
    }
}
</style>