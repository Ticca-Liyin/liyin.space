<script setup>
import { ref, computed } from 'vue';
import { storeToRefs } from 'pinia'
import { useTextjoinStore } from '@/stores/achievement/setting/textjoin.js'
import { useUserInfoStore } from '@/stores/userInfo'

const textjoinStore = useTextjoinStore();
const { textjoinSelectList, getUserTextjoinValue, updateUserTextjoinValue } = textjoinStore;

const userInfoStore = useUserInfoStore()
const { currentUserInfo } = storeToRefs(userInfoStore)

const textjoinList = computed(() => {
    const textjoinList = {}
    
    for (const textjoinId in textjoinSelectList) {
        textjoinList[textjoinId] = ref(getUserTextjoinValue(currentUserInfo.value.tokenID.toString(), textjoinId))
    }

    return textjoinList
})
</script>

<template>
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