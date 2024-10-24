<template>
  <div class="container">
    <h1>Catégories</h1>

    <div v-if="errorMessage" class="error-card">
      <div class="error-content">
        {{ errorMessage }}
      </div>
    </div>

    <div v-else class="categories-grid">
      <div v-for="category in categories"
           :key="category.id"
           class="card category-card">
        <div class="card-content">
          <h3>{{ category.title }}</h3>
          <p class="date">Créé le {{ formatDate(category.createdAt) }}</p>
          <div class="card-actions">
            <button class="btn">Voir les films</button>
          </div>
        </div>
      </div>
    </div>

    <div v-if="totalPages > 1" class="pagination-container">
      <nav class="pagination" aria-label="Navigation des pages">
        <button
            v-if="currentPage > 1"
            @click="fetchCategories(currentPage - 1)"
            class="pagination-btn"
            :class="{'btn-hover': currentPage > 1}">
          ← Précédent
        </button>

        <div class="pagination-numbers">
          <button
              v-for="page in visiblePages"
              :key="page"
              @click="fetchCategories(page)"
              class="pagination-btn"
              :class="{ 'active': page === currentPage }">
            {{ page }}
          </button>
        </div>

        <button
            v-if="currentPage < totalPages"
            @click="fetchCategories(currentPage + 1)"
            class="pagination-btn"
            :class="{'btn-hover': currentPage < totalPages}">
          Suivant →
        </button>
      </nav>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      categories: [],
      errorMessage: null,
      currentPage: 1,
      totalPages: 1,
      pageRange: 5,
    };
  },
  computed: {
    visiblePages() {
      const halfRange = Math.floor(this.pageRange / 2);
      let start = Math.max(1, this.currentPage - halfRange);
      let end = Math.min(this.totalPages, this.currentPage + halfRange);

      if (this.currentPage <= halfRange) {
        end = Math.min(this.totalPages, this.pageRange);
      } else if (this.currentPage + halfRange >= this.totalPages) {
        start = Math.max(1, this.totalPages - this.pageRange + 1);
      }

      const pages = [];
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      return pages;
    }
  },
  methods: {
    isAuthenticated() {
      return !!localStorage.getItem('token');
    },
    formatDate(dateString) {
      return new Date(dateString).toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
    },
    async fetchCategories(page = 1) {
      if (!this.isAuthenticated()) {
        window.location.href = '/login';
        return;
      }

      const token = localStorage.getItem('token');

      const requestOptions = {
        method: "GET",
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        redirect: "follow"
      };

      try {
        const response = await fetch(`http://symfony.mmi-troyes.fr:8319/api/categories?page=${page}`, requestOptions);
        const result = await response.json();

        if (result['hydra:member']) {
          this.categories = result['hydra:member'];
          this.totalPages = Math.ceil(result['hydra:totalItems'] / 10);
          this.currentPage = page;
        } else {
          this.categories = [];
          this.totalPages = 1;
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des catégories :", error);
        if (error.response && error.response.status === 401) {
          localStorage.removeItem('token');
          window.location.href = '/login';
        } else {
          this.errorMessage = "Impossible de récupérer les catégories.";
        }
      }
    }
  },
  created() {
    this.fetchCategories();
  }
};
</script>

<style scoped>
.categories-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 2rem;
  margin: 2rem 0;
}

.category-card {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.card-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.card-content h3 {
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: var(--text-color);
}

.date {
  color: var(--text-light);
  font-size: 0.9rem;
  margin-bottom: 1rem;
}

.card-actions {
  margin-top: auto;
}

.error-card {
  background: var(--card-background);
  border-radius: var(--border-radius);
  padding: 2rem;
  margin: 2rem 0;
  border-left: 4px solid var(--primary-color);
}

.error-content {
  color: var(--primary-color);
  font-weight: 500;
}

.pagination-container {
  margin-top: 3rem;
  margin-bottom: 2rem;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: var(--card-background);
  border-radius: var(--border-radius);
  box-shadow: var(--card-shadow);
}

.pagination-numbers {
  display: flex;
  gap: 0.5rem;
}

.pagination-btn {
  background: transparent;
  color: var(--text-color);
  border: 1px solid var(--primary-color);
  padding: 0.5rem 1rem;
  border-radius: var(--border-radius);
  transition: all var(--transition-speed);
  cursor: pointer;
  font-weight: 500;
}

.pagination-btn:hover,
.btn-hover {
  background: var(--primary-color);
  color: var(--secondary-color);
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(229, 9, 20, 0.3);
}

.pagination-btn.active {
  background: var(--primary-color);
  color: var(--secondary-color);
}

@media (max-width: 768px) {
  .categories-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .pagination {
    flex-direction: column;
    gap: 1rem;
  }

  .pagination-numbers {
    order: -1;
  }
}
</style>
