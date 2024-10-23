<template>
  <div class="homepage">
    <div class="container">
      <h1>Bienvenue sur votre plateforme</h1>

      <section class="content-section">
        <div class="section-header">
          <h2>Derniers Films</h2>
          <div class="section-line"></div>
        </div>
        <div class="grid movies-grid" v-if="latestMovies.length">
          <MovieCard
              v-for="movie in latestMovies"
              :key="movie.id"
              :movie="movie"
          />
        </div>
        <div v-else class="loading-container">
          <div class="loading-spinner"></div>
        </div>
      </section>

      <section class="content-section">
        <div class="section-header">
          <h2>Derniers Acteurs</h2>
          <div class="section-line"></div>
        </div>
        <div class="grid actors-grid" v-if="latestActors.length">
          <ActorCard
              v-for="actor in latestActors"
              :key="actor.id"
              :actor="actor"
          />
        </div>
        <div v-else class="loading-container">
          <div class="loading-spinner"></div>
        </div>
      </section>
    </div>
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
    isAuthenticated() {
      return !!localStorage.getItem('token');
    },
    async fetchLatestMovies() {
      if (!this.isAuthenticated()) {
        this.$router.push('/login');
        return;
      }

      const token = localStorage.getItem('token');
      try {
        const response = await fetch('http://symfony.mmi-troyes.fr:8319/api/movies', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        this.latestMovies = data['hydra:member'].slice(0, 4);
      } catch (error) {
        console.error("Erreur lors de la récupération des films:", error);
        if (error.response?.status === 401) {
          localStorage.removeItem('token');
          this.$router.push('/login');
        }
      }
    },
    async fetchLatestActors() {
      if (!this.isAuthenticated()) {
        this.$router.push('/login');
        return;
      }

      const token = localStorage.getItem('token');
      try {
        const response = await fetch('http://symfony.mmi-troyes.fr:8319/api/actors', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        this.latestActors = data['hydra:member'].slice(0, 4);
      } catch (error) {
        console.error("Erreur lors de la récupération des acteurs:", error);
        if (error.response?.status === 401) {
          localStorage.removeItem('token');
          this.$router.push('/login');
        }
      }
    }
  }
}
</script>

<style scoped>
.homepage {
  min-height: 100vh;
  background: var(--background-color);
  padding: 2rem 0;
}

.content-section {
  margin-bottom: 4rem;
}

.section-header {
  margin-bottom: 2rem;
  position: relative;
}

.section-header h2 {
  font-size: 2rem;
  font-weight: 700;
  color: var(--text-color);
  margin-bottom: 1rem;
}

.section-line {
  width: 60px;
  height: 4px;
  background-color: var(--primary-color);
  border-radius: 2px;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 2rem;
  padding: 1rem 0;
}

.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 200px;
}

@media (max-width: 768px) {
  .homepage {
    padding: 1rem 0;
  }

  .grid {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 1rem;
  }

  .section-header h2 {
    font-size: 1.5rem;
  }

  .content-section {
    margin-bottom: 2rem;
  }
}

/* Animation d'apparition des cartes */
.grid > * {
  animation: fadeIn 0.6s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Style pour le titre principal */
h1 {
  text-align: center;
  margin-bottom: 3rem;
  font-size: 3rem;
  font-weight: 800;
  background: linear-gradient(to right, var(--primary-color), var(--primary-dark));
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  text-shadow: none;
}

/* Hover effect pour les cartes */
.grid > * {
  transition: transform var(--transition-speed) cubic-bezier(0.4, 0, 0.2, 1),
  box-shadow var(--transition-speed) cubic-bezier(0.4, 0, 0.2, 1);
}

.grid > *:hover {
  transform: translateY(-10px);
  box-shadow: var(--card-shadow);
}
</style>