<template>
  <div>

    <h1>Categories</h1>

    <div class="search-bar">
      <input v-model="searchQuery" placeholder="Search for a category" @input="searchCategories" />
    </div>

    <div class="categories-list">
      <CategoryCard
          v-for="category in categories"
          :key="category.id"
          :category="category"
      />
    </div>

    <Pagination :currentPage="currentPage" :totalPages="totalPages" @page-changed="fetchCategories" />

    <button @click="openAddCategoryForm">Add Category</button>

    <!-- Modal for adding/editing a category -->
    <AddCategoryForm v-if="showCategoryForm" :category="selectedCategory" @close="closeCategoryForm" @submit="handleCategorySubmit" />
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import CategoryCard from '@/components/CategoryCard.vue';
import Pagination from '@/components/Pagination.vue';
import AddCategoryForm from '@/components/AddCategoryForm.vue';
import NavBar from '@/components/NavBar.vue';
import { addCategory } from '@/services/api';

export default {
  components: { CategoryCard, Pagination, AddCategoryForm, NavBar },
  setup() {
    const categories = ref([]);
    const searchQuery = ref('');
    const currentPage = ref(1);
    const totalPages = ref(1);
    const showCategoryForm = ref(false);
    const selectedCategory = ref(null);

    const fetchCategories = async (page = 1) => {
      const { data, total_pages } = await fetchCategories(page);
      categories.value = data;
      totalPages.value = total_pages;
      currentPage.value = page;
    };

    const searchCategories = async () => {
      if (searchQuery.value) {
        categories.value = await searchCategories(searchQuery.value);
      } else {
        fetchCategories();
      }
    };

    const openAddCategoryForm = () => {
      selectedCategory.value = null;
      showCategoryForm.value = true;
    };

    const closeCategoryForm = () => {
      showCategoryForm.value = false;
    };

    const handleCategorySubmit = async (category) => {
      if (category.id) {
        await editCategory(category);
      } else {
        await addCategory(category);
      }
      fetchCategories();
      closeCategoryForm();
    };

    onMounted(() => fetchCategories());

    return { categories, searchQuery, currentPage, totalPages, showCategoryForm, selectedCategory, fetchCategories, searchCategories, openAddCategoryForm, closeCategoryForm, handleCategorySubmit };
  }
};
</script>
