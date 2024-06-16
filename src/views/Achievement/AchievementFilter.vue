<script setup>
import { ArrowDown, ArrowUp } from '@element-plus/icons-vue'
import { ElMessageBox } from 'element-plus'
import { useAchievementStore } from '@/stores/achievement';
import { useIsMobileStore } from '@/stores/isMobile'
import { useSettingStore } from '@/stores/setting'
import { ref, onMounted, watch } from 'vue';
import { storeToRefs } from 'pinia';

const achievementStore = useAchievementStore();

const isMobileStore = useIsMobileStore()
const { isMobile } = storeToRefs(isMobileStore)

const settingStore = useSettingStore()
const { achievementSelectAllSecondConfirmation } = storeToRefs(settingStore)

const confirmSelectAll = (event) => {
    // 阻止原生点击事件的默认行为
    event.preventDefault();
    event.stopPropagation();

    if(achievementSelectAllSecondConfirmation.value) {
        const operation = achievementStore.selectAll ? '取消全选' : '全选';

        ElMessageBox.confirm(
            `确认进行 <strong>${operation}</strong> 本页成就?`,
            '确认操作',
            {
            confirmButtonText: '确认',
            cancelButtonText: '取消',
            dangerouslyUseHTMLString: true,
            }
        )
        .then(() => {
            achievementStore.handleSelectAll();
        })
        .catch(() => {

        });
    }

    else {
        achievementStore.handleSelectAll();
    }
}

// 设置行相关折叠功能
const hadFold = ref(false)

//获取折叠缓存
const getAchievementFilterFold = () => {
    // 从缓存中读取名为 "AchievementFilterFold" 的数据
    const tempAchievementFilterFold = localStorage.getItem("AchievementFilterFold")

    // 检查是否存在名为 "AchievementFilterFold" 的数据
    if (tempAchievementFilterFold !== null) {
        // 数据存在，将其从字符串转换为对象
        hadFold.value = JSON.parse(tempAchievementFilterFold)
    } else {
        // 数据不存在，执行相应的操作
        hadFold.value = false
    }
}
//保存折叠缓存
const saveAchievementFilterFold = () => {
    // 将对象转换为字符串，并将其存储在缓存中
    localStorage.setItem("AchievementFilterFold", JSON.stringify(hadFold.value))
}

onMounted(() => {
    getAchievementFilterFold()
})

watch(hadFold, saveAchievementFilterFold)

let isFilterDragging = false;
let FilterStartX = 0;

const startFilterDrag = (event) => {
    isFilterDragging = true;
    FilterStartX = event.clientX;
}

const handleFilterDrag = (event) => {
    const FilterContainer = document.getElementById('achievement-filter')

    if (isFilterDragging) {
        const deltaX = event.clientX - FilterStartX;

        FilterContainer.scrollLeft -= deltaX;

        FilterStartX = event.clientX;
    }
}

const endFilterDrag = () => {
    isFilterDragging = false;
}

const handleFilterScroll = (event) => {
    // 阻止默认的滚动行为，以免影响整个页面的滚动
    event.preventDefault();
    
    // 根据鼠标滚轮的 deltaY 属性来判断滚动方向
    const delta = Math.max(-1, Math.min(1, event.deltaY));
    
    // 根据滚动方向来控制滚动
    const container = document.getElementById('achievement-filter');
    container.scrollLeft += delta * 100; // 根据需要调整滚动速度
}

</script>

<template>
    <div class="achievement-filter-fold" :class="{'achievement-filter-fold-open': hadFold}">
        <div class="achievement-filter" id="achievement-filter"
            @wheel="handleFilterScroll"
        > 
        <!-- @mousedown="startFilterDrag" @mousemove="handleFilterDrag" @mouseup="endFilterDrag" @mouseleave="endFilterDrag" -->
            <div class="achievement-filter-left">
                <div class="achievement-filter-search-input" :class="{'achievement-filter-flex': !hadFold}">
                    <el-input
                        v-model="achievementStore.searchContent"
                        class="achievement-filter-search-el-input"
                        size= "default"
                        placeholder="搜索成就名、成就描述"
                    />
                </div>
                <div class="achievement-filter-select-input" :class="{'achievement-filter-flex achievement-filter-version': !hadFold}">
                    <el-select
                    v-model="achievementStore.showVersionList"
                    multiple
                    collapse-tags
                    collapse-tags-tooltip
                    placeholder="显示所有版本"
                    style="width: 150px"
                    size= "default"
                    >
                        <el-option
                            v-for="item in achievementStore.selectVersionList"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                        />
                    </el-select>
                </div>
            </div>
            <div class="achievement-filter-checkbox">
                <div class="achievement-filter-checkbox-input" :class="{'achievement-filter-flex': !hadFold}">
                    <el-checkbox v-model="achievementStore.hiddenCompleted" label="隐藏已完成成就" :size= 'isMobile ? "default" : "large"' />   
                </div>
                <div class="achievement-filter-checkbox-input" :class="{'achievement-filter-flex': !hadFold}">
                    <el-checkbox v-model="achievementStore.hiddenNotAvailable" label="隐藏暂不可获得成就" :size= 'isMobile ? "default" : "large"' />   
                </div>
                <div class="achievement-filter-checkbox-input" :class="{'achievement-filter-flex': !hadFold}">
                    <el-checkbox v-model="achievementStore.incompletePriority" label="未完成成就优先" :size= 'isMobile ? "default" : "large"' />   
                </div>
                <div class="achievement-filter-checkbox-input" :class="{'achievement-filter-flex': !hadFold}">
                    <el-checkbox v-model="achievementStore.selectAll" :label="[0, 3, 5].includes(achievementStore.showSeriesId) ? '全选本页(多选一成就除外)' : '全选本页'" :size= 'isMobile ? "default" : "large"'  @click="confirmSelectAll"/>
                    <!-- <el-checkbox v-model="achievementStore.selectAll" v-if="achievementStore.showSeriesId === 5" label='全选本页(多选一成就除外)' :size= 'isMobile ? "default" : "large"'  @click="achievementStore.handleSelectAll($event)"/>       -->
                    <div class="achievement-filter-fold-up" v-if="!hadFold" @click="hadFold = true">
                        <el-icon class="el-icon--right">
                            <arrow-up />
                        </el-icon>
                    </div>
                </div>
            </div>
        </div>
        <div class="achievement-filter-fold-down" v-if="hadFold"  @click="hadFold = false">
            <el-icon class="el-icon--right">
                <arrow-down />
            </el-icon>
        </div>
    </div>
</template>

<style>
.achievement-filter-fold{
    display: flex;
    align-items: center;
    flex-wrap: nowrap;
    padding: 10px 0;
}

.achievement-filter{
    display: flex;
    position: sticky;
    top: 0;
    z-index: 100;
    flex: 1 0 0;
    scrollbar-width: none;  /* 隐藏 Firefox 浏览器的滚动条 */
    -ms-overflow-style: none;  /* 隐藏 IE/Edge 浏览器的滚动条 */
}
.achievement-filterr::-webkit-scrollbar {
    width: 0px;  /* 隐藏 Chrome 浏览器的滚动条 */
}
.achievement-filter-fold.achievement-filter-fold-open .achievement-filter{
    flex-direction: row;
    flex-wrap: nowrap;
    overflow-y: hidden;
    overflow-x: auto;
}
.achievement-filter-left{
    display: flex;
    margin: 0 4px 0 10px;
    flex: 2 0 0;
    align-items: center;
    flex-wrap: nowrap;
}
.achievement-filter-fold.achievement-filter-fold-open .achievement-filter-left{
    flex-direction: row;
    flex-wrap: nowrap;
}
.achievement-filter-search-input{
    min-width: 210px;
    flex: 1 0 0;
    margin-right: 5px;
}
.achievement-filter-search-el-input .el-input__inner {
    padding-left: 25px;
    background-image: url('@/images/search.png');
    background-position: left center;
    background-repeat: no-repeat;
    background-size: 14px 14px;
}
.achievement-filter-checkbox{
    display: flex;
    align-items: center;
    flex-wrap: wrap; 
    flex: 3 0 0;
    /* margin: 0 10px; */
}
.achievement-filter-fold.achievement-filter-fold-open .achievement-filter-checkbox{
    flex-direction: row;
    flex-wrap: nowrap;
}
.achievement-filter-checkbox-input {
    display: flex;
    margin: 0 4px 0 10px;
}
.achievement-filter-checkbox-input:nth-child(4) {
    flex: 1 0 0;
}

.achievement-filter-fold-up{
    display: flex; 
    justify-content: end; 
    flex:1 0 0; 
    align-items: center; 
    cursor: pointer;
    color: var(--liyin-arrow-color);
}
.achievement-filter-fold-down{
    height: 40px;
    display: flex; 
    justify-content: center; 
    align-items: center; 
    cursor: pointer; 
    color: var(--liyin-arrow-color);
    margin-right: 4px;
}
@media (max-width: 1260px) {
    .achievement-filter-fold{
        padding: 14px 0 7px 0;
    }
    .achievement-filter-fold.achievement-filter-fold-open{
        padding: 10px 0;
    }
    .achievement-filter {
        flex-direction: column;
        /* padding: 15px 0 0 0; */
    }
    .achievement-filter-checkbox-input.achievement-filter-flex {
        flex: 1 0 0;
    }
}
@media (max-width: 820px){
    .achievement-filter-checkbox-input.achievement-filter-flex {
        flex: 1 0 calc(50% - 14px);
    }
}
@media (max-width: 768px){
    .achievement-filter-checkbox-input.achievement-filter-flex {
        flex: 1 0 0;
    }
}
@media (max-width: 670px){
    .achievement-filter-checkbox-input.achievement-filter-flex {
        flex: 1 0 calc(50% - 14px);
    }
}
@media (max-width: 500px){
    .achievement-filter-checkbox-input.achievement-filter-flex:nth-child(2n) {
        flex: 1 0 calc(60% - 14px);
    }
    .achievement-filter-checkbox-input.achievement-filter-flex:nth-child(2n+1) {
        flex: 1 0 calc(40% - 14px);
    }
}
@media (max-width: 400px){
    .achievement-filter-checkbox-input.achievement-filter-flex:nth-child(2n) {
        flex: 1 0 calc(60% - 14px);
    }
    .achievement-filter-checkbox-input.achievement-filter-flex:nth-child(2n+1) {
        flex: 1 0 calc(30% - 14px);
    }
    .achievement-filter-left{
        flex-wrap: wrap;
    }
    .achievement-filter-fold.achievement-filter-fold-open .achievement-filter-left{
        flex-wrap: nowrap;
    }
}
@media (max-width: 384px){
    .achievement-filter-version{
        padding-top: 5px;
    }
}
@media (max-width: 365px){
    .achievement-filter-checkbox-input.achievement-filter-flex:nth-child(n) {
        flex: 1 0 calc(60% - 14px);
    }
}
@media (max-width: 768px){
    .achievement-filter-fold{
        padding: 4px 0 1px 0;
    }
    .achievement-filter-fold.achievement-filter-fold-open{
        padding: 0;
    }
}
</style>