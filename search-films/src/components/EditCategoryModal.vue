<template>
  <div v-if="showModal" class="modal">
    <div class="modal-content">
      <span class="close" @click="closeModal">&times;</span>
      <h2>Modifier la Catégorie</h2>

      <form @submit.prevent="updateCategory">
        <div class="form-container">
          <div class="form-group">
            <label for="category-title">Titre :</label>
            <input
                type="text"
                id="category-title"
                v-model="localCategory.title"
                required
            />
          </div>
          <div class="form-group">
            <label for="category-date">Date de création :</label>
            <input
                type="date"
                id="category-date"
                v-model="localCategory.created_at"
                required
            />
          </div>

          <button type="submit">Modifier</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    showModal: Boolean,
    category: Object,
  },
  data() {
    return {
      localCategory: { ...this.category },
    };
  },
  watch: {
    category: {
      handler(newCategory) {
        this.localCategory = JSON.parse(JSON.stringify(newCategory));
      },
      immediate: true,
    },
  },
  methods: {
    closeModal() {
      this.$emit("close");
    },
    updateCategory() {
      this.$emit("update-category", this.localCategory)
      this.closeModal();
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
  position: relative;
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
  margin-bottom: 2rem;
  color: white;
}

.form-container {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group label {
  color: #fff;
  font-size: 1rem;
}

button {
  padding: 0.75rem 1.5rem;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-weight: 500;
  cursor: pointer;
}
</style>
