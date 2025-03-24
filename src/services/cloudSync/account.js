import cloudSyncService from "./index.js";

// 验证邮箱验证码
export const getAccountInfoService = async () => cloudSyncService.get('/account');