<template>
    <el-dialog 
        v-model="showUpdateLog"
        title="更新日志"
        align-center
        class="update-log-dialog"
        :before-close="handleClose"
    >
        <div class="update-log-view">
            <div v-for="item in updateLogInfo" :key="item.version" class="update-log-content">
                <h3> [v{{ item.version }}] - {{ item.date }} </h3>
                <div v-html="item.changes"></div>
            </div>
        </div>
    </el-dialog>
</template>

<script setup>
import { ref } from 'vue'
import { useUpdateLogStore } from '@/stores/updateLog';

const updateLogStore = useUpdateLogStore()
const { updateLogInfo, displayUpdateLog, updateLastShowVersion } = updateLogStore

const showUpdateLog = ref(displayUpdateLog())

const handleClose = (done) => {
    updateLastShowVersion()
    done()
}
</script>

<style scoped>
.update-log-view {
    max-height: 60vh;
    overflow-y: auto;
}

.update-log-view::-webkit-scrollbar {
    width: 6px;
    height: 6px;
}   
.update-log-view::-webkit-scrollbar-track {
    background-color: transparent;
}
.update-log-view::-webkit-scrollbar-thumb {
    background-color: rgba(139, 139, 139, 0.4);
    border-radius: 10px;
}
.update-log-view::-webkit-scrollbar-button {
    display: none;
}

.update-log-content {
    padding: 0 5px;
}

.update-log-content h3 {
    --liyin-update-log-version-color: var(--liyin-text-main-color);
    line-height: 32px;
    font-size: 18px;
    margin: 15px 0 10px 0;  
    color: var(--liyin-update-log-version-color);  
}
.update-log-content:first-child h3 {
    margin-top: 0;
}
</style>

<style>
.update-log-dialog {
    width: 50%;
    overflow: hidden;
}

.update-log-content ul {
    padding-left: 20px;
}

.update-log-content li {
    margin: 5px 0;
    color: var(--liyin-text-color);
}

@media (max-width: 768px){
    .update-log-dialog {
        width: 80%;
    }
}
</style>
