<template>
  <div class="actors-list">
    <h2>Acteurs associés au film</h2>
    <!-- Vérifie si les acteurs sont récupérés -->
    <div v-if="actors.length > 0">
      <div v-for="actor in actors" :key="actor.id" class="actor-card">
        <h2>{{ actor.firstname }} {{ actor.lastname }}</h2>
        <button @click="goToDetails(actor.id)">Voir Détails</button>
      </div>
    </div>
    <div v-else>
      <p>Chargement des acteurs...</p>
    </div>

    <!-- Pagination -->
    <div class="pagination">
      <button @click="fetchActorsData(currentPage - 1)" :disabled="currentPage <= 1">Précédent</button>
      <span>Page {{ currentPage }} sur {{ totalPages }}</span>
      <button @click="fetchActorsData(currentPage + 1)" :disabled="currentPage >= totalPages">Suivant</button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    movieId: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      actors: [],
      currentPage: 1,
      totalPages: 1,
      loading: true
    };
  },
  methods: {
    async fetchActorsData(page = 1) {
      this.loading = true;

      const requestOptions = {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        },
        redirect: "follow"
      };

      try {
        const response = await fetch(`http://symfony.mmi-troyes.fr:8319/api/actors?page=${page}`, requestOptions);
        const data = await response.json();

        const actorsForMovie = data['hydra:member'].filter(actor => {
          return actor.movies.includes(this.movieId); // Assure que l'acteur fait partie de ce film
        });

        this.actors = actorsForMovie;
        this.currentPage = page;
        this.totalPages = data['hydra:totalPages'];
      } catch (error) {
        console.error('Erreur lors de la récupération des acteurs :', error);
      } finally {
        this.loading = false;
      }
    },
    goToDetails(actorId) {
      this.$router.push(`/actors/${actorId}`);
    }
  },
  mounted() {
    this.fetchActorsData();
  }
};
</script>

<style scoped>
.actor-card {
  padding: 20px;
  border: 1px solid #ddd;
  margin-bottom: 10px;
}

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

button {
  padding: 5px 10px;
  background-color: #3498db;
  color: white;
  border: none;
  cursor: pointer;
}

button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}
</style>
