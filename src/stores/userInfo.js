import {ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useUserInfoStore = defineStore('userInfo', () => {
    const userInfoList = ref({})

    const getUserInfo = () => {
        // 从缓存中读取名为 "userInfo" 的数据
        const tempUserInfo = localStorage.getItem("userInfo")

        // 检查是否存在名为 "userInfo" 的数据
        if (tempUserInfo !== null) {
            // 数据存在，将其从字符串转换为对象
            userInfoList.value = JSON.parse(tempUserInfo)

            // 检查数据是否合法
            let valid = true

            if(typeof userInfoList.value !== "object" || Array.isArray(userInfoList.value)) {
                // 数据不合法，重置为默认值
                userInfoList.value = {
                    currentTokenID: 1,
                    list: {
                        1:{
                            tokenID: 1,
                            avatar: 1001,
                            uid: 100000000, 
                            name: "开拓者", 
                        }
                    }
                }
                saveUserInfo()
                return
            }

            // 判断 list 是否存在且是否为对象且至少含有一个 tokenID
            if(userInfoList.value.list === undefined || typeof userInfoList.value.list !== "object" || Array.isArray(userInfoList.value.list) || Object.keys(userInfoList.value.list ?? {}).length === 0){
                // 数据不合法，重置为默认值
                userInfoList.value.list = {
                    1:{
                        tokenID: 1,
                        avatar: 1001,
                        uid: 100000000, 
                        name: "开拓者", 
                    }
                }
                valid = false
            }

            // 判断 currentTokenID 是否存在且是否在 list 中
            if(userInfoList.value.currentTokenID === undefined || userInfoList.value.list[userInfoList.value.currentTokenID] === undefined){
                // currentTokenID 充值为 list 中的第一个 tokenID
                userInfoList.value.currentTokenID = Object.keys(userInfoList.value.list)[0]
                valid = false
            }

            if (valid === false){
                saveUserInfo()
            }

        } else {
            // 数据不存在，执行相应的操作
            // userInfoList.value.currentTokenID = 1
            // userInfoList.value.list = {
            //     1:{
            //         tokenID: 1,
            //         avatar: 1001,
            //         uid: 100000000, 
            //         name: "开拓者", 
            //     }
            // }
            userInfoList.value = {
                currentTokenID: 1,
                list: {
                    1:{
                        tokenID: 1,
                        avatar: 1001,
                        uid: 100000000, 
                        name: "开拓者", 
                    }
                }
            }
            saveUserInfo()
        }
    }
    const saveUserInfo = () => {
        // 将对象转换为字符串，并将其存储在缓存中
        localStorage.setItem("userInfo", JSON.stringify(userInfoList.value))
    }

    const currentUserInfo = computed(() => {
        return userInfoList.value?.list?.[userInfoList.value?.currentTokenID]
    })

    const handleCurrentTokenID = (tokenID) => {
        userInfoList.value.currentTokenID = tokenID
        saveUserInfo()
    }

    const addUserInfo = (name, uid, avatar) => {
        if(Object.values(userInfoList.value.list ?? {}).length >= 5){
            ElMessage({
                showClose: true,
                message: '添加失败，账号个数不能超过 5',
                type: 'error',
            })
            return
        }
        let maxTokenID = -Infinity
        for(const tokenID in userInfoList.value.list){
            if(uid === userInfoList.value.list[tokenID].uid){
                ElMessage({
                    showClose: true,
                    message: '添加失败，该 UID 已存在',
                    type: 'error',
                })
                return
            }
            const tokenid = userInfoList.value.list[tokenID].tokenID
            if(tokenid > maxTokenID){
                maxTokenID = tokenid
            }
        }
        userInfoList.value.list[maxTokenID + 1] = {
            tokenID: maxTokenID + 1,
            avatar,
            uid,
            name,
        }

        saveUserInfo()
    }

    const editUserInfo = (tokenid, name, uid, avatar) => {
        if(!userInfoList.value.list[tokenid]) {
            ElMessage({
                showClose: true,
                message: '编辑失败，编辑账号不存在',
                type: 'error',
            })
            return
        }
        for(const tokenID in userInfoList.value.list){
            if(tokenid === userInfoList.value.list[tokenID].tokenID) continue
            if(uid === userInfoList.value.list[tokenID].uid){
                ElMessage({
                    showClose: true,
                    message: '编辑失败，该 UID 已存在',
                    type: 'error',
                })
                return
            }
        }
        userInfoList.value.list[tokenid].name = name
        userInfoList.value.list[tokenid].uid = uid
        userInfoList.value.list[tokenid].avatar = avatar
        saveUserInfo()
    }

    const deleteUserInfo = (tokenid) => {
        ElMessageBox.confirm(
            `确认删除 uid 为 ${userInfoList.value.list[tokenid].uid} 的账号吗？`, 
            '提示', 
            {
                confirmButtonText: '确认',
                cancelButtonText: '取消',
                // type: 'warning',
            }
        )
        .then(() => {
            // console.log('确认删除')
            if(!userInfoList.value.list[tokenid]) {
                ElMessage({
                    showClose: true,
                    message: '删除失败，删除账号不存在',
                    type: 'error',
                })
                return
            }
            if(Object.values(userInfoList.value.list ?? {}).length <= 1){
                ElMessage({
                    showClose: true,
                    message: '删除失败，账号个数不能少于 1',
                    type: 'error',
                })
                return
            }
    
            delete userInfoList.value.list[tokenid]
            if(userInfoList.value.currentTokenID === tokenid)   
                userInfoList.value.currentTokenID = Object.values(userInfoList.value.list ?? {})[0].tokenID
    
            saveUserInfo()
            updateUserAchievement()
        })
        .catch(() => {
            // console.log('取消删除')
        })
    }

    //更新（删除） userAchievement 中不存在userInfo 的 tokenID 中的数据
    const updateUserAchievement = () => {
        // 从缓存中读取名为 "userAchievement" 的数据
        let userAchievement = localStorage.getItem("userAchievement")

        // 检查是否存在名为 "userAchievement" 的数据
        if (userAchievement !== null) {
            // 数据存在，将其从字符串转换为对象
            userAchievement = JSON.parse(userAchievement)

            const userTokenIDs = Object.keys(userInfoList.value.list)

            for(const tokenID in userAchievement)
                if(!userTokenIDs.includes(tokenID))
                    delete userAchievement[tokenID]
            
            localStorage.setItem("userAchievement", JSON.stringify(userAchievement))
        } 
    }

    return {
        userInfoList,
        currentUserInfo,
        getUserInfo,
        handleCurrentTokenID,
        addUserInfo,
        editUserInfo,
        deleteUserInfo
    }
})