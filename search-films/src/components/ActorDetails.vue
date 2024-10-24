<template>
  <main class="actor-page">
    <template v-if="actor">
      <!-- Hero Section with Actor Info -->
      <section class="hero-section">
        <div class="content-wrapper">
          <div class="profile-section">
            <!-- Image Section -->
            <div class="image-wrapper">
              <img
                  :src="actor.media"
                  :alt="actor.firstname + ' ' + actor.lastname"
                  class="profile-image"
              />
              <div class="image-overlay"></div>
            </div>

            <!-- Info Section -->
            <div class="info-section">
              <h1 class="actor-name">
                <span class="firstname">{{ actor.firstname }}</span>
                <span class="lastname">{{ actor.lastname }}</span>
              </h1>

              <div class="details-grid">
                <div class="detail-item">
                  <i class="fas fa-birthday-cake"></i>
                  <div class="detail-content">
                    <span class="label">Date de naissance</span>
                    <span class="value">{{ formatDate(actor.dob) }}</span>
                  </div>
                </div>

                <div v-if="actor.death_date" class="detail-item">
                  <i class="fas fa-cross"></i>
                  <div class="detail-content">
                    <span class="label">Date de décès</span>
                    <span class="value">{{ formatDate(actor.death_date) }}</span>
                  </div>
                </div>

                <div class="detail-item">
                  <i class="fas fa-globe"></i>
                  <div class="detail-content">
                    <span class="label">Nationalité</span>
                    <span class="value">{{ actor.nationality }}</span>
                  </div>
                </div>

                <div class="detail-item">
                  <i class="fas fa-user"></i>
                  <div class="detail-content">
                    <span class="label">Genre</span>
                    <span class="value">{{ actor.gender }}</span>
                  </div>
                </div>

                <div v-if="actor.awards" class="detail-item awards">
                  <i class="fas fa-award"></i>
                  <div class="detail-content">
                    <span class="label">Récompenses</span>
                    <span class="value">{{ actor.awards }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Filmography Section -->
      <section class="filmography-section">
        <div class="content-wrapper">
          <h2 class="section-title">
            <span class="title-icon">🎬</span>
            <span>Filmographie de {{ actor.firstname }}</span>
          </h2>

          <div v-if="movies.length" class="movies-grid">
            <MovieCard
                v-for="movie in movies"
                :key="movie.id"
                :movie="movie"
                class="movie-card"
            />
          </div>

          <div v-else class="empty-state">
            <div class="empty-content">
              <i class="fas fa-film"></i>
              <p>Aucun film disponible pour le moment</p>
            </div>
          </div>
        </div>
      </section>
    </template>

    <!-- Loading State -->
    <div v-else class="loading-state">
      <div class="loader">
        <div class="spinner"></div>
        <span>Chargement...</span>
      </div>
    </div>
  </main>
</template>

<script>
import axios from 'axios';
import MovieCard from '@/components/MovieCard.vue';

export default {
  name: 'ActorDetails',
  components: { MovieCard },

  data() {
    return {
      actor: null,
      movies: [],
      loading: true,
      error: null
    };
  },

  created() {
    this.fetchActorDetails();
  },

  methods: {
    async fetchActorDetails() {
      try {
        const actorId = this.$route.params.id;
        const token = localStorage.getItem('token');

        const response = await axios.get(`http://symfony.mmi-troyes.fr:8319/api/actors/${actorId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          }
        });

        this.actor = response.data;
        await this.fetchMovies();
      } catch (error) {
        this.error = error.message;
        if (error.response?.status === 401) {
          localStorage.removeItem('token');
          this.$router.push('/login');
        }
      } finally {
        this.loading = false;
      }
    },

    async fetchMovies() {
      if (this.actor?.movies?.length) {
        try {
          const moviePromises = this.actor.movies.map(movieUrl =>
              axios.get(`http://symfony.mmi-troyes.fr:8319${movieUrl}`).then(res => res.data)
          );
          this.movies = await Promise.all(moviePromises);
        } catch (error) {
          console.error('Erreur lors de la récupération des films:', error);
        }
      }
    },

    formatDate(date) {
      return new Date(date).toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    }
  }
};
</script>

<style scoped>
.actor-page {
  min-height: 100vh;
  background-color: var(--background);
}

/* Hero Section */
.hero-section {
  position: relative;
  padding: 4rem 0;
  background: linear-gradient(to bottom, var(--primary-dark), var(--background));
  color: var(--text-light);
}

.content-wrapper {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
}

.profile-section {
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 3rem;
  align-items: start;
}

/* Image Styling */
.image-wrapper {
  position: relative;
  border-radius: 1rem;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
}

.profile-image {
  width: 100%;
  height: 450px;
  object-fit: cover;
  transition: transform 0.4s ease;
}

.image-wrapper:hover .profile-image {
  transform: scale(1.05);
}

.image-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 100%);
}

/* Info Section */
.info-section {
  padding: 1rem 0;
}

.actor-name {
  margin-bottom: 2rem;
  line-height: 1.2;
}

.firstname {
  display: block;
  font-size: 2.5rem;
  color: var(--text-light);
  opacity: 0.9;
}

.lastname {
  display: block;
  font-size: 3.5rem;
  font-weight: 700;
  background: linear-gradient(45deg, var(--primary-light), var(--accent));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

/* Details Grid */
.details-grid {
  display: grid;
  gap: 1.5rem;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
}

.detail-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 0.75rem;
  backdrop-filter: blur(10px);
  transition: transform 0.3s ease;
}

.detail-item:hover {
  transform: translateY(-2px);
}

.detail-item i {
  font-size: 1.5rem;
  color: var(--accent);
}

.detail-content {
  display: flex;
  flex-direction: column;
}

.label {
  font-size: 0.875rem;
  color: var(--text-light);
  opacity: 0.8;
}

.value {
  font-size: 1rem;
  font-weight: 500;
}

/* Filmography Section */
.filmography-section {
  padding: 4rem 0;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2.5rem;
  font-size: 2rem;
  font-weight: 600;
  color: var(--text-dark);
}

.title-icon {
  font-size: 2rem;
}

.movies-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 2rem;
}

/* Empty State */
.empty-state {
  padding: 4rem 0;
  text-align: center;
}

.empty-content {
  padding: 3rem;
  background: var(--card-background);
  border-radius: 1rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.empty-content i {
  font-size: 3rem;
  color: var(--primary);
  margin-bottom: 1rem;
}

/* Loading State */
.loading-state {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

.loader {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 4px solid var(--primary-light);
  border-top-color: var(--primary);
  border-radius: 50%;
  animation: spin 1s infinite linear;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Responsive Design */
@media (max-width: 1024px) {
  .profile-section {
    grid-template-columns: 250px 1fr;
    gap: 2rem;
  }

  .profile-image {
    height: 375px;
  }
}

@media (max-width: 768px) {
  .profile-section {
    grid-template-columns: 1fr;
    text-align: center;
  }

  .image-wrapper {
    max-width: 300px;
    margin: 0 auto;
  }

  .details-grid {
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  }

  .detail-item {
    justify-content: center;
  }

  .section-title {
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .hero-section {
    padding: 2rem 0;
  }

  .firstname {
    font-size: 2rem;
  }

  .lastname {
    font-size: 2.5rem;
  }

  .movies-grid {
    grid-template-columns: 1fr;
  }
}

/* Theme Variables (à ajouter dans votre fichier CSS global) */
:root {
  --primary: #3b82f6;
  --primary-dark: #1e40af;
  --primary-light: #60a5fa;
  --accent: #f59e0b;
  --background: #f8fafc;
  --card-background: #ffffff;
  --text-dark: #1e293b;
  --text-light: #f8fafc;
}
</style>