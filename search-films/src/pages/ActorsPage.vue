<template>
  <div>
    <h1>Liste des Acteurs</h1>

    <div class="actors-list" v-if="actors.length > 0">
      <ActorCard v-for="actor in actors" :key="actor.id" :actor="actor" />
    </div>

    <div v-else>
      <p>Aucun acteur trouvé</p>
    </div>

    <div class="pagination-container" v-if="totalPages > 1">
      <div class="pagination">
        <button
            class="pagination-btn"
            :disabled="currentPage === 1"
            @click="goToPreviousPage"
        >
          Précédent
        </button>

        <div class="pagination-numbers">
          <button
              v-if="visiblePages[0] > 1"
              class="pagination-btn"
              @click="goToPage(1)"
          >
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
import { ref, computed, onMounted } from 'vue';
import ActorCard from '@/components/ActorCard.vue';
import Pagination from '@/components/Pagination.vue';

export default {
  components: {
    ActorCard,
    Pagination,
  },
  setup() {
    const actors = ref([]);
    const currentPage = ref(1);
    const totalPages = ref(1);
    const pageRange = ref(5);
    const itemsPerPage = 9;
    const isLoading = ref(false);
    const filters = ref({
      nationality: '',
      awards_min: null,
    });
    const isAuthenticated = () => !!localStorage.getItem('token');

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

    const fetchActorsData = async (page = 1) => {
      if (!isAuthenticated()) {
        window.location.href = '/login';
        return;
      }

      isLoading.value = true;
      const token = localStorage.getItem('token');
      try {
        const params = new URLSearchParams({
          page: page.toString(),
          itemsPerPage: itemsPerPage.toString(),
          nationality: filters.value.nationality || '',
          awards_min: filters.value.awards_min || '',
        });

        const response = await fetch(
            `http://symfony.mmi-troyes.fr:8319/api/actors?${params.toString()}`,
            {
              method: 'GET',
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
              },
              redirect: 'follow',
            }
        );
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
        if (error.response && error.response.status === 401) {
          localStorage.removeItem('token');
          window.location.href = '/login';
        }
      } finally {
        isLoading.value = false;
      }
    };

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

    onMounted(() => {
      fetchActorsData();
    });

    return {
      actors,
      currentPage,
      totalPages,
      visiblePages,
      isLoading,
      filters,
      fetchActorsData,
      goToPreviousPage,
      goToNextPage,
      goToPage,
    };
  },
};
</script>

<style scoped>
.search-bar {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
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

@media (max-width: 768px) {
  .pagination {
    flex-direction: column;
    gap: 1rem;
  }

  .pagination-numbers {
    order: -1;
  }
}
</style>
