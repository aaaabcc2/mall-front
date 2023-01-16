import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '../stores/user'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import ('../views/HomeView.vue')
    },
    {
      path: '/login',
      name: 'Login',
      component: () => import ('../views/Login.vue') 
    },
    {
      path: '/register',
      name: 'Register',
      component: () => import('../views/Register.vue')
    },
  ]
})

export default router
