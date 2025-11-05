import {ref, watchEffect } from 'vue'
import { defineStore } from 'pinia'

export const useUpdateLogStore = defineStore('updateLog', () => {
    const updateLogInfo = [
        {
            version: '3.7.0', 
            date: '2025-11-05', 
            title: '更新 3.7 版本成就相关数据，更新 3.7 版本角色相关数据',
            changes: '<ul><li>更新 3.7 版本成就相关数据</li><li>更新 3.7 版本角色相关数据</li></ul>' 
        },
        {
            version: '3.6.1', 
            date: '2025-09-25', 
            title: '更新 3.6 版本角色相关数据',
            changes: '<ul><li>更新 3.6 版本角色相关数据</li></ul>' 
        },
        {
            version: '3.6.0', 
            date: '2025-09-24', 
            title: '更新 3.6 版本成就相关数据',
            changes: '<ul><li>更新 3.6 版本成就相关数据</li></ul>' 
        },
        {
            version: '3.5.1', 
            date: '2025-08-13', 
            title: '更新 3.5 版本角色相关数据',
            changes: '<ul><li>更新 3.5 版本角色相关数据</li></ul>' 
        },
        {
            version: '3.5.0', 
            date: '2025-08-13', 
            title: '更新 3.5 版本成就相关数据',
            changes: '<ul><li>更新 3.5 版本成就相关数据</li></ul>' 
        },
        {
            version: '3.4.6', 
            date: '2025-07-14', 
            title: '成就攻略界面新增其他攻略跳转引导',
            changes: '<ul><li>成就攻略界面新增其他攻略跳转引导：包括米游社及bilibili</li></ul>' 
        },
        {
            version: '3.4.5', 
            date: '2025-07-14', 
            title: '修复特殊情况下成就系列无法显示的异常',
            changes: '<ul><li>修复特殊情况下成就系列无法显示的异常</li></ul>' 
        },
        {
            version: '3.4.4', 
            date: '2025-07-13', 
            title: '新增隐藏完成成就系列功能',
            changes: '<ul><li>新增隐藏完成成就系列功能<br>可在成就界面设置中进行设置<br>用于控制隐藏所有成就已完成的系列</li></ul>' 
        },
        {
            version: '3.4.3', 
            date: '2025-07-12', 
            title: '修复特殊情况下成就搜索框无法进行搜索的异常',
            changes: '<ul><li>修复特殊情况下成就搜索框无法进行搜索的异常</li></ul>' 
        },
        {
            version: '3.4.2', 
            date: '2025-07-12', 
            title: '更新 3.4 版本成就部分缺失数据',
            changes: '<ul><li>更新 3.4 版本成就部分缺失数据</li></ul>' 
        },
        {
            version: '3.4.1', 
            date: '2025-07-07', 
            title: '更新 3.4 版本角色相关数据',
            changes: '<ul><li>更新 3.4 版本角色相关数据</li></ul>' 
        },
        {
            version: '3.4.0', 
            date: '2025-07-03', 
            title: '更新 3.4 版本成就相关数据',
            changes: '<ul><li>更新 3.4 版本成就相关数据</li></ul>' 
        },
        {
            version: '3.3.1', 
            date: '2025-05-23', 
            title: '更正 3.3 版本联动角色数据',
            changes: '<ul><li>更正 3.3 版本联动角色数据</li></ul>' 
        },
        {
            version: '3.3.0', 
            date: '2025-05-19', 
            title: '更新 3.3 版本成就相关数据，更新 3.3 版本角色相关数据，调整角色显示列表的排布样式',
            changes: '<ul><li>更新 3.3 版本成就相关数据</li><li>更新 3.3 版本角色相关数据</li><li>调整角色显示列表的排布样式</li></ul>' 
        },
        {
            version: '3.2.2', 
            date: '2025-04-28', 
            title: '优化网络请求超时的异常反馈逻辑，优化邮箱格式校验逻辑',
            changes: '<ul><li>优化网络请求超时的异常反馈逻辑</li><li>优化邮箱格式校验逻辑</li></ul>' 
        },
        {
            version: '3.2.1', 
            date: '2025-04-13', 
            title: '修复部分情况下登录数据云同步账号后异常卡死的问题',
            changes: '<ul><li>修复部分情况下登录数据云同步账号后异常卡死的问题</li></ul>' 
        },
        {
            version: '3.2.0', 
            date: '2025-04-07', 
            title: '更新 3.2 版本成就相关数据',
            changes: '<ul><li>更新 3.2 版本成就相关数据</li></ul>' 
        },
        {
            version: '3.1.1', 
            date: '2025-04-05', 
            title: '新增云数据同步功能，更新 3.1、3.2 版本角色相关数据',
            changes: '<ul><li>新增云数据同步功能</li><li>更新 3.1、3.2 版本角色相关数据</li></ul>' 
        },
        {
            version: '3.1.0', 
            date: '2025-02-24', 
            title: '更新 3.1 版本成就相关数据，新增更新日志弹窗',
            changes: '<ul><li>更新 3.1 版本成就相关数据 </li><li>新增更新日志弹窗</li></ul>' 
        },
        {
            version: '3.0.3', 
            date: '2025-02-02', 
            title: '新增 cookie 导入成就功能及自动 cookie 导入成就功能，新增本页成就悬浮窗口隐藏功能，新增显示分支类型的成就筛选功能',
            changes: '<ul><li>新增 cookie 导入成就功能</li><li>新增自动 cookie 导入成就功能</li><li>成就设置新增设置 cookie 导入二次确认功能</li><li>新增本页成就悬浮窗口隐藏功能</li><li>新增显示分支类型的成就筛选功能</li></ul>' 
        },
        {
            version: '3.0.2', 
            date: '2025-01-23', 
            title: 'stardb 导入识别兼容新版 stardb-exporter 提取的数据',
            changes: '<ul><li>stardb 导入识别兼容新版 stardb-exporter 提取的数据</li></ul>' 
        },
        {
            version: '3.0.1', 
            date: '2025-01-16', 
            title: '移除阿格莱雅相关战斗成就的暂不可获得状态',
            changes: '<ul><li>移除阿格莱雅相关战斗成就的暂不可获得状态</li></ul>' 
        },
        {
            version: '3.0.0', 
            date: '2025-01-15', 
            title: '更新 3.0 版本成就相关数据，更新 3.0 版本角色相关数据',
            changes: '<ul><li>更新 3.0 版本成就相关数据 </li><li>更新 3.0 版本角色相关数据</li></ul>' 
        },
        {
            version: '2.7.0', 
            date: '2024-12-04', 
            title: '更新 2.7 版本成就相关数据，更新 2.7 版本角色相关数据',
            changes: '<ul><li>更新 2.7 版本成就相关数据 </li><li>更新 2.7 版本角色相关数据</li></ul>' 
        },
        {
            version: '2.6.0', 
            date: '2024-10-23', 
            title: '更新 2.6 版本成就相关数据，更新 2.6 版本角色相关数据',
            changes: '<ul><li>更新 2.6 版本成就相关数据 </li><li>更新 2.6 版本角色相关数据</li></ul>' 
        },
        {
            version: '2.5.2', 
            date: '2024-09-24', 
            title: '修复设置为暂不可获取成就后，再次设置为可获取成就时，成就状态在全新加载界面后会自动恢复为未完成的问题',
            changes: '<ul><li>修复设置为暂不可获取成就后，再次设置为可获取成就时，成就状态在全新加载界面后会自动恢复为未完成的问题</li></ul>' 
        },
        {
            version: '2.5.1', 
            date: '2024-09-10', 
            title: '修正成就 棉花糖兔子 为可获得成就',
            changes: '<ul><li>修正成就 棉花糖兔子 为可获得成就</li></ul>' 
        },
        {
            version: '2.5.0', 
            date: '2024-09-09', 
            title: '更新 2.5 版本成就相关数据，更新 2.5 版本角色相关数据',
            changes: '<ul><li>更新 2.5 版本成就相关数据 </li><li>更新 2.5 版本角色相关数据</li></ul>' 
        },
        {
            version: '2.4.3', 
            date: '2024-08-28', 
            title: '新增自定义暂不可获得成就功能，将设置界面中与成就相关的选项移动至成就界面的设置窗口中',
            changes: '<ul><li>新增自定义暂不可获得成就功能，长按对应成就的选择按钮即可弹出设置自定义暂不可获得窗口</li><li>将设置界面中与成就相关的选项移动至成就界面的设置窗口中</li></ul>' 
        },
        {
            version: '2.4.2', 
            date: '2024-07-31', 
            title: '修正成就 忽冷忽热 为可获得成就',
            changes: '<ul><li>修正成就 忽冷忽热 为可获得成就</li></ul>' 
        },
        {
            version: '2.4.1', 
            date: '2024-07-30', 
            title: '更新 2.4 版本角色相关数据',
            changes: '<ul><li>更新 2.4 版本角色相关数据</li></ul>' 
        },
        {
            version: '2.4.0', 
            date: '2024-07-29', 
            title: '更新 2.4 版本成就相关数据',
            changes: '<ul><li>更新 2.4 版本成就相关数据</li></ul>' 
        },
        {
            version: '2.3.6', 
            date: '2024-07-17', 
            title: '优化手机端成就界面及角色界面的悬浮窗口位置为左边, 优化成就筛选功能',
            changes: '<ul><li>优化手机端成就界面及角色界面的悬浮窗口位置为左边</li><li>优化成就筛选功能，新增更多的筛选类型，设置界面新增成就筛选配置缓存选项便于自行取舍是否保留筛选缓存</li></ul>' 
        },
        {
            version: '2.3.5', 
            date: '2024-06-30', 
            title: '新增 世末丶月光之下 的成就视频攻略，新增 祈鸢ya 的 2.3 相关攻略',
            changes: '<ul><li>新增 世末丶月光之下 的成就视频攻略</li><li>新增  祈鸢ya 的 2.3 相关攻略</li></ul>' 
        },
        {
            version: '2.3.4', 
            date: '2024-06-22', 
            title: '新增成就界面设置特殊文本内容功能',
            changes: '<ul><li>新增成就界面设置特殊文本内容功能<br>如自定义以太硬币扑满的名称、晖长石号的名称等</li></ul>' 
        },
        {
            version: '2.3.3', 
            date: '2024-06-20', 
            title: '更新 stardb-exporter 程序蓝奏云下载链接，使用此导入功能的需要重新下载此文件',
            changes: '<ul><li>更新 stardb-exporter 程序蓝奏云下载链接，使用此导入功能的需要重新下载此文件</li></ul>' 
        },
        { 
            version: '2.3.2', 
            date: '2024-06-19', 
            title: '修正“客随主便”、“主随客便”为多选一成就，优化成就导入功能性能问题',
            changes: '<ul><li>修正“客随主便”、“主随客便”为多选一成就</li><li>优化成就导入功能性能问题</li></ul>' 
        },
        { 
            version: '2.3.1', 
            date: '2024-06-18', 
            title: '修正 2.4 前瞻角色相关数据',
            changes: '<ul><li>修正 2.4 前瞻角色相关数据</li></ul>' 
        },
        { 
            version: '2.3.0', 
            date: '2024-06-17', 
            title: '更新 2.3 版本成就相关数据',
            changes: '<ul><li>更新 2.3 版本成就相关数据</li></ul>' 
        },
        { 
            version: '2.2.7', 
            date: '2024-06-16', 
            title: '新增 Stardb-exporter 导入功能',
            changes: '<ul><li>新增 Stardb-exporter 导入功能<br>通过该功能可以快捷导入星穹铁道游戏内的成就数据</li></ul>' 
        },
        { 
            version: '2.2.6', 
            date: '2024-06-12', 
            title: '新增成就全选本页二次确认功能',
            changes: '<ul><li>新增成就全选本页二次确认功能<br>通过该功能可以避免误触导致成就数据丢失<br>你可以在设置界面选择开启或者关闭该功能</li></ul>' 
        },
        { 
            version: '2.2.5', 
            date: '2024-06-09', 
            title: '新增角色总数悬浮窗, 新增显示对应阵营角色设置，新增 2.4 前瞻角色信息',
            changes: '<ul><li>新增角色总数悬浮窗，方便各位了解筛选后的角色数据，其中去重是指切换角色只计入一次（如开拓者、三月七等）</li><li>新增角色界面显示对应阵营角色设置</li><li>新增 2.4 前瞻角色信息，具体角色为：云璃、椒丘、三月七•巡猎</li></ul>' 
        },
        { 
            version: '2.2.4', 
            date: '2024-06-05', 
            title: '新增本页成就悬浮窗, 新增 祈鸢ya 的 1.0 ~ 2.1 相关攻略',
            changes: '<ul><li>新增本页成就悬浮窗，方便各位了解筛选后的成就数据，也可以通过它了解各版本各系列成就新增的成就数据</li><li>新增 祈鸢ya 的 1.0 ~ 2.1 相关攻略，一位非常优秀的原神及星铁攻略up主，大家可以关注一下</li></ul>' 
        },
        { 
            version: '2.2.3', 
            date: '2024-06-01', 
            title: '新增更新日志，新增 祈鸢ya 的相关攻略，新增显示对应版本角色设置，修改成就攻略界面样式, 修改开拓者为非跃迁类别',
            changes: '<ul><li>新增更新日志</li><li>新增 祈鸢ya 的相关攻略，一位非常优秀的原神及星铁攻略up主，大家可以关注一下<br>【注：目前只上传了 2.2 版本的成就攻略，其他攻略后面陆续补充】</li><li>新增角色界面显示对应版本角色设置</li><li>修改成就攻略界面部分样式，支持查看作者主页</li><li>修改开拓者为非跃迁类别</li></ul>' 
        },
        { 
            version: '2.2.2', 
            date: '2024-05-29', 
            title: '新增角色界面显示角色相关设置，修改成就及角色界面部分样式',
            changes: '<ul><li>新增角色界面显示角色相关设置</li><li>修改成就及角色界面部分样式</li></ul>' 
        },
        { 
            version: '2.2.1', 
            date: '2024-05-19', 
            title: '新增主题颜色切换功能，新增修改账号头像的功能，新增角色界面，新增折叠功能，新增缓存机制，新增教程视跳转链接',
            changes: '<ul><li>新增主题颜色切换功能</li><li>新增修改账号头像的功能</li><li>新增角色界面</li><li>新增折叠功能</li><li>新增缓存机制</li><li>新增教程视频跳转链接</li></ul>' 
        },
        { 
            version: '2.2.0', 
            date: '2024-05-08', 
            title: '更新 2.2 版本成就相关数据',
            changes: '<ul><li>更新 2.2 版本成就相关数据</li></ul>' 
        },
        { 
            version: '更早', 
            date: '更早', 
            title: '无相关记录',
            changes: '<ul><li>无相关记录</li></ul>' 
        },
    ];

    const LAST_SHOW_UPDATE_LOG_VERSION_KEY = 'last-show-update-log-version'

    const lastShowVersion = ref(localStorage.getItem(LAST_SHOW_UPDATE_LOG_VERSION_KEY) ?? '')

    const updateLastShowVersion = () => {
        lastShowVersion.value = updateLogInfo[0].version
    }

    watchEffect(() => {
        localStorage.setItem(LAST_SHOW_UPDATE_LOG_VERSION_KEY, lastShowVersion.value)
    })

    const displayUpdateLog = () => {
        return lastShowVersion.value !== updateLogInfo[0].version
    };

    return {
        updateLogInfo,
        displayUpdateLog,
        updateLastShowVersion
    }
})