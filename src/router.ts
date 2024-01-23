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
  {
    path: '/Dummy3',
    name: 'Dummy3',
    component: () => import('./views/Dummy3.vue'),
  },
  {
    path: '/Village',
    name: 'Village',
    component: () => import('./views/Village.vue'),
  },
  {
    path: '/Axis',
    name: 'Axis',
    component: () => import('./views/Axis.vue'),
  },
  {
    path: '/Car',
    name: 'Car',
    component: () => import('./views/Car.vue'),
  },
  {
    path: '/CarAnimation',
    name: 'CarAnimation',
    component: () => import('./views/CarAnimation.vue'),
  },
  {
    path: '/MovePOV',
    name: 'MovePOV',
    component: () => import('./views/MovePOV.vue'),
  },
  {
    path: '/WalkAroundVillage',
    name: 'WalkAroundVillage',
    component: () => import('./views/WalkAroundVillage.vue'),
  },
  {
    path: '/BasicCollisions',
    name: 'BasicCollisions',
    component: () => import('./views/BasicCollisions.vue'),
  },
  // BasicCollisions
];

/** Vue Router */
const router: Router = createRouter({
  history: createWebHistory(),
  routes,
});

export const routeList = routes.map((item) => item.name).filter(Boolean);

export default router;
