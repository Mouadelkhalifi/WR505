<template>
  <div class="bg-gray-50 min-h-screen py-10">
    <div class="container mx-auto px-4">
      <h1 class="text-5xl font-extrabold text-center text-gray-900 mb-10 tracking-tight">Découvrez nos films</h1>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <MovieCard v-for="movie in movies" :key="movie.id" :movie="movie" />
        <div v-if="movies.length === 0" class="col-span-full text-center text-gray-500">
          Aucun film trouvé.
        </div>
      </div>

      <!-- Pagination -->
      <div v-if="totalPages > 1" class="pagination-container mt-10 flex justify-center">
        <nav class="pagination" aria-label="Pagination">
          <a v-if="currentPage > 1" @click="fetchMovies(currentPage - 1)" class="pagination-btn prev">
            Précédent
          </a>

          <a v-for="page in visiblePages" :key="page" @click="fetchMovies(page)"
             :class="['pagination-btn', { 'active': page === currentPage }]">
            {{ page }}
          </a>

          <a v-if="currentPage < totalPages" @click="fetchMovies(currentPage + 1)" class="pagination-btn next">
            Suivant
          </a>
        </nav>
      </div>

    </div>
  </div>
</template>

<script>
import MovieCard from '@/components/MovieCard.vue';

export default {
  components: { MovieCard },
  data() {
    return {
      movies: [],
      currentPage: 1,
      totalPages: 1,
      pageRange: 5  // Nombre de pages visibles autour de la page actuelle
    };
  },
  mounted() {
    this.fetchMovies();
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
      // Vérifie si un token existe dans le localStorage
      return !!localStorage.getItem('token');
    },
    async fetchMovies(page = 1) {
      if (!this.isAuthenticated()) {
        // Si l'utilisateur n'est pas authentifié, rediriger vers la page de connexion
        window.location.href = '/login';
        return;
      }

      const token = localStorage.getItem('token');
      try {
        const response = await fetch(`http://symfony.mmi-troyes.fr:8319/api/movies?page=${page}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,  // Ajoute le token dans l'en-tête Authorization
            'Content-Type': 'application/json'
          }
        });

        const data = await response.json();

        if (data['hydra:member'] && Array.isArray(data['hydra:member'])) {
          this.movies = data['hydra:member'];
        } else {
          this.movies = [];
        }

        const totalItems = data['hydra:totalItems'] || 0;
        const itemsPerPage = data['hydra:itemsPerPage'] || 1;

        this.totalPages = Math.ceil(totalItems / itemsPerPage);
        this.currentPage = page;

      } catch (error) {
        console.error("Erreur lors de la récupération des films:", error);
        if (error.response && error.response.status === 401) {
          // Si une erreur d'autorisation (401) survient, supprimer le token et rediriger vers login
          localStorage.removeItem('token');
          window.location.href = '/login';
        }
        this.movies = [];
        this.totalPages = 1;
      }
    }
  }
}
</script>

<style scoped>
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
  .pagination {
    flex-direction: column;
    gap: 1rem;
  }

  .pagination-numbers {
    order: -1;
  }
}
</style>
