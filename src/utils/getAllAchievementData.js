import { useUserInfoStore } from '@/stores/userInfo'
import { useUserAchievementStore } from '@/stores/achievement/userAchievement'
import { useAchievementCustomNotAchievedStore } from '@/stores/achievement/achievementCustomNotAchieved'
import { useTextjoinStore } from '@/stores/achievement/setting/textjoin'

/**
 * 合并来自不同store的所有用户相关数据
 * @returns {Object} 包含合并后的用户数据和当前用户信息的对象
 */
export function getAllUserData() {
    const userInfoStore = useUserInfoStore()
    const userAchievementStore = useUserAchievementStore() 
    const achievementCustomNotAchievedStore = useAchievementCustomNotAchievedStore()
    const textjoinStore = useTextjoinStore()

    const mergedData = {
        currentTokenID: {
            tokenID: userInfoStore.userInfoList.currentTokenID,
            lastUpdateTime: userInfoStore.userInfoList.currentTokenIDLastUpdateTime
        }
    }

    // 从userInfo store获取所有用户
    const { list: userList } = userInfoStore.userInfoList

    // 对每个用户
    Object.values(userList).forEach(user => {
        const tokenID = user.tokenID
        const userData = {...user}
        delete userData.lastUpdateTime

        // 获取用户的成就数据
        const achievements = userAchievementStore.getUserAchievementList(tokenID)
        const achievementData = achievements?.list || {}
        const achievementLastUpdateTime = achievements?.lastUpdateTime

        // 获取用户的自定义未达成成就
        const customNotAchieved = achievementCustomNotAchievedStore.getUserCustomNotAchievedList(tokenID)
        const customNotAchievedData = customNotAchieved?.list || {}
        const customNotAchievedLastUpdateTime = customNotAchieved?.lastUpdateTime

        // 获取用户的文本拼接设置
        const textjoinSettings = textjoinStore.getUserTextjoinList(tokenID)
        const textjoinLastUpdateTime = textjoinStore.getUserTextjoinLastUpdateTime(tokenID)

        // 合并该用户的所有数据
        mergedData[tokenID] = {
            user: {
                data: userData,
                lastUpdateTime: user.lastUpdateTime
            },
            achievements: {
                data: achievementData,
                lastUpdateTime: achievementLastUpdateTime
            },
            customNotAchieved: {
                data: customNotAchievedData,
                lastUpdateTime: customNotAchievedLastUpdateTime
            },
            textjoinSettings: {
                data: textjoinSettings,
                lastUpdateTime: textjoinLastUpdateTime
            },
            lastUpdateTime: Math.max(user.lastUpdateTime || 0, achievementLastUpdateTime || 0, customNotAchievedLastUpdateTime || 0, textjoinLastUpdateTime || 0)
        }
    })

    return mergedData
}

export function getAllUserDataDTO() {
    const userInfoStore = useUserInfoStore()
    const userAchievementStore = useUserAchievementStore() 
    const achievementCustomNotAchievedStore = useAchievementCustomNotAchievedStore()
    const textjoinStore = useTextjoinStore()

    const mergedData = {
        achievementAccounts: [],
        currentTokenID: {
            tokenId: userInfoStore.userInfoList.currentTokenID,
            lastUpdateTime: userInfoStore.userInfoList.currentTokenIDLastUpdateTime
        }
    }

    // 从userInfo store获取所有用户
    const { list: userList } = userInfoStore.userInfoList

    // 对每个用户
    Object.values(userList).forEach(user => {
        const tokenID = user.tokenID
        const userData = {...user}
        delete userData.lastUpdateTime

        // 获取用户的成就数据
        const achievements = userAchievementStore.getUserAchievementList(tokenID)
        const achievementData = achievements?.list || {}
        const achievementLastUpdateTime = achievements?.lastUpdateTime

        // 获取用户的自定义未达成成就
        const customNotAchieved = achievementCustomNotAchievedStore.getUserCustomNotAchievedList(tokenID)
        const customNotAchievedData = customNotAchieved?.list || {}
        const customNotAchievedLastUpdateTime = customNotAchieved?.lastUpdateTime

        // 获取用户的文本拼接设置
        const textjoinSettings = textjoinStore.getUserTextjoinList(tokenID)
        const textjoinLastUpdateTime = textjoinStore.getUserTextjoinLastUpdateTime(tokenID)
        
        const data = {
            user: {
                data: userData,
                lastUpdateTime: user.lastUpdateTime
            },            
        }
        
        if (achievementData && achievementLastUpdateTime) {
            data.achievements = {
                data: achievementData,
                lastUpdateTime: achievementLastUpdateTime
            }
        }
        
        if (customNotAchievedData && customNotAchievedLastUpdateTime) {
            data.customNotAchieved = {
                data: customNotAchievedData,
                lastUpdateTime: customNotAchievedLastUpdateTime
            }
        }
        
        if (textjoinSettings && textjoinLastUpdateTime) {
            data.textjoinSettings = {
                data: textjoinSettings,
                lastUpdateTime: textjoinLastUpdateTime
            }
        }

        // 合并该用户的所有数据
        mergedData.achievementAccounts.push(data)
    })

    return mergedData
}
