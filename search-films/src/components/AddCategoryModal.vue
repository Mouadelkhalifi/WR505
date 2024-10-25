<template>
  <div class="modal" v-if="showModal">
    <div class="modal-content">
      <span class="close" @click="closeModal">&times;</span>
      <h2>Ajouter une Catégorie</h2>

      <form @submit.prevent="submitForm">
        <div class="form-container">
          <div class="form-column">
            <div>
              <label for="title">Titre de la catégorie :</label>
              <input
                  type="text"
                  id="title"
                  v-model="category.title"
                  required
              />
            </div>
          </div>

          <div class="form-column">
            <div>
              <label for="date">Date de création :</label>
              <input
                  type="date"
                  id="date"
                  v-model="category.created_at"
                  required
              />
            </div>
          </div>
        </div>

        <div class="button-group">
          <button type="submit" class="btn-submit">Ajouter</button>
          <button type="button" @click="closeModal" class="btn-cancel">Annuler</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    showModal: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      category: {
        title: '',
      },
    };
  },
  methods: {
    submitForm() {
      this.$emit('add-category', this.category);
      this.category = {title: '', description: ''};
      this.$emit('close');
    },
    closeModal() {
      this.$emit('close');
    },
  },
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
  max-width: 600px;
  margin: 0 1rem;
  position: relative;
}

.close {
  position: absolute;
  top: 1rem;
  right: 1rem;
  font-size: 1.5rem;
  cursor: pointer;
  color: white;
}

h2 {
  font-size: 2rem;
  margin-bottom: 2rem;
  color: white;
  text-align: center;
}

.form-container {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

.form-column {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

label {
  font-weight: 500;
  margin-bottom: 0.5rem;
  color: #fff;
}

input, textarea {
  padding: 0.75rem;
  border-radius: 0.5rem;
  border: 1px solid #4a4a4a;
  background: #333;
  color: #fff;
  width: 100%;
}

textarea {
  resize: vertical;
  min-height: 100px;
}

.button-group {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1.5rem;
}

.btn-submit {
  padding: 0.75rem 1.5rem;
  background-color: #e50914;
  color: white;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
}

.btn-submit:hover {
  background-color: #cc0000;
}

.btn-cancel {
  padding: 0.75rem 1.5rem;
  background-color: #4a4a4a;
  color: white;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
}

.btn-cancel:hover {
  background-color: #333;
}
</style>
