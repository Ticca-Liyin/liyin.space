<script setup>
import { CopyDocument } from '@element-plus/icons-vue'
import { ref } from 'vue';
import { useIsMobileStore } from '@/stores/isMobile'
import { useAchievementImportByCookieStore } from '@/stores/achievement/import/achievementImportByCookie'
import { useAchievementImportStore } from '@/stores/achievement/import/achievementImport'
import { CookieServerCode } from '@/types/requesrResult'
import { storeToRefs } from 'pinia';

const achievementImport = useAchievementImportStore()
const { isImporting } = storeToRefs(achievementImport)
const { importAchievementsByCookie } = achievementImport

const isMobileStore = useIsMobileStore()
const { isMobile } = storeToRefs(isMobileStore)

const importByCookieStore = useAchievementImportByCookieStore()
const { findUserImportByCookieConfig, handleUserImportByCookieConfig } = importByCookieStore

const cookieConfig = findUserImportByCookieConfig();
const importCookie = ref(cookieConfig?.cookie ?? '');
const openAutoUpate = ref(cookieConfig?.autoUpdateAchevements ?? false);

const copyCode = () => {
    const code = "var cookie = document.cookie;\nif (cookie.includes('e_hkrpg_token=')){\n    copy(cookie);\n    console.log('cookie 已粘贴至剪切板');\n} else {\n    console.error('cookie 获取失败，可能你还未登录');\n}"

    navigator.clipboard.writeText(code)
    .then(() => {
        ElMessage({
            showClose: true,
            message: "代码已复制到剪切板",
            type: 'success',
        })
    })
    .catch(err => {
        ElMessage({
            showClose: true,
            message: "复制到剪切板失败: " + err.message,
            type: 'error',
        })
    });
}

const emit = defineEmits(['import-achievements']);

const importAchievements = () => {
    const cookie = importCookie.value;
    const autoUpate = openAutoUpate.value;

    importAchievementsByCookie(cookie)
    .then((res) => {
        if (res?.code === CookieServerCode.SUCCESS) {
            handleUserImportByCookieConfig(cookie, autoUpate)
            emit('import-achievements')
        }
    })
    .catch((err) => {
        
    })
}

const reset = () => {
    const cookieConfig = findUserImportByCookieConfig();
    importCookie.value = cookieConfig?.cookie ?? ''
    openAutoUpate.value = cookieConfig?.autoUpdateAchevements ?? false
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
            <el-collapse v-model="activeNames">
                <el-collapse-item title="PC端使用教程" name="PC">
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
                    <div class="cookie-import-code">
                        <el-button title="复制代码" class="cookie-import-copy-button" :disabled="isMobile" @click="copyCode">
                            <el-icon>
                                <copy-document />
                            </el-icon>                    
                        </el-button>
<pre>
<span>var cookie = document.cookie;</span>
<span>if (cookie.includes('e_hkrpg_token=')){</span>
<span>    copy(cookie);</span>
<span>    console.log('cookie 已粘贴至剪切板');</span>
<span>} else {</span>
<span>    console.error('cookie 获取失败，可能你还未登录');</span>
<span>}</span>
</pre>
                    </div>
                    <p>6) 将获取到的 Cookie 粘贴至下方文本框中</p><br/>
                    <p>7) 点击 <code>导入</code> 按钮完成导入</p>
                    <!-- <br/>
                    <p>教程视频：<a class="cookie-import-link" href="" target="_blank">点这里</a></p><br/> -->  
                </el-collapse-item>
                <el-collapse-item title="移动端使用教程" name="Mobile">
                    <p>1) 使用移动端设备打开官方的游戏工具网页：</p>
                    <p>&nbsp;&nbsp;&nbsp;
                        <a class="cookie-import-link" href="https://act.mihoyo.com/sr/event/cultivation-tool/index.html" target="_blank">米游社游戏工具</a> 
                        &nbsp; | &nbsp;
                        <a class="cookie-import-link" href="https://act.hoyolab.com/sr/event/cultivation-tool/index.html" target="_blank">hoyolab 游戏工具</a> 
                    </p><br/>
                    <p>2) 登录你的游戏账号</p><br/>
                    <p>3) 打开浏览器开发者工具的控制台<i>（由于不同移动端浏览器操作流程不一样，且有些移动端浏览器不支持开发者模式，此过程需自行上网查找方法）</i></p><br/>
                    <p>4) 将下面的代码粘贴至控制台中，并按下 <code>回车键</code> 触发获取 </p>
                    <div class="cookie-import-code">
                        <el-button title="复制代码" class="cookie-import-copy-button" :disabled="isMobile" @click="copyCode">
                            <el-icon>
                                <copy-document />
                            </el-icon>                    
                        </el-button>
<pre>
<span>var cookie = document.cookie;</span>
<span>if (cookie.includes('e_hkrpg_token=')){</span>
<span>    copy(cookie);</span>
<span>    console.log('cookie 已粘贴至剪切板');</span>
<span>} else {</span>
<span>    console.error('cookie 获取失败，可能你还未登录');</span>
<span>}</span>
</pre>
                    </div>
                    <p>5) 将获取到的 Cookie 粘贴至下方文本框中</p><br/>
                    <p>6) 点击 <code>导入</code> 按钮完成导入</p><br/>
                    <p style="color: #aaa;">若你使用的浏览器无法打开开发者模式，你可以先使用PC端完成获取 cookie 流程后将 cookie 发送给你的移动端设备，再粘贴至下方文本框中</p>
                    <!-- <br/>
                    <p>教程视频：<a class="cookie-import-link" href="" target="_blank">点这里</a></p><br/> -->    
                </el-collapse-item>
            </el-collapse>
            <br/><p style="color: #e6a23c;">导入的成就会覆盖当前所选账号原有的所有成就信息，请谨慎导入</p><br/>
        </div>
        <div class="cookie-import-data">
            <div class="cookie-import-data-title">Cookie：</div>
            <el-input v-model="importCookie" class="cookie-import-data-textarea" :rows="3" resize="none" type="textarea" 
            placeholder="请输入你的 Cookie"/> 
        </div>
        <div class="auto-update-checkbox">
            <el-checkbox v-model="openAutoUpate" label="每次登录账号时自动使用 cookie 导入更新成就数据" :size="isMobile ? 'small' : 'default'"/>
        </div>
    </div>
    <div class="cookie-import-footer">
        <div class="cookie-import-footer-tip"></div>
        <el-button type="primary" plain 
            v-loading.fullscreen.lock="isImporting" element-loading-text="正在通过 cookie 获取成就数据..." 
            element-loading-background="rgba(0, 0, 0, 0.7)"
            @click="importAchievements" :disabled="!importCookie.trim()">
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
    overflow-x: hidden;
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

.cookie-import-code {
    position: relative;
}

.cookie-import-copy-button {
    position: absolute;
    font-size: 16px;
    top: 15px;
    right: 20px;
    z-index: 2;
    width: 30px;
    height: 30px;
    padding: 5px;
    opacity: 0;
}

.cookie-import-code:hover .cookie-import-copy-button {
    opacity: 1;
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

.auto-update-checkbox {
    padding: 0 20px;
    margin-top: -6px;
    margin-bottom: 5px;
}

.auto-update-checkbox .el-checkbox {
    align-items: start;
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

    .cookie-import-copy-button {
        opacity: 0;
    }

    .cookie-import-code:hover .cookie-import-copy-button {
        opacity: 0;
    }

    .cookie-import-data{
        font-size: 12px;
    }

    .cookie-import-data-textarea {
        font-size: 12px;
    }

    .auto-update-checkbox {
        margin-top: -7px;
    }

    .cookie-import-footer-error{
        font-size: 12px;
    }
    .cookie-import-footer-tip{
        font-size: 12px;
    }
}
</style>

<style>
.cookie-import-tip .el-collapse-item__content {
    color: var(--liyin-text-color);
    font-size: 15px;
}

@media (max-width: 768px){
    .cookie-import-tip .el-collapse-item__header {
        font-size: 12px;
        line-height: 15px;
        height: 40px;
    }
    .cookie-import-tip .el-collapse-item__content {
        font-size: 12px;
        line-height: 15px; 
        padding-bottom: 15px;
    }
}

.auto-update-checkbox .el-checkbox .el-checkbox__input {
    padding-left: 2px;
}
.auto-update-checkbox .el-checkbox .el-checkbox__label {
  white-space: normal !important;
  word-break: break-all;
} 
</style>