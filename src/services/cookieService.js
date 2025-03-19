import axios from 'axios';

if (!import.meta.env.VITE_COOKIE_SERVER_PATH) {
    console.error('未配置 cookie 服务器地址');
}

const url = import.meta.env.VITE_COOKIE_SERVER_PATH ?? 'https://localhost:20025';

// 创建 Axios 实例
const api = axios.create({
  baseURL: url,
  timeout: 10000,
});

// 响应拦截器
api.interceptors.response.use(
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
export const getAchievementsService = async (cookie) => api.get('/cookie/getAchievements', {
    headers: {
        'user-cookie': cookie,
    }
});
