<script setup>
import { ref } from 'vue';
import { useAchievementStore } from '@/stores/achievement';
import { storeToRefs } from 'pinia';

const achievementStore = useAchievementStore()
const { achievements } = storeToRefs(achievementStore)
const { handleUserAchievementList, handleAchevementStatus } = achievementStore
const showImportDialog = ref(false)
const inputImportFile = ref(null)
const identifyFileName = ref('')
const importNum = ref(0)
const importAchievementList = ref([])
const statusList = [1, 2, 3] 

const handleDrop = (event) => {
    event.preventDefault();
    // 判断file是文件夹还是文件
    const isDirectory = event.dataTransfer.items[0].webkitGetAsEntry()?.isDirectory
    const files = event.dataTransfer.files;

    if (isDirectory === undefined){
        ElMessage({
            showClose: true,
            message: '导入失败，导入文件不存在',
            type: 'error',
        })
        return  
    }
    if (isDirectory) {
        ElMessage({
            showClose: true,
            message: '导入失败，不能导入文件夹',
            type: 'error',
        })
        return
    }
    if (files.length !== 1) {
        ElMessage({
            showClose: true,
            message: '导入失败，每次只能导入一个文件',
            type: 'error',
        })
        return;
    }

    readFile(files)
}
const selectFile = () => {
    inputImportFile.value.click()
}
const inputFile = (e) => {
    if(e.target.files.length === 0){
        ElMessage({
            showClose: true,
            message: '导入失败，请选择文件',
            type: 'error',
        })
        return;
    }
    if(e.target.files.length > 1){
        ElMessage({
            showClose: true,
            message: '导入失败，每次只能导入一个文件',
            type: 'error',
        })
        return;
    }
    readFile(e.target.files)
}
const checkLiyin = (jsonData) => {
    if (!jsonData?.list || typeof jsonData.list !== 'object' || Array.isArray(jsonData.list)) {
        importNum.value = 0
        importAchievementList.value = []
        return
    }

    const jsonAchievementList = jsonData.list
    const AchievementIDs = []
    importAchievementList.value = []
    importNum.value = 0
    achievements.value.forEach(achievement => AchievementIDs.push(achievement.AchievementID))

    for(const id in jsonAchievementList){
        if(AchievementIDs.includes(jsonAchievementList[id]?.id) && statusList.includes(jsonAchievementList[id]?.status)){
            importNum.value++
            if(jsonAchievementList[id]?.status === 3)
                importAchievementList.value.push(jsonAchievementList[id])
        }
    }
}
const checkCocogoat = (jsonData) => {
    if (!jsonData?.list || !Array.isArray(jsonData.list)) {
        importNum.value = 0
        importAchievementList.value = []
        return
    }

    const jsonAchievementList = jsonData.list
    const AchievementIDs = []
    importAchievementList.value = []
    importNum.value = 0
    achievements.value.forEach(achievement => AchievementIDs.push(achievement.AchievementID))

    for(const achievement of jsonAchievementList){
        if(AchievementIDs.includes(achievement?.id) && statusList.includes(achievement?.status)){
            importNum.value++
            if(achievement?.status === 3)
                importAchievementList.value.push(achievement)
        }
    }
}
const checkAchievements = (jsonData) => { 
    if ( jsonData?.info){
        if (jsonData.info.export_app === "liyin"){
            checkLiyin(jsonData)
            return
        }
        else if (jsonData.info.export_app === "cocogoat"){
            checkCocogoat(jsonData)
            return
        }
    }
    checkLiyin(jsonData)
}
const readFile = (files) => {
    const fileName = files[0].name;  // 获取文件路径

    const isJsonFile = fileName.endsWith('.json'); // 判断文件是否为 JSON 文件

    if(!isJsonFile){
        ElMessage({
            showClose: true,
            message: '导入失败，只能导入 JSON 文件',
            type: 'error',
        })
        return
    }
    identifyFileName.value = fileName

    const reader = new FileReader();
    reader.onload = (event) => {
        const fileContent = event.target.result; // 获取文件内容

        const jsonData = JSON.parse(fileContent); // 将 JSON 字符串解析为 JSON 对象

        checkAchievements(jsonData)
    };
    reader.readAsText(files[0]); // 读取文件内容
}
const importAchievements = () => {
    // 初始化所有成就状态为未完成
    achievements.value.forEach(achievement => {
        achievement.Status = 1
        handleUserAchievementList(achievement.AchievementID, achievement.Status)
    })
    // 修改已完成状态, 同一多选已成就后识别的覆盖先识别到的
    for(const ach of importAchievementList.value){
        if (ach.status !== 3) continue

        const ach_ = achievements.value.find(achievement => ach.id === achievement.AchievementID)

        if (!ach_) continue
        ach_.Status = 1
        handleAchevementStatus(ach_)
    }
    // 旧版导入逻辑
    // for(const ach of achievements.value){
    //     if (ach.isNotAvailable) continue

    //     // 更新成就状态
    //     const ach_ = importAchievementList.value.find(achievement => ach.AchievementID === achievement.id)

    //     if (!ach_) ach.Status = 1
    //     else ach.Status = ach_.status

    //     handleUserAchievementList(ach.AchievementID, ach.Status)
    // }
    handleCloseImportDialog()
}
const handleCloseImportDialog = () => {
    showImportDialog.value = false
    identifyFileName.value = ''
    importNum.value = 0
    importAchievementList.value = []
    inputImportFile.value.value = ''
}
</script>

<template>
    <div class="import-button" @click="showImportDialog = true">
        导入
    </div>
    <el-dialog
    v-model="showImportDialog"
    align-center
    title="导入"
    class="dialog-import"
    :before-close="handleCloseImportDialog"
  >
        <div class="dialog-import-main"
        @dragenter.prevent
        @dragover.prevent
        @drop="handleDrop"
        >
            <div class="dialog-import-tip">
                <p>点击右下方 "选择文件" 按钮选择文件，或将文件拖拽入虚线框内进行导入</p><br/>
                <p>导入的成就会覆盖现在所选账号原有的所有成就信息，请谨慎导入</p><br/>
                <p>目前仅支持的导入 json 文件</p><br/>
                <p>支持导入的项目如下：</p>
                <p>-&nbsp;&nbsp;liyin&nbsp;&nbsp;&nbsp;JSON</p>
                <p>-&nbsp;&nbsp;椰羊&nbsp;&nbsp;&nbsp;JSON</p><br/><br/>
            </div>
            <div class="dialog-import-showFileName">
                <div class="dialog-import-showFileName-title">识别文件：</div>
                <el-input class="dialog-import-showFileName-input" v-model="identifyFileName" disabled placeholder="请先选择文件" />
                <el-button plain class="dialog-import-button-select" @click="selectFile">选择文件</el-button>    
            </div>
            <input type="file" id="inputImportFile"  ref="inputImportFile" class="dialog-import-file-input" @change="inputFile">
        </div>
        <template #footer>
            <div class="dialog-import-footer">
                <div v-if="!importNum" class="dialog-import-footer-tip">未识别到可导入的内容</div>
                <div v-else class="dialog-import-footer-tip">识别到成就 {{ importNum }} 个</div>
                <el-button type="primary" plain @click="importAchievements" :disabled="!importNum">
                导入
                </el-button>
            </div>
        </template>
  </el-dialog>
</template>

<style>
.import-button {
    height: 15px;
    line-height: 15px;
    color: #606266;
    border: 1px solid #DCDFE6;
    font-size: 15px;
    padding: 11px 15px 11px 15px;
    border-radius: 5px;
    cursor: pointer;
    user-select: none;
}
.import-button:hover {
    border: 1px solid #409EFF;
    color: #409EFF;
}
.dialog-import{
    width:40%;
}
.dialog-import .el-dialog__header{
    margin: 0;
}
.dialog-import .el-dialog__body{
    padding: 10px 20px 15px 20px;
}
.dialog-import .el-dialog__footer{
    padding: 0px 20px 15px 20px;
}
.dialog-import-main{
    width:100%;
    border:1px dashed #606266;
    border-radius: 5px;
    position: relative;
}
/* .dialog-import-showFileName{
    height: 40px;
} */
.dialog-import-tip{
    color: #767676;
    font-size: 15px;
    padding-left: 20px;
    padding-top: 10px;
    line-height: 20px;   
}
.dialog-import-showFileName-title{
    width: 80px;
    padding-left: 20px;
    font-size: 16px;
}
.dialog-import-showFileName-input{
    width: 400px;
    height: 60px;
    padding-left: 20px;
    padding-top: 10px;
    padding-bottom: 20px;
}
.dialog-import-button-select{
    position: absolute;
    right: 20px;
    bottom: 20px;
}
.dialog-import-file-input{
    display: none;
}
.dialog-import-footer{
    display: flex; 
    align-items: center;
    justify-content: space-between;
}
.dialog-import-footer-tip{
    color: #767676;
    font-size: 15px;
    padding-left: 10px;
}
@media (max-width: 768px){
    .dialog-import{
        width: 80%;
    }
    .dialog-import-main{
        max-height: 250px;
        overflow-y: auto;
    }
    .dialog-import-tip{
        font-size: 12px;
        padding-left: 20px;
        padding-top: 10px;
        padding-right: 20px;
        line-height: 15px;   
    }
    .dialog-import-showFileName{
        position: relative;
    }
    .dialog-import-showFileName-title{
        width: 80px;
        padding-left: 20px;
        font-size: 14px;
    }
    .dialog-import-showFileName-input{
        width: 100%;
        height: 90px;
        padding-left: 20px;
        padding-right: 20px;
        padding-top: 10px;
        padding-bottom: 50px;
    }
    .dialog-import-button-select{
        position: absolute;
        right: 20px;
        bottom: 10px;
    }
    .dialog-import-footer-tip{
        font-size: 12px;
        padding-left: 0px;
    }
}
</style>