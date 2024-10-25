<template>
  <div class="container">
    <h1>Liste des Catégories</h1>

    <!-- Barre de recherche -->
    <div class="search-bar mb-8">
      <input
          id="search"
          ref="searchInput"
          type="text"
          v-model="query"
          placeholder="Rechercher une catégorie..."
          class="search-input"
      />
    </div>

    <div class="flex justify-end mb-8">
      <button @click="openAddCategoryForm" class="add-category-btn">Ajouter une catégorie</button>
    </div>

    <!-- Modal d'ajout de catégorie -->
    <AddCategoryModal
        v-if="showAddCategoryForm"
        :showModal="showAddCategoryForm"
        @close="closeAddCategoryForm"
        @add-category="addCategory"
    />

    <!-- Liste des catégories -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" v-if="categories.length > 0">
      <CategoryCard
          v-for="category in categories"
          :key="category.id"
          :category="category"
          @update-category="updateCategoryInList"
          @category-deleted="removeCategoryFromList"
      />
    </div>

    <div v-else>
      <p>Aucune catégorie trouvée.</p>
    </div>

    <!-- Popin de succès pour suppression -->
    <div v-if="showDeleteSuccess" class="success-popin">Catégorie supprimée avec succès !</div>

    <!-- Pagination -->
    <div class="pagination-container" v-if="totalPages > 1">
      <div class="pagination">
        <button class="pagination-btn" :disabled="currentPage === 1" @click="goToPreviousPage">Précédent</button>
        <div class="pagination-numbers">
          <button v-if="visiblePages[0] > 1" class="pagination-btn" @click="goToPage(1)">1</button>
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

        <button class="pagination-btn" :disabled="currentPage === totalPages" @click="goToNextPage">Suivant</button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, watch } from 'vue';
import CategoryCard from '@/components/CategoryCard.vue';
import AddCategoryModal from '@/components/AddCategoryModal.vue';

export default {
  components: {
    CategoryCard,
    AddCategoryModal,
  },
  setup() {
    const categories = ref([]);
    const currentPage = ref(1);
    const totalPages = ref(1);
    const pageRange = ref(5);
    const itemsPerPage = 9;
    const showAddCategoryForm = ref(false);
    const showDeleteSuccess = ref(false);
    const isLoading = ref(false);
    const query = ref('');
    const typingTimer = ref(null);

    const fetchCategoriesData = async (page = 1) => {
      if (!isAuthenticated()) {
        window.location.href = '/login';
        return;
      }

      isLoading.value = true;
      const token = localStorage.getItem('token');
      const params = new URLSearchParams({
        page: page.toString(),
        itemsPerPage: itemsPerPage.toString(),
        title: query.value || ''
      });

      try {
        const response = await fetch(`http://symfony.mmi-troyes.fr:8319/api/categories?${params.toString()}`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        const data = await response.json();

        if (data['hydra:member']) {
          categories.value = data['hydra:member'];
          currentPage.value = page;
          totalPages.value = Math.ceil(data['hydra:totalItems'] / itemsPerPage);
        } else {
          categories.value = [];
          totalPages.value = 1;
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des catégories:', error);
      } finally {
        isLoading.value = false;
      }
    };

    const visiblePages = computed(() => {
      const halfRange = Math.floor(pageRange.value / 2);
      let start = Math.max(1, currentPage.value - halfRange);
      let end = Math.min(totalPages.value, currentPage.value + halfRange);

      if (currentPage.value <= halfRange) {
        end = Math.min(totalPages.value, pageRange.value);
      } else if (currentPage.value + halfRange >= totalPages.value) {
        start = Math.max(1, totalPages.value - pageRange.value + 1);
      }

      return Array.from({ length: end - start + 1 }, (_, i) => i + start);
    });

    const goToPreviousPage = () => {
      if (currentPage.value > 1) {
        fetchCategoriesData(currentPage.value - 1);
      }
    };

    const goToNextPage = () => {
      if (currentPage.value < totalPages.value) {
        fetchCategoriesData(currentPage.value + 1);
      }
    };

    const goToPage = (page) => {
      if (page >= 1 && page <= totalPages.value) {
        fetchCategoriesData(page);
      }
    };

    const openAddCategoryForm = () => {
      showAddCategoryForm.value = true;
    };

    const closeAddCategoryForm = () => {
      showAddCategoryForm.value = false;
    };

    const addCategory = async (newCategory) => {
      const token = localStorage.getItem('token');
      try {
        const response = await fetch('http://symfony.mmi-troyes.fr:8319/api/categories', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newCategory),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(`Erreur lors de l'ajout: ${errorData.detail}`);
        }

        fetchCategoriesData(currentPage.value);
      } catch (error) {
        console.error("Erreur lors de l'ajout de la catégorie:", error);
      }
    };

    const updateCategoryInList = (updatedCategory) => {
      const index = categories.value.findIndex(category => category.id === updatedCategory.id);
      if (index !== -1) {
        categories.value[index] = { ...updatedCategory };
      }
    };

    const removeCategoryFromList = (categoryId) => {
      categories.value = categories.value.filter(category => category.id !== categoryId);
      showDeleteSuccess.value = true;
      console.log("Le popin de suppression devrait être visible.");

      setTimeout(() => {
        showDeleteSuccess.value = false;
        console.log("Le popin de suppression est maintenant masqué.");
      }, 3000);
    };

    watch(query, () => {
      clearTimeout(typingTimer.value);
      typingTimer.value = setTimeout(() => {
        currentPage.value = 1;
        fetchCategoriesData();
      }, 500);
    });

    const isAuthenticated = () => !!localStorage.getItem('token');

    onMounted(() => {
      fetchCategoriesData();
    });

    return {
      categories,
      currentPage,
      totalPages,
      visiblePages,
      isLoading,
      query,
      showAddCategoryForm,
      showDeleteSuccess,
      fetchCategoriesData,
      goToPreviousPage,
      goToNextPage,
      goToPage,
      openAddCategoryForm,
      closeAddCategoryForm,
      addCategory,
      updateCategoryInList,
      removeCategoryFromList,
    };
  },
};
</script>


<style scoped>
.success-popin{
  position: fixed;
  bottom: 20px;
  right: 20px;
  background-color: #28a745;
  color: white;
  padding: 1rem 1.5rem;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  z-index: 1000;
}
.search-bar {
  position: relative;
  max-width: 600px;
  margin: 0 auto 2rem;
}

.search-input {
  width: 100%;
  padding: 12px 20px;
  font-size: 16px;
  color: #1f2937;
  background-color: #fff;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.search-input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
}

.search-input::placeholder {
  color: #9ca3af;
}

.add-category-btn {
  display: inline-flex;
  align-items: center;
  padding: 12px 24px;
  font-size: 16px;
  font-weight: 500;
  color: #ffffff;
  background-color: #3b82f6;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(59, 130, 246, 0.2);
}

.add-category-btn:hover {
  background-color: #2563eb;
  transform: translateY(-1px);
  box-shadow: 0 4px 6px rgba(59, 130, 246, 0.3);
}

.add-category-btn:active {
  transform: translateY(0);
  box-shadow: 0 2px 4px rgba(59, 130, 246, 0.2);
}

.add-category-btn:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.3);
}

@media (prefers-color-scheme: dark) {
  .search-input {
    background-color: #1f2937;
    color: #f3f4f6;
    border-color: #374151;
  }

  .search-input::placeholder {
    color: #6b7280;
  }

  .search-input:focus {
    border-color: #60a5fa;
    box-shadow: 0 0 0 3px rgba(96, 165, 250, 0.2);
  }
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

.pagination-btn {
  background: transparent;
  color: var(--text-color);
  border: 1px solid var(--primary-color);
  padding: 0.5rem 1rem;
  border-radius: var(--border-radius);
  cursor: pointer;
  font-weight: 500;
  transition: all var(--transition-speed);
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
