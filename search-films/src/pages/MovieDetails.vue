<template>
  <div class="movie-details">
    <h1>{{ movie.title }}</h1>
    <img :src="movie.media" :alt="movie.title" class="movie-image" />
    <p><strong>Durée :</strong> {{ movie.duration }} minutes</p>
    <p><strong>Réalisateur :</strong> {{ movie.director }}</p>
    <p><strong>Description :</strong> {{ movie.description }}</p>

    <!-- Liste des acteurs -->
    <div class="actors">
      <h2>Acteurs</h2>
      <ul>
        <li v-for="actor in movie.actors" :key="actor.id">
          {{ actor.firstname }} {{ actor.lastname }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      movie: null,
    };
  },
  created() {
    this.fetchMovieDetails();
  },
  methods: {
    async fetchMovieDetails() {
      try {
        const movieId = this.$route.params.id; // Récupère l'ID du film depuis l'URL
        const response = await axios.get(`http://symfony.mmi-troyes.fr:8319/api/movies/${movieId}`);
        this.movie = response.data;
      } catch (error) {
        console.error('Erreur lors de la récupération des détails du film :', error);
      }
    },
  },
};
</script>

<style scoped>
.movie-details {
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 10px;
}

.movie-image {
  width: 100%;
  height: auto;
  border-radius: 8px;
  margin-bottom: 20px;
}

.actors {
  margin-top: 20px;
}

.actors ul {
  list-style: none;
  padding: 0;
}

.actors li {
  margin-bottom: 10px;
}
</style>
