import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useTokenStore = defineStore('token', () => {
    //定义状态的内容
    const token = ref('');

    //设置token
    const setToken =(newToken)=>{
        token.value = newToken;
    }

    //移除token
    const removeToken =()=>{
        token.value = '';
    }

    //判断是否用户登录
    const isLogin = computed(() => token.value !== '')

    return {
        token,
        setToken,
        removeToken,
        isLogin
    }
}, 
{
    persist: true
});