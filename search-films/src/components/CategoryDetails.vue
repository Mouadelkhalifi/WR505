<template>
  <main class="category-page">
    <template v-if="category">
      <section class="category-section">
        <div class="content-wrapper">
          <h1 class="category-title">{{ category.title }}</h1>
          <p class="category-info">
            <strong>Créé le :</strong> {{ formatDate(category.created_at) }}
          </p>
          <p v-if="category.updated_at" class="category-info">
            <strong>Mis à jour le :</strong> {{ formatDate(category.updated_at) }}
          </p>
        </div>
      </section>
    </template>

    <div v-else-if="loading" class="loading-state">
      <div class="loader">
        <div class="spinner"></div>
        <span>Chargement...</span>
      </div>
    </div>

    <div v-else class="error-state">
      <p>Erreur lors du chargement des détails de la catégorie.</p>
    </div>
  </main>
</template>

<script>
import axios from 'axios';

export default {
  name: 'CategoryDetails',

  data() {
    return {
      category: null,
      loading: true,
      error: null,
    };
  },

  created() {
    this.fetchCategoryDetails();
  },

  methods: {
    async fetchCategoryDetails() {
      try {
        const categoryId = this.$route.params.id;
        const token = localStorage.getItem('token');

        const response = await axios.get(`http://symfony.mmi-troyes.fr:8319/api/categories/${categoryId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          }
        });

        this.category = response.data;
      } catch (error) {
        this.error = error.message;
        if (error.response?.status === 401) {
          localStorage.removeItem('token');
          this.$router.push('/login');
        }
      } finally {
        this.loading = false;
      }
    },

    formatDate(date) {
      return new Date(date).toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    }
  }
};
</script>

<style scoped>
.category-page {
  min-height: 100vh;
  background-color: var(--background);
  color: var(--text-dark);
}

.category-section {
  padding: 4rem 0;
  text-align: center;
}

.content-wrapper {
  max-width: 800px;
  margin: 0 auto;
  padding: 0 1.5rem;
}

.category-title {
  font-size: 2.5rem;
  font-weight: bold;
  color: var(--primary);
}

.category-info {
  font-size: 1.2rem;
  margin-top: 1rem;
}

.loading-state, .error-state {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 50vh;
  text-align: center;
  font-size: 1.5rem;
  color: var(--text-dark);
}

.loader .spinner {
  width: 50px;
  height: 50px;
  border: 4px solid var(--primary-light);
  border-top-color: var(--primary);
  border-radius: 50%;
  animation: spin 1s infinite linear;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.error-state p {
  color: var(--primary-dark);
  padding: 1rem;
  background-color: #f8d7da;
  border: 1px solid #f5c6cb;
  border-radius: 0.5rem;
}
</style>
