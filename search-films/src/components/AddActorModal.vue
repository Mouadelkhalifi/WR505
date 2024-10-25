<template>
  <div v-if="showModal" class="modal">
    <div class="modal-content">
      <span class="close" @click="closeModal">&times;</span>
      <h2>Ajouter un Acteur</h2>

      <form @submit.prevent="addActor">
        <div class="form-container">
          <!-- Première colonne -->
          <div class="form-column">
            <div>
              <label for="actor-firstname">Prénom :</label>
              <input
                  type="text"
                  id="actor-firstname"
                  v-model="actor.firstname"
                  required
              />
            </div>

            <div>
              <label for="actor-lastname">Nom :</label>
              <input
                  type="text"
                  id="actor-lastname"
                  v-model="actor.lastname"
                  required
              />
            </div>

            <div>
              <label for="actor-dob">Date de naissance :</label>
              <input
                  type="date"
                  id="actor-dob"
                  v-model="actor.dob"
                  required
              />
            </div>

            <div>
              <label for="actor-nationality">Nationalité (FR/DE/MA) :</label>
              <input
                  type="text"
                  id="actor-nationality"
                  v-model="actor.nationality"
                  required
              />
            </div>
          </div>

          <!-- Deuxième colonne -->
          <div class="form-column">
            <div>
              <label for="actor-gender">Genre :</label>
              <select v-model="actor.gender" id="actor-gender" required>
                <option value="male">Homme</option>
                <option value="female">Femme</option>
              </select>
            </div>

            <div>
              <label for="actor-awards">Récompenses :</label>
              <input
                  type="number"
                  id="actor-awards"
                  v-model="actor.awards"
                  required
              />
            </div>

            <div>
              <button type="submit">Ajouter</button>
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
    showModal: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      actor: {
        firstname: '',
        lastname: '',
        dob: '',
        nationality: '',
        gender: 'male',
        awards: 0,
      },
    };
  },
  methods: {
    closeModal() {
      this.$emit('close');
    },
    addActor() {
      this.$emit('add-actor', this.actor);
      this.closeModal();
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
}

.close {
  position: absolute;
  top: 1rem;
  right: 1rem;
  font-size: 1.5rem;
  cursor: pointer;
}

h2 {
  font-size: 2rem;
  margin-bottom: 2rem;
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
}

input, select {
  padding: 0.75rem;
  border-radius: 0.5rem;
  border: 1px solid #4a4a4a;
  background: #333;
  color: #fff;
  width: 100%;
}

button {
  padding: 0.75rem 1.5rem;
  background-color: #e50914;
  color: white;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
}

button:hover {
  background-color: #cc0000;
}
</style>
