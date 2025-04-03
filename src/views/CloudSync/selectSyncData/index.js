import { createApp, h } from 'vue'
// import ElementPlus from 'element-plus'
import SelectSyncData from '@/views/cloudSync/selectSyncData/SelectSyncData.vue'

export const showSelectSyncDataDialog = (options = {}) => {
  const container = document.createElement('div')
  document.body.appendChild(container)

  const app = createApp({
    render() {
      return h(SelectSyncData, {
        localData: options.localData,
        cloudData: options.cloudData,
        ref: 'dialog'
      })
    }
  })

//   app.use(ElementPlus)
  const instance = app.mount(container)
  const dialogComponent = instance.$refs.dialog

  return new Promise((resolve) => {
    dialogComponent.getSelection().then(selectedValue => {
      app.unmount()
      document.body.removeChild(container)
      resolve(selectedValue)
    })
  })
}