<template>
  <div class="profile-container">
    <div class="profile-card">
      <h1 class="profile-title">Mon Profil</h1>
      <form @submit.prevent="updateProfile" class="profile-form">
        <div class="form-group">
          <label for="email" class="form-label">Email:</label>
          <div class="input-container">
            <span class="input-icon">📧</span>
            <input
                v-model="profile.email"
                type="email"
                id="email"
                class="form-input"
                required
            />
          </div>
        </div>
        <div class="form-group">
          <label for="password" class="form-label">Nouveau mot de passe:</label>
          <div class="input-container">
            <span class="input-icon">🔒</span>
            <input
                v-model="profile.password"
                type="password"
                id="password"
                class="form-input"
                required
            />
          </div>
        </div>
        <button type="submit" class="submit-btn">
          Mettre à jour
        </button>
      </form>
      <div v-if="message" :class="['message', message.includes('succès') ? 'success' : 'error']">
        {{ message }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      profile: {
        email: '',
        password: ''
      },
      message: ''
    };
  },
  created() {
    this.fetchProfile();
  },
  methods: {
    async fetchProfile() {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch("http://symfony.mmi-troyes.fr:8319/api/user/profile", {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        });

        if (!response.ok) throw new Error("Failed to fetch profile data");

        const data = await response.json();
        this.profile.email = data.email;
      } catch (error) {
        console.error("Erreur lors de la récupération du profil:", error);
        this.message = "Erreur lors du chargement du profil";
      }
    },
    async updateProfile() {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch("http://symfony.mmi-troyes.fr:8319/api/user/profile", {
          method: "PUT",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            email: this.profile.email,
            password: this.profile.password
          })
        });

        if (!response.ok) throw new Error("Failed to update profile");

        this.message = "Profil mis à jour avec succès";
        this.profile.password = '';
      } catch (error) {
        console.error("Erreur lors de la mise à jour du profil:", error);
        this.message = "Erreur lors de la mise à jour du profil";
      }
    }
  }
};
</script>

<style scoped>
.profile-container {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem;
  background: #121212;
}

.profile-card {
  width: 100%;
  max-width: 500px;
  background: linear-gradient(180deg, #1a1a1a 0%, #2a2a2a 100%);
  border-radius: 15px;
  padding: 2rem;
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.3);
}

.profile-title {
  color: #ffffff;
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 2rem;
  text-align: center;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
}

.profile-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-label {
  color: #808080;
  font-size: 0.875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.input-container {
  position: relative;
  display: flex;
  align-items: center;
}

.input-icon {
  position: absolute;
  left: 1rem;
  font-size: 1.2rem;
  pointer-events: none;
}

.form-input {
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 3rem;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  color: #ffffff;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.form-input:focus {
  outline: none;
  border-color: #e50914;
  background: rgba(255, 255, 255, 0.15);
  box-shadow: 0 0 0 2px rgba(229, 9, 20, 0.2);
}

.submit-btn {
  margin-top: 1rem;
  padding: 1rem;
  background: #e50914;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.submit-btn:hover {
  background: #b30710;
  transform: translateY(-2px);
}

.submit-btn:active {
  transform: translateY(0);
}

.message {
  margin-top: 1.5rem;
  padding: 1rem;
  border-radius: 8px;
  text-align: center;
  font-weight: 600;
  animation: slideIn 0.3s ease-out;
}

.success {
  background: rgba(16, 185, 129, 0.2);
  color: #10b981;
  border: 1px solid #10b981;
}

.error {
  background: rgba(239, 68, 68, 0.2);
  color: #ef4444;
  border: 1px solid #ef4444;
}

@keyframes slideIn {
  from {
    transform: translateY(-10px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

@media (max-width: 640px) {
  .profile-container {
    padding: 1rem;
  }

  .profile-card {
    padding: 1.5rem;
  }

  .profile-title {
    font-size: 1.5rem;
  }

  .form-input {
    font-size: 0.875rem;
  }
}
</style>