import { storeToRefs } from 'pinia'
import { useUserInfoStore } from '@/stores/userInfo'
import { useTextjoinStore } from '@/stores/achievement/setting/textjoin'

const textjoinStore = useTextjoinStore();
const { getUserTextjoinValue } = textjoinStore;

const userInfoStore = useUserInfoStore()
const { currentUserInfo } = storeToRefs(userInfoStore);

export const pattern1 = /{NICKNAME}/g;
export const pattern2 = /{TEXTJOIN#(\d+)}/g;

export class Achievement {
    constructor(achievement) {
        this.AchievementID = achievement.AchievementID
        this.SeriesID = achievement.SeriesID
        this.AchievementSrcTitle = achievement.AchievementTitle
        this.AchievementSrcDesc = achievement.AchievementDesc
        this.ParamList = achievement.ParamList
        this.Priority = achievement.Priority
        this.Rarity = achievement.Rarity
        this.ShowType = achievement.ShowType
        this.Version = achievement.Version
        this.Status = 1
    }

    get isHidden(){
        return this.ShowType === "ShowAfterFinish"
    }

    get AchievementTitle(){
        let result = this.AchievementSrcTitle.replace(pattern1, currentUserInfo.value.name)
        
        return result
    }

    get AchievementDesc(){
        let result = this.AchievementSrcDesc.replace(pattern1, currentUserInfo.value.name)
        
        result = result.replace(pattern2, (match, id) => {
            const textjoinId = 'TEXTJOIN#' + id;
            return getUserTextjoinValue(currentUserInfo.value.tokenID.toString(), textjoinId) ?? match;
        })

        return result
    }

    get StellarJadeNum(){
        if (this.Rarity === "High") return 20
        if (this.Rarity === "Mid") return 10
        if (this.Rarity === "Low") return 5
        return 0
    }

    get isNotAvailable(){
        if(!this?.timestamp) return false

        const currentTimestamp = Date.now();

        return this.timestamp > currentTimestamp;
    }

    get StatusDesc(){
        if(this.CustomNotAchieved) return "自定义暂不可获得"
        if(this.isNotAvailable) return "暂不可获得"
        if(this.Status === 1) return "未完成"
        if(this.Status === 2) return "已选其他"
        if(this.Status === 3) return "已完成"
        return "未知状态"
    }
}