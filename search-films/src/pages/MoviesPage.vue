<template>
  <div class="bg-gray-50 min-h-screen py-10">
    <div class="container mx-auto px-4">
      <h1 class="text-5xl font-extrabold text-center text-gray-900 mb-10 tracking-tight">Découvrez nos films</h1>

      <!-- Section films -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <MovieCard v-for="movie in movies" :key="movie.id" :movie="movie" />
        <div v-if="movies.length === 0" class="col-span-full text-center text-gray-500">
          Aucun film trouvé.
        </div>
      </div>

      <!-- Pagination -->
      <div v-if="totalPages > 1" class="mt-10 flex justify-center">
        <nav class="relative z-0 inline-flex rounded-md shadow-sm" aria-label="Pagination">
          <a v-if="currentPage > 1" @click="fetchMovies(currentPage - 1)" class="pagination-btn">
            Précédent
          </a>

          <!-- Logic for showing a limited range of pages -->
          <a v-for="page in visiblePages" :key="page" @click="fetchMovies(page)"
             :class="['pagination-btn', { 'active': page === currentPage }]">
            {{ page }}
          </a>

          <a v-if="currentPage < totalPages" @click="fetchMovies(currentPage + 1)" class="pagination-btn">
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

      // Adjust if at the start or end of pagination
      if (this.currentPage <= halfRange) {
        end = Math.min(this.totalPages, this.pageRange);
      } else if (this.currentPage + halfRange >= this.totalPages) {
        start = Math.max(1, this.totalPages - this.pageRange + 1);
      }

      // Create array of pages to display
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

        console.log('Données API:', data);  // Ajoutons ce log

        if (data['hydra:member'] && Array.isArray(data['hydra:member'])) {
          this.movies = data['hydra:member'];
        } else {
          this.movies = [];
        }

        const totalItems = data['hydra:totalItems'] || 0;
        const itemsPerPage = data['hydra:itemsPerPage'] || 1;

        console.log(`Total Items: ${totalItems}, Items per Page: ${itemsPerPage}`);  // Log du calcul des pages

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
.pagination-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 2.5rem;
  height: 2.5rem;
  padding: 0 0.5rem;
  margin: 0 0.25rem;
  font-size: 0.875rem;
  font-weight: 500;
  border-radius: 6px;
  background-color: #fff;
  color: #333;
  border: 1px solid #e2e8f0;
  transition: all 0.3s;
  cursor: pointer;
}

.pagination-btn:hover, .pagination-btn.active {
  background-color: #3498db;
  color: #fff;
  border-color: #3498db;
}
</style>