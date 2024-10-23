<template>
  <nav class="navbar">
    <div class="container">
      <div class="nav-container">
        <!-- Logo/Brand -->
        <div class="brand">
          <router-link to="/" class="brand-link">
            CinéStream
          </router-link>
        </div>

        <!-- Navigation Links - Desktop -->
        <ul class="nav-list desktop-nav">
          <li>
            <router-link to="/">Homepage</router-link>
          </li>
          <li>
            <router-link to="/movies">Movies</router-link>
          </li>
          <li>
            <router-link to="/actors">Actors</router-link>
          </li>
          <li>
            <router-link to="/categories">Categories</router-link>
          </li>
          <li v-if="isLoggedIn">
            <router-link to="/profile">Edit Profile</router-link>
          </li>
          <li v-if="isLoggedIn">
            <button @click="logout" class="btn">Logout</button>
          </li>
          <li v-else>
            <router-link to="/login" class="btn">Login</router-link>
          </li>
        </ul>

        <!-- Mobile Menu Button -->
        <button @click="toggleMobileMenu" class="mobile-menu-btn">
          <span class="menu-icon"></span>
        </button>
      </div>

      <!-- Mobile Menu -->
      <ul class="nav-list mobile-nav" :class="{ 'active': isMobileMenuOpen }">
        <li>
          <router-link to="/" @click="closeMobileMenu">Homepage</router-link>
        </li>
        <li>
          <router-link to="/movies" @click="closeMobileMenu">Movies</router-link>
        </li>
        <li>
          <router-link to="/actors" @click="closeMobileMenu">Actors</router-link>
        </li>
        <li>
          <router-link to="/categories" @click="closeMobileMenu">Categories</router-link>
        </li>
        <li v-if="isLoggedIn">
          <router-link to="/profile" @click="closeMobileMenu">Edit Profile</router-link>
        </li>
        <li v-if="isLoggedIn">
          <button @click="logoutMobile" class="btn">Logout</button>
        </li>
        <li v-else>
          <router-link to="/login" class="btn" @click="closeMobileMenu">Login</router-link>
        </li>
      </ul>
    </div>
  </nav>
</template>

<script>
export default {
  data() {
    return {
      isLoggedIn: false,
      isMobileMenuOpen: false
    };
  },
  created() {
    this.checkLoginStatus();
  },
  methods: {
    checkLoginStatus() {
      const token = localStorage.getItem('token');
      this.isLoggedIn = !!token;
    },
    logout() {
      localStorage.removeItem('token');
      this.isLoggedIn = false;
      this.$router.push('/login');
    },
    logoutMobile() {
      this.logout();
      this.closeMobileMenu();
    },
    toggleMobileMenu() {
      this.isMobileMenuOpen = !this.isMobileMenuOpen;
    },
    closeMobileMenu() {
      this.isMobileMenuOpen = false;
    }
  },
  watch: {
    '$route'() {
      this.checkLoginStatus();
    }
  }
};
</script>

<style scoped>
.nav-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.brand-link {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-color);
}

.brand-link:hover {
  color: var(--primary-color);
}

.desktop-nav {
  display: flex;
  align-items: center;
}

.mobile-nav {
  display: none;
}

.mobile-menu-btn {
  display: none;
  background: none;
  border: none;
  cursor: pointer;
  padding: 1rem;
}

.menu-icon {
  display: block;
  width: 25px;
  height: 2px;
  background-color: var(--text-color);
  position: relative;
  transition: var(--transition-speed);
}

.menu-icon::before,
.menu-icon::after {
  content: '';
  position: absolute;
  width: 25px;
  height: 2px;
  background-color: var(--text-color);
  transition: var(--transition-speed);
}

.menu-icon::before {
  transform: translateY(-8px);
}

.menu-icon::after {
  transform: translateY(8px);
}

@media (max-width: 768px) {
  .desktop-nav {
    display: none;
  }

  .mobile-menu-btn {
    display: block;
  }

  .mobile-nav {
    display: none;
    width: 100%;
    padding: 1rem 0;
  }

  .mobile-nav.active {
    display: block;
  }

  .mobile-nav li {
    margin-bottom: 1rem;
  }

  .mobile-nav a,
  .mobile-nav button {
    width: 100%;
    text-align: left;
    padding: 0.75rem 1rem;
  }

  .nav-container {
    flex-wrap: wrap;
  }
}

/* Animation pour le menu mobile */
.mobile-nav {
  transform-origin: top;
  transition: transform var(--transition-speed);
}

.mobile-nav.active {
  transform: scaleY(1);
}

/* Style des boutons dans la navbar */
.btn {
  background-color: var(--primary-color);
  color: var(--secondary-color);
  padding: 0.5rem 1rem;
  border-radius: var(--border-radius);
  transition: all var(--transition-speed);
  border: none;
  cursor: pointer;
  font-weight: 600;
}

.btn:hover {
  background-color: var(--primary-dark);
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(229, 9, 20, 0.3);
}
</style>