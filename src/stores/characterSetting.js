import { ref, watch } from 'vue'
import { defineStore } from 'pinia'
import { useCharacterStore } from '@/stores/character';
import { useIsMobileStore } from '@/stores/isMobile'
import { storeToRefs } from 'pinia';

const characterStore = useCharacterStore()
const { characters } = storeToRefs(characterStore)

const isMobileStore = useIsMobileStore()
const { isMobile } = storeToRefs(isMobileStore)

export const useCharacterSettingStore = defineStore('characterSetting', () => {
    //角色区域点击跳转事件相关
    const MiYoShe = '米游社'
    const HoYoWiki = 'HoYoWiki'
    const YuChengBei = '玉衡杯数据库'
    const BiliWiki = 'biliWiki'

    const toMiYoShe = (charId) => {
        const id = characters.value[charId]?.MiYoSheId

        if (id) {
            window.open(`https://bbs.mihoyo.com/sr/wiki/content/${id}/detail`, '_blank')
        }
        else{
            ElMessage({
                showClose: true,
                message: `米游社暂无 ${characters.value[charId].name} 相关信息或本网站未及时更新`,
                type: 'error',
            })
        }
    }

    const toHoYoWiki = (charId) => {
        const id = characters.value[charId]?.HoYoWikiId

        if (id) {
            window.open(`https://wiki.hoyolab.com/pc/hsr/entry/${id}`, '_blank')
        }
        else{
            ElMessage({
                showClose: true,
                message: `HoYoWiKi 暂无 ${characters.value[charId].name} 相关信息或本网站未及时更新`,
                type: 'error',
            })
        }
    }

    const toYuChengBei = (charId) => {
        window.open('https://homdgcat.wiki/sr/char?lang=CH#_' + charId, '_blank');
    }

    const toBiliWiki = (charId) => {
        let name = characters.value[charId].name

        if(name.startsWith('开拓者')){
            name = name.replace('-', '•')
        }

        window.open('https://wiki.biligame.com/sr/' + name, '_blank');
    }

    const WebsiteNameList = {
        [MiYoShe]: {
           value: MiYoShe,
           label: MiYoShe,
           jump: toMiYoShe
        },
        [HoYoWiki]: {
            value: HoYoWiki,
            label: HoYoWiki,
            jump: toHoYoWiki
        },
        [YuChengBei]: {
            value: YuChengBei,
            label: YuChengBei,
            jump: toYuChengBei
        },
        [BiliWiki]: {
            value: BiliWiki,
            label: BiliWiki,
            jump: toBiliWiki
        },
    }
    const toWebsiteName = ref(Object.values(WebsiteNameList)[0].value)

    const handleToWebsite = (charId) => {
        const jump = WebsiteNameList[toWebsiteName.value]?.jump

        if (typeof jump === 'function' && jump instanceof Function) 
            jump(charId)

        else
            console.error(`网站名称为 ${toWebsiteName.value} 的跳转对象无跳转事件`)
    }

    // 缩放相关设置
    const scale = ref(1);
    const useWheelEvent = ref(false)
    const scaleBaseIncrement = 0.05 // 缩放基础增量
    const scaleMax = 1 // 缩放最大值
    const scaleMin = 0.2 // 缩放最小值

    //获取角色界面设置缓存
    const getCharacterSettingConfig = () => {
        // 从缓存中读取名为 "CharacterViewSettingConfig" 的数据
        const tempCharacterViewSetting = localStorage.getItem("CharacterViewSettingConfig")
        const defaultScale = isMobile.value ? 0.4 : 1

        // 检查是否存在名为 "CharacterViewSettingConfig" 的数据
        if (tempCharacterViewSetting !== null) {
            // 数据存在，将其从字符串转换为对象
            const data = JSON.parse(tempCharacterViewSetting)
            
            toWebsiteName.value = data?.toWebsiteName || Object.values(WebsiteNameList)[0].value
            scale.value = data?.scale || defaultScale
            useWheelEvent.value = data?.useWheelEvent || false
        } else {
            // 数据不存在，执行相应的操作
            toWebsiteName.value = Object.values(WebsiteNameList)[0].value
            scale.value = defaultScale
            useWheelEvent.value = false
        }
    }
    //保存角色界面设置缓存
    const saveCharacterSettingConfig = () => {
        // 将对象转换为字符串，并将其存储在缓存中
        localStorage.setItem("CharacterViewSettingConfig", JSON.stringify({
            toWebsiteName: toWebsiteName.value,
            scale: scale.value,
            useWheelEvent: useWheelEvent.value,
        }))
    }

    watch([toWebsiteName, scale, useWheelEvent], saveCharacterSettingConfig)

    return {
        WebsiteNameList,
        toWebsiteName,
        handleToWebsite,
        scale,
        useWheelEvent,
        scaleBaseIncrement,
        scaleMax,
        scaleMin,
        getCharacterSettingConfig,
    }
})