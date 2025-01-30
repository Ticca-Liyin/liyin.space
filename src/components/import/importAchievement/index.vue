<script setup>
import { ref } from 'vue';
import ImportByFile from './ImportByFile.vue'
import ImportByStardb from './ImportByStardb.vue'
import ImportByCookie from './ImportByCookie.vue'

const showImportDialog = ref(false)
const activeName = ref('importByFile')

const importByFileRef = ref(null);
const importByStardbRef = ref(null);
const importByCookieRef = ref(null);

const handleCloseImportDialog = () => {
    showImportDialog.value = false

    if(importByFileRef.value){
        importByFileRef.value.reset()
    }

    if(importByStardbRef.value){
        importByStardbRef.value.reset()
    }

    if(importByCookieRef.value){
        importByCookieRef.value.reset()
    }
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
        <el-tabs v-model="activeName">
            <el-tab-pane label="文件导入" name="importByFile">
                <ImportByFile ref='importByFileRef' @import-achievements='handleCloseImportDialog'/>
            </el-tab-pane>
            <el-tab-pane label="Stardb 导入" name="importByStardb">
                <ImportByStardb ref='importByStardbRef' @import-achievements='handleCloseImportDialog'/>
            </el-tab-pane>
            <el-tab-pane label="Cookie 导入" name="importByCookie">
                <ImportByCookie ref='importByCookieRef' @import-achievements='handleCloseImportDialog'/>
            </el-tab-pane>
        </el-tabs>
    </el-dialog>
</template>

<style>
.import-button {
    height: 15px;
    line-height: 15px;
    color: var(--el-text-color-regular);
    border: 1px solid var(--liyin-button-border-color);
    font-size: 15px;
    padding: 11px 15px 11px 15px;
    border-radius: 5px;
    cursor: pointer;
    user-select: none;
}
.import-button:hover {
    border: 1px solid var(--el-color-primary);
    color: var(--el-color-primary);
}

.dialog-import{
    width:50%;
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
@media (max-width: 768px){
    .import-button {
        font-size: 14px;
        padding: 8px 15px 8px 15px;
    }
    .dialog-import{
        width: 80%;
    }
}
</style>