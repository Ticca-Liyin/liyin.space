<script setup>
import { useAchievementStrategyDialogStore } from '@/stores/achievement/strategy/achievementStrategyDialog';
import { useAuthorStore } from '@/stores/author';
import { storeToRefs } from 'pinia';
import formatTimestamp from '../../utils/formatTimestamp';

const achievementStrategyDialogStore = useAchievementStrategyDialogStore()
const { dialogVisible, dialogAchievement, dialogMultipleChoiceList, showStrategyList} = storeToRefs(achievementStrategyDialogStore);

const authorStore = useAuthorStore()
const { authors } = storeToRefs(authorStore)

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
                    成就攻略<span v-if="showStrategyList.length > 0">({{showStrategyList.length}})</span>：
                </div>
                <el-scrollbar max-height="150px" v-if="showStrategyList.length > 0">
                    <template v-for="strategy in showStrategyList" :key="strategy.title">
                        <template v-if="Object.keys(authors).includes(String(strategy.author))">
                            <div class="dialog-body-stratery-concent PC">
                                <div>
                                    <a :href="authors[strategy.author].homepage" target="_blank" class="dialog-body-stratery-author">【{{ authors[strategy.author].name }}】</a>
                                    <span>{{ strategy.title }}</span> ：
                                </div> 
                                <div>
                                    <a class="dialog-body-stratery-href" :href="strategy.url" target="_blank" style="margin-left: 7px;"> {{ strategy.url }}</a>                            
                                </div>
                            </div>
                            <div class="dialog-body-stratery-concent Mobile">
                                <a :href="authors[strategy.author].homepage" target="_blank" class="dialog-body-stratery-author">【{{ authors[strategy.author].name }}】</a>
                                <a class="dialog-body-stratery-href" :href="strategy.url" target="_blank"><span>{{ strategy.title }}</span> </a>
                            </div>
                        </template>
                        <div v-else class="dialog-body-achievement">
                            该攻略作者已注销
                        </div>
                    </template>
                </el-scrollbar>
                <div v-else class="dialog-body-stratery-concent">
                    <div>暂无相关攻略</div>
                </div>
            </div>
        </div>
        <template #footer>
            <div class="dialog-footer">
                <div>点击 橙字内容 跳转至作者主页</div>
                <div>点击 绿字内容 跳转至攻略页面</div>
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
    padding: 0;
}
.dialog-achievement .el-dialog__header{
    padding: 15px 20px;
}
.dialog-achievement .el-dialog__body{
    padding: 0 20px 15px 20px;
}
.dialog-achievement .el-dialog__footer{
    padding: 0 20px 15px 20px;
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
    color: var(--liyin-ach-version-color);
    font-size: 14px;
    margin-top: -3px;
    margin-left: 5px;
}
.dialog-header-hiddenColor{
    color: var(--liyin-ach-showtype-color);
}
.dialog-body{

}
.dialog-body-margin{
    margin: 0 0 10px 0;
}
.dialog-body-introduce{
    color: var(--liyin-text-deep-color);
    line-height: 25px;
    font-size: 14px;
}
.dialog-body-achievement{
    /* height: 40px; */
    line-height: 20px;
    font-size: 14px;
    color: var(--liyin-text-color);
    margin-bottom: 5px;
    /* display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2; */
    /* overflow: hidden; 
    text-overflow: ellipsis;  */
    /* white-space: nowrap; */
}
.orange{
    color: var(--liyin-orange-color);
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
a.dialog-body-stratery-author{
    text-decoration: none;
    color: var(--liyin-author-text-color);
    word-wrap: break-word;
}
a.dialog-body-stratery-author:hover{
    color: var(--liyin-author-hover-text-color);
}
a.dialog-body-stratery-href {
    text-decoration: none;
    color: var(--liyin-url-text-color);
    word-wrap: break-word;
}
a.dialog-body-stratery-href:hover{
    color: var(--liyin-url-hover-text-color);
}
.dialog-footer {
  /* margin-right: 10px; */
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: var(--liyin-text-color);
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
