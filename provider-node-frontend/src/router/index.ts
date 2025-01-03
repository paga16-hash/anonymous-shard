import { createRouter, createWebHistory, type Router } from 'vue-router'
import BasicLayout from "../layouts/BasicLayout.vue";
import NotificationView from "../views/TaskView.vue";
import NotFoundView from "../views/NotFoundView.vue";

const router: Router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: BasicLayout,
      children: [
        {
          path: '',
          redirect: '/home'
        },
        {
          path: 'home',
          name: 'Home',
          component: NotificationView
        },
      ]
    },
    {
      path: '/:catchAll(.*)',
      name: 'NotFound',
      component: NotFoundView
    }
  ]
})

export default router
