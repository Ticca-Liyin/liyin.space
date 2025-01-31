import { computed, watch, ref } from 'vue'
import { defineStore, storeToRefs } from 'pinia'
import { useCharacterStore } from '@/stores/character/character';
import { useCharacterSettingStore } from '@/stores/character/characterSetting';

export const useShowCharactersStore = defineStore('showCharacters', () => {
    const characterStore = useCharacterStore()
    const { characters } = storeToRefs(characterStore)
    const { charactersUniqueTotal } = characterStore

    const characterSettingStore = useCharacterSettingStore()
    const { showStarList, showWarpList, showVersionList, showFactionList } = storeToRefs(characterSettingStore)

    const showCharacters = computed(() => {
        return Object.values(characters.value).filter(character =>{
            // 显示角色的星数
            if(showStarList.value.length > 0)
                if(!showStarList.value.includes(character.star))
                    return false

            // 显示角色的限定程度
            if(showWarpList.value.length > 0)
                if(!showWarpList.value.includes(character.warp))
                    return false

            // 显示角色的版本
            if(showVersionList.value.length > 0)
                if(!showVersionList.value.includes(character.version))
                    return false

            // 显示角色的阵营
            if(showFactionList.value.length > 0){
                if(Array.isArray(character.faction)){
                    if(character.faction.every(faction => !showFactionList.value.includes(faction)))
                        return false
                }else {
                    return false
                }
            }

            return true
        })
    })
    
    const showCharactersTotal = computed(() => {
        return showCharacters.value.length
    })

    const showCharactersUniqueTotal = computed(() => {
        return charactersUniqueTotal(showCharacters.value)
    })

    return {
        showCharacters,
        showCharactersTotal,
        showCharactersUniqueTotal
    }
})