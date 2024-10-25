<template>
  <div v-if="showModal" class="modal">
    <div class="modal-content">
      <span class="close" @click="closeModal">&times;</span>
      <h2>Supprimer une Catégorie</h2>
      <p v-if="!hasMovies">
        Êtes-vous sûr de vouloir supprimer la catégorie <strong>{{ category.title }}</strong> ? Cette action est irréversible.
      </p>
      <p v-else>
        La catégorie <strong>{{ category.title }}</strong> est associée à un ou plusieurs films et ne peut pas être supprimée.
      </p>

      <div class="buttons">
        <button class="btn-cancel" @click="closeModal">Annuler</button>
        <button
            class="btn-delete"
            @click="deleteCategory"
            :disabled="hasMovies">
          Supprimer
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    showModal: Boolean,
    category: Object
  },
  data() {
    return {
      hasMovies: false
    };
  },
  watch: {
    category: {
      immediate: true,
      handler(newCategory) {
        if (newCategory) {
          this.checkCategoryMovies(newCategory.id);
        }
      }
    }
  },
  methods: {
    closeModal() {
      this.$emit("close");
    },
    async checkCategoryMovies(categoryId) {
      const token = localStorage.getItem("token");
      try {
        const response = await fetch(`http://symfony.mmi-troyes.fr:8319/api/categories/${categoryId}/movies`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        });

        if (!response.ok) {
          throw new Error("Erreur lors de la récupération des films");
        }

        const data = await response.json();
        this.hasMovies = data.length > 0;
      } catch (error) {
        console.error("Erreur lors de la vérification des films associés :", error);
      }
    },
    deleteCategory() {
      if (!this.hasMovies) {
        this.$emit("delete-category", this.category.id);
      }
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
  background: #2b2a2a;
  padding: 2rem;
  border-radius: 0.5rem;
  width: 100%;
  max-width: 42rem;
  margin: 0 1rem;
}

.close {
  position: absolute;
  top: 1rem;
  right: 1rem;
  font-size: 1.5rem;
  color: white;
  cursor: pointer;
}

h2 {
  font-size: 2rem;
  font-weight: 700;
  text-align: center;
  margin-bottom: 1rem;
  color: white;
}

p {
  color: white;
  text-align: center;
  margin-bottom: 1.5rem;
}

.buttons {
  display: flex;
  justify-content: space-between;
}

.btn-cancel {
  background-color: #007bff;
  color: white;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
}

.btn-delete {
  background-color: #dc3545;
  color: white;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
}

.btn-delete:disabled {
  background-color: #888;
  cursor: not-allowed;
}

.btn-delete:hover:not(:disabled) {
  background-color: #b02a37;
}
</style>
