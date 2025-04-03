<template>
  <div class="setting-title">云同步管理：</div>
  <div class="setting-account-view">
    <div class="setting-account-info">
      <div class="setting-account-left">
        <div class="setting-account-avatar">
          <img src='@/images/icon/characterIcon.png' alt="头像">
        </div>
        <div class="setting-account-content">
          <div class="setting-account-name"> {{ isLogin ? (account.identifier ?? "未知") : "未登录" }} </div>
          <div class="setting-account-type"> {{ isLogin ? (account.type ?? "uknow") : "请先登录" }}</div>
        </div>
      </div>
      <div class="setting-account-right">
        <el-button v-if="!isLogin" type="primary" plain style="padding: 8px 10px;" @click="gotoLoginDialog"> 
          <el-icon style="padding-right: 10px;"><Login /></el-icon>云端登录
        </el-button>
        <template v-else>
          <el-button type="primary" plain :icon="UploadFilled" @click.stop="manualSync" :loading="manualSyncing"/>
          <el-button type="danger" plain :icon="Logout" @click.stop="logout"/>          
        </template>
      </div>
    </div>
  </div>
  <el-dialog
    v-model="showLoginDialog"
    title="云端登录"
    align-center
    class="login-dialog"
  >
    <el-form label-width="auto">
      <el-form-item label="邮箱">
        <el-input
          v-model="email"
          placeholder="请输入邮箱"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item label="验证码">
          <el-input v-model="verifyCode" placeholder="请输入验证码" clearable maxlength="6">
            <template #append>
              <el-button plain @click="getVerifyCode" :disabled="!email.trim() || countdown > 0" style="width: 100px;">{{ countdown > 0 ? `${countdown}秒后重试` : '获取验证码' }}</el-button>
            </template>
          </el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button type="primary" plain @click="login" :loading="logining">登录</el-button>
    </template>
    <!-- 行为验证弹窗 -->
    <el-dialog
      v-model="showTacDialog" :show-close="false" :modal="false"
      width="auto" top="0" align-center class="tac-dialog"
      :close-on-click-modal="false" :close-on-press-escape="false" 
      @opened="loadingTAC" append-to-body
    >
      <template #header></template>
      <div :id="tacBindId"></div>
    </el-dialog>
  </el-dialog>
</template>

<script setup>
import { TAC } from '@/assets/captcha/tac/js/tac.min.js';
import UploadFilled from '@/components/icon/UploadFilled.vue';
import Login from '@/components/icon/Login.vue';
import Logout from '@/components/icon/Logout.vue';
import { ref, onBeforeUnmount } from 'vue';
import { storeToRefs } from 'pinia'
import { useTokenStore } from '@/stores/cloudSync/token';
import { useAccountStore } from '@/stores/cloudSync/account';
import { useSyncStatusStore } from '@/stores/cloudSync/syncStatus';
import { verifyEmailService } from '@/services/cloudSync/lumine';
import { setAccountByService } from '@/utils/setAccountByService';
import { throttleDebounce } from '@/utils/throttleDebounce';
import { uploadAllAcountDataToCloud } from '@/utils/achievementCloudSync';
import { handleDataSync } from '@/utils/handleDataSync';
import { SyncStatusCode } from '@/types/syncStatusCode'


const tokenStore = useTokenStore();
const { setToken, removeToken } = tokenStore;

const accountStore = useAccountStore();
const { account, isLogin } = storeToRefs(accountStore);
const { removeAccount } = accountStore;

const syncStatusStore = useSyncStatusStore();
const { syncStatus } = storeToRefs(syncStatusStore);
const { resetStatus } = syncStatusStore;

const showLoginDialog = ref(false);
const email = ref('');
const verifyCode = ref('');
const countdown = ref(0);
let timer = null;
const logining = ref(false);

const showTacDialog = ref(false);
const tacBindId = "captcha-div";
const tacBindEl = "#" + tacBindId;
const reg = /^[\w]+@[\w]+((\.[\w]+)+)$/;

// 已登录状态下，进行登录操作时的错误提示
const hadLoginError = () => {
  if (isLogin.value) {
    ElMessage({
      showClose: true,
      message: '云端账号已登录，请先退出',
      type: 'error',
    })
    return true
  }
  return false
}

const gotoLoginDialog = () => {
  if(hadLoginError()) return

  email.value = '';
  verifyCode.value = '';
  showLoginDialog.value = true
}

const getVerifyCode = () => {
  if(hadLoginError()) return

  if(countdown.value > 0) return

  // 判断邮箱是否非空
  if (!email.value.trim()) {
    ElMessage({
      showClose: true,
      message: '请输入邮箱',
      type: 'error',
    })
    return
  }
  // 判断邮箱格式是否正确
  if (!reg.test(email.value)) {
    ElMessage({
      showClose: true,
      message: '请输入正确的邮箱',
      type: 'error',
    })
    return
  }

  // 清除上一次验证码区域内容，防止内容重复显示
  hideLoading(tacBindEl); 
  // 显示验证码弹窗
  showTacDialog.value = true;
}

const captchaConfig = {
  // 请求验证码接口
  requestCaptchaDataUrl: "/cloudsync/lumine/genCaptcha",
  // 验证验证码接口
  validCaptchaUrl: "/cloudsync/lumine/sendCode",
  // 绑定的div
  bindEl: tacBindEl,
  // 验证成功回调函数
  validSuccess: (res, c, t) => {
    // 销毁验证码
    t.destroyWindow();
    
    // 开始倒计时
    countdown.value = 60;
    timer = setInterval(() => {
      countdown.value--;
      if (countdown.value <= 0) {
        clearInterval(timer);
        timer = null;
      }
    }, 1000);

    showTacDialog.value = false
  },
  btnRefreshFun: throttleDebounce((el, tac) => {
    tac.reloadCaptcha();
  }, 2000, 800, () => {
    ElMessage({
      showClose: true,
      message: '操作频繁，请稍后再试！',
      type: 'error',
    })
  }, 2500),
  btnCloseFun: (el, tac) => {
    tac.destroyWindow();
    showTacDialog.value = false
  }
}

const captchaStyle = {
  logoUrl: null,
  moveTrackMaskBgColor: "var(--liyin-captcha-slider-track-bg-color)",
  moveTrackMaskBorderColor: "var(--liyin-captcha-slider-track-border-color)",
}

const hideLoading = (e) => {
    let t = document.querySelector(e);
    t && (t.innerHTML = "");
}

const loadingTAC = () => {
  const tac = new TAC(captchaConfig, captchaStyle);
  tac.config.addRequestChain({
    preRequest(type, param, c, tac) {
      if (["requestCaptchaData", "validCaptcha"].includes(type) && param.data) {
        param.data.email = email.value;
      }
      return true;
    },
    postRequest(type, param, res, c, tac) {
      if (["requestCaptchaData", "validCaptcha"].includes(type)) {
        if (res.code !== 0 && res.code !== 60001) {
          ElMessage({
            showClose: true,
            message: res.message ?? "网络异常",
            type: 'error',
          })
          setTimeout(() => {
            showTacDialog.value = false;            
          }, 300);
          if (type === "requestCaptchaData") {
            throw new Error("验证码获取失败:" + res.message);
          } else {
            throw new Error("验证码验证失败:" + res.message);
          }
        }
        else {
          Object.assign(res, res.data);
        }
      }
      return true;
    }
  })
  tac.init()    
}

onBeforeUnmount(() => {
  if (timer) {
    clearInterval(timer);
    timer = null;
  }
});

const login = () => {
  if(hadLoginError()) return

  let errorMsg = '';
  if (!email.value.trim()) errorMsg = '请输入邮箱';
  else if (!reg.test(email.value)) errorMsg = '请输入正确的邮箱';
  else if (!verifyCode.value.trim()) errorMsg = '请输入验证码';
  else if (verifyCode.value.length !== 6) errorMsg = '请输入6位验证码';

  if (errorMsg) {
    ElMessage({
      showClose: true,
      message: errorMsg,
      type: 'error'
    });
    return;
  }
  
  logining.value = true;

  verifyEmailService(email.value, verifyCode.value).then(async (res) => {
    if (res.code === 0) {
      ElMessage({
        showClose: true,
        message: '登录成功',
        type: 'success',
      })
      
      showLoginDialog.value = false;

      setToken(res.data);
      await setAccountByService();

      await handleDataSync();
    } else {
      ElMessage({
        showClose: true,
        message: res.message,
        type: 'error',
      })
    }
  })
  .catch(error => {
    ElMessage({
        showClose: true,
        message: error,
        type: 'error',
    })
  })
  .finally(() => {
    logining.value = false;
  })
}

// 已退出状态下，进行退出操作时的错误提示
const hadLogoutError = () => {
  if (!isLogin.value) {
    ElMessage({
      showClose: true,
      message: '请先登录云端账号',
      type: 'error',
    })
    return true
  }
  return false
}

const logout = async () => {
  if (hadLogoutError()) return;

  if (syncStatus.value !== SyncStatusCode.SUCCESS) {
    try {
      const res = await ElMessageBox.confirm(
          `部分本地数据未成功同步至云端，退出将导致云端数据与本地数据不一致！！！确认退出？`, 
          '提示', 
          {
              confirmButtonText: '确认',
              cancelButtonText: '取消',
          }
      )
    } catch (error) {
      return;      
    }
  }

  removeToken();
  removeAccount();
  resetStatus();
}

const manualSyncing = ref(false)
const manualSync = async () => {
  if (hadLogoutError()) return;

  try {
    const res = await ElMessageBox.confirm(
      `确认强制同步本地数据至云端？<br/><i style="color: var(--el-color-danger); ">这将强制覆盖云端数据且不可撤回！！！</i>`, 
      '警告', 
      {
        dangerouslyUseHTMLString: true,
        confirmButtonText: '确认',
        cancelButtonText: '取消',
      }
    )
  } catch (error) {
    return;      
  }

  manualSyncing.value = true;
  uploadAllAcountDataToCloud().then((res)=> {
    if (res.code === 0) {
      ElMessage({
        showClose: true,
        message: '同步成功',
        type: 'success',
      })
      resetStatus();
    } else {
      ElMessage({
        showClose: true,
        message: '同步异常',
        type: 'error',
      })
    }
  })
  .catch((error) => {
    ElMessage({
      showClose: true,
      message: error,
      type: 'error',
    })
  })
  .finally(() => {
    manualSyncing.value = false;
  })
}
</script>

<style scoped>
.setting-title {
    color: var(--liyin-text-color);
    font-size: 16px;
    margin: 10px 0;
}
.setting-account-view{
    border: 1px solid var(--liyin-main-border-color);
    border-radius: 5px;
}
.setting-account-info{
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 60px;
    padding: 0 15px;
    user-select: none;
}
.setting-account-left{
    display: flex;
    align-items: center;
    height: 100%;
    overflow: hidden;
}
.setting-account-right{
    display: flex;
    align-items: center;
    height: 100%;
}
.setting-account-avatar{
    width: 40px;
    height: 40px;
    min-width: 40px;
    border-radius: 50%;
    overflow: hidden;
    margin-right: 10px;
    border: 2px solid var(--liyin-char-avatar-border-color);
    background-color: var(--liyin-char-avatar-bg-color);
}
.setting-account-avatar img{
    width: 100%;
    height: 100%;
}
.setting-account-content{
    margin-right: 10px;
    overflow: hidden; 
    white-space: nowrap;
    text-overflow: ellipsis;
}
.setting-account-name{
    font-size: 15px;
    color: var(--liyin-text-main-color);
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
}
.setting-account-type{
    color: var(--liyin-text-color);
    font-size: 12px;
}
</style>
<style>
.login-dialog {
    width: 40%;
}
.login-dialog .el-dialog__footer{
    padding-top: 0;
}

@media (max-width: 768px){
  .login-dialog{
    width: 80%;
  }
}

.tac-dialog.el-dialog {
  padding: 0;
}
.tac-dialog .el-dialog__header {
  padding: 0;
}

/* 行为验证样式配置 */
#captcha-div #tianai-captcha-parent {
  box-shadow: none;
}
#captcha-div #tianai-captcha-parent #tianai-captcha-bg-img {
  background-color: var(--el-bg-color);
}
#captcha-div #tianai-captcha-parent #tianai-captcha-box .loading .nb-spinner {
  border-top: 4px solid var(--el-color-primary);
}
#captcha-div #tianai-captcha.tianai-captcha-slider .slider-tip {
  color: var(--el-text-color-primary);
}
#captcha-div #tianai-captcha.tianai-captcha-slider .slider-move {
  filter: opacity(1);
}
#captcha-div #tianai-captcha.tianai-captcha-slider .slider-move .slider-move-btn {
  border:1px solid rgba(206, 206, 206, 0.74)
}
</style>