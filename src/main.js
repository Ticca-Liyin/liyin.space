import 'element-plus/theme-chalk/dark/css-vars.css'
import '@/assets/captcha/tac/css/tac.css'
import '@/assets/theme.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createPersistedState } from 'pinia-plugin-persistedstate'

import App from './App.vue'
import router from './router'

const app = createApp(App)

// 全局指令，用于阻止元素的拖动操作
const preventDragStart = {
    beforeMount(el, binding) {
      if (binding.value) {
        el.addEventListener('dragstart', function(event) {
          event.preventDefault();
        });
      }
    }
};

app.directive('preventDragStart', preventDragStart);

const pinia = createPinia()
const persist = createPersistedState()
pinia.use(persist)

app.use(pinia)
app.use(router)

app.mount('#app')