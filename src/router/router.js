import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  // base: process.env.BASE_URL,
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      component: () => import(/* webpackChunkName: "mainLayout" */ '../views/MainLayout.vue'),
      meta: { requiresAuth: true },
      children: [
        {
            path: '/',
            name: 'home',
            component: () => import(/* webpackChunkName: "home" */ '../components/Home/Home.vue')
        },
        {
          path: '/create-room',
          name: 'create-room',
          component: () => import(/* webpackChunkName: "createroom" */ '../components/CreateRoom/CreateRoom.vue')
        },
        {
          path: '/chat-room/*',
          name: 'chat-room',
          component: () => import(/* webpackChunkName: "chatroom" */ '../components/ChatRoom/ChatRoom.vue')
        },
        {
          path: '/lobby',
          name: 'lobby',
          component: () => import(/* webpackChunkName: "lobby" */ '../components/Lobby/Lobby.vue')
        }
      ]
    }
  ]
})

export default router
