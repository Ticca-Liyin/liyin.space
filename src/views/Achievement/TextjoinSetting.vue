<script setup>
import { ref, defineExpose, computed } from 'vue';
import { storeToRefs } from 'pinia'
import { useTextjoinStore } from '@/stores/textjoin.js'
import { useIsMobileStore } from '@/stores/isMobile'
import { useUserInfoStore } from '@/stores/userInfo'

const showSettingDrawer = ref(false);

const textjoinStore = useTextjoinStore();
const { textjoinSelectList, getUserTextjoinValue, updateUserTextjoinValue } = textjoinStore;

const isMobileStore = useIsMobileStore()
const { isMobile } = storeToRefs(isMobileStore)

const handleClose = () => {
    showSettingDrawer.value = false;
}

const handleOpen = () => {
    showSettingDrawer.value = true;
}

const userInfoStore = useUserInfoStore()
const { currentUserInfo } = storeToRefs(userInfoStore)

const textjoinList = computed(() => {
    const textjoinList = {}
    
    for (const textjoinId in textjoinSelectList) {
        textjoinList[textjoinId] = ref(getUserTextjoinValue(currentUserInfo.value.tokenID.toString(), textjoinId))
    }

    return textjoinList
})

defineExpose({ handleOpen, handleClose })

</script>

<template>
    <el-drawer
        v-model="showSettingDrawer"
        title="特殊文本设置"
        direction='rtl'
        size='320px'
        :z-index="150"
        :style="isMobile ? 'padding-top: 50px;' : 'padding-top: 60px;'"
    >
        <div style="margin-top: -25px;">
            <div v-for="(textjoin, id) in textjoinList" :key="id">
                <div class="textjoin-name"> {{ id }}：</div>
                <div class="textjoin-select-box">
                    <el-select
                        v-model="textjoin.value"
                        placeholder="请选择 TEXTJOIN"
                        size="large"
                        style="width: 240px"
                        @change="(newvalue) => updateUserTextjoinValue(currentUserInfo.tokenID.toString(), id, newvalue)"
                    >
                        <el-option
                            v-for="item in textjoinSelectList[id]"
                            :key="item"
                            :label="item"
                            :value="item"
                        />
                    </el-select>
                </div>
            </div>
        </div>
    </el-drawer>
</template>

<style>
.textjoin-name {
    color: var(--liyin-textjion-text-color);
    /* font-size: 16px; */
    margin: 10px 0;
}
.textjoin-select-box{
    margin: 0;
}
</style>