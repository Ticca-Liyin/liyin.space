import { defineStore, storeToRefs } from 'pinia'
import { useUserInfoStore } from '@/stores/userInfo'
import { uploadeAchievementsToCloud } from '@/utils/achievementCloudSync';

export const useUserAchievementStore = defineStore('userAchievement', () => {
    const userInfoStore = useUserInfoStore()
    const { currentUserInfo } = storeToRefs(userInfoStore)

    //用户成就状态列表
    let userAchievement = {}
    //获取缓存
    const getUserAchievement = () => {
        // 从缓存中读取名为 "userAchievement" 的数据
        const tempUserAchievement = localStorage.getItem("userAchievement")

        // 检查是否存在名为 "userAchievement" 的数据
        if (tempUserAchievement !== null) {
            // 数据存在，将其从字符串转换为对象
            userAchievement = JSON.parse(tempUserAchievement)

            // #region lastUpdateTime 属性缺失补充
            if (userAchievement !== null && typeof userAchievement === "object" && !Array.isArray(userAchievement)) {
                let valid = true
                for(const tokenID in userAchievement){
                    // 判断 lastUpdateTime 是否存在且是否为数字
                    if(userAchievement[tokenID].lastUpdateTime === undefined || typeof userAchievement[tokenID].lastUpdateTime !== "number"){
                        // 数据不合法，重置为默认值
                        userAchievement[tokenID].lastUpdateTime = new Date().getTime()
                        valid = false
                    }
                }
                if (!valid) saveUserAchievement()
            }
            // #endregion
        } else {
            // 数据不存在，执行相应的操作
            userAchievement = {}
        }
    }
    //保存缓存
    const saveUserAchievement = () => {
        // 将对象转换为字符串，并将其存储在缓存中
        localStorage.setItem("userAchievement", JSON.stringify(userAchievement))
        saveUserAchievementsToCloud()
    }

    const resetUserAchievement = (newUserAchievement) => {
        localStorage.setItem("userAchievement", JSON.stringify(newUserAchievement));
        getUserAchievement();
    }

    const saveUserAchievementsToCloud = () => {
        const currentTokenId = currentUserInfo?.value.tokenID
        const achievementList = userAchievement[currentTokenId]
        uploadeAchievementsToCloud(currentTokenId, {
            data: achievementList.list,
            updateTime: achievementList.lastUpdateTime
        })
    }
    const findUserAchievementList = () => {
        // 查找用户成就列表
        return userAchievement[currentUserInfo?.value.tokenID]
    }
    const getUserAchievementList = (tokenID) => {
        const achievementList = userAchievement[tokenID]

        if(typeof achievementList !== "object" || Array.isArray(achievementList)) {
            return {}   
        }
        return JSON.parse(JSON.stringify(achievementList))
    }
    const handleUserAchievementList = (achievementID, status, save = true) => {
        if(!achievementID || !status) throw new Error("数据不能为空")
        if(status !== 1 && status !== 2 && status !== 3) throw new Error("参数status不能为非1、2或3的值")
        // 修改用户成就列表
        const userAchievementList = findUserAchievementList()

        if (!userAchievementList) {
            // 用户成就列表不存在，创建新的用户成就列表
            userAchievement[currentUserInfo.value.tokenID] = {
                tokenID: currentUserInfo.value.tokenID,
                list: {
                    [achievementID]: {
                        id: achievementID,
                        status: status
                    }
                },
                lastUpdateTime: new Date().getTime()
            }
            if(save) saveUserAchievement()
            return 
        }
        // 用户成就列表存在，修改成就状态
        userAchievementList.list[achievementID] = {
            id: achievementID,
            status: status
        }
        userAchievementList.lastUpdateTime = new Date().getTime()
        if(save) saveUserAchievement()
        return 
    }   

    getUserAchievement();

    return {
        saveUserAchievement,
        findUserAchievementList,
        getUserAchievementList,
        handleUserAchievementList,
        resetUserAchievement,
    }
})