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
      ],
      meta: {
        title: '黎愔成就'
      }
    },
    {
      path: '/character',
      component: () => import('@/views/index.vue'),
      children:[
          {
            path: '',
            name: 'character',
            component: () => import('@/views/Character/index.vue'),
          }
      ],
      meta: {
        title: '角色列表'
      }
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
      ],
      meta: {
        title: '设置'
      }
    },
  ]
})

// 设置导航栏标签名称
router.beforeEach((to, from, next) => {
  document.title = to.meta.title || '黎愔成就';
  next();
});

export default router
