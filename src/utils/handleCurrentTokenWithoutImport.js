import { storeToRefs } from 'pinia';
import { useUserInfoStore } from '@/stores/userInfo'
import { useAchievementImportStore } from '@/stores/achievement/import/achievementImport'

const userInfoStore = useUserInfoStore()
const { handleCurrentTokenID } = userInfoStore

const achievementImport = useAchievementImportStore()
const { isImporting } = storeToRefs(achievementImport)

export const handleCurrentTokenWithoutImport = (tookenId) => {
    if (isImporting.value){
        ElMessage({
            showClose: true,
            message: "正在导入成就数据中，请稍后...",
            type: 'error',
        })
        return
    }

    handleCurrentTokenID(tookenId)
}