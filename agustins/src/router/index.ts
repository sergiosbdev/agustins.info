import {createRouter, createWebHistory} from 'vue-router';

const routes = [
    {
        path: '/',
        name: 'Home',
        component: () => import('@/views/Home.vue'),
        meta: {label: 'Home'}
    },
    {
        path: '/infantil',
        name: 'Infantil',
        component: () => import('@/views/Infantil.vue'),
        meta: {label: 'Home'}
    },
    {
        path: '/petits',
        name: 'Petits',
        component: () => import('@/views/Petits.vue'),
        meta: {label: 'Home'}
    },
    {
        path: '/mitjans',
        name: 'Mitjans',
        component: () => import('@/views/Mitjans.vue'),
        meta: {label: 'Home'}
    },
    {
        path: '/grans',
        name: 'Grans',
        component: () => import('@/views/Grans.vue'),
        meta: {label: 'Home'}
    },
    {
        path: '/joves',
        name: 'Joves',
        component: () => import('@/views/Joves.vue'),
        meta: {label: 'Home'}
    },
];

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes,
    scrollBehavior(to, from, savedPosition) {
        return savedPosition || { top: 0 };
      }
});

export default router;