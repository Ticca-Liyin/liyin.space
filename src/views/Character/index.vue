<script setup>
import CharacterSetting from './CharacterSetting.vue';
import CharacterContainer from './CharacterContainer.vue';
import { useCharacterSettingStore } from '@/stores/characterSetting';
import { onMounted} from 'vue';

const characterSettingStore = useCharacterSettingStore()
const { getCharacterSettingConfig } = characterSettingStore

onMounted(() => {
    getCharacterSettingConfig()
})

</script>

<template>
    <div class="character">
        <CharacterSetting></CharacterSetting>

        <CharacterContainer class="character-container"></CharacterContainer>
    </div>
</template>

<style scoped>
.character{
    /* width: 100%;  */
    height: 100%;
    overflow: hidden;
    display: flex;
    flex-direction: column;
}

.character-container{
    flex: 1 0 0;
    overflow: auto;
    width: 100%;
    height: calc(100% - 40px);
}

</style>