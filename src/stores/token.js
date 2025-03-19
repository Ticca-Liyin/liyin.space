import { ref } from 'vue'
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

    return {
        token,
        setToken,
        removeToken
    }
}, 
{
    persist: true
});