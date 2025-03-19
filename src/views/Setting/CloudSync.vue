<template>
  <div>
    <el-form label-width="auto">
      <el-form-item label="邮箱">
        <el-input
          v-model="email"
          placeholder="请输入邮箱"
          clearable
        >
          <template #append>
            <el-button  @click="login">获取验证码</el-button>
          </template>
        </el-input>
      </el-form-item>
      <el-form-item label="验证码">
          <el-input v-model="verifyCode" placeholder="请输入验证码" clearable maxlength="6"/>
      </el-form-item>
    </el-form>
    <el-button @click="add">添加</el-button>
    <!-- 行为验证弹窗 -->
    <el-dialog
      v-model="showTacDialog" :show-close="false" :modal="false"
      width="auto" top="0" align-center class="tac-dialog"
      :close-on-click-modal="false" :close-on-press-escape="false" 
      @opened="loadingTAC"
    >
      <template #header></template>
      <div :id="tacBindId"></div>
    </el-dialog>
  </div>
</template>

<script setup>
import { TAC } from '@/assets/captcha/tac/js/tac.min.js';
import { ref } from 'vue';
import { useTokenStore } from '@/stores/token';
import { verifyEmailService } from '@/services/cloudSync/lumine';

const tokenStore = useTokenStore();
const { setToken } = tokenStore;

const email = ref('');
const verifyCode = ref('');

const showTacDialog = ref(false);
const tacBindId = "captcha-div";
const tacBindEl = "#" + tacBindId;
const reg = /^[\w]+@[\w]+((\.[\w]+)+)$/;

const login = () => {
  // 判断邮箱是否非空
  if (!email.value) {
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

  // 显示验证码弹窗
  hideLoading(tacBindEl); 

  showTacDialog.value = true;
}

const add = () => {
   // 判断邮箱是否非空
  if (!email.value) {
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
  // 判断验证码是否非空
  if (!verifyCode.value) {
    ElMessage({
      showClose: true,
      message: '请输入验证码',
      type: 'error',
    })
    return
  }
  // 判断验证码是否为6位
  if (verifyCode.value.length !== 6) {
    ElMessage({
      showClose: true,
      message: '请输入6位验证码',
      type: 'error',
    })
    return
  }
  
  // TODO: 完成云同步登录操作
  verifyEmailService(email.value, verifyCode.value).then((res) => {
    if (res.code === 0) {
      ElMessage({
        showClose: true,
        message: '登录成功',
        type: 'success',
      })
      setToken(res.data)
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
        message: error.message,
        type: 'error',
    })
  });
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
    
    showTacDialog.value = false
  },
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
            message: res.message,
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
</script>

<style>
.tac-dialog.el-dialog {
  padding: 0;
}
.tac-dialog .el-dialog__header {
  padding: 0;
}

/* 行为验证样式配置 */
#tianai-captcha-parent {
  box-shadow: none;
}
#tianai-captcha-parent #tianai-captcha-bg-img {
  background-color: var(--el-bg-color);
}
#tianai-captcha-parent #tianai-captcha-box .loading .nb-spinner {
  border-top: 4px solid var(--el-color-primary);
}
#tianai-captcha.tianai-captcha-slider .slider-tip {
  color: var(--el-text-color-primary);
}
#tianai-captcha.tianai-captcha-slider .slider-move {
  filter: opacity(1);
}
#tianai-captcha.tianai-captcha-slider .slider-move .slider-move-btn {
  border:1px solid rgba(206, 206, 206, 0.74)
}
</style>