<template>
  <div>
    <h1>Mon Profil</h1>
    <form @submit.prevent="updateProfile">
      <div>
        <label for="name">Nom:</label>
        <input v-model="profile.name" type="text" id="name" />
      </div>
      <div>
        <label for="email">Email:</label>
        <input v-model="profile.email" type="email" id="email" />
      </div>
      <button type="submit">Mettre à jour</button>
    </form>
  </div>
</template>

<script>
import NavBar from '@/components/NavBar.vue';

export default {
  components: {
    NavBar,
  },
  data() {
    return {
      profile: {
        name: '',
        email: '',
      },
    };
  },
  created() {
    this.fetchProfile();
  },
  methods: {
    async fetchProfile() {
      try {
        const response = await getUserProfile();
        this.profile = response.data;
      } catch (error) {
        console.error('Erreur lors de la récupération du profil:', error);
      }
    },
    async updateProfile() {
      try {
        await updateUserProfile(this.profile);
        alert('Profil mis à jour avec succès');
      } catch (error) {
        console.error('Erreur lors de la mise à jour du profil:', error);
      }
    },
  },
};
</script>

<style scoped>
</style>
