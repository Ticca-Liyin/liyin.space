<template>
    <el-dialog
      v-model="showDialog" :show-close="false" width="auto"
      top="0" align-center class="select-sync-data-dialog"
      :close-on-click-modal="false" :close-on-press-escape="false"
    >   
        <template #header></template>
        <div class="sync-info-tip">检测到本地数据与云端数据冲突，请选择要保留的数据：</div>
        <div class="sync-info-body">
            <div class="sync-info-data">
                <el-radio v-model="selectedOption" class="sync-info-radio" value="local" :size="toSmall ? 'small' : ''">本地数据</el-radio> 
                <div class="sync-info-box" @click="selectedOption = 'local'">
                    <el-scrollbar class="sync-info-scroll" height="auto" :max-height="toSmall ? 100: 200">
                        <template v-for="(item, id) in localData" >
                            <div v-if="id !== 'currentTokenID'" class="sync-info-container">
                                <div>
                                    <div class="sync-info-user">
                                        <div class="sync-info-user-name">
                                            {{item.user?.data?.name}}
                                        </div>
                                        <div class="sync-info-user-uid">
                                            {{item.user?.data?.uid}}
                                        </div>
                                    </div>
                                    <div class="sync-info-content">
                                        <span class="sync-info-title">已完成成就数：</span>
                                        <span class="sync-info-text">{{countFinishedAchievemts(item.achievements?.data)}}</span>
                                    </div>
                                </div>
                            </div>
                        </template>
                    </el-scrollbar>
                    <div class="sync-info-content">
                        <span class="sync-info-title">上次更新时间：</span>
                        <span class="sync-info-text">{{formatTimestamp(getLastUpdateTime(localData))}}</span>
                    </div>
                </div>
            </div>
            <div class="sync-info-space"></div>
            <div class="sync-info-data">
                <el-radio v-model="selectedOption" class="sync-info-radio" value="sync" :size="toSmall ? 'small' : ''">云端数据</el-radio>
                <div class="sync-info-box" @click="selectedOption = 'sync'">
                    <el-scrollbar class="sync-info-scroll" height="auto" :max-height="toSmall ? 100: 200">
                        <template v-for="(item, id) in cloudData" >
                            <div v-if="id !== 'currentTokenID'" class="sync-info-container">
                                <div>
                                    <div class="sync-info-user">
                                        <div class="sync-info-user-name">
                                            {{item.user?.data?.name}}
                                        </div>
                                        <div class="sync-info-user-uid">
                                            {{item.user?.data?.uid}}
                                        </div>
                                    </div>
                                    <div class="sync-info-content">
                                        <span class="sync-info-title">已完成成就数：</span>
                                        <span class="sync-info-text">{{countFinishedAchievemts(item.achievements?.data)}}</span>
                                    </div>
                                </div>
                            </div>
                        </template>
                    </el-scrollbar>
                    <div class="sync-info-content">
                        <span class="sync-info-title">上次更新时间：</span>
                        <span class="sync-info-text">{{formatTimestamp(getLastUpdateTime(cloudData))}}</span>
                    </div>
                </div>
            </div>
        </div>

        <template #footer>
            <el-button @click="handleConfirm">确认</el-button>
        </template>
    </el-dialog>
</template>

<script setup>
import { ref } from 'vue';
import formatTimestamp from '@/utils/formatTimestamp';

const props = defineProps({
    localData: {
        type: Object,
        default: ''
    },
    cloudData: {
        type: Object,
        default: ''
    }
})

const showDialog = ref(true);
const selectedOption = ref('');

const match = matchMedia('(max-width: 600px)')
const toSmall = ref(match.matches);
match.addEventListener('change', () => {
    toSmall.value = match.matches
})

const countFinishedAchievemts = (data) => {
    return Object.values(data || {}).filter(item => item.status === 3).length;
}

const getLastUpdateTime = (data) => {
    console.log(data)
    return Object.values(data || {}).reduce((maxTime, item) => 
        Math.max(maxTime, item.lastUpdateTime || 0), 0);
}

const handleConfirm = async () => {
    if (!selectedOption.value) {
        ElMessage({
            showClose: true,
            message: "请先选择要保留的数据",
            type: 'error',
        })
        return;
    }

    const [ first, second ] = selectedOption.value === 'local' ? ['本地', '云端'] : ['云端', '本地'];
    const message = `确认保留<b style="color: var(--el-color-primary);">${first}数据</b>，并将其覆盖<i>${second}数据</i> ？`;

    try {
        const res = await ElMessageBox.confirm(
        message, 
        '确认', 
        {
            dangerouslyUseHTMLString: true,
            confirmButtonText: '确认',
            cancelButtonText: '取消',
        }
        )
    } catch (error) {
        return;      
    }

    showDialog.value = false
    resolvePromise(selectedOption.value)
}

let resolvePromise = () => {}

const getSelection = () => {
    return new Promise((resolve) => {
        resolvePromise = resolve
    })
}

defineExpose({ getSelection })
</script>

<style scoped>
.sync-info-tip {
    font-size: 15px;
}
.sync-info-body {
    display: flex;
    flex-direction: row;
}
.sync-info-data {
    display: flex;
    flex-direction: column;
}
.sync-info-radio {
    width: 228px;
}
.sync-info-box {
    min-width: 250px;
    max-width: 250px;
    border: 1px solid var(--el-border-color);
    border-radius: 5px;
    padding: 5px;
    /* flex: 1; */
    cursor: pointer;
}
.sync-info-scroll{
    height: auto;
    max-height: 200px;
}
.sync-info-container {
    display: flex;
    align-items: center;
    border-radius: 5px;
    background-color: var(--liyin-sync-bg-color);
    padding: 10px;
    margin: 5px 0;
    overflow: hidden;
}
.sync-info-user {
    min-width: 230px;
    max-width: 230px;
    display: flex;
    align-items: end;
    margin-bottom: 5px;
    overflow: hidden;
}
.sync-info-user-name {
    margin-right: 5px;
    color: var(--liyin-text-main-color);
    font-size: 15px;
    font-weight: 600;
    overflow: hidden; 
    text-overflow: ellipsis; 
    white-space: nowrap;
}
.sync-info-user-uid {
    color: var(--liyin-text-color);
    font-size: 12px;
}
.sync-info-content {
    display: flex;
    align-items: end;
    margin: 2px 0;
}
.sync-info-title {
    color: var(--liyin-text-main-color);
    font-size: 13px;
}
.sync-info-text {
    color: var(--liyin-text-color);
    font-size: 13px;
}
.sync-info-space {
    margin: 5px;
}
@media (max-width: 600px){
    .sync-info-tip {
        font-size: 13px;
        max-width: 210px;
    }
    .sync-info-body {
        flex-direction: column;
    }
    .sync-info-box {
        min-width: 200px;
        max-width: 200px;
        padding: 4px;
    }
    .sync-info-radio {
        width: 178px;
    }
    .sync-info-scroll{
        max-height: 100px;
    }
    .sync-info-container {
        padding: 5px;
        margin: 3px 0;
    }
    .sync-info-user {
        min-width: 190px;
        max-width: 190px;
        margin-bottom: 5px;
    }
    .sync-info-user-name {
        margin-right: 3px;
        font-size: 13px;
    }
    .sync-info-user-uid {
        font-size: 10px;
    }
    .sync-info-content {
        margin: 2px 0;
    }
    .sync-info-title {
        font-size: 11px;
    }
    .sync-info-text {
        font-size: 11px;
    }
    .sync-info-space {
        margin: 1px;
    }
}
</style>

<style>
.select-sync-data-dialog .el-dialog__header {
  padding: 0;
}
@media (max-width: 600px){
    .select-sync-data-dialog.el-dialog {
        padding: 10px;
    }
    .select-sync-data-dialog .el-dialog__footer {
        padding-top: 5px;
    }
}
</style>
