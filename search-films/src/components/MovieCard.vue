<template>
  <div class="movie-card">
    <div class="image-container" @click="goToMovieDetails">
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
          <button class="btn-view" @click="goToMovieDetails">Voir plus</button>
          <button class="btn-edit" @click="openEditMovieForm">Éditer</button>
          <button class="btn-delete" @click="openDeleteMovieForm">Supprimer</button>
        </div>
      </div>
    </div>
  </div>
  <!-- Edit Movie Modal -->
  <EditMovieModal
      :showModal="showEditMovieForm"
      :movie="editedMovie"
      :actors="actors"
      @close="closeEditMovieForm"
      @update-movie="handleMovieUpdate"
  />

  <DeleteMovieModal
      :showModal="showDeleteMovieForm"
      :movie="movie"
      @close="closeDeleteMovieForm"
      @delete-movie="handleMovieDelete"
  />

  <div v-if="showUpdateSuccess" class="success-popin">
    Film mis à jour avec succès !
  </div>

  <div v-if="showDeleteSuccess" class="success-popin">
    Film supprimé avec succès !
  </div>
</template>

<script>
import EditMovieModal from "@/components/EditMovieModal.vue";
import DeleteMovieModal from "@/components/DeleteMovieModal.vue";

export default {
  name: "MovieCard",
  components: { EditMovieModal, DeleteMovieModal },
  props: {
    movie: {
      type: Object,
      required: true,
    },
    actors: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      showEditMovieForm: false,
      showDeleteMovieForm: false,
      showDeleteSuccess: false,
      showUpdateSuccess: false,
      editedMovie: {},
    };
  },
  methods: {
    goToMovieDetails() {
      this.$router.push(`/movies/${this.movie.id}`);
    },
    formatDuration(minutes) {
      const hours = Math.floor(minutes / 60);
      const mins = minutes % 60;
      return `${hours}h${mins.toString().padStart(2, "0")}`;
    },
    formatYear(date) {
      return new Date(date).getFullYear();
    },
    truncateText(text, length) {
      return text.length <= length ? text : text.substring(0, length) + "...";
    },
    formatEntries(number) {
      return number >= 1000000
          ? (number / 1000000).toFixed(1) + "M"
          : number >= 1000
              ? (number / 1000).toFixed(1) + "K"
              : number;
    },
    openEditMovieForm() {
      this.editedMovie = JSON.parse(JSON.stringify(this.movie));
      this.showEditMovieForm = true;
    },
    closeEditMovieForm() {
      this.showEditMovieForm = false;
    },
    openDeleteMovieForm() {
      this.showDeleteMovieForm = true;
    },
    closeDeleteMovieForm() {
      this.showDeleteMovieForm = false;
    },
    async handleMovieUpdate(updatedMovie) {
      const token = localStorage.getItem("token");
      if (!updatedMovie.id) {
        console.error("L'ID du film est manquant. Impossible de procéder à la mise à jour.");
        return;
      }

      const url = `http://symfony.mmi-troyes.fr:8319/api/movies/${updatedMovie.id}`;

      try {
        const response = await fetch(url, {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/merge-patch+json",
          },
          body: JSON.stringify(updatedMovie),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(`Erreur lors de la mise à jour: ${errorData.detail}`);
        }

        this.showUpdateSuccess = true;
        this.$emit("update-movie", updatedMovie);
        setTimeout(() => {
          this.showUpdateSuccess = false;
        }, 3000);

        const result = await response.json();
        this.$emit("update-movie", result);
        this.closeEditMovieForm();
      } catch (error) {
        console.error("Erreur lors de la mise à jour du film:", error);
      }
    },
    async handleMovieDelete(movieId) {
      const token = localStorage.getItem("token");
      const url = `http://symfony.mmi-troyes.fr:8319/api/movies/${movieId}`;

      try {
        const response = await fetch(url, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(`Erreur lors de la suppression: ${errorData.detail}`);
        }

        console.log("Film supprimé avec succès");
        this.$emit("movie-deleted", movieId);

        // Déclenche l'affichage du popin de succès
        this.showDeleteSuccess = true;
        this.showDeleteMovieForm = false; // Ferme le popin de confirmation

        setTimeout(() => {
          this.showDeleteSuccess = false;
        }, 3000);
      } catch (error) {
        console.error("Erreur lors de la suppression du film:", error);
      }
    },
  },
};
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

.btn-edit {
  background: #007bff;
  color: #ffffff;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.btn-edit:hover {
  background: #0056b3;
}
.btn-delete {
  background-color: #e50914;
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 20px;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.btn-delete:hover {
  background-color: #b30710;
}

.success-popin {
  position: fixed;
  bottom: 20px;
  right: 20px;
  background-color: #28a745;
  color: white;
  padding: 1rem 1.5rem;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  z-index: 1000;
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