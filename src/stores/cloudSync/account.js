import { ref } from 'vue'
import { defineStore, storeToRefs } from 'pinia'
import { useTokenStore } from '@/stores/cloudSync/token';
import { getAccountInfoService } from '@/services/cloudSync/account';

export const useAccountStore = defineStore('account', () => {
    const tokenStore = useTokenStore();
    const { isLogin } = storeToRefs(tokenStore);

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

    const setAccountByService = async () => {
        if (!isLogin.value) {
            return;
        }

        try {
            const res = await getAccountInfoService();
            if (res.code === 0) {
                setAccount(res.data);
                }
            else {
                ElMessage({
                    showClose: true,
                    message: res.message,
                    type: 'error',
                })
                setAccount({})
            }
        } catch (error) {
            ElMessage({
                showClose: true,
                message: error.message,
                type: 'error',
            })
            setAccount({})
        }
    }

    return {
        account,
        setAccount,
        removeAccount,
        setAccountByService
    }
});