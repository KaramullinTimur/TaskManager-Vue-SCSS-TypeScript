import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/Home.vue')
  },
  {
    path: '/list',
    name: 'TaskList',
    component: () => import('../views/TaskList.vue')
  },
  {
    path: '/create',
    name: 'CreateTask',
    component: () => import('../views/CreateTask.vue')
  },
  {
    path: '/edit/:id',
    name: 'EditTask',
    component: () => import('../views/EditTask.vue')
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
