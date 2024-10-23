// src/router.js
import { createRouter, createWebHistory } from 'vue-router';
import MoviesPage from './pages/MoviesPage.vue';
import LoginForm from './components/LoginForm.vue';
import HomePage from '@/pages/HomePage.vue';
import ActorsPage from "@/pages/ActorsPage.vue";
import CategoriesPage from "@/pages/CategoriesPage.vue";
import ProfilePage from "@/pages/ProfilePage.vue";
import ActorCard from "@/components/ActorCard.vue";

// Fonction pour vérifier l'authentification
function isAuthenticated() {
    // Vérifie la présence d'un token dans le localStorage
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
        meta: { requiresAuth: true }, // Page protégée, nécessite une authentification
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
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

// Navigation Guard global pour vérifier les routes protégées
router.beforeEach((to, from, next) => {
    if (to.matched.some(record => record.meta.requiresAuth)) {
        // Vérifie si la route nécessite une authentification
        if (!isAuthenticated()) {
            // Si l'utilisateur n'est pas authentifié, redirection vers la page de login
            next({ name: 'Login' });
        } else {
            // Si l'utilisateur est authentifié, continuer
            next();
        }
    } else {
        // Si la route ne nécessite pas d'authentification, continuer
        next();
    }
});

export default router;
