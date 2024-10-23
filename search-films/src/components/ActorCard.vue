<template>
  <div v-if="actor" class="actor-card">
    <div class="image-container">
      <img :src="actor.media" alt="Image de l'acteur" class="actor-image" />
      <div class="status-badge" v-if="actor.death_date">In Memoriam</div>
      <div class="overlay">
        <div class="actor-name">
          <h2>{{ actor.firstname }} <span>{{ actor.lastname }}</span></h2>
        </div>
      </div>
    </div>
    <div class="content">
      <div class="info-section">
        <div class="info-grid">
          <div class="info-item">
            <span class="icon">🎂</span>
            <div class="info-content">
              <span class="label">Date de naissance</span>
              <span class="value">{{ formatDate(actor.dob) }}</span> <!-- Formattage de la date -->
            </div>
          </div>
          <div class="info-item" v-if="actor.death_date">
            <span class="icon">✝️</span>
            <div class="info-content">
              <span class="label">Date de décès</span>
              <span class="value">{{ formatDate(actor.death_date) }}</span> <!-- Formattage de la date -->
            </div>
          </div>
          <div class="info-item">
            <span class="icon">🌍</span>
            <div class="info-content">
              <span class="label">Nationalité</span>
              <span class="value">{{ actor.nationality }}</span>
            </div>
          </div>
          <div class="info-item">
            <span class="icon">⚥</span>
            <div class="info-content">
              <span class="label">Genre</span>
              <span class="value">{{ actor.gender }}</span>
            </div>
          </div>
        </div>

        <div class="awards-section">
          <span class="icon">🏆</span>
          <div class="info-content">
            <span class="label">Récompenses</span>
            <span class="value awards">{{ actor.awards }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div v-else class="loading">
    <div class="loading-spinner"></div>
    <p>Chargement des détails de l'acteur...</p>
  </div>
</template>

<script>
export default {
  props: {
    actor: {
      type: Object,
      required: true
    }
  },
  methods: {
    truncateBio(text, length) {
      if (!text) return '';
      return text.length > length ? text.substring(0, length) + '...' : text;
    },
    formatDate(date) {
      if (!date) return '';
      // Utilise le format français jour/mois/année
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
.actor-card {
  width: 100%;
  max-width: 400px;
  background: #1a1a1a;
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.3);
  transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1),
  box-shadow 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
}

.status-badge {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: rgba(0, 0, 0, 0.8);
  color: #e50914;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  z-index: 2;
}

.image-container {
  position: relative;
  width: 100%;
  height: 280px;
  overflow: hidden;
}

.actor-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.8s cubic-bezier(0.4, 0, 0.2, 1);
}

.overlay {
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

h2 {
  font-size: 1.8rem;
  font-weight: 700;
  color: #ffffff;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
  margin: 0;
  line-height: 1.2;
}

h2 span {
  display: block;
  color: #e50914;
}

.content {
  padding: 1.5rem;
  background: linear-gradient(180deg, #1a1a1a 0%, #2a2a2a 100%);
}

.info-section {
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.2rem;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 0.8rem;
}

.icon {
  font-size: 1.2rem;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(229, 9, 20, 0.1);
  border-radius: 8px;
}

.info-content {
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
  font-size: 0.95rem;
  color: #ffffff;
  font-weight: 500;
}

.awards-section {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  padding-top: 0.8rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.awards {
  color: #e50914;
  font-weight: 600;
}

.bio-section {
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding-top: 0.8rem;
}

.bio-text {
  color: #cccccc;
  font-size: 0.9rem;
  line-height: 1.5;
  margin: 0.5rem 0 0 0;
}

.metadata {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  padding-top: 0.8rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  font-size: 0.75rem;
  color: #666666;
}

.metadata-item {
  display: block;
}

.loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 2rem;
  background: #1a1a1a;
  border-radius: 15px;
  color: #ffffff;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid rgba(229, 9, 20, 0.1);
  border-top-color: #e50914;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@media (max-width: 480px) {
  h2 {
    font-size: 1.5rem;
  }

  .info-grid {
    grid-template-columns: 1fr;
  }

  .image-container {
    height: 220px;
  }
}
</style>