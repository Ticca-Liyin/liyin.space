<script setup>
import FloatingWindow from '@/components/FloatingWindow.vue';
import { useCharacterSettingStore } from '@/stores/characterSetting';
import { useThemeStore } from '@/stores/theme'
import { storeToRefs } from 'pinia';

const characterSettingStore = useCharacterSettingStore()
const { showCharactersTotal, showCharactersUniqueTotal } = storeToRefs(characterSettingStore)

const themeStore = useThemeStore()
const { isDark } = storeToRefs(themeStore)
</script>

<template>
  <FloatingWindow class="character-floating-window">
    <div class="character-grid">
        <div class="character-grid-item">
            <b>当前显示角色总个数：</b>
        </div>
        <div class="character-grid-item">
            {{ showCharactersTotal }}
        </div>
        <div class="character-grid-item">
            <b>当前角色去重总个数：</b>
        </div>
        <div class="character-grid-item">
            {{ showCharactersUniqueTotal }}
        </div>
    </div>
  </FloatingWindow>
</template>

<style scoped>
.character-floating-window{
    --liyin-floating-window-bg-color: var(--liyin-char-floating-window-bg-color);
}
.character-grid{
    user-select: none;
    padding: 5px 10px;
    background-color: var(--liyin-ach-current-page-bg-color);
    color: var(--liyin-char-name-text-color);
    display: grid;
    grid-template-rows: 2;
    grid-template-columns: 2;
}
.character-grid-item{
    line-height: 23px;
    font-size: 15px;
    align-items: center;
    padding: 5px 0;
}
.character-grid-item:nth-child(2n+1){
    grid-column: 1;
    text-align: right;
}
.character-grid-item:nth-child(2n){
    grid-column: 2;
    color: var(--liyin-char-floating-total-text-color);
}

@media (max-width: 768px){
    .character-grid{
        padding: 3px 5px;
    }
    .character-grid-item{
    line-height: 15px;
    font-size: 12px;
    padding: 2px 0;
}
}
</style>