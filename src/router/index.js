import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/achievement'
    },
    {
      path: '/achievement',
      component: () => import('@/views/index.vue'),
      children:[
          {
            path: ':id?',
            name: 'achievement',
            component: () => import('@/views/Achievement/index.vue'),
          }
      ]
    },
    {
      path: '/setting',
      component: () => import('@/views/index.vue'),
      children:[
          {
            path: '',
            name: 'setting',
            component: () => import('@/views/Setting/index.vue'),
          }
      ]
    },
  ]
})

export default router
