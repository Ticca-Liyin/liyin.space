import { onMounted, ref } from "vue"


export default function(maxFrameCount){
    let frameCount = ref(0)

    onMounted(()=>{
        const refreshFraeCount = () =>{
            requestAnimationFrame(() => {
                frameCount.value++
                if(frameCount.value < maxFrameCount){
                    refreshFraeCount()
                }
            })
        }
        refreshFraeCount()
    })


    const defer = (showInFrameCount) => {
        return frameCount.value >= showInFrameCount
    }

    return {
        frameCount,
        defer
    }
    // return{
    //     data(){
    //         return{
    //             frameCount: 0  
    //         }
    //     },
        
    //     // mounted() {
    //     //     this.refreshFraeCount()
    //     // },

    //     methods:{
    //         defer(showInFrameCount){
    //             return this.frameCount >= showInFrameCount
    //         },
    //         refreshFraeCount(){
    //             requestAnimationFrame(() => {
    //                 this.frameCount++
    //                 if(this.frameCount < maxFrameCount){
    //                     this.refreshFraeCount()
    //                 }
    //             })
    //         }
    //     } 
    // }
} 