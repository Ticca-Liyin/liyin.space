<script setup>
import { useAchievementStore } from '@/stores/achievement';
import { storeToRefs } from 'pinia';
import formatTimestamp from './formatTimestamp';

const achievementStore = useAchievementStore()
const { dialogVisible, dialogAchievement, dialogMultipleChoiceList, showStrategyList} = storeToRefs(achievementStore);
// const isMobile = window.matchMedia('(max-width: 768px)').matches
</script>

<template>
    <el-dialog
        v-model="dialogVisible"
        align-center
        class="dialog-achievement"
        :show-close="false"
    >
        <template #header>
            <div class="dialog-header">
                <span class="dialog-header-title" :class="{'dialog-header-hiddenColor': dialogAchievement.ShowType === 'ShowAfterFinish'}">
                    {{ dialogAchievement.AchievementTitle }}
                </span>
                <sup class="dialog-header-version">
                    {{dialogAchievement.Version}}
                </sup>
            </div>
        </template>
        <div class="dialog-body">
            <div class="dialog-body-margin">
                <div class="dialog-body-introduce">
                    成就描述：
                </div>
                <div class="dialog-body-achievement" v-html="dialogAchievement.AchievementDesc"></div>
            </div>
            <div class="dialog-body-margin">
                <div class="dialog-body-introduce">
                    成就状态：
                </div>
                <div class="dialog-body-achievement"  
                    :class="{'orange': dialogAchievement.Status === 3}">
                    {{ dialogAchievement.StatusDesc }} 
                    <span v-if="dialogAchievement.isNotAvailable" style="margin-left: 20px;">
                        预计于 {{ formatTimestamp(dialogAchievement?.timestamp) }} 后可获得
                    </span>
                </div>
            </div>
            <div class="dialog-body-margin" v-if="dialogAchievement?.MultipleID">
                <div class="dialog-body-introduce">
                    相关多选一成就：
                </div>
                <div class="dialog-body-achievement" v-for="multipleChoice in dialogMultipleChoiceList" :key="multipleChoice.AchievementID">
                    <span class="dialog-header-hiddenColor">{{ multipleChoice.AchievementTitle }}</span>
                    ( 
                    <span :class="{'orange': multipleChoice.Status === 3}">{{ multipleChoice.StatusDesc }}</span>
                    )：
                    <div v-html="multipleChoice.AchievementDesc"></div>
                </div>
            </div>
            <div class="dialog-body-strategy">
                <div class="dialog-body-introduce">
                    成就攻略：
                </div>
                <div v-if="showStrategyList.length > 0">
                    <div v-for="strategy in showStrategyList" :key="strategy.title" class="dialog-body-stratery-concent PC">
                        <div>
                            <span style="color: #FF7A45;">【{{ strategy.author }}】</span><span>{{ strategy.title }}</span> ：
                        </div> 
                        <div>
                            <a :href="strategy.url" target="_blank" style="margin-left: 7px;"> {{ strategy.url }}</a>                            
                        </div>
                    </div>
                    <div v-for="strategy in showStrategyList" :key="strategy.title" class="dialog-body-stratery-concent Mobile">
                        <span style="color: #FF7A45;">【{{ strategy.author }}】</span>
                        <a :href="strategy.url" target="_blank"><span>{{ strategy.title }}</span> </a>
                    </div>
                </div>
                <div v-else class="dialog-body-stratery-concent">
                    <div>暂无相关攻略</div>
                </div>
            </div>
        </div>
        <template #footer>
            <div class="dialog-footer">
                <div>点击 绿字内容 跳转至对应攻略</div>
            </div>
        </template>
    </el-dialog>
</template>

<style>
.dialog-achievement{
    width:40%;
    max-height: 65%;
    overflow: hidden;
    overflow-y: auto;
}
.dialog-achievement .el-dialog__header{
    margin: 0;
}
.dialog-achievement .el-dialog__body{
    padding: 10px 20px 15px 20px;
}
.dialog-achievement .el-dialog__footer{
    padding: 0px 20px 15px 20px;
}
.dialog-header{
    /* display: flex; */
    font-weight: 700;
    font-size: 18px;
    line-height: 30px;
    /* height: 30px; */
    /* overflow: hidden; 
    text-overflow: ellipsis; 
    white-space: nowrap; */
}
.dialog-header-title{
    /* overflow: hidden; 
    text-overflow: ellipsis; 
    white-space: nowrap; */
}
.dialog-header-version{
    color: #00A8E8;
    font-size: 14px;
    margin-top: -3px;
    margin-left: 5px;
}
.dialog-header-hiddenColor{
    color: #FFC0CB;
}
.dialog-body{

}
.dialog-body-margin{
    margin: 0 0 10px 0;
}
.dialog-body-introduce{
    color: #000;
    line-height: 25px;
    font-size: 14px;
}
.dialog-body-achievement{
    /* height: 40px; */
    line-height: 20px;
    font-size: 14px;
    color: #767676;
    margin-bottom: 5px;
    /* display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2; */
    /* overflow: hidden; 
    text-overflow: ellipsis;  */
    /* white-space: nowrap; */
}
.orange{
    color: #FF7A45;
}
.dialog-body-stratery-concent{
    line-height: 25px;
}
.dialog-body-stratery-concent.PC{
    display: block;
}
.dialog-body-stratery-concent.Mobile{
    display: none;
}
.dialog-achievement a {
    text-decoration: none;
    color: #42b983;
    word-wrap: break-word;
}
.dialog-achievement a:hover{
    color: #2A9D8F;
}
.dialog-footer {
  /* margin-right: 10px; */
  display: flex;
  align-items: center;
  justify-content: center;
  color: #767676;
  font-size: 12px;
  text-align: center;
}
.dialog-footer div{
    word-wrap: break-word;
}
@media (max-width: 768px){
    .dialog-achievement{
        width:70%;
    }
    .dialog-achievement .el-dialog__header{
        padding: 15px;
    }
    .dialog-achievement .el-dialog__body{
        padding: 0px 15px 15px 15px;
    }
    .dialog-achievement .el-dialog__footer{
        padding: 0px 15px 15px 15px;
    }
    .dialog-header{
        font-weight: 700;
        font-size: 16px;
    }
    .dialog-header-version{
        font-size: 10px;
    }
    .dialog-body-achievement{
        line-height: 15px;
        font-size: 12px;
    }
    .dialog-body-strategy{
        font-size: 12px;
    }
    .dialog-body-stratery-concent{
        line-height: 15px;
    }
    .dialog-body-stratery-concent.PC{
        display: none;
    }
    .dialog-body-stratery-concent.Mobile{
        display: block;
    }
    .dialog-footer {
        font-size: 10px;
    }
}

</style>
