<template>
  <div class="add-actor-form">
    <h2>Ajouter un acteur</h2>
    <form @submit.prevent="submitForm">
      <div class="form-group">
        <label for="firstname">Prénom:</label>
        <input type="text" v-model="firstname" id="firstname" required />
      </div>

      <div class="form-group">
        <label for="lastname">Nom:</label>
        <input type="text" v-model="lastname" id="lastname" required />
      </div>

      <div class="form-group">
        <label for="dob">Date de naissance:</label>
        <input type="date" v-model="dob" id="dob" required />
      </div>

      <div class="form-group">
        <label for="nationality">Nationalité:</label>
        <input type="text" v-model="nationality" id="nationality" required />
      </div>

      <div class="form-group">
        <label for="awards">Récompenses:</label>
        <input type="number" v-model="awards" id="awards" />
      </div>

      <button type="submit">Ajouter</button>
    </form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      firstname: '',
      lastname: '',
      dob: '',
      nationality: '',
      awards: 0,
    };
  },
  methods: {
    submitForm() {
      const newActor = {
        firstname: this.firstname,
        lastname: this.lastname,
        dob: this.dob,
        nationality: this.nationality,
        awards: this.awards,
      };

      // Faire un appel API pour ajouter l'acteur
      fetch('http://symfony.mmi-troyes.fr:8319/api/actors', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newActor),
      })
          .then(response => response.json())
          .then(data => {
            console.log('Actor added:', data);
            // Réinitialiser le formulaire
            this.firstname = '';
            this.lastname = '';
            this.dob = '';
            this.nationality = '';
            this.awards = 0;
          })
          .catch(error => {
            console.error('Error adding actor:', error);
          });
    },
  },
};
</script>

<style scoped>
.add-actor-form {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.form-group {
  margin-bottom: 15px;
}

form label {
  display: block;
  margin-bottom: 5px;
}

form input {
  width: 100%;
  padding: 8px;
  margin-bottom: 10px;
  border-radius: 4px;
  border: 1px solid #ccc;
}

button {
  background-color: #3498db;
  color: white;
  padding: 10px 15px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

button:hover {
  background-color: #2980b9;
}
</style>
