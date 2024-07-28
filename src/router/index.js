import { createRouter, createWebHistory } from 'vue-router'
import ChatView from '../views/ChatView.vue'
import { useUserStore } from '../stores/user'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'chat',
      component: ChatView
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue')
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('../views/RegisterView.vue')
    }
  ]
})

export function authGuard() {
  const userStore = useUserStore()

  router.beforeEach((to, from, next) => {
    if (to.path !== '/login' && to.path !== '/register' && !userStore.isLoggedIn()) {
      next('/login')
    } else if (to.path == '/logout') {
      userStore.logout()
      next('/login')
    } else {
      next()
    }
  })
}

export default router
