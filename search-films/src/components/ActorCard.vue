<template>
  <div v-if="actor" class="actor-card">
    <div class="image-container" @click="goToActorDetails">
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
              <span class="value">{{ formatDate(actor.dob) }}</span>
            </div>
          </div>
          <div class="info-item" v-if="actor.death_date">
            <span class="icon">✝️</span>
            <div class="info-content">
              <span class="label">Date de décès</span>
              <span class="value">{{ formatDate(actor.death_date) }}</span>
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

      <div class="footer">
        <button class="btn-view-actors" @click="goToActorDetails">Voir les acteurs</button>
        <button class="btn-edit" @click="openEditActorForm">Éditer</button>
        <button class="btn-delete" @click="openDeleteActorForm">Supprimer</button>
      </div>
    </div>
  </div>
  <EditActorModal
      :showModal="showEditActorForm"
      :actor="editedActor"
      @close="closeEditActorForm"
      @update-actor="handleActorUpdate"
  />

  <DeleteActorModal
      :showModal="showDeleteActorForm"
      :actor="actor"
      @close="closeDeleteActorForm"
      @delete-actor="handleActorDelete"
  />

  <div v-if="showDeleteSuccess" class="success-popin">
    Acteur supprimé avec succès !
  </div>

  <div v-if="showUpdateSuccess" class="success-popin">
    Acteur modifié avec succès !
  </div>


</template>

<script>
import EditActorModal from "@/components/EditActorModal.vue";
import DeleteActorModal from "@/components/DeleteActorModal.vue";

export default {
  name: "ActorCard",
  components: { EditActorModal, DeleteActorModal },
  props: {
    actor: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      showEditActorForm: false,
      showDeleteActorForm: false,
      showDeleteSuccess: false,
      showUpdateSuccess: false,
      editedActor: { ...this.actor },
    };
  },
  methods: {
    goToActorDetails() {
      this.$router.push(`/actors/${this.actor.id}`);
    },
    formatDate(date) {
      return date
          ? new Date(date).toLocaleDateString("fr-FR", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })
          : "";
    },
    openEditActorForm() {
      this.editedActor = JSON.parse(JSON.stringify(this.actor));
      this.showEditActorForm = true;
    },
    closeEditActorForm() {
      this.showEditActorForm = false;
    },
    openDeleteActorForm() {
      this.showDeleteActorForm = true;
    },
    closeDeleteActorForm() {
      this.showDeleteActorForm = false;
    },
    async handleActorUpdate(updatedActor) {
      const token = localStorage.getItem("token");
      if (!updatedActor.id) {
        console.error("L'ID de l'acteur est manquant. Impossible de procéder à la mise à jour.");
        return;
      }

      if (typeof updatedActor.awards === "string") {
        updatedActor.awards = parseInt(updatedActor.awards, 10);
      }

      if (isNaN(updatedActor.awards)) {
        console.error("Erreur : 'awards' doit être un nombre entier valide.");
        return;
      }

      const url = `http://symfony.mmi-troyes.fr:8319/api/actors/${updatedActor.id}`;

      try {
        const response = await fetch(url, {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/merge-patch+json",
          },
          body: JSON.stringify(updatedActor),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(`Erreur lors de la mise à jour: ${errorData.detail}`);
        }

        this.showUpdateSuccess = true;
        this.$emit("update-actor", updatedActor);
        setTimeout(() => {
          this.showUpdateSuccess = false;
        }, 3000);

        const result = await response.json();
        this.$emit("update-actor", result);
        this.closeEditActorForm();
      } catch (error) {
        console.error("Erreur lors de la mise à jour de l'acteur:", error);
      }
    },
    async handleActorDelete(actorId) {
      const token = localStorage.getItem("token");
      const url = `http://symfony.mmi-troyes.fr:8319/api/actors/${actorId}`;

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

        console.log("Acteur supprimé avec succès");
        this.$emit("actor-deleted", actorId);

        this.showDeleteSuccess = true;
        this.closeDeleteActorForm();

        setTimeout(() => {
          this.showDeleteSuccess = false;
        }, 3000);
      } catch (error) {
        console.error("Erreur lors de la suppression de l'acteur:", error);
      }
    },
  },
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

/* Boutons */
.btn-view-actors,
.btn-edit,
.btn-delete {
  flex: 1;
  padding: 0.75rem 1rem;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-view-actors {
  background-color: #e50914;
  color: white;
}

.btn-view-actors:hover {
  background-color: #b30710;
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
.btn-edit,
.btn-delete {
  background-color: #007bff;
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 0.3rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.btn-edit:hover {
  background-color: #0056b3;
}

.btn-delete {
  background-color: #dc3545;
}

.btn-delete:hover {
  background-color: #b02a37;
}

.success-popin {
  background-color: green;
  color: white;
  padding: 1rem;
  border-radius: 10px;
  position: fixed;
  top: 20px;
  right: 20px;
}
</style>