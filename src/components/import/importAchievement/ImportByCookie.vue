<script setup>
import { ref } from 'vue';
import { useAchievementStore } from '@/stores/achievement';
import { useAchievementCustomNotAchievedStore } from '@/stores/achievementCustomNotAchieved'
import { storeToRefs } from 'pinia';

const achievementStore = useAchievementStore()
const { achievements } = storeToRefs(achievementStore)
const { handleUserAchievementList, handleAchevementStatus, saveUserAchievement } = achievementStore

const achievementCustomNotAchievedStore = useAchievementCustomNotAchievedStore()
const { initUserCustomNotAchievedList } = achievementCustomNotAchievedStore

const importCookie = ref('')
const errorStr = ref('')
const importAchievementList = ref([])

// const identifyData = () => {
//     errorStr.value = ''
//     importAchievementList.value = []

//     try {
//         // 尝试将用户输入的 JSON 字符串解析为 JavaScript 对象
//         const data = JSON.parse(importData.value);

//         // 进一步检查解析后的数据是否符合预期
//         if (typeof data === 'object' && data !== null && !Array.isArray(data) && 'achievements' in data && Array.isArray(data.achievements)) {
//             const AchievementIDs = []
//             achievements.value.forEach(achievement => AchievementIDs.push(achievement.AchievementID))

//             for(const id of data.achievements){
//                 if(AchievementIDs.includes(id) && !importAchievementList.value.includes(id)){
//                     importAchievementList.value.push(id)
//                 }
//             }
//         }
//         else {
//             errorStr.value = '无法正确识别导入数据'
//         }
//     } catch (error) {
//         errorStr.value = '无法正确识别导入数据'
//     }
// }

const emit = defineEmits(['import-achievements']);

// 从cookie字符串中提取指定字段的值
const extractCookieValue = (cookies, key) => {
    // 将cookie字符串分割成键值对
    const cookiePairs = cookies.split('; ');
    for (const pair of cookiePairs) {
        // 每个键值对进一步分割成键和值
        if (pair.includes('=')) {
            const [k, v] = pair.split('=', 2);
            // 如果找到了匹配的键，则返回对应的值
            if (k === key) {
                return v;
            }
        }
    }
    // 如果没有找到匹配的键，则返回null
    return null;
}

const importAchievements = () => {
    const cookie = importCookie.value;
    const device_id = extractCookieValue(cookie, '_MHYUUID');

    if (!device_id) {
        ElMessage({
            showClose: true,
            message: '解析 cookie 失败，请确认 cookie 是否正确！',
            type: 'error',
        })
        return;
    }

    const url = extractCookieValue(cookie, 'HYV_LOGIN_PLATFORM_LIFECYCLE_ID') !== null ? '/hoyolab-api/event/rpgcultivate/achievement/list' : '/mohoyo-api/event/rpgcultivate/achievement/list'

    // 请求参数
    const params = new URLSearchParams({
        show_hide: "true",
        need_all: "true"
    });

    // 请求头
    const headers = new Headers({
        'cookie': cookie,
        'x-rpc-device_id': device_id,
        'host': 'api-takumi.mihoyo.com',
        'origin': 'https://act.mihoyo.com',
        'referer': 'https://act.mihoyo.com/',
    });

    // 发送GET请求
    fetch(`${url}?${params.toString()}`, {
        method: 'GET',
        headers: headers
    })
    .then(response => {
        if (response.ok) {
            return response.json();
        } else {
            throw new Error(`请求失败，状态码: ${response.status}`);
        }
    })
    .then(data => {
        console.log(data);

        if (data.retcode !== 0) {
            ElMessage({
                showClose: true,
                message: '请求失败，未知异常！',
                type: 'error',
            })
            return;
        }

        const achievements = data.data.achievement_list;
        console.log(achievements);

        // 假设 get_achievement 是一个处理成就的函数
        // for (const achievement of achievements) {
        //     get_achievement(achievement);
        // }

        // 打印成就列表
        console.log(achievements);
        console.log(`已完成成就个数：${achievements.length}`);

        // 将JSON数据复制到剪切板
        navigator.clipboard.writeText(JSON.stringify(achievements, null, 2))
            .then(() => {
                console.log("成就数据已复制到剪切板");
                alert("成就数据已复制到剪切板");
            })
            .catch(err => {
                console.error("无法复制到剪切板: ", err);
                alert("无法复制到剪切板: " + err.message);
            });
    })
    .catch(error => {
        console.error(error.message);
        ElMessage({
            showClose: true,
            message: error.message,
            type: 'error',
        })
        return;
    });
    // // 初始化所有成就状态为未完成
    // achievements.value.forEach(achievement => {
    //     achievement.Status = 1
    //     achievement.CustomNotAchieved = false
    //     handleUserAchievementList(achievement.AchievementID, achievement.Status, false)
    // })        
    // initUserCustomNotAchievedList()

    // // 修改已完成状态, 同一多选已成就后识别的覆盖先识别到的
    // for(const id of importAchievementList.value){
    //     const ach_ = achievements.value.find(achievement => id === achievement.AchievementID)

    //     if (!ach_) continue
    //     ach_.Status = 1
    //     handleAchevementStatus(ach_, false)
    // }

    // saveUserAchievement()

    emit('import-achievements')
}

const reset = () => {
    errorStr.value = ''
    importCookie.value = ''
    importAchievementList.value = []
}

defineExpose({ reset })
</script>

<template>
    <div class="cookie-import-main"
    @dragenter.prevent
    @dragover.prevent
    @drop="handleDrop"
    >
        <div class="cookie-import-tip">
            <p>使用教程：</p><br/>
            <p>1) 使用 PC 设备打开官方的游戏工具网页：</p>
            <p>&nbsp;&nbsp;&nbsp;
                <a class="cookie-import-link" href="https://act.mihoyo.com/sr/event/cultivation-tool/index.html" target="_blank">米游社游戏工具</a> 
                &nbsp; | &nbsp;
                <a class="cookie-import-link" href="https://act.hoyolab.com/sr/event/cultivation-tool/index.html" target="_blank">hoyolab 游戏工具</a> 
            </p><br/>
            <p>2) 登录你的游戏账号</p><br/>
            <p>3) 按 <code>F12</code> 或右键菜单选择 <code>检查</code> 打开开发者工具</p><br/>
            <p>4) 切换到 <code>控制台</code> 或 <code>Console</code> 标签页</p><br/>
            <p>5) 将下面的代码粘贴至控制台中，并按下 <code>Enter</code> 键</p>
<pre>
<span>var cookie = document.cookie;</span>
<span>if (cookie.includes('e_hkrpg_token=')){</span>
<span>    copy(cookie);</span>
<span>    console.log('cookie 已粘贴至剪切板');</span>
<span>} else {</span>
<span>    console.error('cookie 获取失败，可能你还未登录');</span>
<span>}</span>
</pre>
            <p>6) 将获取到的 Cookie 粘贴至文本框中</p><br/>
            <p>7) 点击 <code>导入</code> 按钮完成导入</p><br/>
            
            <!-- <p>教程视频：<a class="cookie-import-link" href="" target="_blank">点这里</a></p><br/> -->    
        </div>
        <div class="cookie-import-data">
            <div class="cookie-import-data-title">Cookie：</div>
            <el-input v-model="importCookie" class="cookie-import-data-textarea" :rows="3" resize="none" type="textarea" 
            placeholder="请输入你的 Cookie"/> 
        </div>
    </div>
    <div class="cookie-import-footer">
        <!-- <div v-if="errorStr" class="cookie-import-footer-error">{{ errorStr }}</div>
        <div v-else-if="!importAchievementList.length" class="cookie-import-footer-tip">未识别到可导入的内容</div>
        <div v-else class="cookie-import-footer-tip">识别到已完成成就 {{ importAchievementList.length }} 个</div> -->
        <div class="cookie-import-footer-tip"></div>
        <el-button type="primary" plain @click="importAchievements" :disabled="!importCookie.trim()">
        导入
        </el-button>
    </div>
</template>

<style scoped>
.cookie-import-main{
    width:99%;
    border:1px dashed var(--liyin-dashed-border-color);
    border-radius: 5px;
    max-height: 350px;
    overflow-y: auto;
}
.cookie-import-main::-webkit-scrollbar,
.cookie-import-tip pre::-webkit-scrollbar,
.cookie-import-data-textarea ::-webkit-scrollbar {
    width: 6px;
    height: 6px;
}   
.cookie-import-main::-webkit-scrollbar-track,
.cookie-import-tip pre::-webkit-scrollbar-track,
.cookie-import-data-textarea ::-webkit-scrollbar-track {
    background-color: transparent;
}
.cookie-import-main::-webkit-scrollbar-thumb,
.cookie-import-tip pre::-webkit-scrollbar-thumb,
.cookie-import-data-textarea ::-webkit-scrollbar-thumb {
    background-color: rgba(139, 139, 139, 0.4);
    border-radius: 10px;
}
.cookie-import-main::-webkit-scrollbar-button,
.cookie-import-tip pre::-webkit-scrollbar-button,
.cookie-import-data-textarea ::-webkit-scrollbar-button {
    display: none;
}

.cookie-import-tip{
    color: var(--liyin-text-color);
    font-size: 15px;
    padding: 10px 20px 0 20px;
    line-height: 20px;   
}

.cookie-import-tip p > code {
    background-color: rgba(42, 157, 143, .16);
    border-radius: 4px;
    padding: 3px 6px;
    color: #42b983;
    font-size: .875em;
    transition: color .25s, background-color .5s;
}

.cookie-import-tip pre{
    position: relative;
    z-index: 1;
    margin: 10px 5px 20px 5px;
    padding: 10px 15px;
    border-radius: 5px;
    background: var(--liyin-pre-bg-color);
    color: var(--liyin-pre-color);
    overflow-x: auto; 
}

.cookie-import-link {
    text-decoration: none;
    color: var(--liyin-url-text-color);
    word-wrap: break-word;
}
.cookie-import-link:hover {
    color: var(--liyin-url-hover-text-color);
}

.cookie-import-data{
    width: calc(100% - 40px);
    padding: 0 20px;
    font-size: 16px;
}
.cookie-import-data-title{
    margin-bottom: 10px;
}
.cookie-import-data-textarea{
    width: 100%;
    margin-bottom: 10px;
}

.cookie-import-footer{
    display: flex; 
    align-items: center;
    justify-content: space-between;
    margin-top: 15px;
}
.cookie-import-footer-error{
    color: red;
    font-size: 15px;
}
.cookie-import-footer-tip{
    color: var(--liyin-text-color);
    font-size: 15px;
}

@media (max-width: 768px){
    .cookie-import-main{
        max-height: 200px;
        overflow-y: auto;
    }

    .cookie-import-tip{
        font-size: 12px;
        line-height: 15px;   
    }

    .cookie-import-data{
        font-size: 14px;
    }

    .cookie-import-footer-error{
        font-size: 12px;
    }
    .cookie-import-footer-tip{
        font-size: 12px;
    }
}
</style>