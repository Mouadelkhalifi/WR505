<template>
  <div class="movie-card" @click="goToDetails">
    <div class="image-container">
      <img :src="movie.media" :alt="movie.title" class="movie-poster" />
      <div class="movie-overlay">
        <div class="movie-metadata">
          <span class="duration">{{ formatDuration(movie.duration) }}</span>
          <div class="rating" v-if="movie.rating">
            <span class="star">★</span>
            {{ movie.rating.toFixed(1) }}
          </div>
        </div>
      </div>
    </div>
    <div class="content">
      <div class="header">
        <h3 class="title">{{ movie.title }}</h3>
        <span class="year">{{ formatYear(movie.releaseDate) }}</span>
      </div>

      <div class="details">
        <div class="director">
          <span class="label">Réalisateur</span>
          <span class="value">{{ movie.director }}</span>
        </div>

        <div class="description">
          {{ truncateText(movie.description, 100) }}
        </div>

        <div class="footer">
          <span class="entries">{{ formatEntries(movie.entries) }} vues</span>
          <button class="btn-view">Voir plus</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MovieCard',
  props: {
    movie: {
      type: Object,
      required: true
    }
  },
  methods: {
    goToDetails() {
      this.$router.push(`/movies/${this.movie.id}`);
    },
    formatDuration(minutes) {
      const hours = Math.floor(minutes / 60);
      const mins = minutes % 60;
      return `${hours}h${mins.toString().padStart(2, '0')}`;
    },
    formatYear(date) {
      return new Date(date).getFullYear();
    },
    truncateText(text, length) {
      if (text.length <= length) return text;
      return text.substring(0, length) + '...';
    },
    formatEntries(number) {
      if (number >= 1000000) {
        return (number / 1000000).toFixed(1) + 'M';
      }
      if (number >= 1000) {
        return (number / 1000).toFixed(1) + 'K';
      }
      return number;
    }
  }
}
</script>

<style scoped>
.movie-card {
  width: 100%;
  max-width: 400px;
  background: #1a1a1a;
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.3);
  transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1),
  box-shadow 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
}

.movie-card:hover {
  transform: translateY(-10px) scale(1.02);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
}

.image-container {
  position: relative;
  width: 100%;
  height: 260px;
  overflow: hidden;
}

.movie-poster {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.8s cubic-bezier(0.4, 0, 0.2, 1);
}

.movie-card:hover .movie-poster {
  transform: scale(1.05);
}

.movie-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 100%;
  background: linear-gradient(
      180deg,
      transparent 0%,
      rgba(0, 0, 0, 0.2) 50%,
      rgba(0, 0, 0, 0.8) 100%
  );
  display: flex;
  align-items: flex-end;
  padding: 1.5rem;
}

.movie-metadata {
  display: flex;
  justify-content: space-between;
  width: 100%;
  color: #ffffff;
}

.duration {
  background: rgba(229, 9, 20, 0.9);
  padding: 0.3rem 0.8rem;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
}

.rating {
  display: flex;
  align-items: center;
  gap: 0.3rem;
  font-weight: 600;
}

.star {
  color: #ffd700;
}

.content {
  padding: 1.5rem;
  background: linear-gradient(180deg, #1a1a1a 0%, #2a2a2a 100%);
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
}

.title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #ffffff;
  margin: 0;
  flex: 1;
}

.year {
  color: #e50914;
  font-weight: 600;
  font-size: 1.1rem;
}

.details {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.director {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.label {
  font-size: 0.75rem;
  color: #808080;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.value {
  color: #ffffff;
  font-weight: 500;
}

.description {
  color: #cccccc;
  font-size: 0.9rem;
  line-height: 1.5;
}

.footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.entries {
  color: #808080;
  font-size: 0.9rem;
}

.btn-view {
  background: #e50914;
  color: #ffffff;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.btn-view:hover {
  background: #b30710;
}

@media (max-width: 480px) {
  .movie-card {
    max-width: 100%;
  }

  .image-container {
    height: 200px;
  }

  .title {
    font-size: 1.25rem;
  }

  .content {
    padding: 1rem;
  }
}
</style>