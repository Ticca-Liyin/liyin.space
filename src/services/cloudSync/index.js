import axios from 'axios';
import { useTokenStore } from '@/stores/cloudSync/token';

const tokenStore = useTokenStore();
const url = '/cloudsync';

// 创建 Axios 实例
const cloudSyncService = axios.create({
    baseURL: url,
    timeout: 10000,
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
            return response.data;
        } else {
            return Promise.reject(`请求失败，状态码: ${response.status}`);
        }
    },
    error => {
        return Promise.reject(error);
    }
);

// 导出通用的请求方法
export default cloudSyncService;
