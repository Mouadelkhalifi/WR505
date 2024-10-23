// src/router.js
import { createRouter, createWebHistory } from 'vue-router';
import MoviesPage from './pages/MoviesPage.vue';
import LoginForm from './components/LoginForm.vue';
import HomePage from '@/pages/HomePage.vue';
import ActorsPage from "@/pages/ActorsPage.vue";
import CategoriesPage from "@/pages/CategoriesPage.vue";
import ProfilePage from "@/pages/ProfilePage.vue";
import ActorCard from "@/components/ActorCard.vue";

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
    },
    {
        path: '/actors/:id',
        name: 'ActorDetails',
        component: ActorCard,
    }

];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;
