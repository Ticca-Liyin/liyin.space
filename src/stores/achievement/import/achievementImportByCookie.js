import { ref, watch } from 'vue'
import { defineStore, storeToRefs } from 'pinia'
import { useUserInfoStore } from '@/stores/userInfo'

export const useAchievementImportByCookieStore = defineStore('achievementImportByCookie', () => { 
    const userInfoStore = useUserInfoStore();
    const { currentUserInfo } = storeToRefs(userInfoStore);

    //用户 cookie 导入配置
    let userImportByCookieConfig = {};

    const STORAGE_KEY = 'AchievementImportByCookieConfig';
    
    //获取 cookie 配置缓存
    const getAchievementImportByCookieConfig = () => {
        // 从缓存中读取名为 STORAGE_KEY 的数据
        const tempConfig = localStorage.getItem(STORAGE_KEY)

        // 检查是否存在名为 STORAGE_KEY 的数据
        if (tempConfig !== null) {
            // 数据存在，将其从字符串转换为对象
            try {
                const data = JSON.parse(tempConfig)
                if (typeof data === 'object' && !Array.isArray(data)) {
                    userImportByCookieConfig = data
                }
                else {
                    userImportByCookieConfig = {}
                }
            }
            catch {
                userImportByCookieConfig = {}
            }
        } else {
            // 数据不存在，执行相应的操作
            userImportByCookieConfig = {}
        }
    }
    //保存角色界面设置缓存
    const saveAchievementImportByCookieConfig = () => {
        // 将对象转换为字符串，并将其存储在缓存中
        localStorage.setItem(STORAGE_KEY, JSON.stringify(userImportByCookieConfig))
    }
    const findUserImportByCookieConfig = () => {
        // 查找自定义暂不可获取列表
        return userImportByCookieConfig[currentUserInfo?.value.tokenID]
    }
    const initUserImportByCookieConfig = () => {
        // 初始化自定义暂不可获取列表
        userImportByCookieConfig[currentUserInfo?.value.tokenID] = {
            tokenID: currentUserInfo.value.tokenID,
            cookie: '',
            autoUpdateAchevements: false
        }

        saveAchievementImportByCookieConfig()
    }

    const handleUserImportByCookieConfig = (cookie, autoUpdate) => {
        if(typeof cookie !== 'string') throw new Error("参数cookie必须为字符串类型")
        if(typeof autoUpdate !== 'boolean') throw new Error("参数status不能为非 true 或 false 的值")
        
        userImportByCookieConfig[currentUserInfo.value.tokenID] = {
            tokenID: currentUserInfo.value.tokenID,
            cookie: cookie,
            autoUpdateAchevements: autoUpdate
        }
        
        saveAchievementImportByCookieConfig()
    }  

    getAchievementImportByCookieConfig();

    return {
        findUserImportByCookieConfig,
        initUserImportByCookieConfig,
        handleUserImportByCookieConfig
    }
})