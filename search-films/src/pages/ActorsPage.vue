<template>
  <div>
    <h1>Actors</h1>

    <button @click="openAddActorForm">Add Actor</button>
    <AddActorForm v-if="showActorForm" :actor="selectedActor" @close="closeActorForm" @submit="handleActorSubmit" />

    <div class="search-bar">
      <input v-model="searchQuery" placeholder="Search for an actor" @input="handleSearchActors" />
    </div>

    <div class="actors-list">
      <ActorCard
          v-for="actor in actors"
          :key="actor.id"
          :actor="actor"
          @click="goToActorDetails(actor.id)"
      />
    </div>

    <Pagination :currentPage="currentPage" :totalPages="totalPages" @page-changed="fetchActorsData" />
  </div>
</template>

<script>
import {ref, onMounted} from 'vue';
import ActorCard from '@/components/ActorCard.vue';
import Pagination from '@/components/Pagination.vue';
import AddActorForm from '@/components/AddActorForm.vue';
import {addActor, updateActor, fetchActorsAPI, searchActorsFromAPI} from '@/services/api'; // Assurez-vous que cette fonction existe

export default {
  components: {
    ActorCard,
    Pagination,
    AddActorForm
  },
  setup() {
    const actors = ref([]);
    const searchQuery = ref('');
    const currentPage = ref(1);
    const totalPages = ref(1);
    const showActorForm = ref(false);
    const selectedActor = ref(null);

    // Utiliser fetchActorsAPI à la place de fetchActors
    const fetchActorsData = async (page = 1) => {
      try {
        const {data, total_pages} = await fetchActorsAPI(page); // Assurez-vous que cette fonction existe dans votre fichier API
        actors.value = data;
        totalPages.value = total_pages;
        currentPage.value = page;
      } catch (error) {
        console.error("Erreur lors de la récupération des acteurs :", error);
      }
    };

    const handleSearchActors = async () => {
      if (searchQuery.value) {
        const data = await searchActorsFromAPI(searchQuery.value); // Utilisation correcte de searchActorsFromAPI
        actors.value = data;
      } else {
        fetchActorsData();
      }
    };

    const goToActorDetails = (actorId) => {
      this.$router.push(`/actors/${actorId}`);
    };

    const openAddActorForm = () => {
      selectedActor.value = null;
      showActorForm.value = true;
    };

    const closeActorForm = () => {
      showActorForm.value = false;
    };

    const handleActorSubmit = async (actor) => {
      try {
        if (actor.id) {
          await updateActor(actor.id, actor);
        } else {
          await addActor(actor);
        }
        fetchActorsData();
        closeActorForm();
      } catch (error) {
        console.error("Erreur lors de l'ajout/modification de l'acteur :", error);
      }
    };

    onMounted(() => fetchActorsData());

    return {
      actors,
      searchQuery,
      currentPage,
      totalPages,
      showActorForm,
      selectedActor,
      fetchActorsData,
      handleSearchActors,
      goToActorDetails,
      openAddActorForm,
      closeActorForm,
      handleActorSubmit
    };
  }
};
</script>
