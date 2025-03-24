<script setup>
import UpdateLog from '@/views/Setting/UpdateLog.vue'
import AccountManage from '@/views/Setting/AccountManage.vue'
import ThemeSetting from '@/views/Setting/ThemeSetting.vue'
import CloudSync from '@/views/Setting/CloudSync.vue';
import { ref } from 'vue'

const activeName = ref('basic')
</script>

<template>
    <div class="setting">
        <div class="setting-main">
        <!-- <el-tabs v-model="activeName" class="setting-tabs">
            <el-tab-pane class="setting-main" label="基础" name="basic"> -->
                <UpdateLog />

                <ThemeSetting />
                
                <AccountManage />

                <CloudSync />

                <!-- <div class="setting-title">关于：</div> -->
                <div class="setting-title">如果你有什么好的想法和建议，或者是发现网页中的bug，可以通过以下方式联系我：</div>
                <div class="setting-title">- QQ: 1765931937 </div>
                <div class="video">
                    教程视频：
                    <a href="https://space.bilibili.com/2079439802/channel/collectiondetail?sid=3040945" target="_blank" class="video-link">功能介绍合集</a>
                </div>
                <div class="afadian">
                    赞助页面：
                    <a href="https://afdian.com/a/ticca" target="_blank" class="afadian-link">爱发电</a>
                </div>
                <div class="github">
                    开源地址：
                    <a href="https://github.com/Ticca-Liyin/liyin.space" target="_blank" class="github-link">GitHub</a>
                </div>
            <!-- </el-tab-pane>
            <el-tab-pane class="setting-main" label="数据云同步" name="sync">
                <CloudSync />
            </el-tab-pane>
        </el-tabs> -->
        </div>
    </div>    
</template>

<style scoped>
.github, .afadian, .video {
    color: var(--liyin-text-color);
    font-size: 16px;
    margin: 10px;
}
.github a, .afadian a, .video a {
    text-decoration: none;
    color: var(--liyin-url-text-color);
    word-wrap: break-word;
}
.github a:hover, .afadian a:hover, .video a:hover {
    color: var(--liyin-url-hover-text-color);
}
.setting{
    height: 100%;
    display: flex;;
    flex-direction: column;
    overflow: hidden;
    overflow-y: auto;
    background-color: var(--liyin-setting-bg-color);
    /* padding: 10px 20px; */
}
.setting-main {
    padding: 10px;
}
.setting-title {
    color: var(--liyin-text-color);
    font-size: 16px;
    margin: 10px 0;
}

.setting::-webkit-scrollbar {
    width: 6px;
    height: 6px;
}   
.setting::-webkit-scrollbar-track {
    background-color: transparent;
}
.setting::-webkit-scrollbar-thumb {
    background-color: rgba(139, 139, 139, 0.4);
    border-radius: 10px;
}
.setting::-webkit-scrollbar-button {
    display: none;
}
.setting::-webkit-scrollbar-corner {
    background-color: var(--liyin-char-bg-color); 
}
</style>

<style>
.setting-tabs .el-tabs__nav-scroll {
    padding: 0 20px;
}

@media (max-width: 768px){
    .setting-tabs .el-tabs__item {
        padding: 0 10px;
    }
}
</style>