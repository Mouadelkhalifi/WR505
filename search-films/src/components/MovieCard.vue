<template>
  <div class="bg-white rounded-xl shadow-lg overflow-hidden card-hover">
    <!-- Image -->
    <div class="relative">
      <img :src="movie.media" :alt="movie.title" class="w-full h-56 object-cover">
      <div class="absolute inset-0 bg-gradient-to-t from-gray-900 opacity-50"></div>
      <div class="absolute bottom-4 left-4">
        <span class="text-white font-semibold text-xl">{{ movie.title }}</span>
      </div>
    </div>

    <!-- Movie Information -->
    <div class="p-5">
      <h2 class="card-title text-xl font-bold text-gray-800 mb-3">{{ movie.title }}</h2>
      <p class="card-description text-gray-600 mb-5">{{ truncateDescription(movie.description) }}</p>

      <!-- Categories -->
      <div class="flex flex-wrap">
        <span v-for="category in (movie.categories || [])" :key="category.id" class="card-category">
          {{ category.title }}
        </span>
      </div>

      <!-- Actors -->
      <div class="card-actors flex flex-wrap">
        <span v-for="(actor, index) in limitedActors" :key="actor.id">
          {{ actor.firstname }} {{ actor.lastname }}{{ index < limitedActors.length - 1 ? ', ' : '' }}
        </span>
        <span v-if="actorsDetails.length > 3">
          et {{ actorsDetails.length - 3 }} autres
        </span>
      </div>

      <!-- Buttons -->
      <div class="mt-4 flex justify-end">
        <a @click="goToDetails" class="btn-view-more">Voir plus</a>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    movie: Object,
  },
  data() {
    return {
      actorsDetails: []  // Pour stocker les détails des acteurs récupérés
    };
  },
  computed: {
    limitedActors() {
      // Retourne uniquement les 3 premiers acteurs
      return this.actorsDetails.slice(0, 3);
    }
  },
  methods: {
    async fetchActorDetails() {
      // Si `movie.actors` contient des URLs, les récupérer
      if (this.movie.actors && this.movie.actors.length) {
        const actorPromises = this.movie.actors.map(async (actorUrl) => {
          const response = await fetch(actorUrl);  // Requête pour récupérer les détails d'un acteur
          return response.json();  // Retourne les détails d'un acteur
        });

        // Attend que toutes les requêtes soient terminées et met à jour `actorsDetails`
        this.actorsDetails = await Promise.all(actorPromises);
      }
    },
    goToDetails() {
      this.$router.push(`/movies/${this.movie.id}`);
    },
    truncateDescription(description) {
      return description.length > 120 ? description.slice(0, 120) + '...' : description;
    }
  },
  mounted() {
    this.fetchActorDetails();  // Récupère les détails des acteurs au montage du composant
  }
}
</script>

<style scoped>
.card-hover {
  transition: transform 0.3s, box-shadow 0.3s;
  min-height: 100%;
  overflow: hidden;
}

.card-hover:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.15);
}

.card-category {
  background-color: #2ecc71;
  color: #fff;
  font-size: 0.8rem;
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
  margin-right: 0.5rem;
  margin-bottom: 0.5rem;
}

.btn-view-more {
  display: inline-block;
  background-color: #3498db;
  color: #fff;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  text-decoration: none;
  font-weight: 600;
  transition: background-color 0.3s;
  cursor: pointer;
}

.btn-view-more:hover {
  background-color: #2980b9;
}

img {
  max-height: 14rem; /* Fixe une hauteur maximale pour l'image */
  object-fit: cover; /* Assure-toi que l'image conserve ses proportions tout en remplissant le cadre */
}
</style>
