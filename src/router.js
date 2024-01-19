import { createRouter, createWebHistory } from 'vue-router';

/** Router Rules */
const routes = [
  {
    path: '/',
    redirect: '/Xinyan',
  },
  {
    path: '/Cube',
    name: 'Cube',
    component: () => import('./views/Cube.vue'),
  },
  {
    path: '/Xbot',
    name: 'Xbot',
    component: () => import('./views/Xbot.vue'),
  },
  {
    path: '/Xinyan',
    name: 'Xinyan',
    component: () => import('./views/Xinyan.vue'),
  },
  {
    path: '/Weapons',
    name: 'Weapons',
    component: () => import('./views/Weapons.vue'),
  },
];

/** Vue Router */
const router = createRouter({
  history: createWebHistory(),
  routes,
});

export const routeList = routes.map((item) => item.name).filter(Boolean);

export default router;
