<script setup>
import { useUpdateLogStore } from '@/stores/updateLog';

import { useIsMobileStore } from '@/stores/isMobile'
import { storeToRefs } from 'pinia'

const updateLogStore = useUpdateLogStore()
const { updateLogInfo } = updateLogStore

const isMobileStore = useIsMobileStore()
const { isMobile } = storeToRefs(isMobileStore)

</script>

<template>
    <el-popover
        :placement="isMobile ? 'bottom' : 'bottom-start'"
        :width="isMobile ? '80%' : '50%'"
        trigger="hover"
    >
        <template #reference>
            <div class="update-log">
                <el-alert :title="`${ updateLogInfo[0].date}： ${ updateLogInfo[0].title}`" type="warning" show-icon :closable="false"/>
            </div>
        </template>
        <el-table :data="updateLogInfo" :max-height="300" border table-layout="auto" >
            <el-table-column type="expand">
                <template #default="props">
                    <div class="update-log-changes" v-html="props.row.changes"></div>
                </template>
            </el-table-column>
            <el-table-column property="version" sortable label="版本" />
            <el-table-column property="date" sortable label="日期" />
        </el-table>
    </el-popover>
</template>

<style>
.update-log {
    margin: 10px 10px 0 10px;
}
.update-log-changes {
    margin: 5px 15px;
}

.update-log-changes ul {
    padding-left: 10px;
}

.update-log-changes li {
    margin: 5px 0;
}
</style>