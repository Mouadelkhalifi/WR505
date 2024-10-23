<template>
  <div class="login-container">
    <div class="login-card">
      <h2>Connexion</h2>
      <form @submit.prevent="login" class="login-form">
        <div class="form-group">
          <label for="email">Email:</label>
          <input
              v-model="email"
              type="text"
              id="email"
              placeholder="Email"
              class="form-input"
          />
        </div>
        <div class="form-group">
          <label for="password">Mot de passe:</label>
          <input
              v-model="password"
              type="password"
              id="password"
              placeholder="Mot de passe"
              class="form-input"
          />
        </div>
        <div class="form-group">
          <button type="submit" class="btn login-btn">
            <span v-if="!isLoading">Se connecter</span>
            <div v-else class="loading-spinner"></div>
          </button>
        </div>
        <div v-if="errorMessage" class="error-message">
          {{ errorMessage }}
        </div>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      email: 'admin@example.com',
      password: 'admin123',
      errorMessage: '',
      isLoading: false
    };
  },
  methods: {
    async login() {
      this.isLoading = true;
      this.errorMessage = '';

      const myHeaders = new Headers();
      myHeaders.append('Content-Type', 'application/json');

      const raw = JSON.stringify({
        email: this.email,
        password: this.password,
      });

      const requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow',
      };

      try {
        const response = await fetch('http://symfony.mmi-troyes.fr:8319/auth', requestOptions);

        if (response.ok) {
          const result = await response.json();
          localStorage.setItem('token', result.token);
          this.$emit('updateLoginStatus', true);
          this.$router.push('/home');
        } else {
          this.errorMessage = 'Échec de la connexion. Vérifiez vos identifiants.';
        }
      } catch (error) {
        console.error('Erreur réseau:', error);
        this.errorMessage = 'Erreur de connexion. Veuillez réessayer.';
      } finally {
        this.isLoading = false;
      }
    },
  },
};
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background: var(--background-color);
}

.login-card {
  width: 100%;
  max-width: 400px;
  background: var(--card-background);
  padding: 2rem;
  border-radius: var(--border-radius);
  box-shadow: var(--card-shadow);
}

.login-card h2 {
  text-align: center;
  margin-bottom: 2rem;
  color: var(--text-color);
  font-size: 2rem;
  position: relative;
}

.login-card h2::after {
  content: '';
  display: block;
  width: 60px;
  height: 4px;
  background-color: var(--primary-color);
  margin: 1rem auto 0;
  border-radius: 2px;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  color: var(--text-color);
  font-weight: 500;
}

.form-input {
  padding: 0.75rem 1rem;
  border: 2px solid transparent;
  border-radius: var(--border-radius);
  background-color: var(--background-color);
  color: var(--text-color);
  transition: all var(--transition-speed);
}

.form-input:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 2px rgba(229, 9, 20, 0.2);
}

.login-btn {
  width: 100%;
  padding: 0.75rem;
  font-size: 1.1rem;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 48px;
}

.login-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.error-message {
  background-color: rgba(255, 0, 0, 0.1);
  color: var(--primary-color);
  padding: 0.75rem;
  border-radius: var(--border-radius);
  text-align: center;
  font-weight: 500;
}

/* Loading Spinner styles sont déjà définis dans votre CSS global */
</style>