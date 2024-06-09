<script setup>
import { ArrowDown } from '@element-plus/icons-vue'
import { useUserInfoStore } from '@/stores/userInfo'
import { useAuthorStore } from '@/stores/author'
import { useCharacterStore } from '@/stores/character'
import { useIsMobileStore } from '@/stores/isMobile'
import { useThemeStore } from '@/stores/theme'
import { onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useRoute } from 'vue-router';

const route = useRoute()

const userInfoStore = useUserInfoStore()
const { userInfoList, currentUserInfo } = storeToRefs(userInfoStore)
const { getUserInfo, handleCurrentTokenID } = userInfoStore

const authorStore = useAuthorStore()
const { initialAuthorsInfo } = authorStore

const characterStore = useCharacterStore()
const { initialCharactersInfo, getCharacterAvatar, getCharacterAvatarName } = characterStore

const isMobileStore = useIsMobileStore()
const { isMobile } = storeToRefs(isMobileStore)

const themeStore = useThemeStore()
const { isDark } = storeToRefs(themeStore)

const navList = [
    {
        name: '成就',
        value: 'achievement',
    },
    {
        name: '角色',
        value: 'character',
    },
    {
        name: '设置',
        value: 'setting',
    }
]

onMounted(() => {
    getUserInfo()
    initialAuthorsInfo()
    initialCharactersInfo()
})

</script>

<template>
    <header class="ly-header">
        <div class="ly-header-left">
            <div class="left-title">
                黎愔成就
            </div>
        </div>
        <div class="ly-header-right">
            <el-dropdown class="dropdown-user" :trigger="isMobile ? 'click' : 'hover'">
                <div class="user-info">
                    <div class="user-avatar">
                        <img :src='getCharacterAvatar(currentUserInfo?.avatar)' 
                            :alt="getCharacterAvatarName(currentUserInfo?.avatar)">
                    </div>
                    <div class="user-content">
                        <div class="user-name"> {{ currentUserInfo?.name }} </div>
                        <div class="user-uid"> {{ currentUserInfo?.uid }}</div>
                    </div>
                    <el-icon class="el-icon--right user-arrow">
                        <arrow-down />
                    </el-icon>
                </div>
                <template #dropdown>
                    <el-dropdown-menu>
                        <div class="user-info" v-for="userInfo in userInfoList.list" :key="userInfo.tokenID"
                        @click="handleCurrentTokenID(userInfo.tokenID)">
                            <div class="user-avatar">
                                <img :src='getCharacterAvatar(userInfo?.avatar)' 
                                    :alt="getCharacterAvatarName(userInfo?.avatar)">
                            </div>
                            <div class="user-content">
                                <div class="user-name"> {{ userInfo?.name }} </div>
                                <div class="user-uid"> {{ userInfo?.uid }}</div>
                            </div>
                        </div>
                        <RouterLink to="/setting">
                            <el-dropdown-item divided>
                                账号管理
                            </el-dropdown-item>
                        </RouterLink>
                    </el-dropdown-menu>
                </template>
            </el-dropdown> 
        </div>
    </header>

    <aside class="ly-aside">
        <RouterLink v-for="nav in navList" :to="`/${nav.value}`" :class="{'router-link-exact-active': route.path.split('/')[1] === nav.value}">
            <div class="nav-main">
                <div class="nav-content">
                    <img :src="`/src/images/icon/${nav.value}Icon.png`" alt="nav.name" v-if="route.path.split('/')[1] !== nav.value">
                    <img :src="`/src/images/icon/${nav.value}DarkIcon.png`" :alt="nav.name" v-else-if="isDark">
                    <img :src="`/src/images/icon/${nav.value}LightIcon.png`" :alt="nav.name" v-else-if="isMobile">
                    <img :src="`/src/images/icon/${nav.value}Icon1.png`" :alt="nav.name" v-else>
                    <div class="nav-title">
                        {{nav.name}}
                    </div>
                </div>
            </div>
        </RouterLink>
    </aside>

    <main class="ly-main">
        <RouterView />
    </main>
</template>

<style>
a {
    color: var(--liyin-text-color);
}
.ly-header{
    width: 100%;
    height: 60px;
    background-color: var(--liyin-bg-color-2);
    display: flex;
    justify-content: space-between;
    box-shadow: 1px 5px 10px rgba(60, 60, 60, 0.3);
    /*margin-bottom: 1px; */
}
.left-title{
    width: 150px;
    height: 60px;
    line-height: 60px;
    color: var(--liyin-text-light-color);
    font-size: 18px;
    font-weight: 700;
    text-align: center;
    background-color: var(--liyin-header-left-bg-color);
    box-shadow: var(--liyin-header-left-box-shadow)
}
.ly-header-right{
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
}
.dropdown-user{
    height: 100%;
}
.user-info{
    display: flex;
    align-items: center;
    height: 60px;
    padding: 0 10px;
    cursor: pointer;
    user-select: none;
}
.user-info:hover{
    background-color: var(--liyin-userinfo-hover-bg-color);
}
.user-avatar{
    width: 40px;
    height: 40px;
    border-radius: 50%;
    overflow: hidden;
    margin-right: 5px;
    border: 2px solid var(--liyin-char-avatar-border-color);
    background-color: var(--liyin-char-avatar-bg-color);
}
.user-avatar img{
    width: 100%;
    height: 100%;
}
.user-content{
    width: 70px;
    overflow: hidden; 
    white-space: nowrap;
}
.user-name{
    font-size: 15px;
    font-weight: 700;
    color: var(--liyin-text-main-color);
}
.user-info:hover .user-name{
    color: var(--el-color-primary);
}
.user-uid{
    color: var(--liyin-text-color);
    font-size: 12px;
}
.user-info:hover .user-uid{
    color: var(--el-color-primary);
    
}
/* .user-arrow{
    color: var(--liyin-arrow-color)
} */
.user-info:hover .user-arrow{
    color: var(--el-color-primary);
}
.dropdown-user .el-icon--right{
    margin-left: 0px;
}
.ly-aside{
    width: 150px;
    height: calc(100vh - 60px);
    background-color: var(--liyin-aside-bg-color);
    box-shadow: 5px 1px 10px rgba(60, 60, 60, 0.3);
}
.nav-main{
    height: 40px;
    padding: 10px 10% 10px 10%;
    user-select: none;
}
.ly-aside a.router-link-exact-active .nav-main{
    background-color: var(--liyin-aside-selected-bg-color);
    color: var(--liyin-aside-selected-text-color)
}
.nav-content {
    display: flex;
    align-items: center;
}
.nav-content img{
    width: 30px;
    height: 30px;
    margin: 10px;
}
.nav-title{
    color: var(--liyin-aside-text-color);
    font-size: 16px;
    font-weight: 700;
}
.nav-main:hover .nav-title{
    color: var(--liyin-aside-selected-text-color);
}
.ly-aside a.router-link-exact-active .nav-title{
    color: var(--liyin-aside-selected-text-color);
}
@media (min-width: 769px){
    .ly-header{
        position: fixed;
        top: 0;
        left: 0;
        z-index: 20;
    }
    .ly-aside{
        position: fixed;
        top: 60px;
        left: 0;
        z-index: 15;
    }
    .ly-main{
        /* width: 100%; */
        /* height:  calc(100vh - 60px);  */
        padding: 60px 0 0 150px;
        /* height: 100%; */
        height: calc(100vh - 60px);
    }
}
@media (max-width: 768px){
    .ly-header{
        height: 50px;
        position: fixed;
        top: 0;
        left: 0;
        z-index: 20;
        box-shadow: 3px 1px 10px rgba(60, 60, 60, 0.3);
    }
    .left-title{
        display: none;
    }
    .user-info{
        height: 50px;
        padding: 0 5px;
    }
    .user-avatar{
        width: 35px;
        height: 35px;
    }
    .user-avatar img{
        width: 100%;
        height: 100%;
    }
    .user-content{
        width: 70px;
        overflow: hidden; 
        white-space: nowrap;
    }
    .user-name{
        font-size: 13px;
        font-weight: 700;
    }
    .user-uid{
        color: var(--liyin-text-color);
        font-size: 12px;
    }
    .ly-aside{
        width: 100%;
        height: 50px;
        display: flex;
        background-color: var(--liyin-bg-color-2);
        flex-direction: row;
        justify-content: space-around;
        box-shadow: 1px -3px 10px rgba(60, 60, 60, 0.3);
        position: fixed;
        bottom: 0;
        left: 0;
        z-index: 15;
    }
    .nav-main{
        width: 50px;
        padding: 5px 10%;
    }
    .ly-aside a.router-link-exact-active .nav-main{
        background-color: var(--liyin-bg-color-2);
        color: var(--liyin-aside-selected-text-color-2);
    }
    .nav-content {
        display: flex;
        flex-direction: column;
        align-items: center;
    }
    .nav-content img{
        height: 25px;
        width: 25px;
        margin: 0;
    }
    .nav-title{
        color: var(--liyin-aside-text-color);
        font-size: 13px;
        font-weight: 700;
    }
    .ly-aside a.router-link-exact-active .nav-title{
        color: var(--liyin-aside-selected-text-color-2);
    }
    .nav-main:hover .nav-title{
        color: var(--liyin-aside-text-color);
    }
    .ly-main{
        padding: 50px 0 50px 0;
        width: 100%; 
        height: 100vh;
        box-sizing: border-box;
    }
}
</style>