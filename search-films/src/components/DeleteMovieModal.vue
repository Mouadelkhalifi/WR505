<template>
  <div v-if="showModal" class="modal">
    <div class="modal-content">
      <span class="close" @click="closeModal">&times;</span>
      <h2>Confirmer la suppression</h2>
      <p>Êtes-vous sûr de vouloir supprimer ce film ? Cette action est irréversible.</p>

      <div class="buttons">
        <button @click="confirmDelete" class="btn-delete">Supprimer</button>
        <button @click="closeModal" class="btn-cancel">Annuler</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    showModal: Boolean,
    movie: Object,
  },
  methods: {
    closeModal() {
      this.$emit("close");
    },
    confirmDelete() {
      this.$emit("delete-movie", this.movie.id);
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
  max-width: 30rem;
  text-align: center;
  color: white;
}

.close {
  position: absolute;
  top: 1rem;
  right: 1rem;
  font-size: 1.5rem;
  cursor: pointer;
}

h2 {
  font-size: 1.75rem;
  margin-bottom: 1rem;
}

.buttons {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
}

.btn-delete {
  background-color: #e50914;
  color: white;
  padding: 0.75rem 1.5rem;
  border: none;
  cursor: pointer;
  border-radius: 0.5rem;
}

.btn-cancel {
  background-color: #ccc;
  padding: 0.75rem 1.5rem;
  border: none;
  cursor: pointer;
  border-radius: 0.5rem;
}

.btn-delete:hover {
  background-color: #b30710;
}

.btn-cancel:hover {
  background-color: #999;
}
</style>
