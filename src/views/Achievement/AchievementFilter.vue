<script setup>
import { useAchievementStore } from '@/stores/achievement';

const achievementStore = useAchievementStore();

const isMobile = window.matchMedia('(max-width: 768px)').matches
</script>

<template>
    <div class="achievement-filter">
        <div class="achievement-filter-left">
            <div class="achievement-filter-search-input">
                <el-input
                    v-model="achievementStore.searchContent"
                    class="achievement-filter-search-el-input"
                    :size= 'isMobile ? "default" : "large"'
                    placeholder="搜索成就名、成就描述"
                />
            </div>
            <div class="achievement-filter-select-input">
                <el-select
                v-model="achievementStore.showVersionList"
                multiple
                collapse-tags
                collapse-tags-tooltip
                placeholder="显示所有版本"
                style="width: 150px"
                :size= 'isMobile ? "default" : "large"'
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
            <div class="achievement-filter-checkbox-input">
                <el-checkbox v-model="achievementStore.hiddenCompleted" label="隐藏已完成成就" :size= 'isMobile ? "default" : "large"' />   
            </div>
            <div class="achievement-filter-checkbox-input">
                <el-checkbox v-model="achievementStore.hiddenNotAvailable" label="隐藏暂不可获得成就" :size= 'isMobile ? "default" : "large"' />   
            </div>
            <div class="achievement-filter-checkbox-input">
                <el-checkbox v-model="achievementStore.incompletePriority" label="未完成成就优先" :size= 'isMobile ? "default" : "large"' />   
            </div>
            <div class="achievement-filter-checkbox-input">
                <el-checkbox v-model="achievementStore.selectAll" :label="achievementStore.showSeriesId === 5 ||  achievementStore.showSeriesId === 0 ? '全选本页(多选一成就除外)' : '全选本页'" :size= 'isMobile ? "default" : "large"'  @click="achievementStore.handleSelectAll($event)"/>
                <!-- <el-checkbox v-model="achievementStore.selectAll" v-if="achievementStore.showSeriesId === 5" label='全选本页(多选一成就除外)' :size= 'isMobile ? "default" : "large"'  @click="achievementStore.handleSelectAll($event)"/>       -->
            </div>
        </div>
    </div>
</template>

<style>
.achievement-filter{
    padding: 15px 0;
    display: flex;
    position: sticky;
    top: 0;
    z-index: 100;
}
.achievement-filter-left{
    display: flex;
    margin: 0 4px 0 10px;
    flex: 2 0 0;
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
    flex-wrap: wrap; 
    flex: 3 0 0;
    /* margin: 0 10px; */
}
.achievement-filter-checkbox-input {
    margin: 0 4px 0 10px;
}
@media (max-width: 1100px) {
    .achievement-filter {
        flex-direction: column;
        padding: 15px 0 0 0;
    }
    .achievement-filter-checkbox-input {
        flex: 1 0 0;
    }
}
@media (max-width: 640px){
    .achievement-filter-checkbox-input {
        flex: 1 0 calc(50% - 14px);
    }
}
@media (max-width: 500px){
    .achievement-filter-checkbox-input:nth-child(2n) {
        flex: 1 0 calc(60% - 14px);
    }
    .achievement-filter-checkbox-input:nth-child(2n+1) {
        flex: 1 0 calc(40% - 14px);
    }
}
@media (max-width: 768px){
    .achievement-filter{
        padding: 8px 0 0 0;
    }
}
</style>