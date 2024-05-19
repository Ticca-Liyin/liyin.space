<script setup>
import { ArrowDown, ArrowUp } from '@element-plus/icons-vue'
import { useCharacterSettingStore } from '@/stores/characterSetting';
import { useIsMobileStore } from '@/stores/isMobile'
import { ref, onMounted, watch } from 'vue';
import { storeToRefs } from 'pinia';

const isMobileStore = useIsMobileStore()
const { isMobile } = storeToRefs(isMobileStore)

const characterSettingStore = useCharacterSettingStore()
const { toWebsiteName, scale, useWheelEvent} = storeToRefs(characterSettingStore)
const { WebsiteNameList, scaleMin, scaleMax} = characterSettingStore

// 设置行相关折叠功能
const hadFold = ref(false)

const handleSettingScroll = (event) => {
    // 阻止默认的滚动行为，以免影响整个页面的滚动
    event.preventDefault();
    
    // 根据鼠标滚轮的 deltaY 属性来判断滚动方向
    const delta = Math.max(-1, Math.min(1, event.deltaY));
    
    // 根据滚动方向来控制滚动
    const container = document.getElementById('character-setting');
    container.scrollLeft += delta * 100; // 根据需要调整滚动速度
}

let isSettingDragging = false;
let settingStartX = 0;

const startSettingDrag = (event) => {
    isSettingDragging = true;
    settingStartX = event.clientX;
}

const handleSettingDrag = (event) => {
    const settingContainer = document.getElementById('character-setting')

    if (isSettingDragging) {
        const deltaX = event.clientX - settingStartX;

        settingContainer.scrollLeft -= deltaX;

        settingStartX = event.clientX;
    }
}

const endSettingDrag = () => {
    isSettingDragging = false;
}

//获取折叠缓存
const getCharacterSettingFold = () => {
    // 从缓存中读取名为 "CharacterSettingFold" 的数据
    const tempCharacterSettingFold = localStorage.getItem("CharacterSettingFold")

    // 检查是否存在名为 "CharacterSettingFold" 的数据
    if (tempCharacterSettingFold !== null) {
        // 数据存在，将其从字符串转换为对象
        hadFold.value = JSON.parse(tempCharacterSettingFold)
    } else {
        // 数据不存在，执行相应的操作
        hadFold.value = false
    }
}
//保存折叠缓存
const saveCharacterSettingFold = () => {
    // 将对象转换为字符串，并将其存储在缓存中
    localStorage.setItem("CharacterSettingFold", JSON.stringify(hadFold.value))
}

onMounted(() => {
    getCharacterSettingFold()
})

watch(hadFold, saveCharacterSettingFold)

</script>

<template>
    <div class="character-setting-fold">
        <div class="character-setting" id="character-setting" :class="hadFold ? 'nowarp' : 'warp'" @wheel="handleSettingScroll">
            <!-- @mousedown="startSettingDrag" @mousemove="handleSettingDrag" @mouseup="endSettingDrag" @mouseleave="endSettingDrag" -->
            <div class="select-demo-block">
                <span class="demonstration">跳转网站</span>
                <el-select
                v-model="toWebsiteName"
                collapse-tags
                collapse-tags-tooltip
                placeholder="请选择网站名称"
                size = "small"
                style="width: 150px; --el-color-primary: #DBC291;"
                >
                    <el-option
                        v-for="item in Object.values(WebsiteNameList)"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                        style="--el-color-primary: #DBC291;"
                    />
                </el-select>
            </div>

            <div class="switch-demo-block" v-if="!isMobile">
                <span class="demonstration">滚轮缩放</span>
                <el-switch
                    v-model="useWheelEvent"
                    inline-prompt
                    active-text="开启"
                    inactive-text="关闭"
                    style="--el-switch-on-color: #DBC291;"
                />
            </div>

            <div class="slider-demo-block">
                <span class="demonstration">缩放比例</span>
                <el-slider v-model="scale" :min="scaleMin" :max="scaleMax" :step="0.01" style="width: 150px;"/>
            </div>
            <div class="character-setting-fold-up" v-if="!hadFold" @click="hadFold = true">
                <el-icon class="el-icon--right" style="padding: 10px; margin: 0;">
                    <arrow-up />
                </el-icon>
            </div>
            <!-- <h1>角色列表设置（跳转主网站、滚轮控制事件的缩放基础增量（可选实现，或者和开关合并提供 关闭、0.05、0.1、0.15、0.2 四个选项））</h1> -->
        </div>

        <div class="character-setting-fold-down" v-if="hadFold" @click="hadFold = false">
            <el-icon class="el-icon--right">
                <arrow-down />
            </el-icon>
        </div>
    </div>
</template>

<style scoped>
.character-setting-fold{
    display: flex;
    align-items: center;
    background-color: var(--liyin-char-bg-color);
}

.character-setting{
    flex: 1 0 0;
    /* width: 100%; */
    /* height:40px;  */
    background-color: var(--liyin-char-bg-color);;
    display: flex;
    /* justify-content: center; */
    align-items: center;
    position: relative;
}
.character-setting.warp{
    flex-wrap: wrap;
}
.character-setting.nowarp{
    flex-wrap: nowrap;
    overflow-y: hidden;
    overflow-x: auto;
    scrollbar-width: none;  /* 隐藏 Firefox 浏览器的滚动条 */
    -ms-overflow-style: none;  /* 隐藏 IE/Edge 浏览器的滚动条 */
}

.character-setting.nowarp::-webkit-scrollbar {
  width: 0px;  /* 隐藏 Chrome 浏览器的滚动条 */
}

.select-demo-block {
    /* min-width: 220px;
    max-width: 250px; */
    height: 40px;
    margin: 0 10px;
    display: flex;
    align-items: center; 
}


.select-demo-block .demonstration {
    width: 60px;
    font-size: 14px;
    color: var(--liyin-char-text-color);
    line-height: 40px;
    /* flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap; */
    margin-bottom: 0;
    margin-right: 12px;
    user-select: none;
}

.switch-demo-block {
    /* min-width: 120px;   
    max-width: 160px; */
    height: 40px;
    margin: 0 10px;
    display: flex;
    align-items: center;
}

.switch-demo-block .el-switch__inner .is-text{
    color: var(--liyin-char-button-bg-color);
}
.switch-demo-block .el-switch__action{
    background-color: var(--liyin-char-button-bg-color);
}

.switch-demo-block .demonstration {
    width: 60px;
    font-size: 14px;
    color: var(--liyin-char-text-color);;
    line-height: 40px;
    /* flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap; */
    margin-bottom: 0;
    margin-right: 12px;
    user-select: none;
}

.slider-demo-block {
    /* min-width: 250px;
    max-width: 300px; */
    height: 40px;
    /* width: 270px; */
    display: flex;
    align-items: center;
    margin: 0 10px;
}

.slider-demo-block .el-slider {
  margin-top: 0;
  /* margin-left: 12px; */
  --el-slider-main-bg-color: #DBC291;
}

.slider-demo-block .el-slider__button{
    background-color: var(--liyin-char-button-bg-color);
}

.slider-demo-block .demonstration {
  width: 60px;
  /* min-width: 60px; */
  font-size: 14px;
  color: var(--liyin-char-text-color);
  line-height: 40px;
  /* flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap; */
  margin-bottom: 0;
  margin-right: 12px;
  user-select: none;
}

/* .slider-demo-block .demonstration + .el-slider {
  flex: 0 0 70%;
} */
.character-setting-fold-up{
    display: flex; 
    justify-content: end; 
    flex:1 0 0; 
    height: 40px; 
    align-items: center; 
    cursor: pointer;
    color: var(--liyin-arrow-color);
}

.character-setting-fold-down{
    height: 40px; 
    width: 40px; 
    display: flex; 
    justify-content: center; 
    align-items: center; 
    cursor: pointer; 
    background-color: var(--liyin-char-bg-color);
    color: var(--liyin-arrow-color);
}

</style>