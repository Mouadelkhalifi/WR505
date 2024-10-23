<template>
  <div>
    <form @submit.prevent="login">
      <input v-model="username" placeholder="Username" />
      <input v-model="password" type="password" placeholder="Password" />
      <button type="submit">Login</button>
    </form>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      username: '',
      password: '',
      isLoggedIn: false,
    };
  },
  methods: {
    async login() {
      // Vérifier si l'utilisateur est déjà connecté
      if (localStorage.getItem('token')) {
        this.isLoggedIn = true;
        this.$router.push('/home'); // Redirection vers la page d'accueil si déjà connecté
        return; // Arrêter la méthode ici
      }

      try {
        // Envoyer la requête d'authentification
        const response = await axios.post('http://symfony.mmi-troyes.fr:8319/auth', {
          username: this.username,
          password: this.password,
        });

        // Vérifier et stocker le token
        if (response.data && response.data.token) {
          localStorage.setItem('token', response.data.token); // Stocker le token
          this.isLoggedIn = true;
          this.$router.push('/accueil'); // Redirection après succès
        }
      } catch (error) {
        console.error('Erreur d\'authentification :', error);
        // Gérer l'erreur, afficher un message à l'utilisateur, etc.
      }
    }
  },
};
</script>
