<template>
  <div v-if="category" class="category-card">
    <div class="image-container" @click="goToCategoryDetails">
      <img :src="category.image" alt="Image de la catégorie" class="category-image" />
      <div class="overlay">
        <div class="category-name">
          <h2>{{ category.title }}</h2>
        </div>
      </div>
    </div>

    <div class="content">
      <div class="info-section">
        <div class="info-grid">
          <div class="info-item">
            <span class="icon">📅</span>
            <div class="info-content">
              <span class="label">Créé le</span>
              <span class="value">{{ formatDate(category.createdAt) }}</span>
            </div>
          </div>
          <div class="info-item">
            <span class="icon">🎥</span>
            <div class="info-content">
              <span class="label">Nombre de films</span>
              <span class="value">{{ category.movieCount }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="footer">
        <button class="btn-view-categories" @click="goToCategoryDetails">Voir les films</button>
        <button class="btn-edit" @click="openEditCategoryForm">Éditer</button>
        <button class="btn-delete" @click="openDeleteCategoryForm">Supprimer</button>
      </div>
    </div>
    <EditCategoryModal
        v-if="showEditCategoryForm"
        :showModal="showEditCategoryForm"
        :category="editedCategory"
        @close="closeEditCategoryForm"
        @update-category="updateCategory"
    />

    <DeleteCategoryModal
        v-if="showDeleteCategoryForm"
        :showModal="showDeleteCategoryForm"
        :category="category"
        @close="closeDeleteCategoryForm"
        @delete-category="handleDeleteCategory"
    />

    <div v-if="showDeleteSuccess" class="success-popin">
      Film supprimé avec succès !
    </div>

    <div v-if="showUpdateSuccess" class="success-popin">
      Film mis à jour avec succès !
    </div>
  </div>
</template>

<script>
import EditCategoryModal from "@/components/EditCategoryModal.vue";
import DeleteCategoryModal from "@/components/DeleteCategoryModal.vue";

export default {
  name: "CategoryCard",
  components: { EditCategoryModal, DeleteCategoryModal },
  props: {
    category: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      showEditCategoryForm: false,
      showDeleteCategoryForm: false,
      showDeleteSuccess: false,
      showUpdateSuccess: false,
      editedCategory: { ...this.category },
    };
  },
  methods: {
    goToCategoryDetails() {
      this.$router.push(`/categories/${this.category.id}`);
    },
    openEditCategoryForm() {
      this.editedCategory = JSON.parse(JSON.stringify(this.category));
      this.showEditCategoryForm = true;
    },
    closeEditCategoryForm() {
      this.showEditCategoryForm = false;
    },
    openDeleteCategoryForm() {
      this.showDeleteCategoryForm = true;
    },
    closeDeleteCategoryForm() {
      this.showDeleteCategoryForm = false;
    },
    viewMovies() {
      this.$emit("view-movies", this.category.id);
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
    async updateCategory(updatedCategory) {
      const token = localStorage.getItem("token");
      if(!updatedCategory.id) {
        console.error("L'ID de la catégorie est manquant. Impossible de procéder à la mise à jour.");
        return;
      }

     const url = `http://symfony.mmi-troyes.fr:8319/api/categories/${updatedCategory.id}`;

      try {
        const response = await fetch(url, {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/merge-patch+json",
          },
          body: JSON.stringify(updatedCategory),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(`Erreur lors de la mise à jour: ${errorData.detail}`);
        }

        this.showUpdateSuccess = true;
        this.$emit("update-category", updatedCategory);
        setTimeout(() => {
          this.showUpdateSuccess = false;
        }, 3000);

        const result = await response.json();
        this.$emit("update-category", result);
        this.closeEditCategoryForm();
      } catch (error) {
        console.error("Erreur lors de la mise à jour de la catégorie:", error);
      }
    },
    async handleDeleteCategory(categoryId) {
      const token = localStorage.getItem("token");
      const url = `http://symfony.mmi-troyes.fr:8319/api/categories/${categoryId}`;

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

        console.log("Catégorie supprimée avec succès");
        this.$emit("category-deleted", categoryId);

        this.showDeleteSuccess = true;
        this.closeDeleteCategoryForm()

        this.showDeleteCategoryForm = false;
        this.closeDeleteCategoryForm();

        setTimeout(() => {
          this.showDeleteSuccess = false;
        }, 3000);
      } catch (error) {
        console.error("Erreur lors de la suppression de la catégorie:", error);
      }
    },
  },
};
</script>

<style scoped>
.category-card {
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

.image-container {
  position: relative;
  width: 100%;
  height: 280px;
  overflow: hidden;
}

.category-image {
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

.category-name h2 {
  font-size: 1.8rem;
  font-weight: 700;
  color: #ffffff;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
  margin: 0;
  line-height: 1.2;
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

.footer {
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

/* Boutons */
.btn-view-categories,
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

.btn-view-categories {
  background-color: #e50914;
  color: white;
}

.btn-view-categories:hover {
  background-color: #b30710;
}

.btn-edit {
  background-color: #2c3e50;
  color: white;
}

.btn-edit:hover {
  background-color: #1a252f;
}

.btn-delete {
  background-color: #7f1d1d;
  color: white;
}

.btn-delete:hover {
  background-color: #5f1515;
}

/* Success Popin */
.success-popin {
  background-color: #10b981;
  color: white;
  padding: 1rem 1.5rem;
  border-radius: 8px;
  position: fixed;
  top: 20px;
  right: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  animation: slideIn 0.3s ease-out;
}


@keyframes slideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

/* Responsive */
@media (max-width: 480px) {
  .category-name h2 {
    font-size: 1.5rem;
  }

  .info-grid {
    grid-template-columns: 1fr;
  }

  .image-container {
    height: 220px;
  }

  .footer {
    flex-direction: column;
  }
}
</style>
