import { useCharacterStore } from '@/stores/character'
import { storeToRefs } from 'pinia'

const characterStore = useCharacterStore()
const { characters } = storeToRefs(characterStore)
const { getCharacterAvatar } = characterStore


export const getValidUerInfoAvatar = (userInfoAvatar) => {
    if(userInfoAvatar in characters.value){
        return getCharacterAvatar(userInfoAvatar)
    }

    const charactersKeys = Object.keys(characters.value);
    if(charactersKeys.length > 0){
        return getCharacterAvatar(charactersKeys[0])
    }
    else{
        return '/src/images/icon/characterIcon.png'
    }
}
    
export const getValidUerInfoAvatarName = (userInfoAvatar) => {
    if(userInfoAvatar in characters.value){
        return characters.value[userInfoAvatar].name
    }

    const charactersKeys = Object.keys(characters.value);
    if(charactersKeys.length > 0){
        return characters.value[charactersKeys[0]].name
    }
    else{
        return '角色'
    }
}