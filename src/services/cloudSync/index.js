import axios from 'axios';
import { useTokenStore } from '@/stores/cloudSync/token';
import { useAccountStore } from '@/stores/cloudSync/account';
import { useSyncStatusStore } from '@/stores/cloudSync/syncStatus';

const tokenStore = useTokenStore();
const accountStore = useAccountStore();
const syncStatusStore = useSyncStatusStore();
const url = '/cloudsync';

// 创建 Axios 实例
const cloudSyncService = axios.create({
    baseURL: url,
    timeout: 60000,
});

// 请求拦截器
cloudSyncService.interceptors.request.use(
    config => {
        if (tokenStore.token) {
            config.headers.Authorization = tokenStore.token;
        }
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);

// 响应拦截器
cloudSyncService.interceptors.response.use(
    response => {
        if (response.status === 200) {
            // 如果返回的状态码是 10002 或 10202，说明登录失效，需要重新登录
            if (response.data.code === 10002 || response.data.code === 10202) {
                accountStore.removeAccount();
                syncStatusStore.resetStatus();
                tokenStore.removeToken();
                return Promise.reject("登录失效，请重新登录");
            }
            return response.data;
        } else if (response.status === 401) { // 401 为 JWT Token 失效
            accountStore.removeAccount();
            syncStatusStore.resetStatus();
            tokenStore.removeToken();
            return Promise.reject("登录失效，请重新登录");
        } else {
            return Promise.reject(`请求失败，状态码: ${response.status}`);
        }
    },
    error => {
        if (error.response && error.response.status === 500) {
            return Promise.reject('服务器请求异常，请稍后再试');
        }
        if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
            return Promise.reject('网络请求超时');
        }
        return Promise.reject(error);
    }
);

// 导出通用的请求方法
export default cloudSyncService;
