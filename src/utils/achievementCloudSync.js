import { storeToRefs } from 'pinia'
import { useAccountStore } from '@/stores/cloudSync/account';
import { useSyncStatusStore } from '@/stores/cloudSync/syncStatus';
import { getAllUserDataDTO } from '@/utils/getAllAchievementData';
import { debounce } from '@/utils/throttleDebounce';
import { RequestType } from '@/types/syncStatusCode'
import { 
  creatrOrUpdateAchievementAcountService,
  updateAllAchievementDataService,
  deleteAchievementAcountService,
  updateAchievementsService,
  updateTextjoinsService,
  updateCustomNotAchievedService,
  updateCurrentAchievementAcountService
} from '@/services/cloudSync/achievement';

const accountStore = useAccountStore();
const { isLogin } = storeToRefs(accountStore);

const syncStatusStore = useSyncStatusStore();
const { startRequest, requestSuccess, requestFailed, startCurrentAccountRequest, requestCurrentAccountSuccess, requestCurrentAccountFailed } = syncStatusStore

export const uploadAccountToCloud = async (tokenId, dto) => {
  if (!isLogin.value) return;

  const type = RequestType.AccountInfo;

  const requestId = startRequest(true, tokenId, type);

  // 获取用户的成就数据
  return creatrOrUpdateAchievementAcountService(tokenId, dto).then(
    (res) => {
      if (res.code === 0) {
        requestSuccess(tokenId, type, requestId);        
      } else {
        ElMessage({
          showClose: true,
          message: res.message,
          type: 'error',
        })
        requestFailed(tokenId, type, requestId);
      }
      return res;
    },
  ).catch((error) => {
    ElMessage({
      showClose: true,
      message: error,
      type: 'error',
    })
    requestFailed(tokenId, type, requestId);
    throw error;
  });
}

export const deleteAccountForCloud = async (tokenId) => {
  if (!isLogin.value) return;

  const type = RequestType.AccountDelete;

  const requestId = startRequest(false, tokenId, type);

  // 获取用户的成就数据
  return deleteAchievementAcountService(tokenId).then(
    (res) => {
      if (res.code === 0) {
        requestSuccess(tokenId, type, requestId);        
      } else {
        ElMessage({
          showClose: true,
          message: res.message,
          type: 'error',
        })
        requestFailed(tokenId, type, requestId);
      }
      return res;
    },
  ).catch((error) => {
    ElMessage({
      showClose: true,
      message: error,
      type: 'error',
    })
    requestFailed(tokenId, type, requestId);
    throw error;
  });
}

export const uploadCurrentAccountToCloud = debounce(async (dto) => {
  if (!isLogin.value) return;

  const requestId = startCurrentAccountRequest();
  
  return updateCurrentAchievementAcountService(dto).then(
    (res) => {
      if (res.code === 0) {
        requestCurrentAccountSuccess(requestId);        
      } else {
        ElMessage({
          showClose: true,
          message: res.message,
          type: 'error',
        })
        requestCurrentAccountFailed(requestId);
      }
      return res;
    },
  ).catch((error) => {
    ElMessage({
      showClose: true,
      message: error,
      type: 'error',
    })
    requestCurrentAccountFailed(requestId);
    throw error;
  });
}, 500)

export const uploadeAchievementsToCloud = debounce(async (tokenId, dto) => {
  if (!isLogin.value) return;

  const type = RequestType.Achievements;

  const requestId = startRequest(true, tokenId, type);

  return updateAchievementsService(tokenId, dto).then(
    (res) => {
      if (res.code === 0) {
        requestSuccess(tokenId, type, requestId);        
      } else {
        ElMessage({
          showClose: true,
          message: res.message,
          type: 'error',
        })
        requestFailed(tokenId, type, requestId);
      }
      return res;
    },
  ).catch((error) => {
    ElMessage({
      showClose: true,
      message: error,
      type: 'error',
    })
    requestFailed(tokenId, type, requestId);
    throw error;
  });
}, 500)

export const uploadeTextjoinsToCloud = debounce(async (tokenId, dto) => {
  if (!isLogin.value) return;

  const type = RequestType.Textjoins;

  const requestId = startRequest(true, tokenId, type);

  return updateTextjoinsService(tokenId, dto).then(
    (res) => {
      if (res.code === 0) {
        requestSuccess(tokenId, type, requestId);        
      } else {
        ElMessage({
          showClose: true,
          message: res.message,
          type: 'error',
        })
        requestFailed(tokenId, type, requestId);
      }
      return res;
    },
  ).catch((error) => {
    ElMessage({
      showClose: true,
      message: error,
      type: 'error',
    })
    requestFailed(tokenId, type, requestId);
    throw error;
  });
}, 500)

export const uploadeCustomNotAchievedToCloud = debounce(async (tokenId, dto) => {
  if (!isLogin.value) return;

  const type = RequestType.CustomNotAchieved;

  const requestId = startRequest(true, tokenId, type);

  return updateCustomNotAchievedService(tokenId, dto).then(
    (res) => {
      if (res.code === 0) {
        requestSuccess(tokenId, type, requestId);        
      } else {
        ElMessage({
          showClose: true,
          message: res.message,
          type: 'error',
        })
        requestFailed(tokenId, type, requestId);
      }
      return res;
    },
  ).catch((error) => {
    ElMessage({
      showClose: true,
      message: error,
      type: 'error',
    })
    requestFailed(tokenId, type, requestId);
    throw error;
  });
}, 500)

// 更新所有成就账号数据至云端
export const uploadAllAcountDataToCloud = async () => {
  if (!isLogin.value) return;

  const dto = getAllUserDataDTO();

  return updateAllAchievementDataService(dto);
}
