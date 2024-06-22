import {ref, watchEffect, computed } from 'vue'
import { defineStore, storeToRefs } from 'pinia'
import { useUserInfoStore } from '@/stores/userInfo'


export const useTextjoinStore = defineStore('textjoin', () => {
    //用户成就状态列表
    let userTextjoin = ref({})

    const TEXTJOIN_KEY = "userTextjoin"

    //获取缓存
    const getUserTextjoin = () => {
        // 从缓存中读取名为 TEXTJOIN_KEY 的数据
        let tempUserTextjoin = localStorage.getItem(TEXTJOIN_KEY)

        // 检查是否存在名为 TEXTJOIN_KEY 的数据
        if (tempUserTextjoin !== null) {
            // 数据存在，将其从字符串转换为对象
            tempUserTextjoin = JSON.parse(tempUserTextjoin)

            if(typeof tempUserTextjoin !== "object" || Array.isArray(tempUserTextjoin)) {
                userTextjoin.value = {}
            }
            else {
                userTextjoin.value = tempUserTextjoin
            }
        } else {
            // 数据不存在，执行相应的操作
            userTextjoin.value = {}
        }
    }
    //保存缓存
    const saveUserTextjoin = () => {
        // 将对象转换为字符串，并将其存储在缓存中
        localStorage.setItem(TEXTJOIN_KEY, JSON.stringify(userTextjoin.value))
    }

    const getUserTextjoinList = (tokenID) => {
        const textjoinList = userTextjoin.value[tokenID]

        if(typeof textjoinList !== "object" || Array.isArray(textjoinList)) {
            return {}   
        }
        return JSON.parse(JSON.stringify(textjoinList))
    }

    const textjoinSelectList = {
        "TEXTJOIN#54" : ['次元扑满', '扑满', '泡泡', '毛球', '白色恶魔', '肥大', '扑满侠', '扑神'],
        "TEXTJOIN#87" : ['晖长石号', '开拓之尾号', '塔塔洛夫号', '飞翔时针号']
    }

    const textjoinIDs = Object.keys(textjoinSelectList)

    const userInfoStore = useUserInfoStore()
    const { userInfoList } = storeToRefs(userInfoStore)

    const getUserTextjoinValue = (tokenID, textjoinId) => {
        const userTokenIDs = Object.keys(userInfoList.value.list)

        if(!userTokenIDs.includes(tokenID)) {
            return undefined
        }

        if(!textjoinIDs.includes(textjoinId)) {
            return undefined
        }
        
        if(typeof userTextjoin.value[tokenID] !== "object" || Array.isArray(userTextjoin.value[tokenID])) {
            return textjoinSelectList[textjoinId][0]
        }

        return userTextjoin.value[tokenID][textjoinId] ?? textjoinSelectList[textjoinId][0]
    }

    const updateUserTextjoinValue = (tokenID, textjoinId, value) => {
        const userTokenIDs = Object.keys(userInfoList.value.list)

        if(!userTokenIDs.includes(tokenID)) {
            ElMessage({
                showClose: true,
                message: '更新 TEXTJOIN 失败，账号不存在',
                type: 'error',
            })
            return
        }

        if(!textjoinIDs.includes(textjoinId)) {
            ElMessage({
                showClose: true,
                message: '更新 TEXTJOIN 失败，TEXTJOIN ID 不存在',
                type: 'error',
            })
            return
        }

        if(!textjoinSelectList[textjoinId].includes(value)) {
            ElMessage({
                showClose: true,
                message: `更新 TEXTJOIN 失败，${value} 不在可选参数中`,
                type: 'error',
            })
            return
        }

        if(typeof userTextjoin.value[tokenID] !== "object" || Array.isArray(userTextjoin.value[tokenID])) {
            userTextjoin.value[tokenID] = {}
        }

        userTextjoin.value[tokenID][textjoinId] = value

        saveUserTextjoin()
    }

    return {
        textjoinSelectList,
        getUserTextjoin,
        getUserTextjoinList,
        getUserTextjoinValue,
        updateUserTextjoinValue,
    }
})