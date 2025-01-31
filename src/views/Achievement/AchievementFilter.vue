<script setup>
import { ArrowDown, ArrowUp, Filter, Search } from '@element-plus/icons-vue'
import { ElMessageBox } from 'element-plus'
import { useAchievementSelectAllStore } from '@/stores/achievementSelectAll';
import { useAchievementShowSeriesStore } from '@/stores/achievementShowSeries'
import { useAchievementFelterStore } from '@/stores/achievementFelter';
import { useIsMobileStore } from '@/stores/isMobile'
import { useAchievementSettingStore } from '@/stores/achievementSetting'
import { ref, onMounted, watch } from 'vue';
import { storeToRefs } from 'pinia';

const achievementSelectAllStore = useAchievementSelectAllStore();
const { selectAll } = storeToRefs(achievementSelectAllStore);
const { handleSelectAll } = achievementSelectAllStore;

const achievementShowSeriesStore = useAchievementShowSeriesStore()
const { showSeriesId } = storeToRefs(achievementShowSeriesStore)

const achievementFelterStore = useAchievementFelterStore();
const { showHiddenType, showRewardType, showCompletedType, showAvailableType, showVersionList, selectVersionList, hadFilter, searchContent, incompletePriority, } = storeToRefs(achievementFelterStore);
const { selectHiddenList, selectRewardList, selectCompletedList, selectAvailableList } = achievementFelterStore

const isMobileStore = useIsMobileStore()
const { isMobile } = storeToRefs(isMobileStore)

const settingStore = useAchievementSettingStore()
const { achievementSelectAllSecondConfirmation } = storeToRefs(settingStore)

const confirmSelectAll = (event) => {
    // 阻止原生点击事件的默认行为
    event.preventDefault();
    event.stopPropagation();

    if(achievementSelectAllSecondConfirmation.value) {
        const operation = selectAll ? '取消全选' : '全选';

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
            handleSelectAll();
        })
        .catch(() => {

        });
    }

    else {
        handleSelectAll();
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

// 设置筛选按钮的点击状态
const hadFilterClicked = ref(false)

</script>

<template>
    <div class="achievement-filter-fold" :class="{'achievement-filter-fold-open': hadFold}">
        <div class="achievement-filter" id="achievement-filter"
            @wheel="handleFilterScroll"
        > 
        <!-- @mousedown="startFilterDrag" @mousemove="handleFilterDrag" @mouseup="endFilterDrag" @mouseleave="endFilterDrag" -->
            <div class="achievement-filter-left">
                <el-popover placement="bottom-start" width="fit-content" trigger="click" popper-style="padding: 5px 12px;" @show="hadFilterClicked = true" @hide="hadFilterClicked = false">
                    <template #reference>
                        <el-icon class="achievement-filter-icon" :class="{'clicked': hadFilterClicked, 'filtered': hadFilter}">
                            <Filter />
                        </el-icon>
                    </template>
                    <div class="achievement-filter-segmented">
                        <div>显示奖励类型：</div>
                        <el-segmented v-model="showRewardType" :options="selectRewardList" black :size="isMobile ? 'small' : 'default'" :style="`font-size: ${isMobile ? 13 : 14}px;`">
                        </el-segmented>
                    </div>
                    <div class="achievement-filter-segmented">
                        <div>显示隐藏类型：</div>
                        <el-segmented v-model="showHiddenType" :options="selectHiddenList" black :size="isMobile ? 'small' : 'default'" :style="`font-size: ${isMobile ? 13 : 14}px;`"></el-segmented>
                    </div>
                    <div class="achievement-filter-segmented">
                        <div>显示完成类型：</div>
                        <el-segmented v-model="showCompletedType" :options="selectCompletedList" black :size="isMobile ? 'small' : 'default'" :style="`font-size: ${isMobile ? 13 : 14}px;`"></el-segmented>
                    </div>
                    <div class="achievement-filter-segmented">
                        <div>显示获取类型：</div>
                        <el-segmented v-model="showAvailableType" :options="selectAvailableList" black :size="isMobile ? 'small' : 'default'" :style="`font-size: ${isMobile ? 13 : 14}px;`"></el-segmented>
                    </div>
                </el-popover>
                <div class="achievement-filter-search-input" :class="{'achievement-filter-flex': !hadFold}">
                    <el-input
                        v-model="searchContent"
                        class="achievement-filter-search-el-input"
                        size= "default"
                        placeholder="搜索成就名、成就描述"
                        :prefix-icon="Search"
                    />
                </div>
                <div class="achievement-filter-select-input" :class="{'achievement-filter-flex achievement-filter-version': !hadFold}">
                    <el-select
                    v-model="showVersionList"
                    multiple
                    collapse-tags
                    collapse-tags-tooltip
                    placeholder="显示所有版本"
                    style="width: 150px"
                    size= "default"
                    >
                        <el-option
                            v-for="item in selectVersionList"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                        />
                    </el-select>
                </div>
            </div>
            <div class="achievement-filter-checkbox">
                <div class="achievement-filter-checkbox-input" :class="{'achievement-filter-flex': !hadFold}">
                    <el-checkbox v-model="incompletePriority" label="未完成成就优先" :size= 'isMobile ? "default" : "large"' />   
                </div>
                <div class="achievement-filter-checkbox-input" :class="{'achievement-filter-flex': !hadFold}">
                    <el-checkbox v-model="selectAll" :label="[0, 3, 5].includes(showSeriesId) ? '全选本页(多选一成就除外)' : '全选本页'" :size= 'isMobile ? "default" : "large"'  @click="confirmSelectAll"/>
                    <div style="flex:1 0 0"></div>
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
    /* flex: 2 0 0; */
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
.achievement-filter-search-el-input .el-input__prefix .el-input__icon {
    width: 16px;
    height: 16px;
}
.achievement-filter-search-el-input .el-input__prefix .el-input__icon svg {
    width: 16px;
    height: 16px;
}
.achievement-filter-icon{
    width: 30px;
    height: 30px;
    border: 1px solid var(--liyin-button-border-color);
    border-radius: 4px;
    margin: 0 5px 0 0;
    cursor: pointer;
    text-align: center;
    color: var(--el-text-color-placeholder);
    background-color: var(--el-fill-color-blank)
}
.achievement-filter-icon:hover{
    border: 1px solid var(--el-border-color-hover);
}
.achievement-filter-icon.filtered{
    color: var(--el-color-primary);
}
.achievement-filter-icon.clicked{
    border: 1px solid var(--el-color-primary);
    color: var(--el-color-primary);
}
.achievement-filter-segmented{
    display: flex;
    align-items: center;
    margin: 5px 0;
    font-size: 14px;
}
.achievement-filter-checkbox{
    display: flex;
    align-items: center;
    flex-wrap: wrap; 
    flex: 1 0 0;
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
.achievement-filter-checkbox-input:nth-child(2) {
    flex: 1 0 0;
}

.achievement-filter-fold-up{
    display: flex; 
    justify-content: end; 
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
@media (max-width: 940px) {
    .achievement-filter-fold{
        padding: 14px 0 7px 0;
    }
    .achievement-filter-fold.achievement-filter-fold-open{
        padding: 10px 0;
    }
    .achievement-filter {
        flex-direction: column;
    }
    .achievement-filter-checkbox-input.achievement-filter-flex {
        flex: 1 0 0;
    }
}
@media (max-width: 430px){
    .achievement-filter-left{
        flex-wrap: wrap;
    }
    .achievement-filter-fold.achievement-filter-fold-open .achievement-filter-left{
        flex-wrap: nowrap;
    }
}
@media (max-width: 421px){
    .achievement-filter-version{
        padding-top: 5px;
    }
}
@media (max-width: 768px){
    .achievement-filter-fold{
        padding: 4px 0 1px 0;
    }
    .achievement-filter-fold.achievement-filter-fold-open{
        padding: 0;
    }
    .achievement-filter-segmented{
        font-size: 13px;
    }
}
</style>