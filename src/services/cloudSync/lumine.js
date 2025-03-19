import cloudSyncService from "./index.js";

// 验证邮箱验证码
export const verifyEmailService = async (email, code) => cloudSyncService.post('/lumine/verifyEmail', {
    email, code
});