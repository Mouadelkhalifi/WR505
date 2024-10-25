<template>
  <div v-if="showModal" class="modal">
    <div class="modal-content">
      <span class="close" @click="closeModal">&times;</span>
      <h2>Supprimer un Acteur</h2>
      <p>Êtes-vous sûr de vouloir supprimer l'acteur <strong>{{ actor.firstname }} {{ actor.lastname }}</strong> ? Cette action est irréversible.</p>

      <div class="buttons">
        <button class="btn-cancel" @click="closeModal">Annuler</button>
        <button class="btn-delete" @click="deleteActor">Supprimer</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    showModal: Boolean,
    actor: Object
  },
  methods: {
    closeModal() {
      this.$emit('close');
    },
    deleteActor() {
      this.$emit('delete-actor', this.actor.id);
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

.btn-delete:hover {
  background-color: #b02a37;
}
</style>
