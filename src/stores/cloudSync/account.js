import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useAccountStore = defineStore('account', () => {
    //定义状态的内容
    const account = ref({});

    //设置account
    const setAccount =(newAccount)=>{
        account.value = newAccount;
    }

    //移除account
    const removeAccount =()=>{
        account.value = {};
    }
    
    //判断是否用户登录
    const isLogin = computed(() => {
        const accountInfo = account.value;
        return accountInfo?.identifier && accountInfo?.type;
    });

    return {
        account,
        setAccount,
        removeAccount,
        isLogin
    }
});