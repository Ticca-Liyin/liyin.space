import { storeToRefs } from 'pinia'
import { useAccountStore } from '@/stores/cloudSync/account';
import { useSyncStatusStore } from '@/stores/cloudSync/syncStatus';
import { useUserInfoStore } from '@/stores/userInfo';
import { useAchievementStore } from '@/stores/achievement/achievement';
import { useUserAchievementStore } from '@/stores/achievement/userAchievement'
import { useAchievementCustomNotAchievedStore } from '@/stores/achievement/achievementCustomNotAchieved'
import { useTextjoinStore } from '@/stores/achievement/setting/textjoin.js'
import { getAllUserData } from '@/utils/getAllAchievementData';
import { getAllAchievementDataService } from '@/services/cloudSync/achievement';
import { uploadCurrentAccountToCloud, uploadAllAcountDataToCloud } from '@/utils/achievementCloudSync';
import { showSelectSyncDataDialog } from '@/views/CloudSync/selectSyncData/index.js'

const accountStore = useAccountStore();

const syncStatusStore = useSyncStatusStore();
const { resetStatus, setAllTokenIdsStatusFailed } = syncStatusStore

// 判断本地数据与云端数据的差异
export const differenceOfLocalAndCloud = (localData, cloudData) => {
    const sections = ['user', 'achievements', 'customNotAchieved', 'textjoinSettings'];
    
    // 获取所有账号ID
    const allTokenIDs = new Set([
      ...Object.keys(localData || {}),
      ...Object.keys(cloudData || {})
    ].filter(key => key !== 'currentTokenID'));
  
    // 遍历所有账号
    for (const tokenId of allTokenIDs) {
      const local = localData?.[tokenId];
      const cloud = cloudData?.[tokenId];
  
      // 跳过无效数据
      if (!local && !cloud) continue;
  
      // 单边有数据，说明不同步
      if ((local && !cloud) || (!local && cloud)) {
        return false;
      }
  
      // 检查每个模块的时间戳
      for (const section of sections) {
        const localTime = local?.[section]?.lastUpdateTime;
        const cloudTime = cloud?.[section]?.lastUpdateTime;
  
        // 跳过都没有时间戳的情况
        if (!localTime && !cloudTime) continue;
  
        // 时间戳不一致，说明不同步
        if (localTime !== cloudTime) {
          return false;
        }
      }
    }
  
    // 检查 currentTokenID
    if (localData?.currentTokenID || cloudData?.currentTokenID) {
      const localTime = localData?.currentTokenID?.lastUpdateTime;
      const cloudTime = cloudData?.currentTokenID?.lastUpdateTime;
  
      if (localTime !== cloudTime) {
        return false;
      }
    }
  
    // 所有检查通过，数据同步
    return true;
};
  
// 辅助方法：将所有本地数据更新至云端并完成状态管理
const updateLocalAcountDataToCloud = async (localData) => {
    const localTokenIds = Object.keys(localData || {}).filter(key => key !== 'currentTokenID');
    
    return uploadAllAcountDataToCloud().then((res)=> {
      if (res.code === 0) {
        ElMessage({
          showClose: true,
          message: '数据成功同步至云端',
          type: 'success',
        });
        resetStatus();
      } else {
        ElMessage({
          showClose: true,
          message: '同步异常',
          type: 'error',
        });
        setAllTokenIdsStatusFailed(localTokenIds);
      }
    })
    .catch((error) => {
      ElMessage({
        showClose: true,
        message: error,
        type: 'error',
      });
      setAllTokenIdsStatusFailed(localTokenIds);
    })
}
// 辅助方法：将所有云端数据更新至本地并完成状态管理
const updateCloudAcountDataToLocal = (cloudData) => {
    const userInfoStore = useUserInfoStore();
    const { userInfoList } = storeToRefs(userInfoStore);

    const userInfoData = {
      list: {},
      currentTokenID: cloudData.currentTokenID?.tokenID ?? Object.keys(userInfoList.value.list)[0],
      currentTokenIDLastUpdateTime: cloudData.currentTokenID?.lastUpdateTime ?? new Date().getTime()
    };
  
    const userAchievementData = {} 
    const userCustomNotAchievedData = {}
    const userTextjoinData = {}
  
    Object.keys(cloudData).forEach(key => {
      if (key === "currentTokenID") return; // 跳过非用户条目
      
      const userEntry = cloudData[key];
      const tokenID = userEntry.user.data.tokenID;
      
      const users = userEntry.user
      
      userInfoData.list[key] = {
        tokenID: tokenID,
        uid: users.data.uid,
        name: users.data.name,
        avatar: users.data.avatar,
        lastUpdateTime: users.lastUpdateTime
      };
  
      const achs = userEntry.achievements
      userAchievementData[key] = {
        tokenID: tokenID,
        list: achs.data,
        lastUpdateTime: achs.lastUpdateTime
      }
  
      const cnas = userEntry.customNotAchieved
      userCustomNotAchievedData[key] = {
        tokenID: tokenID,
        list: cnas.data,
        lastUpdateTime: cnas.lastUpdateTime
      }
  
      const tjs = userEntry.textjoinSettings
      userTextjoinData[key] = {
        data: tjs.data,
        lastUpdateTime: tjs.lastUpdateTime
      } 
    });

    const { resetUserInfo } = userInfoStore;
    resetUserInfo(userInfoData);
    if (cloudData.currentTokenID === null) {
      uploadCurrentAccountToCloud({ 
        tokenId: userInfoData.currentTokenID, 
        updateTime: userInfoData.currentTokenIDLastUpdateTime
      })
    }
  
    const userAchievementStore = useUserAchievementStore();
    const { resetUserAchievement } = userAchievementStore;
    resetUserAchievement(userAchievementData);
    
    const achievementCustomNotAchievedStore = useAchievementCustomNotAchievedStore();
    const { resetUserCustomNotAchieved } = achievementCustomNotAchievedStore;
    resetUserCustomNotAchieved(userCustomNotAchievedData);
  
    const textjoinStore = useTextjoinStore();
    const { resetUserTextjoin } = textjoinStore;
    resetUserTextjoin(userTextjoinData);
  
    const achievementStore = useAchievementStore();
    const { resetAchievementsInfo } = achievementStore;
    resetAchievementsInfo();
}
// 账号登录时数据一致性同步
export const handleDataSync = async () => {
    if (!accountStore.isLogin) {
      return;
    }

    const localData = getAllUserData();
    
    const cloudDTO = await getAllAchievementDataService();
    const cloudData = cloudDTO.data;
    
    if (!cloudData) {
      updateLocalAcountDataToCloud(localData);
      return;
    }
  
    if (!differenceOfLocalAndCloud(localData, cloudData)) {
      showSelectSyncDataDialog({
        localData,
        cloudData
      }).then(selected => {
        if (selected === 'local') {
          updateLocalAcountDataToCloud(localData);
        } else {
          updateCloudAcountDataToLocal(cloudData);
        }
      })     
      return;   
    }
}