import { ref, watch } from 'vue'
import { defineStore } from 'pinia'
import { characterInfoVersion } from '@/utils/version.js'

export const useCharacterStore = defineStore('character', () => {
    const combattypes = {
        "物理": {
            ID: 1,
            name: "物理",
            avatar: "physical.b6549d6",
            color: ""
        },
        "量子": {
            ID: 2,
            name: "量子",
            avatar: "quantum.5937479"
        },
        "虚数": {
            ID: 3,
            name: "虚数",
            avatar: "imaginary.f789936"
        },
        "风": {
            ID: 4,
            name: "风",
            avatar: "wind.0cc4f39"
        },
        "火": {
            ID: 5,
            name: "火",
            avatar: "fire.82b3a8e"
        },
        "雷": {
            ID: 6,
            name: "雷",
            avatar: "lightning.df7648e"
        },
        "冰": {
            ID: 7,
            name: "冰",
            avatar: "ice.ae6a64b"
        }
    }

    const paths = {
        "毁灭": {
            ID: 1,
            name: "毁灭",
            avatar: "destruction.51ace07",
            avatar2: "destruction.7418a5c"
        },
        "巡猎": {
            ID: 2,
            name: "巡猎",
            avatar: "hunt.4d56d2e",
            avatar2: "hunt.d548162"
        },
        "智识": {
            ID: 3,
            name: "智识",
            avatar: "erudition.a2d8d53",
            avatar2: "erudition.45c6677"
        },
        "同谐": {
            ID: 4,
            name: "同谐",
            avatar: "harmony.80b3683",
            avatar2: "harmony.18dbf1f"
        },
        "虚无": {
            ID: 5,
            name: "虚无",
            avatar: "nihility.d8e1b5d",
            avatar2: "nihility.d505ef3"
        },
        "存护": {
            ID: 6,
            name: "存护雷",
            avatar: "preservation.0096c9d",
            avatar2: "preservation.33ab44c"
        },
        "丰饶": {
            ID: 7,
            name: "丰饶",
            avatar: "abundance.dfed436",
            avatar2: "abundance.24d2186"
        }
    }
    
    const characters = ref({})

    const initialCharactersInfo = () => {
        fetch(`/src/jsons/CharacterInfo.json?v=${characterInfoVersion}`).then(response => response.json())
        .then(characterInfo => {
            characters.value = characterInfo
            // console.log(characters.value)
        })
        .catch(error => console.error(error))
    }

    const getCharacterAvatar = (charID) => {
        if(!(charID in characters.value)){
            return '/src/images/icon/characterIcon.png'
        }

        let prefix = ''
        const char = characters.value[charID]

        if (char.version < 1.6 && char.name !== "藿藿") 
            prefix = 'https://upload-static.hoyoverse.com/'

        else if (["加拉赫", "花火", "砂金", "开拓者-同谐"].includes(char.name))
            prefix = 'https://act-webstatic.hoyoverse.com/'

        else
            prefix = 'https://act-upload.hoyoverse.com/'

        return prefix + char.avatar
    }

    const getCombatTypeAvatar = (combatTypeName) => {
        return '/src/images/combatType/' + combatTypeName + '.png'
    }

    const getPathAvatar = (pathName) => {
        return '/src/images/path/' + pathName + '.png'
    }

    const getDarkPathAvatar = (pathName) => {
        return '/src/images/path-dark/' + pathName + '.png'
    }

    const getPathSmallAvatar = (pathName) => {
        return '/src/images/smallPath/' + pathName + '.png'
    }

    const getDarkPathSmallAvatar = (pathName) => {
        return '/src/images/smallPath-dark/' + pathName + '.png'
    }

    const getStarAvatar = () => {
        return '/src/images/star.png'
    }

    return {  
        combattypes,
        paths,
        characters,
        initialCharactersInfo,
        getCharacterAvatar,
        getCombatTypeAvatar,
        getPathSmallAvatar,
        getDarkPathSmallAvatar,
        getPathAvatar,
        getDarkPathAvatar,
        getStarAvatar,
    }
})