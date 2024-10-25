<template>
  <div>
    <h1>Liste des Acteurs</h1>

    <!-- Barre de recherche pour les acteurs -->
    <div class="search-bar mb-8">
      <label for="search" class="sr-only">Rechercher un acteur :</label>
      <input
          id="search"
          ref="searchInput"
          type="text"
          v-model="query"
          placeholder="Rechercher un acteur..."
          class="search-input"
      />
    </div>

    <!-- Bouton pour afficher la modal d'ajout d'acteur -->
    <button class="btn-add-actor" @click="openAddActorForm">Ajouter un acteur</button>

    <!-- Modal d'ajout d'acteur -->
    <AddActorModal
        v-if="showAddActorForm"
        :showModal="showAddActorForm"
        @close="closeAddActorForm"
        @add-actor="addActor"
    />

    <!-- Liste des acteurs -->
    <div class="actors-list" v-if="actors.length > 0">
      <ActorCard v-for="actor in actors" :key="actor.id" :actor="actor" @update-actor="updateActorInList" @actor-deleted="removeActorFromList" />
    </div>

    <div v-else>
      <p>Aucun acteur trouvé</p>
    </div>

    <!-- Pagination -->
    <div class="pagination-container" v-if="totalPages > 1">
      <div class="pagination">
        <button class="pagination-btn" :disabled="currentPage === 1" @click="goToPreviousPage">
          Précédent
        </button>

        <div class="pagination-numbers">
          <button v-if="visiblePages[0] > 1" class="pagination-btn" @click="goToPage(1)">
            1
          </button>
          <span v-if="visiblePages[0] > 2">...</span>

          <button
              v-for="page in visiblePages"
              :key="page"
              class="pagination-btn"
              :class="{ active: page === currentPage }"
              @click="goToPage(page)"
          >
            {{ page }}
          </button>

          <span v-if="visiblePages[visiblePages.length - 1] < totalPages - 1">...</span>
          <button
              v-if="visiblePages[visiblePages.length - 1] < totalPages"
              class="pagination-btn"
              @click="goToPage(totalPages)"
          >
            {{ totalPages }}
          </button>
        </div>

        <button
            class="pagination-btn"
            :disabled="currentPage === totalPages"
            @click="goToNextPage"
        >
          Suivant
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, watch } from 'vue';
import ActorCard from '@/components/ActorCard.vue';
import Pagination from '@/components/Pagination.vue';
import AddActorModal from '@/components/AddActorModal.vue';

export default {
  components: {
    ActorCard,
    Pagination,
    AddActorModal,
  },
  setup() {
    const actors = ref([]);
    const currentPage = ref(1);
    const totalPages = ref(1);
    const pageRange = ref(5);
    const itemsPerPage = 9;
    const showAddActorForm = ref(false);
    const isLoading = ref(false);
    const query = ref('');
    const typingTimer = ref(null);

    // Fetch actors from API
    const fetchActorsData = async (page = 1) => {
      if (!isAuthenticated()) {
        window.location.href = '/login';
        return;
      }

      isLoading.value = true;
      const token = localStorage.getItem('token');
      const params = new URLSearchParams({
        page: page.toString(),
        itemsPerPage: itemsPerPage.toString(),
        firstname: query.value || ''
      });

      try {
        const response = await fetch(`http://symfony.mmi-troyes.fr:8319/api/actors?${params.toString()}`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        const data = await response.json();

        if (data['hydra:member']) {
          actors.value = data['hydra:member'];
          currentPage.value = page;
          totalPages.value = Math.ceil(data['hydra:totalItems'] / itemsPerPage);
        } else {
          actors.value = [];
          totalPages.value = 1;
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des acteurs:', error);
      } finally {
        isLoading.value = false;
      }
    };

    // Pagination logic
    const visiblePages = computed(() => {
      const halfRange = Math.floor(pageRange.value / 2);
      let start = Math.max(1, currentPage.value - halfRange);
      let end = Math.min(totalPages.value, currentPage.value + halfRange);

      if (currentPage.value <= halfRange) {
        end = Math.min(totalPages.value, pageRange.value);
      } else if (currentPage.value + halfRange >= totalPages.value) {
        start = Math.max(1, totalPages.value - pageRange.value + 1);
      }

      const pages = [];
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      return pages;
    });

    // Navigation between pages
    const goToPreviousPage = () => {
      if (currentPage.value > 1) {
        fetchActorsData(currentPage.value - 1);
      }
    };

    const goToNextPage = () => {
      if (currentPage.value < totalPages.value) {
        fetchActorsData(currentPage.value + 1);
      }
    };

    const goToPage = (page) => {
      if (page >= 1 && page <= totalPages.value) {
        fetchActorsData(page);
      }
    };

    // Open and close Add Actor modal
    const openAddActorForm = () => {
      showAddActorForm.value = true;
    };

    const closeAddActorForm = () => {
      showAddActorForm.value = false;
    };

    // Add a new actor
    const addActor = async (newActor) => {
      const token = localStorage.getItem('token');
      try {
        const response = await fetch('http://symfony.mmi-troyes.fr:8319/api/actors', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newActor),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(`Erreur lors de l'ajout: ${errorData.detail}`);
        }

        // Refresh actors list after adding a new actor
        fetchActorsData(currentPage.value);
      } catch (error) {
        console.error('Erreur lors de l\'ajout de l\'acteur:', error);
      }
    };

    // Update actor in the list without reloading the page
    const updateActorInList = (updatedActor) => {
      const index = actors.value.findIndex(actor => actor.id === updatedActor.id);
      if (index !== -1) {
        actors.value[index] = {...updatedActor};
      }
    };

    // Remove actor from the list without reloading the page
    const removeActorFromList = (actorId) => {
      actors.value = actors.value.filter(actor => actor.id !== actorId);
    };

    // Search actors automatically (debounced)
    watch(query, (newQuery) => {
      clearTimeout(typingTimer.value);
      typingTimer.value = setTimeout(() => {
        currentPage.value = 1;
        fetchActorsData();
      }, 500); // Debounce search by 500ms
    });

    const isAuthenticated = () => !!localStorage.getItem('token');

    onMounted(() => {
      fetchActorsData();
    });

    return {
      actors,
      currentPage,
      totalPages,
      visiblePages,
      isLoading,
      query,
      showAddActorForm,
      fetchActorsData,
      goToPreviousPage,
      goToNextPage,
      goToPage,
      openAddActorForm,
      closeAddActorForm,
      addActor,
      updateActorInList,
      removeActorFromList,
    };
  },
};
</script>

<style scoped>
.search-bar {
  display: flex;
  justify-content: center;
  margin-bottom: 2rem;
}

.search-input {
  width: 100%;
  max-width: 400px;
  padding: 0.5rem 1rem;
  border-radius: 5px;
  border: 1px solid #ccc;
  font-size: 1rem;
  box-shadow: var(--card-shadow);
}

.actors-list {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 20px;
  margin-left: 20px;
}

.pagination-container {
  margin-top: 3rem;
  margin-bottom: 2rem;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: var(--card-background);
  border-radius: var(--border-radius);
  box-shadow: var(--card-shadow);
}

.pagination-numbers {
  display: flex;
  gap: 0.5rem;
}

.pagination-btn {
  background: transparent;
  color: var(--text-color);
  border: 1px solid var(--primary-color);
  padding: 0.5rem 1rem;
  border-radius: var(--border-radius);
  transition: all var(--transition-speed);
  cursor: pointer;
  font-weight: 500;
}

.pagination-btn:hover,
.btn-hover {
  background: var(--primary-color);
  color: var(--secondary-color);
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(229, 9, 20, 0.3);
}

.pagination-btn.active {
  background: var(--primary-color);
  color: var(--secondary-color);
}
</style>
