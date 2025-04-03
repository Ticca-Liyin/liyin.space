import cloudSyncService from "./index.js";
import { compressedByPako } from "@/utils/compressedByPako.js";


// #region 成就账号相关请求
export const creatrOrUpdateAchievementAcountService = async (tokenId, dto) => cloudSyncService.post(`/achievement/${tokenId}/account`, dto);

export const deleteAchievementAcountService = async (tokenId) => cloudSyncService.delete(`/achievement/${tokenId}/account`);
// #endregion

// #region 成就相关请求
export const getAllAchievementDataService = async () => cloudSyncService.get(`/achievement`);

export const updateAllAchievementDataService = async (dto) => cloudSyncService.post(`/achievement`, compressedByPako(dto), {
    headers: {
        'Content-Encoding': 'gzip',
        'Content-Type': 'application/json'
    }
});

export const updateAchievementsService = async (tokenId, dto) => cloudSyncService.post(`/achievement/${tokenId}/achievements`, compressedByPako(dto), {
    headers: {
        'Content-Encoding': 'gzip',
        'Content-Type': 'application/json'
    }
});

export const updateTextjoinsService = async (tokenId, dto) => cloudSyncService.post(`/achievement/${tokenId}/textjoins`, compressedByPako(dto), {
    headers: {
        'Content-Encoding': 'gzip',
        'Content-Type': 'application/json'
    }
});

export const updateCustomNotAchievedService = async (tokenId, dto) => cloudSyncService.post(`/achievement/${tokenId}/customNotAchieved`, compressedByPako(dto), {
    headers: {
        'Content-Encoding': 'gzip',
        'Content-Type': 'application/json'
    }
});

export const updateCurrentAchievementAcountService = async (dto) => cloudSyncService.post(`/achievement/currentAccount`, compressedByPako(dto), {
    headers: {
        'Content-Encoding': 'gzip',
        'Content-Type': 'application/json'
    }
});
// #endregion