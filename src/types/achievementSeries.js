export class AchievementSeries {
    constructor(achievementSeries, achievements) {
        this.SeriesID = achievementSeries.SeriesID
        this.SeriesTitle = achievementSeries.SeriesTitle
        this.imagePath = achievementSeries.imagePath
        this.imageDarkPath = achievementSeries.imageDarkPath
        this.Priority = achievementSeries.Priority
        this.Achievements = achievements
    }
    //系列相关成就数
    get AchievementsLength(){
        const selectedMultipleIDs = []; // 记录已选择的多选一成就类型
        let totalAchievements = 0; // 记录总共可获得的成就数

        for (const achievement of this.Achievements) {
            if (achievement.isNotAvailable) continue

            const MultipleID = achievement?.MultipleID
            if(!MultipleID){
                totalAchievements++
                continue
            } 
            if (selectedMultipleIDs.includes(MultipleID)){
                continue
            }
            totalAchievements++
            selectedMultipleIDs.push(MultipleID)
        }
        return totalAchievements
    }
    //系列相关成就可获得星琼总数
    get StellarJadeTotal(){
        const selectedMultipleIDs = []; // 记录已选择的多选一成就类型
        let total = 0; // 记录总共可获得的成就数

        for (const achievement of this.Achievements) {
            if (achievement.isNotAvailable) continue

            const MultipleID = achievement?.MultipleID
            if(!MultipleID){
                total+= achievement.StellarJadeNum
                continue
            } 
            if (selectedMultipleIDs.includes(MultipleID)){
                continue
            }
            total+= achievement.StellarJadeNum
            selectedMultipleIDs.push(MultipleID)
        }
        return total
    }
    //系列相关成就已完成数
    get completedAchievementsLength(){
        let count = 0
        // console.log(this.Achievements)
        this.Achievements.forEach(achievement => {
            if (achievement.Status == 3) count++
        })
        return count
    }
    //系列相关成就已获得星琼总数
    get completedStellarJadeTotal(){
        let total = 0
        // console.log(this.Achievements)
        this.Achievements.forEach(achievement => {
            if (achievement.Status == 3) total += achievement.StellarJadeNum
        })
        return total
    }
    //系列成就完成进度
    get completedPercentage(){
        if (this.AchievementsLength === 0) return 0 + '%'
        return Math.min(Math.round(this.completedAchievementsLength / this.AchievementsLength * 100), 100) + '%'
    }

    get completedStellarJadePercentage(){
        if (this.StellarJadeTotal === 0) return 0
        return Math.min(Math.round(this.completedStellarJadeTotal / this.StellarJadeTotal * 100), 100)
    }

    get completedStellarJadePercentageString(){
        return this.completedStellarJadePercentage.toFixed(2) + "%"
    }
    //系列相关暂不可完成成就数
    get notAvailableAchievementsLength(){
        const selectedMultipleIDs = []; // 记录已选择的多选一成就类型
        let totalAchievements = 0; // 记录总共可获得的成就数

        for (const achievement of this.Achievements) {
            if (!achievement.isNotAvailable) continue

            const MultipleID = achievement?.MultipleID
            if(!MultipleID){
                totalAchievements++
                continue
            } 
            if (selectedMultipleIDs.includes(MultipleID)){
                continue
            }
            totalAchievements++
            selectedMultipleIDs.push(MultipleID)
        }
        return totalAchievements
    }

    updateAchievements(achievements) {
        this.Achievements = achievements
    }
}