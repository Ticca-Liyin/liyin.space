<script setup>
import { ArrowDown } from '@element-plus/icons-vue'
import { useUserInfoStore } from '@/stores/userInfo'
import { onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useRoute } from 'vue-router';

const route = useRoute()

const userInfoStore = useUserInfoStore()
const { userInfoList, currentUserInfo } = storeToRefs(userInfoStore)
const { getUserInfo, handleCurrentTokenID } = userInfoStore
onMounted(() => {
    getUserInfo()
})

const isMobile = window.matchMedia('(max-width: 768px)').matches
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
                        <img src="/src/images/三月七.png" alt="">
                    </div>
                    <div class="user-content">
                        <div class="user-name"> {{ currentUserInfo?.name }} </div>
                        <div class="user-uid"> {{ currentUserInfo?.uid }}</div>
                    </div>
                    <el-icon class="el-icon--right">
                        <arrow-down />
                    </el-icon>
                </div>
                <template #dropdown>
                    <el-dropdown-menu>
                        <div class="user-info" v-for="userInfo in userInfoList.list" :key="userInfo.tokenID"
                        @click="handleCurrentTokenID(userInfo.tokenID)">
                            <div class="user-avatar">
                                <img src="/src/images/三月七.png" alt="">
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
        <RouterLink to="/achievement" :class="{'router-link-exact-active': route.path.split('/')[1] === 'achievement'}">
            <div class="nav-main">
                <div class="nav-content">
                    <img src="/src/images/achievementIcon.png" alt="">
                    <div class="nav-title">
                        成就
                    </div>
                </div>
            </div>
        </RouterLink>
        <RouterLink to="/setting" :class="{'router-link-exact-active': route.path.split('/')[1]  === 'setting'}">
            <div class="nav-main">
                <div class="nav-content">
                    <img src="/src/images/settingIcon.png" alt="">
                    <div class="nav-title">
                        设置
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
    color: #767676;
}
.ly-header{
    width: 100%;
    height: 60px;
    background-color: #fff;
    display: flex;
    justify-content: space-between;
    box-shadow: 1px 5px 10px rgba(60, 60, 60, 0.3);
    /*margin-bottom: 1px; */
}
.left-title{
    width: 150px;
    height: 60px;
    line-height: 60px;
    color: #fff;
    font-size: 18px;
    font-weight: 700;
    text-align: center;
    background-color: #4A90E2;
    box-shadow: 5px 1px 10px rgba(60, 60, 60, 0.3);
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
    background-color: #ECF5FF;
}
.user-avatar{
    width: 40px;
    height: 40px;
    border-radius: 50%;
    overflow: hidden;
    margin-right: 5px;
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
}
.user-info:hover .user-name{
    color: #409EFF;
}
.user-uid{
    color: #767676;
    font-size: 12px;
}
.user-info:hover .user-uid{
    color: #409EFF;
    
}
.dropdown-user .el-icon--right{
    margin-left: 0px;
}
.ly-aside{
    width: 150px;
    height: calc(100vh - 60px);
    background-color: #00A8E8;
    box-shadow: 5px 1px 10px rgba(60, 60, 60, 0.3);
}
.nav-main{
    height: 40px;
    padding: 10px 10% 10px 10%;
    user-select: none;
}
.ly-aside a.router-link-exact-active .nav-main{
    background-color: #4A90E2AA;
    color: #fff;
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
    color: #C9D3E3;
    font-size: 16px;
    font-weight: 700;
}
.nav-main:hover .nav-title{
    color: #fff;
}
.ly-aside a.router-link-exact-active .nav-title{
    color: #fff;
}
@media (min-width: 768px){
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
        color: #767676;
        font-size: 12px;
    }
    .ly-aside{
        width: 100%;
        height: 50px;
        display: flex;
        background-color: #fff;
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
        background-color: #fff;
        color: #00A8E8;
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
        color: #C9D3E3;
        font-size: 13px;
        font-weight: 700;
    }
    .ly-aside a.router-link-exact-active .nav-title{
        color: #00A8E8;
    }
    .ly-main{
        padding: 50px 0 50px 0;
        width: 100%; 
        height: 100vh;
        box-sizing: border-box;
    }
}
</style>