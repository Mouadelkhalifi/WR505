<template>
  <div class="bg-gray-50 min-h-screen py-10">
    <div class="container mx-auto px-4">
      <h1 class="text-5xl font-extrabold text-center text-gray-900 mb-10 tracking-tight">Découvrez nos films</h1>

      <!-- Search Bar -->
      <div class="search-bar mb-8">
        <form @submit.prevent="searchFilm">
          <label for="search" class="sr-only">Rechercher :</label>
          <input id="search" ref="searchInput" type="text" v-model="query" placeholder="Rechercher un film..." class="search-input"/>
        </form>
      </div>

      <!-- Add Movie Button -->
      <div class="flex justify-end mb-8">
        <button @click="openAddMovieForm" class="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700">Add Movie</button>
      </div>

      <!-- Movies Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <MovieCard v-for="movie in movies" :key="movie.id" :movie="movie" :actors="actors" @update-movie="updateMovieInList" @movie-deleted="removeMovieFromList" />
        <div v-if="movies.length === 0" class="col-span-full text-center text-gray-500">
          Aucun film trouvé.
        </div>
      </div>

      <!-- Pagination -->
      <div v-if="totalPages > 1" class="pagination-container mt-10 flex justify-center">
        <nav class="pagination" aria-label="Pagination">
          <a v-if="currentPage > 1" @click="fetchMovies(currentPage - 1)" class="pagination-btn prev">Précédent</a>
          <a v-for="page in visiblePages" :key="page" @click="fetchMovies(page)"
             :class="['pagination-btn', { 'active': page === currentPage }]">{{ page }}</a>
          <a v-if="currentPage < totalPages" @click="fetchMovies(currentPage + 1)" class="pagination-btn next">Suivant</a>
        </nav>
      </div>

      <!-- Add Movie Modal -->
      <AddMovieModal
          :showModal="showAddMovieForm"
          :isEditMode="isEditMode"
          :movie="newMovie"
          :actors="actors"
          @close="closeAddMovieForm"
          @add-movie="addMovie"
      />
    </div>
  </div>
</template>

<script>
import MovieCard from '@/components/MovieCard.vue';
import AddMovieModal from '@/components/AddMovieModal.vue';

export default {
  components: { MovieCard, AddMovieModal },
  data() {
    return {
      movies: [],
      currentPage: 1,
      totalPages: 1,
      pageRange: 5,
      query: '',
      showAddMovieForm: false,
      isEditMode: false,
      newMovie: {
        id: '',
        title: '',
        description: '',
        duration: '',
        release_date: '',
        actors: [],
        director: '',
        created_at: ''
      },
      actors: [],
      typingTimer: null
    };
  },
  mounted() {
    this.fetchMovies();
    this.fetchActors();
    this.$refs.searchInput?.focus();
  },
  watch: {
    query() {
      clearTimeout(this.typingTimer);
      this.typingTimer = setTimeout(() => {
        this.currentPage = 1;
        this.fetchMovies();
      }, 500);
    }
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
    async fetchMovies(page = 1) {
      if (!this.isAuthenticated()) {
        window.location.href = '/login';
        return;
      }

      const token = localStorage.getItem('token');
      const url = this.query
          ? `http://symfony.mmi-troyes.fr:8319/api/movies?title=${this.query}&page=${page}`
          : `http://symfony.mmi-troyes.fr:8319/api/movies?page=${page}`;

      try {
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
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
        this.movies = [];
        this.totalPages = 1;
      }
    },
    async fetchActors() {
      const token = localStorage.getItem('token');
      const url = `http://symfony.mmi-troyes.fr:8319/api/actors`;

      try {
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        const data = await response.json();
        console.log("Fetched actors:", data);

        if (data['hydra:member'] && Array.isArray(data['hydra:member'])) {
          this.actors = data['hydra:member'];
        }

      } catch (error) {
        console.error("Erreur lors de la récupération des acteurs:", error);
      }
    },
    openAddMovieForm() {
      this.showAddMovieForm = true;
      this.isEditMode = false;
      this.newMovie = {
        title: '',
        description: '',
        duration: '',
        release_date: '',
        actors: [],
        director: '',
        created_at: ''
      };
    },
    closeAddMovieForm() {
      this.showAddMovieForm = false;
    },
    async addMovie() {
      const token = localStorage.getItem('token');
      const url = `http://symfony.mmi-troyes.fr:8319/api/movies`;

      if (!this.newMovie.title || !this.newMovie.description || !this.newMovie.release_date || !this.newMovie.duration) {
        console.error("All fields are required before adding a movie.");
        return;
      }

      const moviePayload = {
        title: this.newMovie.title,
        description: this.newMovie.description,
        duration: parseInt(this.newMovie.duration, 10),
        release_date: this.newMovie.release_date,
        actors: this.newMovie.actors.length > 0 ? this.newMovie.actors : [],
        director: this.newMovie.director || 'Unknown',
        created_at: this.newMovie.created_at || new Date().toISOString()
      };

      try {
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(moviePayload)
        });

        const result = await response.json();
        console.log("Server response after adding movie:", result);

        if (!response.ok) {
          console.error("Erreur lors de l'ajout du film:", result);
          throw new Error(`Erreur lors de l'ajout du film: ${response.statusText}`);
        }

        this.fetchMovies();
        this.closeAddMovieForm();

      } catch (error) {
        console.error("Erreur lors de l'ajout du film:", error);
      }
    },
    updateMovieInList(updatedMovie) {
      const index = this.movies.findIndex(movie => movie.id === updatedMovie.id);
      if (index !== -1) {
        this.movies[index] = { ...updatedMovie }; // Remplacement direct pour réactivité
      }
    },
    removeMovieFromList(movieId) {
      this.movies = this.movies.filter(movie => movie.id !== movieId);
    }
  }
};
</script>




<style scoped>
.search-bar {
  display: flex;
  justify-content: center;
  margin-bottom: 2rem;
}

.search-input {
  width: 100%;
  max-width: 400px;
  padding: 0.5rem 1rem;
  border-radius: 5px;
  border: 1px solid #ccc;
  font-size: 1rem;
  box-shadow: var(--card-shadow);
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

.pagination-btn {
  background: transparent;
  color: var(--text-color);
  border: 1px solid var(--primary-color);
  padding: 0.5rem 1rem;
  border-radius: var(--border-radius);
  cursor: pointer;
  font-weight: 500;
  transition: all var(--transition-speed);
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
</style>
