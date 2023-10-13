<script setup>
import { useUserInfoStore } from '@/stores/userInfo'
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { Edit, Delete, Plus } from '@element-plus/icons-vue'

const userInfoStore = useUserInfoStore()
const { userInfoList, currentUserInfo } = storeToRefs(userInfoStore)
const { handleCurrentTokenID, addUserInfo, editUserInfo, deleteUserInfo } = userInfoStore

const addDialog = ref(false)
const editDialog = ref(false)
const editInfo = ref({})
const name = ref('')
const uid = ref('')
const error = ref('')
const checkValidity = (userInfo) => {
    if(!name.value){
        error.value = '请输入名称'
        return 0
    }
    if(!name.value.length > 10){
        error.value = '名称长度不能超过 10个字'
        return 0
    }
    if(!uid.value){
        error.value = '请输入 UID'
        return 0
    }
    if(typeof uid.value !== 'number'){
        error.value = 'UID 只能为数字' 
        return 0
    }
    if(uid.value < 100000000 || uid.value > 999999999){
        error.value = 'UID 长度必须为 9位'
        return 0
    }
    for(const tokenID in userInfoList.value.list){
        const UID = userInfoList.value.list[tokenID].uid
        if(userInfo?.uid === UID) continue 
        if(uid.value === UID){
            error.value = '该 UID 已存在'
            return 0
        }
    }
    error.value = ''
    return 1
}
const showAddDialog = () => {
    if(Object.values(userInfoList.value.list ?? {}).length >= 5){
        ElMessage({
            showClose: true,
            message: '账号个数不能超过 5 个',
            type: 'error',
        })
        return
    }
    name.value = ''
    uid.value = ''
    error.value = ''
    addDialog.value = true
}
const showEditDialog = (userInfo) => {
    name.value = userInfo.name
    uid.value = userInfo.uid
    error.value = ''
    editInfo.value = userInfo
    editDialog.value = true
}
const addSubmit = () => {
    if(!checkValidity()) return
    addUserInfo(name.value, uid.value)
    addDialog.value = false
}
const editSubmit = () => {
    if(!checkValidity(editInfo.value)) return
    editUserInfo(editInfo.value.tokenID, name.value, uid.value)
    editInfo.value = {}
    editDialog.value = false
}
const handleCloseEditDialog = (done) => {
    editInfo.value = {}
    done()
}
</script>

<template>
    <div class="setting">
        <div class="setting-title">账号管理：</div>
        <div class="setting-user-view">
            <div class="setting-user-info" v-for="userInfo in userInfoList.list" :key="userInfo.tokenID"
            :class="{'selected': currentUserInfo.tokenID === userInfo.tokenID }" @click="handleCurrentTokenID(userInfo.tokenID)">
                <div class="setting-user-left">
                    <div class="setting-user-avatar">
                        <img src="/src/images/三月七.png" alt="">
                    </div>
                    <div class="setting-user-content">
                        <div class="setting-user-name"> {{ userInfo.name }} </div>
                        <div class="setting-user-uid"> {{ userInfo.uid }}</div>
                    </div>
                </div>
                <div class="setting-user-right">
                    <el-button type="primary" :icon="Edit" plain @click.stop="showEditDialog(userInfo)"/>
                    <el-button type="danger" :icon="Delete" plain @click.stop="deleteUserInfo(userInfo.tokenID)"
                    :disabled="Object.values(userInfoList.list ?? {}).length <= 1"/>
                </div>
            </div>
            <div class="setting-user-add">
                <div class="setting-user-left">
                    <div class="setting-user-tip">点击对应账号进行切换</div>
                </div>
                <div class="setting-user-right">
                    <el-button type="primary" plain style="padding: 8px 10px;" 
                    :disabled="Object.values(userInfoList.list ?? {}).length >= 5" @click="showAddDialog"> 
                        <el-icon style="padding-right: 10px;"><Plus /></el-icon>添加账号
                    </el-button>
                </div>
            </div>
        </div>
        <!-- <div class="setting-title">关于：</div> -->
        <div class="setting-title">如果你有什么好的想法和建议，或者是发现网页中的bug，可以通过以下方式联系我：</div>
        <div class="setting-title">- QQ: 1765931937 </div>
        <div class="github">
            开源地址：
            <a href="https://github.com/Ticca-Liyin/liyin.space" target="_blank" class="github-link">GitHub</a>
        </div>
        <el-dialog
            v-model="addDialog"
            title="添加账号"
            align-center
            class="dialog-userInfo"
        >
            <el-form label-width="auto">
                <el-form-item label="名称">
                    <el-input v-model="name" placeholder="请输入名称" clearable maxlength="10"/>
                </el-form-item>
                <el-form-item label="UID">
                    <el-input v-model.number="uid" placeholder="请输入UID" clearable maxlength="9"/>
                </el-form-item>
            </el-form>
            <template #footer>
                <div class="footer-flex">
                    <div class="error">{{ error }}</div>
                    <el-button type="primary" @click="addSubmit">
                    添加
                    </el-button>
                </div>
            </template>
        </el-dialog>
        <el-dialog
            v-model="editDialog"
            title="编辑账号"
            align-center
            class="dialog-userInfo"
            :before-close="handleCloseEditDialog"
        >
            <el-form label-width="auto">
                <el-form-item label="名称">
                    <el-input v-model="name" placeholder="请输入名称" clearable maxlength="10"/>
                </el-form-item>
                <el-form-item label="UID">
                    <el-input v-model.number="uid" placeholder="请输入UID" clearable maxlength="9"/>
                </el-form-item>
            </el-form>
            <template #footer>
                <div class="footer-flex">
                    <div class="error">{{ error }}</div>
                    <el-button type="primary" @click="editSubmit">
                    保存
                    </el-button>
                </div>
            </template>
        </el-dialog>
    </div>
</template>

<style>
.github {
    color: #767676;
    font-size: 16px;
    margin: 20px 10px 0 10px;
}
.github a {
    text-decoration: none;
    color: #42b983;
    word-wrap: break-word;
}
.github a:hover{
    color: #2A9D8F;
}
.setting{
    height: 100%;
    overflow: hidden;
    overflow-y: auto;
}
.setting-title {
    color: #767676;
    font-size: 16px;
    margin: 5px 10px;
}
.setting-user-view{
    margin: 0 10px;
    border: 1px solid #ebebeb;
    border-radius: 5px;
}
.setting-user-info{
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 60px;
    padding: 0 15px;
    border-bottom: 1px solid #ebebeb;
    cursor: pointer;
    user-select: none;
}
.setting-user-info.selected{
    background-color: #ECF5FF;
}
.setting-user-info:hover{
    background-color: #F5F7FA;
}
.setting-user-left{
    display: flex;
    align-items: center;
    height: 100%;
}
.setting-user-right{
    display: flex;
    align-items: center;
    height: 100%;
}
.setting-user-avatar{
    width: 40px;
    height: 40px;
    border-radius: 50%;
    overflow: hidden;
    margin-right: 10px;
}
.setting-user-avatar img{
    width: 100%;
    height: 100%;
}
.setting-user-content{
    max-width: 150px;
    overflow: hidden; 
    white-space: nowrap;
}
.setting-user-name{
    font-size: 15px;
}
.setting-user-info.selected .setting-user-name{
    color: #409EFF;
}
.setting-user-uid{
    color: #767676;
    font-size: 12px;
}
.setting-user-info.selected .setting-user-uid{
    color: #409EFF; 
}
.setting-user-add{
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 50px;
    padding: 0 15px;
}
.setting-user-tip{
    color: #767676;
    font-size: 14px;
}
.dialog-userInfo{
    width: 40%;
}
.dialog-userInfo .el-dialog__body{
    padding: 10px 20px 0px 20px;
}
.footer-flex{
    display: flex;
    justify-content: space-between;
    align-items: center;
}
.error{
    color: red;
}
@media (max-width: 768px){
    .dialog-userInfo{
        width: 70%;
    }
}
</style>