<script setup>
import { useIsMobileStore } from '@/stores/isMobile'
import { storeToRefs } from 'pinia'

const isMobileStore = useIsMobileStore()
const { isMobile } = storeToRefs(isMobileStore)

const updateLogInfo = [
    {
        version: '2.3.3', 
        date: '2024-06-20', 
        title: '更新 stardb-exporter 程序蓝奏云下载链接，使用此导入功能的需要重新下载此文件',
        changes: '<ul style="padding-left: 10px;"><li>更新 stardb-exporter 程序蓝奏云下载链接，使用此导入功能的需要重新下载此文件</ul>' 
    },
    { 
        version: '2.3.2', 
        date: '2024-06-19', 
        title: '修正“客随主便”、“主随客便”为多选一成就，优化成就导入功能性能问题',
        changes: '<ul style="padding-left: 10px;"><li>修正“客随主便”、“主随客便”为多选一成就</li><li>优化成就导入功能性能问题</li></ul>' 
    },
    { 
        version: '2.3.1', 
        date: '2024-06-18', 
        title: '修正 2.4 前瞻角色相关数据',
        changes: '<ul style="padding-left: 10px;"><li>修正 2.4 前瞻角色相关数据</li></ul>' 
    },
    { 
        version: '2.3.0', 
        date: '2024-06-17', 
        title: '更新 2.3 版本成就相关数据',
        changes: '<ul style="padding-left: 10px;"><li>更新 2.3 版本成就相关数据</li></ul>' 
    },
    { 
        version: '2.2.7', 
        date: '2024-06-16', 
        title: '新增 Stardb-exporter 导入功能',
        changes: '<ul style="padding-left: 10px;"><li>新增 Stardb-exporter 导入功能<br>通过该功能可以快捷导入星穹铁道游戏内的成就数据</li></ul>' 
    },
    { 
        version: '2.2.6', 
        date: '2024-06-12', 
        title: '新增成就全选本页二次确认功能',
        changes: '<ul style="padding-left: 10px;"><li>新增成就全选本页二次确认功能<br>通过该功能可以避免误触导致成就数据丢失<br>你可以在设置界面选择开启或者关闭该功能</li></ul>' 
    },
    { 
        version: '2.2.5', 
        date: '2024-06-09', 
        title: '新增角色总数悬浮窗, 新增显示对应阵营角色设置，新增 2.4 前置角色信息',
        changes: '<ul style="padding-left: 10px;"><li>新增角色总数悬浮窗，方便各位了解筛选后的角色数据，其中去重是指切换角色只计入一次（如开拓者、三月七等）</li><li>新增角色界面显示对应阵营角色设置</li><li>新增 2.4 前置角色信息，具体角色为：云璃、椒丘、三月七-巡猎</li></ul>' 
    },
    { 
        version: '2.2.4', 
        date: '2024-06-05', 
        title: '新增本页成就悬浮窗, 新增 祈鸢ya 的 1.0 ~ 2.1 相关攻略',
        changes: '<ul style="padding-left: 10px;"><li>新增本页成就悬浮窗，方便各位了解筛选后的成就数据，也可以通过它了解各版本各系列成就新增的成就数据</li><li>新增 祈鸢ya 的 1.0 ~ 2.1 相关攻略，一位非常优秀的原神及星铁攻略up主，大家可以关注一下</li></ul>' 
    },
    { 
        version: '2.2.3', 
        date: '2024-06-01', 
        title: '新增更新日志，新增 祈鸢ya 的相关攻略，新增显示对应版本角色设置，修改成就攻略界面样式, 修改开拓者为非跃迁类别',
        changes: '<ul style="padding-left: 10px;"><li>新增更新日志</li><li>新增 祈鸢ya 的相关攻略，一位非常优秀的原神及星铁攻略up主，大家可以关注一下<br>【注：目前只上传了 2.2 版本的成就攻略，其他攻略后面陆续补充】</li><li>新增角色界面显示对应版本角色设置</li><li>修改成就攻略界面部分样式，支持查看作者主页</li><li>修改开拓者为非跃迁类别</li></ul>' 
    },
    { 
        version: '2.2.2', 
        date: '2024-05-29', 
        title: '新增角色界面显示角色相关设置，修改成就及角色界面部分样式',
        changes: '<ul style="padding-left: 10px;"><li>新增角色界面显示角色相关设置</li><li>修改成就及角色界面部分样式</li></ul>' 
    },
    { 
        version: '2.2.1', 
        date: '2024-05-19', 
        title: '新增主题颜色切换功能，新增修改账号头像的功能，新增角色界面，新增折叠功能，新增缓存机制，新增教程视跳转链接',
        changes: '<ul style="padding-left: 10px;"><li>新增主题颜色切换功能</li><li>新增修改账号头像的功能</li><li>新增角色界面</li><li>新增折叠功能</li><li>新增缓存机制</li><li>新增教程视频跳转链接</li></ul>' 
    },
    { 
        version: '2.2.0', 
        date: '2024-05-08', 
        title: '更新 2.2 版本成就相关数据',
        changes: '<ul style="padding-left: 10px;"><li>更新 2.2 版本成就相关数据</li></ul>' 
    },
    { 
        version: '更早', 
        date: '更早', 
        title: '无相关记录',
        changes: '<ul style="padding-left: 10px;"><li>无相关记录</li></ul>' 
    },
]

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

.update-log-changes li {
    margin: 5px 0;
}
</style>