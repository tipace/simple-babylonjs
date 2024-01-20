import {
  createRouter,
  createWebHistory,
  type Router,
  type RouteRecordRaw,
} from 'vue-router';

/** Router Rules */
const routes: RouteRecordRaw[] = [
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
  {
    path: '/PBRSubsurface',
    name: 'PBRSubsurface',
    component: () => import('./views/PBRSubsurface.vue'),
  },
  {
    path: '/Yeti',
    name: 'Yeti',
    component: () => import('./views/Yeti.vue'),
  },
];

/** Vue Router */
const router: Router = createRouter({
  history: createWebHistory(),
  routes,
});

export const routeList = routes.map((item) => item.name).filter(Boolean);

export default router;
