import { createRouter, createWebHistory } from 'vue-router';
import MoviesPage from './pages/MoviesPage.vue';
import LoginForm from './components/LoginForm.vue';
import HomePage from '@/pages/HomePage.vue';
import ActorsPage from "@/pages/ActorsPage.vue";
import CategoriesPage from "@/pages/CategoriesPage.vue";
import ProfilePage from "@/pages/ProfilePage.vue";
import ActorCard from "@/components/ActorCard.vue";
import MovieDetails from "@/components/MovieDetails.vue";
import ActorDetails from "@/components/ActorDetails.vue";

function isAuthenticated() {
    return !!localStorage.getItem('token');
}

const routes = [
    {
        path: '/',
        redirect: '/home',
    },
    {
        path: '/movies',
        name: 'Movies',
        component: MoviesPage,
    },
    {
        path: '/login',
        name: 'Login',
        component: LoginForm,
    },
    {
        path: '/home',
        name: 'Home',
        component: HomePage,
    },
    {
        path: '/actors',
        name: 'Actors',
        component: ActorsPage,
    },
    {
        path: '/categories',
        name: 'Categories',
        component: CategoriesPage,
    },
    {
        path: '/profile',
        name: 'Profile',
        component: ProfilePage,
        meta: { requiresAuth: true },
    },
    {
        path: '/actors/:id',
        name: 'ActorDetails',
        component: ActorCard,
    },
    {
        path: '/logout',
        name: 'Logout',
        beforeEnter(to, from, next) {
            localStorage.removeItem('token');

            window.location.href = '/login';

            next({ name: 'Login' });
        },
    },
    {
        path: '/movies/:id',
        name: 'MovieDetails',
        component: MovieDetails,
    },
    {
        path: '/actors/:id',
        name: 'ActorDetails',
        component: ActorDetails,
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

router.beforeEach((to, from, next) => {
    if (to.matched.some(record => record.meta.requiresAuth)) {
        if (!isAuthenticated()) {
            next({ name: 'Login' });
        } else {
            next();
        }
    } else {
        next();
    }
});

export default router;
