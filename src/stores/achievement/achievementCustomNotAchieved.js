import {ref, watchEffect, computed } from 'vue'
import { defineStore, storeToRefs } from 'pinia'
import { useUserInfoStore } from '@/stores/userInfo'
import { uploadeCustomNotAchievedToCloud } from '@/utils/achievementCloudSync';

export const useAchievementCustomNotAchievedStore = defineStore('achievementCustomNotAchieved', () => { 
    const userInfoStore = useUserInfoStore()
    const { currentUserInfo } = storeToRefs(userInfoStore)

    //用户自定义暂不可获取列表
    let userCustomNotAchieved = {}

    const User_Custom_Not_Achieved_KEY = 'userCustomNotAchieved'

    //获取缓存
    const getUserCustomNotAchieved = () => {
        // 从缓存中读取名为 User_Custom_Not_Achieved_KEY 的数据
        const tempUserCustomNotAchieved = localStorage.getItem(User_Custom_Not_Achieved_KEY)

        // 检查是否存在名为 User_Custom_Not_Achieved_KEY 的数据
        if (tempUserCustomNotAchieved !== null) {
            // 数据存在，将其从字符串转换为对象
            userCustomNotAchieved = JSON.parse(tempUserCustomNotAchieved)

            // #region lastUpdateTime 属性缺失补充
            if (userCustomNotAchieved !== null && typeof userCustomNotAchieved === "object" && !Array.isArray(userCustomNotAchieved)) {
                let valid = true
                for(const tokenID in userCustomNotAchieved){
                    // 判断 lastUpdateTime 是否存在且是否为数字
                    if(userCustomNotAchieved[tokenID].lastUpdateTime === undefined || typeof userCustomNotAchieved[tokenID].lastUpdateTime !== "number"){
                        // 数据不合法，重置为默认值
                        userCustomNotAchieved[tokenID].lastUpdateTime = new Date().getTime()
                        valid = false
                    }
                }
                if (!valid) saveUserCustomNotAchieved()
            }
            // #endregion
        } else {
            // 数据不存在，执行相应的操作
            userCustomNotAchieved = {}
        }
    }
    //保存缓存
    const saveUserCustomNotAchieved = () => {
        // 将对象转换为字符串，并将其存储在缓存中
        localStorage.setItem(User_Custom_Not_Achieved_KEY, JSON.stringify(userCustomNotAchieved))
        saveUserCustomNotAchievedToCloud()
    }
    const resetUserCustomNotAchieved = (newData) => {
        localStorage.setItem(User_Custom_Not_Achieved_KEY, JSON.stringify(newData));
        getUserCustomNotAchieved();
    }
    const saveUserCustomNotAchievedToCloud = () => {
        const currentTokenId = currentUserInfo?.value.tokenID
        const customNotAchievedList = userCustomNotAchieved[currentTokenId]
        uploadeCustomNotAchievedToCloud(currentTokenId, {
            data: customNotAchievedList.list,
            updateTime: customNotAchievedList.lastUpdateTime
        })
    }
    const findUserCustomNotAchievedList = () => {
        // 查找自定义暂不可获取列表
        return userCustomNotAchieved[currentUserInfo?.value.tokenID]
    }  
    const getUserCustomNotAchievedList = (tokenID) => {
        const customNotAchievedList = userCustomNotAchieved[tokenID]

        if(typeof customNotAchievedList !== "object" || Array.isArray(customNotAchievedList)) {
            return {}   
        }
        return JSON.parse(JSON.stringify(customNotAchievedList))
    }
    const initUserCustomNotAchievedList = () => {
        // 初始化自定义暂不可获取列表
        userCustomNotAchieved[currentUserInfo?.value.tokenID] = {
            tokenID: currentUserInfo.value.tokenID,
            list: {},
            lastUpdateTime: new Date().getTime()
        }

        saveUserCustomNotAchieved()
    }  
    const handleUserCustomNotAchievedList = (achievementID, status, save = true) => {
        if(!achievementID) throw new Error("数据不能为空")
        if(typeof status !== 'boolean') throw new Error("参数status不能为非 true 或 false 的值")
        // 修改自定义暂不可获取列表
        const userCustomNotAchievedList = findUserCustomNotAchievedList()

        if (!userCustomNotAchievedList) {
            // 自定义暂不可获取列表不存在，创建新的自定义暂不可获取列表
            userCustomNotAchieved[currentUserInfo.value.tokenID] = {
                tokenID: currentUserInfo.value.tokenID,
                list: {
                    [achievementID]: {
                        id: achievementID,
                        status: status
                    }
                },
                lastUpdateTime: new Date().getTime()
            }
            if(save) saveUserCustomNotAchieved()
            return 
        }
        // 自定义暂不可获取列表存在，修改成就状态
        userCustomNotAchievedList.list[achievementID] = {
            id: achievementID,
            status: status
        }
        userCustomNotAchievedList.lastUpdateTime = new Date().getTime()
        if(save) saveUserCustomNotAchieved()
        return 
    }
    
    getUserCustomNotAchieved()

    return {
        saveUserCustomNotAchieved,
        findUserCustomNotAchievedList,
        getUserCustomNotAchievedList,
        initUserCustomNotAchievedList,
        handleUserCustomNotAchievedList,
        resetUserCustomNotAchieved,
    }
})