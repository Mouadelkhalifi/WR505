<template>
  <div>
    <h1>Homepage</h1>
    <section>
      <h2>Derniers Films</h2>
      <MovieCard v-for="movie in latestMovies" :key="movie.id" :movie="movie" />
    </section>
    <section>
      <h2>Derniers Acteurs</h2>
      <ActorCard v-for="actor in latestActors" :key="actor.id" :actor="actor" />
    </section>
  </div>
</template>

<script>
import MovieCard from '@/components/MovieCard.vue';
import ActorCard from '@/components/ActorCard.vue';

export default {
  components: { MovieCard, ActorCard },
  data() {
    return {
      latestMovies: [],
      latestActors: []
    };
  },
  mounted() {
    this.fetchLatestMovies();
    this.fetchLatestActors();
  },
  methods: {
    async fetchLatestMovies() {
      const response = await fetch('http://symfony.mmi-troyes.fr:8319/api/movies');
      const data = await response.json();
      this.latestMovies = data['hydra:member'].slice(0, 4);
    },
    async fetchLatestActors() {
      const response = await fetch('http://symfony.mmi-troyes.fr:8319/api/actors');
      const data = await response.json();
      this.latestActors = data['hydra:member'].slice(0, 4);
    }
  }
}
</script>
