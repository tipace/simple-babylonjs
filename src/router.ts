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
  {
    path: '/DistantHills',
    name: 'DistantHills',
    component: () => import('./views/DistantHills.vue'),
  },
  {
    path: '/SkyBox',
    name: 'SkyBox',
    component: () => import('./views/SkyBox.vue'),
  },
  {
    path: '/SpriteTree',
    name: 'SpriteTree',
    component: () => import('./views/SpriteTree.vue'),
  },
  {
    path: '/Fountain',
    name: 'Fountain',
    component: () => import('./views/Fountain.vue'),
  },
  {
    path: '/ParticleSpray',
    name: 'ParticleSpray',
    component: () => import('./views/ParticleSpray.vue'),
  },
  {
    path: '/StreetLight',
    name: 'StreetLight',
    component: () => import('./views/StreetLight.vue'),
  },
  {
    path: '/StreetLight2',
    name: 'StreetLight2',
    component: () => import('./views/StreetLight2.vue'),
  },
  {
    path: '/NightToDay',
    name: 'NightToDay',
    component: () => import('./views/NightToDay.vue'),
  },
  // NightToDay
];

/** Vue Router */
const router: Router = createRouter({
  history: createWebHistory(),
  routes,
});

export const routeList = routes.map((item) => item.name).filter(Boolean);

export default router;
