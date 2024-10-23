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
      <div v-if="totalPages > 1" class="pagination-theme mt-10 flex justify-center">
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
    async fetchMovies(page = 1) {
      try {
        const response = await fetch(`http://symfony.mmi-troyes.fr:8319/api/movies?page=${page}`);
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
        this.movies = [];
        this.totalPages = 1;
      }
    }
  }
}
</script>

<style scoped>

.pagination-theme {
  display: flex;
  justify-content: center;
  padding-top: 15px;
}
/* Pagination container */
.pagination {
  display: inline-flex;
  gap: 12px;
  padding: 12px;
  border-radius: 8px;
  background-color: #2b2a2a; /* background léger */
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

/* Buttons styling */
.pagination-btn {
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  background-color: rgba(0, 0, 0, 0.18);
  color: #8a0909;
  font-size: 1rem;
  font-weight: 500;
  border: 1px solid #2b2a2a;
  transition: background-color 0.3s ease, color 0.3s ease;
  cursor: pointer;
}

.pagination-btn:hover {
  background-color: #e50914; /* couleur distinctive */
  color: #2b2a2a;
}

.pagination-btn.active {
  background-color: #e50914;
  color: #2b2a2a;
  border-color: #e50914;
}

/* Specific styles for prev/next buttons */
.pagination-btn.prev,
.pagination-btn.next {
  background-color: #2b2a2a;
}

.pagination-btn.prev:hover,
.pagination-btn.next:hover {
  background-color: #e50914;
  color: #2b2a2a;
}
</style>
