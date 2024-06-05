<script setup>
import { useCharacterStore } from '@/stores/character';
import { useUserInfoStore } from '@/stores/userInfo'
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { Edit, Delete, Plus } from '@element-plus/icons-vue'
import { getValidUerInfoAvatar, getValidUerInfoAvatarName} from '@/utils/getValidUerInfoAvatar'

const characterStore = useCharacterStore()
const { characters } = storeToRefs(characterStore)
const { characterDefaultAvatar, characterDefaultName } = characterStore

const userInfoStore = useUserInfoStore()
const { userInfoList, currentUserInfo } = storeToRefs(userInfoStore)
const { handleCurrentTokenID, addUserInfo, editUserInfo, deleteUserInfo } = userInfoStore

const addDialog = ref(false)
const editDialog = ref(false)
const editInfo = ref({})
const avater = ref('')
const name = ref('')
const uid = ref('')
const error = ref('')

const checkValidity = (userInfo) => {
    console.log(typeof avater.value)
    if(!avater.value){
        error.value = '请选择头像'
        return 0
    }
    if(!(avater.value in characters.value)){
        error.value = '该头像不在有效范围内'
        return 0
    }
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
    avater.value = ''
    name.value = ''
    uid.value = ''
    error.value = ''
    addDialog.value = true
}

const showEditDialog = (userInfo) => {
    avater.value = userInfo.avatar
    name.value = userInfo.name
    uid.value = userInfo.uid
    error.value = ''
    editInfo.value = userInfo
    editDialog.value = true
}

const addSubmit = () => {
    if(!checkValidity()) return
    addUserInfo(name.value, uid.value, avater.value)
    addDialog.value = false
}

const editSubmit = () => {
    if(!checkValidity(editInfo.value)) return
    editUserInfo(editInfo.value.tokenID, name.value, uid.value, avater.value)
    editInfo.value = {}
    editDialog.value = false
}

const handleCloseEditDialog = (done) => {
    editInfo.value = {}
    done()
}
</script>

<template>
    <div class="setting-title">账号管理：</div>
    <div class="setting-user-view">
        <div class="setting-user-info" v-for="userInfo in userInfoList.list" :key="userInfo.tokenID"
        :class="{'selected': currentUserInfo.tokenID === userInfo.tokenID }" @click="handleCurrentTokenID(userInfo.tokenID)">
            <div class="setting-user-left">
                <div class="setting-user-avatar">
                    <img :src='getValidUerInfoAvatar(userInfo?.avatar)' 
                        :alt="getValidUerInfoAvatarName(userInfo?.avatar)">
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
    <el-dialog
        v-model="addDialog"
        title="添加账号"
        align-center
        class="dialog-userInfo"
    >
        <el-form label-width="auto">
            <el-form-item label="头像">
                <el-select v-model="avater" filterable placeholder="请选择头像" style="width: 100%;">
                    <el-option class="character-avatar-select"
                    v-for="item in Object.values(characters)"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                    >
                        <div class="s-character-avatar">
                            <img :src='getValidUerInfoAvatar(item?.id)' 
                                :alt="getValidUerInfoAvatarName(item?.id)">
                        </div>
                        <div class="s-character-name"> {{ item?.name }} </div>
                    </el-option>
                    <template #prefix>
                        <div class="character-selected-avatar" >
                            <img :src='getValidUerInfoAvatar(avater)' 
                                :alt="getValidUerInfoAvatarName(avater)" v-if="avater in characters">
                            <img :src="characterDefaultAvatar" :alt="characterDefaultName" v-else>
                        </div>
                    </template>
                </el-select>
            </el-form-item>
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
            <el-form-item label="头像">
                <el-select v-model="avater" filterable placeholder="请选择头像" style="width: 100%;">
                    <el-option class="character-avatar-select"
                    v-for="item in Object.values(characters)"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                    >
                        <div class="s-character-avatar">
                            <img :src='getValidUerInfoAvatar(item?.id)' 
                                :alt="getValidUerInfoAvatarName(item?.id)">
                        </div>
                        <div class="s-character-name"> {{ item?.name }} </div>
                    </el-option>
                    <template #prefix>
                        <div class="character-selected-avatar" >
                            <img :src='getValidUerInfoAvatar(avater)' 
                                :alt="getValidUerInfoAvatarName(avater)" v-if="avater in characters">
                            <img :src="characterDefaultAvatar" :alt="characterDefaultName" v-else>
                        </div>
                    </template>
                </el-select>
            </el-form-item>
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
</template>

<style>
.setting-title {
    color: var(--liyin-text-color);
    font-size: 16px;
    margin: 10px 10px;
}
.setting-user-view{
    margin: 0 10px;
    border: 1px solid var(--liyin-main-border-color);
    border-radius: 5px;
}
.setting-user-info{
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 60px;
    padding: 0 15px;
    border-bottom: 1px solid var(--liyin-main-border-color);
    cursor: pointer;
    user-select: none;
}
.setting-user-info.selected{
    background-color: var(--liyin-setting-selected-bg-color);
}
.setting-user-info:hover{
    background-color: var(--liyin-setting-hover-bg-color);
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
    border: 2px solid var(--liyin-char-avatar-border-color);
    background-color: var(--liyin-char-avatar-bg-color);
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
    color: var(--liyin-text-main-color)
}
.setting-user-info.selected .setting-user-name{
    color: var(--el-color-primary);
}
.setting-user-uid{
    color: var(--liyin-text-color);
    font-size: 12px;
}
.setting-user-info.selected .setting-user-uid{
    color: var(--el-color-primary);
}
.setting-user-add{
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 50px;
    padding: 0 15px;
}
.setting-user-tip{
    color: var(--liyin-text-color);
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
.character-avatar-select{
    display: flex;
    align-items: center;
    height: 40px;
    margin: 4px 0;
}
.character-avatar-select .s-character-avatar{
    width: 35px;
    height: 35px;
    border-radius: 50%;
    border: 2px solid var(--liyin-char-avatar-border-color);
    overflow: hidden;
    margin-right: 10px;
    background-color: var(--liyin-char-avatar-bg-color);
}
.character-selected-avatar{
    width: 35px;
    height: 35px;
    border-radius: 50%;
    border: 2px solid var(--liyin-char-avatar-border-color);
    overflow: hidden;
    margin: 10px 5px;
    background-color: var(--liyin-char-avatar-bg-color);
}
.character-avatar-select .s-character-avatar img, .character-selected-avatar img{
    width: 100%;
    height: 100%;
}
.character-avatar-select .s-character-name{
    font-size: 15px;
    font-weight: 500;
}
.character-avatar-select:hover .s-character-name{
    color: var(--el-color-primary);
}
@media (max-width: 768px){
    .dialog-userInfo{
        width: 80%;
    }
}
</style>