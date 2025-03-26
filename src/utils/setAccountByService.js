import { storeToRefs } from 'pinia'
import { useTokenStore } from '@/stores/cloudSync/token';
import { useAccountStore } from '@/stores/cloudSync/account';
import { getAccountInfoService } from '@/services/cloudSync/account';

const tokenStore = useTokenStore();
const { token } = storeToRefs(tokenStore);
const { removeToken } = tokenStore;

const accountStore = useAccountStore();
const { setAccount, removeAccount } = accountStore;

export const setAccountByService = async () => {
    if (!token.value?.trim()) {
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
            removeAccount();
            removeToken();
        }
    } catch (error) {
        ElMessage({
            showClose: true,
            message: error,
            type: 'error',
        })
        removeAccount();
        removeToken();
    }
}