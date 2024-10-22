<template>
  <div>
    <h1>Liste des Films</h1>
    <div v-for="movie in movies" :key="movie.id" class="movie-card">
      <h2>{{ movie.title }}</h2>
      <p>Catégories: {{ movie.categories.join(', ') }}</p>
      <p>Acteurs: {{ movie.actors.join(', ') }}</p>
    </div>

    <!-- Pagination -->
    <div class="pagination">
      <button @click="changePage(currentPage - 1)" :disabled="currentPage === 1">Précédent</button>
      <span>Page {{ currentPage }} sur {{ totalPages }}</span>
      <button @click="changePage(currentPage + 1)" :disabled="currentPage === totalPages">Suivant</button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      movies: [],
      currentPage: 1,
      totalPages: 1,
    };
  },
  mounted() {
    this.fetchMovies();
  },
  methods: {
    fetchMovies(page = 1) {
      fetch(`http://symfony.mmi-troyes.fr:8319/api/movies`)
          .then(response => response.json())
          .then(data => {
            this.movies = data.movies;
            this.currentPage = data.currentPage;
            this.totalPages = data.totalPages;
          })
          .catch(error => {
            console.error('Erreur lors de la récupération des films :', error);
          });
    },
    changePage(page) {
      if (page >= 1 && page <= this.totalPages) {
        this.fetchMovies(page);
      }
    },
  },
};
</script>

<style scoped>

</style>
