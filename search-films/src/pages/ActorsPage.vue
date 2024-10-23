<template>
  <div>
    <h1>Liste des Acteurs</h1>

    <div class="actors-list" v-if="actors.length > 0">
      <ActorCard v-for="actor in actors" :key="actor.id" :actor="actor" />
    </div>

    <div v-else>
      <p>Aucun acteur trouvé</p>
    </div>

    <Pagination :currentPage="currentPage" :totalPages="totalPages" @page-changed="fetchActorsData" />
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
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
    const filters = ref({
      nationality: '',
      awards_min: null,
    });
    const itemsPerPage = 10;

    const requestOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      redirect: 'follow',
    };

    const fetchActorsData = async (page = 1) => {
      try {
        const params = new URLSearchParams({
          page: page.toString(),
          nationality: filters.value.nationality || '',
          awards_min: filters.value.awards_min || '',
        });

        const response = await fetch(
            `http://symfony.mmi-troyes.fr:8319/api/actors?${params.toString()}`,
            requestOptions
        );
        const data = await response.json();

        if (data['hydra:member']) {
          actors.value = data['hydra:member'];
          currentPage.value = page;
          totalPages.value = Math.ceil(data['hydra:totalItems'] / 9);
        } else {
          actors.value = [];
          totalPages.value = 1;
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des acteurs:', error);
      }
    };

    onMounted(() => {
      fetchActorsData();
    });

    return {
      actors,
      currentPage,
      totalPages,
      filters,
      fetchActorsData,
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
</style>
