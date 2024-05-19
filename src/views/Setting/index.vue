<script setup>
import AccountManage from '@/views/Setting/AccountManage.vue'
import ThemeSetting from '@/views/Setting/ThemeSetting.vue'

</script>

<template>
    <div class="setting">
        <ThemeSetting></ThemeSetting>

        <AccountManage></AccountManage>

        <!-- <div class="setting-title">关于：</div> -->
        <div class="setting-title">如果你有什么好的想法和建议，或者是发现网页中的bug，可以通过以下方式联系我：</div>
        <div class="setting-title">- QQ: 1765931937 </div>
        <div class="video">
            教程视频：
            <a href="https://www.bilibili.com/video/BV1Mm4y1G7MX" target="_blank" class="video-link">功能介绍</a>
        </div>
        <div class="afadian">
            赞助页面：
            <a href="https://afdian.net/a/ticca" target="_blank" class="afadian-link">爱发电</a>
        </div>
        <div class="github">
            开源地址：
            <a href="https://github.com/Ticca-Liyin/liyin.space" target="_blank" class="github-link">GitHub</a>
        </div>
    </div>
</template>

<style scoped>
.github, .afadian, .video {
    color: var(--liyin-text-color);
    font-size: 16px;
    margin: 20px 10px 0 10px;
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
    overflow: hidden;
    overflow-y: auto;
    background-color: var(--liyin-setting-bg-color);
}
.setting-title {
    color: var(--liyin-text-color);
    font-size: 16px;
    margin: 10px 10px;
}

</style>