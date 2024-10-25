<template>
  <div v-if="showModal" class="modal">
    <div class="modal-content">
      <span class="close" @click="closeModal">&times;</span>
      <h2>Modifier un Acteur</h2>

      <form @submit.prevent="updateActor">
        <div class="form-container">
          <!-- Première colonne -->
          <div class="form-column">
            <div>
              <label for="actor-firstname">Prénom :</label>
              <input
                  type="text"
                  id="actor-firstname"
                  v-model="localActor.firstname"
                  required
              />
            </div>

            <div>
              <label for="actor-lastname">Nom :</label>
              <input
                  type="text"
                  id="actor-lastname"
                  v-model="localActor.lastname"
                  required
              />
            </div>

            <div>
              <label for="actor-dob">Date de naissance :</label>
              <input
                  type="date"
                  id="actor-dob"
                  v-model="formattedDob"
                  required
              />
            </div>

            <div v-if="localActor.death_date">
              <label for="actor-death_date">Date de décès :</label>
              <input
                  type="date"
                  id="actor-death_date"
                  v-model="localActor.death_date"
              />
            </div>
          </div>

          <!-- Deuxième colonne -->
          <div class="form-column">
            <div>
              <label for="actor-nationality">Nationalité (FR/DE/MA) :</label>
              <input
                  type="text"
                  id="actor-nationality"
                  v-model="localActor.nationality"
                  required
              />
            </div>

            <div>
              <label for="actor-gender">Genre :</label>
              <select id="actor-gender" v-model="localActor.gender" required>
                <option value="male">Homme</option>
                <option value="female">Femme</option>
              </select>
            </div>

            <div>
              <label for="actor-awards">Récompenses :</label>
              <input
                  type="number"
                  id="actor-awards"
                  v-model="localActor.awards"
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
    actor: Object
  },
  data() {
    return {
      localActor: {}, // Local copy of the actor data
      formattedDob: "" // Formatted date for the 'dob' field
    };
  },
  watch: {
    // Watch the actor prop to update the local actor copy and format the dob
    actor: {
      handler(newActor) {
        this.localActor = { ...newActor }; // Deep copy to avoid modifying the original directly
        this.formattedDob = this.formatDateForInput(newActor.dob); // Format the dob
      },
      immediate: true
    },
    // Watch formattedDob and update the localActor's dob when it changes
    formattedDob(newDob) {
      this.localActor.dob = newDob;
    }
  },
  methods: {
    formatDateForInput(date) {
      if (!date) return "";
      const d = new Date(date);
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, "0");
      const day = String(d.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    },
    closeModal() {
      this.$emit('close');
    },
    updateActor() {
      this.$emit('update-actor', this.localActor);
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
  margin-bottom: 2rem;
  color: white;
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

button {
  width: 100%;
  padding: 0.75rem 1.5rem;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-weight: 500;
  cursor: pointer;
}
</style>
