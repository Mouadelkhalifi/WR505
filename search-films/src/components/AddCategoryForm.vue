<template>
  <div>
    <h2>Ajouter une Catégorie</h2>
    <form @submit.prevent="submitForm">
      <div>
        <label for="title">Titre :</label>
        <input v-model="category.title" type="text" id="title" required />
      </div>
      <button type="submit">Ajouter</button>
    </form>
  </div>
</template>

<script>
import { addCategory } from '@/services/api'; // Assurez-vous que cette fonction existe dans api.js

export default {
  data() {
    return {
      category: {
        title: '',
      },
    };
  },
  methods: {
    async submitForm() {
      try {
        await addCategory(this.category);
        alert('Catégorie ajoutée avec succès');
        this.category.title = ''; // Reset du formulaire après ajout
      } catch (error) {
        console.error('Erreur lors de l\'ajout de la catégorie:', error);
      }
    },
  },
};
</script>

<style scoped>
/* Ajoutez ici vos styles */
</style>
