// main.js
import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import './assets/global.css';

createApp(App)
    .use(router)  // Utilisation du routeur pour la navigation
    .mount('#app');  // Montre l'application dans l'élément avec l'ID `app`
