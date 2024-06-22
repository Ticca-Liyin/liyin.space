<script setup>
import { useAchievementStore } from '@/stores/achievement'

const achievementStore = useAchievementStore()

defineProps({
    info: Object
})

const formatMultipleID = (MultipleID) => {
    if (!MultipleID) return ''
    const reserveDigits = 2
    return (MultipleID- 50000).toString().padStart(reserveDigits, '0')
}
</script>

<template>
    <section class="achievement-section">
        <div class="achievement-item">
            <div class="achievement-select" :class="{'selected': info.Status === 3, 'selected-other': info.Status === 2, 'not-available': info.isNotAvailable}" 
            :style="{'pointer-events: none;': info.Status === 2 || info.isNotAvailable}" @click="achievementStore.handleAchevementStatus(info)">
                <svg class="achievement-select-icon" viewBox="0 0 1024 1024">
                    <path fill="currentColor" d="M392.533333 806.4L85.333333 503.466667l59.733334-59.733334 247.466666 247.466667L866.133333 213.333333l59.733334 59.733334L392.533333 806.4z" p-id="4063"></path>
                </svg>
            </div>
            <div class="achievement-supplement">
                <div class="achievement-StellarJade">
                    <img :src="achievementStore.StellarJadeImg" alt="星琼">
                    <div class="achievement-StellarJadeNum">
                        {{ info.StellarJadeNum }}
                    </div>
                </div>
                <div class="achievement-introduction"  @click="achievementStore.showStrategyDialog(info)">
                    <svg class="achievement-introduction-icon" viewBox="0 0 1024 1024">
                        <path fill="currentColor" d="M715.264 881.152H325.1712c-96 0-174.08-78.08-174.08-174.08V316.928c0-96 78.08-174.08 174.08-174.08h390.0928c96 0 174.08 78.08 174.08 174.08v390.0928c0 96-78.08 174.1312-174.08 174.1312zM325.1712 183.808c-73.4208 0-133.12 59.6992-133.12 133.12v390.0928c0 73.4208 59.6992 133.12 133.12 133.12h390.0928c73.4208 0 133.12-59.6992 133.12-133.12V316.928c0-73.4208-59.6992-133.12-133.12-133.12H325.1712z"></path>
                        <path fill="currentColor" d="M414.976 706.2528a45.1072 45.1072 0 0 1-26.624-8.704c-14.08-10.24-20.992-27.2384-18.0736-44.3904l15.4624-90.0608a4.37248 4.37248 0 0 0-1.28-3.9424L319.0784 495.4112a45.14304 45.14304 0 0 1-11.4688-46.5408 45.10208 45.10208 0 0 1 36.6592-30.8736l90.4192-13.1584a4.5056 4.5056 0 0 0 3.328-2.4064l40.448-81.92c7.68-15.616 23.296-25.2928 40.704-25.2928 17.408 0 33.024 9.6768 40.704 25.2928l40.448 81.92c0.6656 1.28 1.8944 2.2016 3.328 2.4064l90.4192 13.1584c17.2032 2.5088 31.232 14.336 36.6592 30.8736 5.376 16.5376 0.9728 34.3552-11.4688 46.5408l-65.4336 63.7952c-1.024 1.024-1.536 2.5088-1.28 3.9424l15.4624 90.0608c2.9184 17.152-3.9936 34.1504-18.0736 44.3904a45.056 45.056 0 0 1-47.7696 3.4304l-80.896-42.496a4.4544 4.4544 0 0 0-4.096 0l-80.8448 42.496a47.08352 47.08352 0 0 1-21.3504 5.2224z m104.0896-370.0736c-1.8432 0-3.1744 0.8192-3.9424 2.4576l-40.448 81.92a45.3632 45.3632 0 0 1-34.1504 24.832l-90.4192 13.1584c-1.792 0.256-3.0208 1.28-3.584 3.0208-0.5632 1.7408-0.2048 3.2768 1.1264 4.5568l65.4336 63.7952a45.45536 45.45536 0 0 1 13.056 40.192l-15.4624 90.0608c-0.3072 1.792 0.3072 3.2768 1.7408 4.3008s3.0208 1.1776 4.6592 0.3584l80.8448-42.496a45.31712 45.31712 0 0 1 42.24 0l80.896 42.496c1.6384 0.8704 3.1744 0.7168 4.6592-0.3584 1.4848-1.0752 2.048-2.5088 1.7408-4.3008l-15.4624-90.0608c-2.5088-14.7456 2.3552-29.7472 13.056-40.192l65.4336-63.7952c1.28-1.28 1.6896-2.816 1.1264-4.5568s-1.7408-2.7648-3.584-3.0208l-90.4192-13.1584a45.28128 45.28128 0 0 1-34.1504-24.832l-40.448-81.92c-0.768-1.6384-2.0992-2.4576-3.9424-2.4576z"></path>
                    </svg>
                    攻略
                </div>
            </div>
            <div class="achievement-content">
                <div class="achievement-info">
                    <div class="achievement-title">
                        {{info.AchievementTitle}}                            
                    </div>
                    <sup class="achievement-version">
                        {{info.Version}}
                    </sup>
                    <sup class="achievement-showtype">
                        {{info.ShowType === "ShowAfterFinish" ? '隐藏' : ''}}
                    </sup>
                    <sup class="achievement-branch">
                        {{info?.MultipleID ? '多选一' + formatMultipleID(info?.MultipleID) : ''}}
                    </sup>
                </div>    
                <div class="achievement-desc"  v-html="info.AchievementDesc"></div>
            </div>
            <!-- <div class="achievement-right">
                <div class="achievement-right-status">
                    {{ info.StatusDesc }}
                </div>
            </div> -->
        </div>
    </section> 
</template>

<style scoped>
.achievement-section{
    padding: 0px 4px 15px 10px;
}
.achievement-item{
    display: flex;
    align-items: center;
    border-radius: 5px;
    background-color: var(--liyin-ach-item-bg-color);
    padding: 10px 20px;
}
.achievement-select{
    width: 40px;
    height: 40px;
    /* border: 2px solid #00A8E8; */
    border: 2px solid var(--liyin-ach-not-select-color);
    border-radius: 50%;
    /* background-color: #00A8E8; */
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    user-select: none;
}
.achievement-select.selected{
    border: 2px solid var(--liyin-ach-selected-color);
    background-color: var(--liyin-ach-selected-color);
}
.achievement-select:hover{
    border: 2px solid var(--liyin-ach-hover-color);
}
.achievement-select.selected:hover{
    border: 2px solid var(--liyin-ach-selected-hover-color);
    background-color: var(--liyin-ach-selected-hover-color);
}
.achievement-select.selected-other{
    border: 2px solid var(--liyin-ach-not-available-color);
    background-color: var(--liyin-ach-not-available-color);
    cursor:no-drop;
}
.achievement-select.not-available{
    border: 2px solid var(--liyin-ach-not-available-color);
    cursor:no-drop;
}
.achievement-select.selected-other:hover,
.achievement-select.not-available:hover{
    border: 2px solid var(--liyin-ach-not-available-color);
}
.achievement-select-icon{
    width: 30px;
    height: 30px;
    /* color: #00A8E8; */
    color: var(--liyin-ach-not-select-color);
    /* color: #fff; */
}
.achievement-select:hover .achievement-select-icon{
    color: var(--liyin-ach-hover-color);
}
.achievement-select.selected .achievement-select-icon,
.achievement-select.selected:hover .achievement-select-icon,
.achievement-select.selected-other .achievement-select-icon,
.achievement-select.selected-other:hover .achievement-select-icon{
    color: var(--liyin-ach-icon-selected-color);
}
.achievement-select.not-available .achievement-select-icon,
.achievement-select.not-available:hover .achievement-select-icon{
    color: var(--liyin-ach-not-available-color);
}
.achievement-supplement{
    display: flex;
    flex-direction: column;
    align-items: center;
    user-select: none;
}
.achievement-StellarJade{
    width: 45px;
    height: 45px;
    /* min-width: 45px; */
    /* border: 1px solid #00A8E8; */
    background-color: var(--liyin-ach-stellar-bg-color);
    border-radius: 5px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin: 0 10px;
    position: relative;
    overflow: hidden;
}
.achievement-StellarJadeNum{
    width: 100%;
    text-align: center;
    font-size: 12px;
    /* font-weight: 800; */
    /* margin: 0 0 0 10px; */
    color: var(--liyin-ach-stellar-num-text-color);
    position: absolute;
    bottom: 0;
    z-index: 2;
}
.achievement-StellarJadeNum::before{
    content: '';
    width: 100%;
    height: 100%;
    background-color: var(--liyin-ach-stellar-num-bg-color);
    opacity: 0.6;
    position: absolute;
    bottom: 0;
    left: 0;
    z-index: -1;
}
.achievement-StellarJade img{
    position: relative;
    width: 80%;
    /* height: 100%; */
    margin: 10% 0;
    z-index: 2;
}
.achievement-introduction{
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 0 10px 0 10px;
    font-size: 13px;
    color: var(--liyin-ach-introduction-color);
    line-height: 20px;
    height: 20px;
    cursor: pointer;
}
.achievement-introduction:hover{
    font-weight: 700;
}
.achievement-introduction-icon{
    width: 18px;
    height: 18px;
}
.achievement-content{
    flex-grow: 1;
    max-width: calc(100% - 110px);
    /* max-width: 78%; */
}
.achievement-info{
    display: flex;
    font-size: 16px;
    font-weight: 700;
    line-height: 30px;
    height: 30px;
    overflow: hidden; 
    text-overflow: ellipsis; 
    white-space: nowrap;
}
.achievement-title{
    overflow: hidden; 
    text-overflow: ellipsis; 
    white-space: nowrap;
    color: var(--liyin-text-main-color);
}
.achievement-version{
    color: var(--liyin-ach-version-color);
    font-size: 12px;
    margin-top: -3px;
    margin-left: 3px;
}
.achievement-showtype{
    color: var(--liyin-ach-showtype-color);
    font-size: 12px;
    margin-top: -3px;
    margin-left: 10px;
}
.achievement-branch{
    color: var(--liyin-ach-branch-color);
    font-size: 12px;
    margin-top: -3px;
    margin-left: 10px;
}
.achievement-desc{
    height: 40px;
    line-height: 20px;
    font-size: 14px;
    color: var(--liyin-text-color);
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden; 
    text-overflow: ellipsis; 
    /* white-space: nowrap; */
}
/* .achievement-right{
    display: flex;
    justify-content: center;
    align-items: center;
    width: 70px;
}
.achievement-right-status{
    font-size: 12px;
    color: #767676;
} */

/* @media (max-width: 900px){
    .achievement-section{
        padding: 0px 10px 5px 10px;
    }
} */
@media (max-width: 768px){
    .achievement-section{
        padding: 0px 4px 5px 10px;
    }
    .achievement-item{
        padding: 5px 10px;
        flex-direction: row-reverse;
    }
    .achievement-select{
        width: 30px;
        height: 30px;
    }
    .achievement-select:hover{
        border: 2px solid var(--liyin-ach-not-select-color);
    }
    .achievement-select-icon{
        width: 20px;
        height: 20px;
    }
    .achievement-select:hover .achievement-select-icon{
        color: var(--liyin-ach-not-select-color);
    }
    .achievement-select.selected:hover{
        border: 2px solid var(--liyin-ach-selected-color);
        background-color: var(--liyin-ach-selected-color);
    }
    .achievement-select.selected-other:hover,
    .achievement-select.not-available:hover{
        border: 2px solid var(--liyin-ach-not-available-color);
    }
    .achievement-StellarJade{
        width: 35px;
        height: 35px;
        /* min-width: 35px; */
        margin: 0 5px;
    }
    .achievement-StellarJadeNum{
        font-size: 10px;
    }
    .achievement-introduction{
        margin: 3px 5px 0 5px;
        font-size: 10px;
        line-height: 15px;
        height: 15px;
    }
    .achievement-introduction-icon{
        width: 15px;
        height: 15px;
    }
    .achievement-content{
        flex-grow: 1;
        max-width: calc(100% - 85px);
    }
    .achievement-info{
        font-size: 13px;
        font-weight: 700;
        line-height: 25px;
        height: 25px;
    }
    .achievement-version{
        font-size: 10px;
    }
    .achievement-showtype{
        font-size: 10px;
    }
    .achievement-branch{
        font-size: 10px;
    }
    .achievement-desc{
        height: 30px;
        line-height: 15px;
        font-size: 11px;
    }
}
</style>