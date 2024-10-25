<template>
  <div class="movie-details-container">
    <div v-if="movie" class="movie-details">
      <!-- Hero Section -->
      <div class="movie-hero">
        <div class="movie-backdrop" :style="{ backgroundImage: `url(${movie.media})` }">
          <div class="overlay"></div>
        </div>
        <div class="container">
          <div class="movie-hero-content">
            <img :src="movie.media" :alt="movie.title" class="movie-poster" />
            <div class="movie-info">
              <h1>{{ movie.title }}</h1>
              <div class="movie-meta-grid">
                <div class="meta-item">
                  <div class="meta-icon">⏱</div>
                  <div class="meta-content">
                    <span class="meta-label">Durée</span>
                    <span class="meta-value">{{ movie.duration }} minutes</span>
                  </div>
                </div>
                <div class="meta-item">
                  <div class="meta-icon">🎬</div>
                  <div class="meta-content">
                    <span class="meta-label">Réalisateur</span>
                    <span class="meta-value">{{ movie.director }}</span>
                  </div>
                </div>
                <div class="meta-item">
                  <div class="meta-icon">⭐</div>
                  <div class="meta-content">
                    <span class="meta-label">Note</span>
                    <span class="meta-value">{{ movie.rating }}/10</span>
                  </div>
                </div>
                <div class="meta-item">
                  <div class="meta-icon">📅</div>
                  <div class="meta-content">
                    <span class="meta-label">Date de sortie</span>
                    <span class="meta-value">{{ formatDate(movie.release_date) }}</span>
                  </div>
                </div>
              </div>
              <p class="movie-description">{{ movie.description }}</p>
            </div>
          </div>
        </div>
      </div>

      <div class="container">
        <section class="movie-details-section">
          <div class="section-header">
            <h2>Informations techniques</h2>
            <div class="section-line"></div>
          </div>
          <div class="details-grid">
            <div class="detail-item">
              <span class="detail-label">ID du film: </span>
              <span class="detail-value">#{{ movie.id }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">ID de l'image: </span>
              <span class="detail-value">#{{ movie.image_id }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Nombre d'entrées: </span>
              <span class="detail-value">{{ formatNumber(movie.entries) }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Créé le </span>
              <span class="detail-value">{{ formatDateTime(movie.created_at) }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Dernière mise à jour </span>
              <span class="detail-value">{{ formatDateTime(movie.updated_at) }}</span>
            </div>
          </div>
        </section>

        <section class="actors-section">
          <div class="section-header">
            <h2>Acteurs</h2>
            <div class="section-line"></div>
          </div>
          <div class="actors-grid">
            <ActorCard
                v-for="actor in actors"
                :key="actor.id"
                :actor="actor"
            />
          </div>
        </section>
      </div>
    </div>

    <div v-else class="loading-container">
      <div class="loading-spinner"></div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import ActorCard from '@/components/ActorCard.vue';

export default {
  components: { ActorCard },
  data() {
    return {
      movie: null,
      actors: [],
    };
  },
  created() {
    this.fetchMovieDetails();
  },
  methods: {
    async fetchMovieDetails() {
      try {
        const movieId = this.$route.params.id;
        const token = localStorage.getItem('token');
        const response = await axios.get(
            `http://symfony.mmi-troyes.fr:8319/api/movies/${movieId}`,
            {
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
              },
            }
        );
        this.movie = response.data;

        this.fetchActorDetails(this.movie.actors);
      } catch (error) {
        console.error('Erreur lors de la récupération des détails du film :', error);
        if (error.response?.status === 401) {
          localStorage.removeItem('token');
          this.$router.push('/login');
        }
      }
    },
    async fetchActorDetails(actorUrls) {
      try {
        const actorPromises = actorUrls.map((url) =>
            axios.get(`http://symfony.mmi-troyes.fr:8319${url}`)
        );
        const actorResponses = await Promise.all(actorPromises);
        this.actors = actorResponses.map((res) => res.data);
      } catch (error) {
        console.error('Erreur lors de la récupération des acteurs :', error);
      }
    },
    formatDate(date) {
      return new Date(date).toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    },
    formatDateTime(datetime) {
      return new Date(datetime).toLocaleString('fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    },
    formatNumber(number) {
      return new Intl.NumberFormat('fr-FR').format(number);
    },
  },
};
</script>


<style>
.movie-details-container {
  min-height: 100vh;
  background: var(--background-color);
  color: var(--text-color);
}

/* Hero Section */
.movie-hero {
  position: relative;
  min-height: 80vh;
  margin-bottom: 4rem;
}

.movie-backdrop {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  filter: blur(3px) brightness(0.7);
}

.overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 80% !important;
  background: linear-gradient(
      to bottom,
      rgba(0, 0, 0, 0.4) 0%,
      rgba(0, 0, 0, 0.8) 100%
  );
}

.movie-hero-content {
  position: relative;
  display: flex;
  gap: 3rem;
  padding-top: 15vh;
  z-index: 2;
}

.movie-poster {
  width: 320px;
  height: 480px;
  object-fit: cover;
  border-radius: 16px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.3);
  transition: transform 0.3s ease;
}

.movie-poster:hover {
  transform: scale(1.02);
}

.movie-info {
  flex: 1;
  padding-top: 2rem;
}

.movie-info h1 {
  font-size: 3.8rem;
  font-weight: 700;
  margin-bottom: 2rem;
  text-align: left;
  line-height: 1.2;
  background: linear-gradient(45deg, #fff, #e0e0e0);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

/* Meta Information Grid */
.movie-meta-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1.5rem;
  margin-bottom: 3rem;
}

.meta-item {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 1.2rem;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  backdrop-filter: blur(10px);
  transition: transform 0.3s ease, background-color 0.3s ease;
}

.meta-item:hover {
  transform: translateY(-5px);
  background: rgba(255, 255, 255, 0.15);
}

.meta-icon {
  font-size: 1.8rem;
}

.meta-content {
  display: flex;
  flex-direction: column;
}

.meta-label {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 0.4rem;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.meta-value {
  font-weight: 600;
  font-size: 1.1rem;
}

/* Sections Headers */
.section-header {
  margin-bottom: 3rem;
  position: relative;
}

.section-header h2 {
  font-size: 2.2rem;
  font-weight: 700;
  margin-bottom: 1rem;
  background: linear-gradient(45deg, var(--primary-color), var(--secondary-color, #4a90e2));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.section-line {
  width: 80px;
  height: 4px;
  background: linear-gradient(90deg, var(--primary-color), var(--secondary-color, #4a90e2));
  border-radius: 2px;
}

/* Technical Details Grid */
.details-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
  margin-bottom: 4rem;
}

.detail-item {
  padding: 1.8rem;
  background: var(--card-background);
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.detail-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
}

/* Actors Section */
.actors-section {
  padding: 3rem 0;
}

.actors-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
}

.actor-card {
  position: relative;
  background: var(--card-background);
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.actor-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.2);
}

.actor-image {
  width: 100%;
  height: 300px;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.actor-card:hover .actor-image {
  transform: scale(1.05);
}

.actor-info {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 1.5rem;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.9), transparent);
  color: white;
  transform: translateY(0);
  transition: transform 0.3s ease;
}

.actor-card:hover .actor-info {
  transform: translateY(-5px);
}

.actor-info h3 {
  margin: 0 0 0.5rem 0;
  font-size: 1.3rem;
  font-weight: 600;
}

.actor-role {
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.8);
  font-style: italic;
}

/* Responsive Design */
@media (max-width: 968px) {
  .movie-hero-content {
    padding-top: 12vh;
  }

  .movie-info h1 {
    font-size: 3rem;
  }
}

@media (max-width: 768px) {
  .movie-hero-content {
    flex-direction: column;
    align-items: center;
    text-align: center;
    padding-top: 8vh;
    gap: 2rem;
  }

  .movie-poster {
    width: 260px;
    height: 390px;
  }

  .movie-info h1 {
    font-size: 2.5rem;
    text-align: center;
  }

  .meta-item {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .actors-grid {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  }

  .actor-image {
    height: 250px;
  }
}

@media (max-width: 480px) {
  .movie-poster {
    width: 220px;
    height: 330px;
  }

  .movie-info h1 {
    font-size: 2rem;
  }

  .meta-item {
    padding: 1rem;
  }

  .actors-grid {
    grid-template-columns: 1fr;
  }

  .actor-image {
    height: 280px;
  }
}
</style>