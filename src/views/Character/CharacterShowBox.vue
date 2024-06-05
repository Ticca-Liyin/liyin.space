<script setup>
import { computed } from 'vue';
import { useCharacterStore } from '@/stores/character'
import { useCharacterSettingStore } from '@/stores/characterSetting';
import { useThemeStore } from '@/stores/theme'
import { storeToRefs } from 'pinia';

const characterStore = useCharacterStore()
const { getCharacterAvatar, getPathSmallAvatar, getDarkPathSmallAvatar, getStarAvatar, getCombatTypeAvatar } = characterStore

const characterSettingStore = useCharacterSettingStore()
const { handleToWebsite } = characterSettingStore

const themeStore = useThemeStore()
const { isDark } = storeToRefs(themeStore)

const props = defineProps({
    characterList: Array
})

const showCharacters = computed(() => {
    // console.log(props.characterList)
    let maxLength = Math.ceil(Math.sqrt(props.characterList.length)); // 计算每行的最大存储个数
    // console.log(maxLength)
    let outputCharacterList = [];

    props.characterList.sort((a, b) =>  {
        // Sort by star in descending order
        if (b.star !== a.star) {
            return b.star - a.star;
        }
        
        // Sort by version in descending order
        return parseFloat(b.version) - parseFloat(a.version);
    }) 

    for (let i = 0; i < props.characterList.length; i += maxLength) {
        let row = props.characterList.slice(i, i + maxLength);
        outputCharacterList.push(row);
    }
    // console.log(outputCharacterList)
    return outputCharacterList;
})

</script>

<template>
    <div class="character-show-box">
        <div class="character-show-row" v-for="(characters, rowIndex) in showCharacters" :key="rowIndex">
            <div v-for="char in characters" :key="char.name" class="character-info-box" @click="handleToWebsite(char.id)">
                <div v-if="char.deploymentDate > Date.now()" class="character-slanted-content"> 即将上线 </div>

                <img class="character-avatar" :class="'d-img-level-' + char.star" draggable="false" :src="getCharacterAvatar(char.id)" :alt="char.name">

                <div class="character-star">
                    <img v-for="i in new Array(char.star)" class="character-star-avatar" draggable="false" 
                    :src="getStarAvatar()" alt="star">
                </div>

                <div class="character-info">
                    <div class="character-path">
                        <img class="character-path-avatar" draggable="false" :src="isDark ? getPathSmallAvatar(char.path) : getDarkPathSmallAvatar(char.path)" :alt="char.path">
                    </div>
                    
                    <div class="character-combattype">
                        <img class="character-combattype-avatar" draggable="false" :src="getCombatTypeAvatar(char.combattype)" :alt="char.combattype">
                    </div>
                </div>

                <div class="character-name">{{ char.name }}</div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.character-show-box{
    display: flex;
    justify-content: center; /* 水平居中 */
    align-items: center; /* 垂直居中 */
    text-align: center;
    flex-direction: column;
}

.character-show-row {
    display: flex;
    /* padding: 10px; */
    justify-content: center; /* 水平居中 */
    align-items: center; /* 垂直居中 */
    text-align: center;
}

.character-info-box {
    margin: 10px;
    position: relative;
    overflow: hidden;
    transition: transform 0.05s ease;
    cursor: pointer;
}

.character-info-box:hover {
    transform: scale(1.05);
}

.character-slanted-content {
    position: absolute;
    top: 10px;
    right: -30px;
    width: 90px;
    font-size: 10px;
    font-weight: 700;
    background-color: rgba(255, 165, 0, 0.5);
    color: #fff;
    padding: 2px 5px;
    /* transform: translateY(45%) skew(45deg); */
    /* transform-origin: center; */
    transform:rotate(45deg);
    z-index: 2;
}

.character-avatar {
    width: 63px;
    height: 72px;
    object-fit: cover;
    border-radius: 0 24px 0 0;
}

.character-star-avatar {
    width: 12px;
    height: 12px;
}

.character-info {
    display: flex;
    justify-content: center;
}

.character-path {
    margin: 0 3px;
}

.character-path-avatar {
    width: 16px; 
    height: 16px; 
    object-fit: cover; 
    opacity: .65;
}

.character-combattype {
    width: 16px;
    height: 16px;
    border-radius: 100%;
    background-color: var(--liyin-char-combattypt-bg-color);
    margin: 0 3px; 
    position: relative;
}

.character-combattype-avatar {
    width: 15px; 
    height: 15px; 
    object-fit: cover; 
    left: 50%; 
    position: absolute; 
    top: 50%; 
    transform: translate(-50%,-50%);
}

.d-img-level-4 {
    background: -webkit-gradient(linear, left top, left bottom, from(#3f4064), to(#9c65d7));
    background: linear-gradient(180deg, #3f4064, #9c65d7);
}

.d-img-level-5 {
    background: -webkit-gradient(linear, left top, left bottom, from(#a35d55), to(#d0aa6e));
    background: linear-gradient(180deg, #a35d55, #d0aa6e);
}

.character-name {
    color: var(--liyin-char-name-text-color); 
    font-size: 14px; 
    white-space: nowrap;
}

</style>