<template>
  <div v-if="showModal" class="modal">
    <div class="modal-content">
      <span class="close" @click="closeModal">&times;</span>
      <h2>Modifier un Film</h2>

      <form @submit.prevent="updateMovie">
        <div class="form-container">
          <!-- Première colonne -->
          <div class="form-column">
            <div>
              <label for="movie-title">Titre :</label>
              <input
                  type="text"
                  id="movie-title"
                  v-model="localMovie.title"
                  required
              />
            </div>

            <div>
              <label for="movie-description">Description :</label>
              <textarea
                  id="movie-description"
                  v-model="localMovie.description"
                  required
              ></textarea>
            </div>

            <div>
              <label for="movie-duration">Durée (minutes) :</label>
              <input
                  type="number"
                  id="movie-duration"
                  v-model="localMovie.duration"
                  required
              />
            </div>

            <div>
              <label for="movie-release_date">Date de sortie :</label>
              <input
                  type="date"
                  id="movie-release_date"
                  v-model="localMovie.release_date"
                  required
              />
            </div>
          </div>

          <!-- Deuxième colonne -->
          <div class="form-column">
            <div>
              <label for="movie-actors">Acteurs :</label>
              <select
                  v-model="localMovie.actors"
                  id="movie-actors"
                  multiple
              >
                <option v-for="actor in actors" :key="actor.id" :value="actor['@id']">
                  {{ actor.firstname }} {{ actor.lastname }}
                </option>
              </select>
            </div>

            <div>
              <label for="movie-director">Réalisateur :</label>
              <input
                  type="text"
                  id="movie-director"
                  v-model="localMovie.director"
                  required
              />
            </div>

            <div>
              <label for="movie-created_at">Date de création :</label>
              <input
                  type="date"
                  id="movie-created_at"
                  v-model="localMovie.created_at"
                  required
              />
            </div>

            <div>
              <button type="submit">Modifier</button>
            </div>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    showModal: Boolean,
    movie: Object,
    actors: Array
  },
  data() {
    return {
      localMovie: {}  // Local movie data to edit
    };
  },
  watch: {
    movie: {
      handler(newMovie) {
        // Initialize localMovie with the movie data from the parent
        this.localMovie = JSON.parse(JSON.stringify(newMovie));
      },
      immediate: true
    }
  },
  methods: {
    closeModal() {
      this.$emit("close");
    },
    updateMovie() {
      // Emit the updated movie data
      this.$emit("update-movie", this.localMovie);
    }
  }
};
</script>

<style scoped>
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 50;
}

.modal-content {
  background: var(--card-background, #2b2a2a);
  padding: 2rem;
  border-radius: var(--border-radius, 0.5rem);
  width: 100%;
  max-width: 42rem;
  margin: 0 1rem;
  box-shadow: var(--card-shadow, 0 4px 6px rgba(0, 0, 0, 0.3));
}

.close {
  position: absolute;
  top: 1rem;
  right: 1rem;
  font-size: 1.5rem;
  color: var(--text-color, #ffffff);
  cursor: pointer;
  transition: all var(--transition-speed, 0.3s);
}

.close:hover {
  color: var(--primary-color, #ff0000);
  transform: scale(1.1);
}

h2 {
  font-size: 2rem;
  font-weight: 700;
  color: var(--text-color, #ffffff);
  text-align: center;
  margin-bottom: 2rem;
  letter-spacing: var(--letter-spacing, -0.025em);
}

.form-container {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
}

@media (min-width: 768px) {
  .form-container {
    grid-template-columns: 1fr 1fr;
  }
}

.form-column {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

label {
  display: block;
  font-size: 1rem;
  font-weight: 500;
  color: var(--text-color, #ffffff);
  margin-bottom: 0.5rem;
}

input,
textarea,
select {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid var(--border-color, #4a4a4a);
  border-radius: var(--border-radius, 0.5rem);
  background: var(--input-background, #333333);
  color: var(--text-color, #ffffff);
  transition: all var(--transition-speed, 0.3s);
  box-shadow: var(--input-shadow, 0 1px 2px rgba(0, 0, 0, 0.1));
}

input:focus,
textarea:focus,
select:focus {
  outline: none;
  border-color: var(--primary-color, #ff0000);
  box-shadow: var(--focus-shadow, 0 0 0 2px rgba(255, 0, 0, 0.2));
}

textarea {
  resize: vertical;
  min-height: 7.5rem;
}

select[multiple] {
  min-height: 7.5rem;
}

button {
  width: 100%;
  padding: 0.75rem 1.5rem;
  background-color: var(--primary-color, #ff0000);
  color: var(--secondary-color, #ffffff);
  border: none;
  border-radius: var(--border-radius, 0.5rem);
  font-weight: 500;
  cursor: pointer;
  transition: all var(--transition-speed, 0.3s);
  box-shadow: var(--button-shadow, 0 2px 4px rgba(0, 0, 0, 0.2));
}

button:hover {
  transform: translateY(-2px);
  box-shadow: var(--button-hover-shadow, 0 4px 6px rgba(0, 0, 0, 0.3));
  background-color: var(--primary-hover-color, #cc0000);
}

button:focus {
  outline: none;
  box-shadow: var(--focus-shadow, 0 0 0 2px rgba(255, 0, 0, 0.2));
}

@media (max-width: 768px) {
  .modal-content {
    margin: 1rem;
    padding: 1.5rem;
  }

  h2 {
    font-size: 1.5rem;
    margin-bottom: 1.5rem;
  }
}
</style>
