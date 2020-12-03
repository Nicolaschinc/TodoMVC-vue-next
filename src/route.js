import { createRouter, createWebHistory } from 'vue-router';

const routes = [
    {
        path: '/', 
        redirect: '/home'
    },
    {
        path: '/home', 
        name: 'Home',
        component: () => import('./Home.vue')
    }
]

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
});

// ['all', 'active', 'completed'].forEach(function (visibility) {
//     router.onReady(visibility, function () {
//         console.log('visibility:', visibility);
//     });
// });

// router.configure({
//     notfound: function () {
//         window.location.hash = '';
//         // app.visibility = 'all';
//     }
// });

export default router;
