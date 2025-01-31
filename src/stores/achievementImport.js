import { ref, watch } from 'vue'
import { defineStore, storeToRefs } from 'pinia'
import { useAchievementStore } from '@/stores/achievement';
import { useUserAchievementStore } from '@/stores/userAchievement'
import { useAchievementSettingStore } from '@/stores/achievementSetting'
import { useAchievementCustomNotAchievedStore } from '@/stores/achievementCustomNotAchieved'
import { useAchievementImportByCookieStore } from '@/stores/achievementImportByCookie'
import { getAchievements } from '@/services/cookieService';
import { CookieServerCode, RequesrResult } from '@/types/requesrResult'

export const useAchievementImportStore = defineStore('achievementImport', () => { 
    const achievementStore = useAchievementStore()
    const { achievements } = storeToRefs(achievementStore)
    const { handleAchevementStatus } = achievementStore

    const userAchievementStore = useUserAchievementStore()
    const { handleUserAchievementList, saveUserAchievement } = userAchievementStore

    const achievementCustomNotAchievedStore = useAchievementCustomNotAchievedStore()
    const { initUserCustomNotAchievedList } = achievementCustomNotAchievedStore

    const settingStore = useAchievementSettingStore()
    const { importByCookieSecondConfirmation } = storeToRefs(settingStore)

    const importByCookieStore = useAchievementImportByCookieStore()
    const { findUserImportByCookieConfig, initUserImportByCookieConfig } = importByCookieStore

    const isImporting = ref(false)

    const importAchievementsByIds = (importAchievementList) => {
        // 初始化所有成就状态为未完成
        achievements.value.forEach(achievement => {
            achievement.Status = 1
            achievement.CustomNotAchieved = false
            handleUserAchievementList(achievement.AchievementID, achievement.Status, false)
        })        
        initUserCustomNotAchievedList()
    
        // 修改已完成状态, 同一多选已成就后识别的覆盖先识别到的
        for(const id of importAchievementList){
            const ach_ = achievements.value.find(achievement => id === achievement.AchievementID)
    
            if (!ach_) continue
            ach_.Status = 1
            handleAchevementStatus(ach_, false)
        }
    
        saveUserAchievement()
    }

    const importAchievementsByCookie = async (cookie) => {
        isImporting.value = true;
    
        return getAchievements(cookie).then( async (data) => {
            if (data.code !== 0) {
                ElMessage({
                    showClose: true,
                    message: data.message,
                    type: 'error'
                })

                isImporting.value = false;
                return data;
            }
    
            const achievements = data.data;
            const achievementIds = achievements.filter(achievement => achievement.finished)
                                                .map(achievement => parseInt(achievement.id, 10));
    
            if (importByCookieSecondConfirmation.value) {
                try {
                    await ElMessageBox.confirm(
                        `识别到已完成成就 ${achievementIds.length} 个，确认导入?`,
                        '确认 cookie 导入',
                        {
                            confirmButtonText: '确认',
                            cancelButtonText: '取消',
                            showClose: false,
                        }
                    )
                    
                    importAchievementsByIds(achievementIds)
                } catch {
                    isImporting.value = false;
                    return new RequesrResult(-200, '用户取消导入');
                }
            }
            else {
                importAchievementsByIds(achievementIds)
            }
            
            isImporting.value = false;
            return new RequesrResult(CookieServerCode.SUCCESS, 'success', true);
        })
        .catch(error => {
            ElMessage({
                showClose: true,
                message: error.message,
                type: 'error',
            })

            isImporting.value = false;
            throw new RequesrResult(CookieServerCode.UNKNOWN_ERROR, error.message);
        });
    }
    
    const autoImportAchievementsByCookie = async () => {
        const cookieConfig = findUserImportByCookieConfig();
        const autoUpate = cookieConfig?.autoUpdateAchevements ?? false;
    
        if (!autoUpate) {
            return;
        }

        const cookie = cookieConfig?.cookie ?? '';

        return importAchievementsByCookie(cookie).then((result) => {
            if ([CookieServerCode.COOKIE_EXPIRED, CookieServerCode.COOKIE_ERROR].includes(result?.code)) {
                initUserImportByCookieConfig();
            }
        }).catch((error) => {
            
        });
    }

    return {
        isImporting,
        importAchievementsByIds,
        importAchievementsByCookie,
        autoImportAchievementsByCookie,
    }
})