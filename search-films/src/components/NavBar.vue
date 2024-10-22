<template>
  <nav class="navbar">
    <ul class="nav-list">
      <li><router-link to="/">Homepage</router-link></li>
      <li><router-link to="/movies">Movies</router-link></li>
      <li><router-link to="/actors">Actors</router-link></li>
      <li><router-link to="/categories">Categories</router-link></li>
      <li><router-link to="/profile">Edit Profile</router-link></li>
      <li><button @click="logout">Logout</button></li>
    </ul>
  </nav>
</template>

<script>
export default {
  methods: {
    logout() {
      // Logique pour déconnecter l'utilisateur
      console.log('User logged out');
      this.$router.push('/login'); // Rediriger vers la page de connexion après la déconnexion
    }
  }
}
</script>

<style scoped>


</style>
