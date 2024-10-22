<template>
  <div>
    <NavBar />

    <h1>Actors</h1>

    <div class="search-bar">
      <input v-model="searchQuery" placeholder="Search for an actor" @input="searchActors" />
    </div>

    <div class="actors-list">
      <ActorCard
          v-for="actor in actors"
          :key="actor.id"
          :actor="actor"
          @click="goToActorDetails(actor.id)"
      />
    </div>

    <Pagination :currentPage="currentPage" :totalPages="totalPages" @page-changed="fetchActors" />

    <button @click="openAddActorForm">Add Actor</button>

    <!-- Modal for adding/editing an actor -->
    <AddActorForm v-if="showActorForm" :actor="selectedActor" @close="closeActorForm" @submit="handleActorSubmit" />
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import ActorCard from '@/components/ActorCard.vue';
import Pagination from '@/components/Pagination.vue';
import AddActorForm from '@/components/AddActorForm.vue';
import NavBar from '@/components/NavBar.vue';
import { addActor } from '@/services/api';

export default {
  components: { ActorCard, Pagination, AddActorForm, NavBar },
  setup() {
    const actors = ref([]);
    const searchQuery = ref('');
    const currentPage = ref(1);
    const totalPages = ref(1);
    const showActorForm = ref(false);
    const selectedActor = ref(null);

    const fetchActors = async (page = 1) => {
      const { data, total_pages } = await fetchActors(page);
      actors.value = data;
      totalPages.value = total_pages;
      currentPage.value = page;
    };

    const searchActors = async () => {
      if (searchQuery.value) {
        actors.value = await searchActors(searchQuery.value);
      } else {
        fetchActors();
      }
    };

    const goToActorDetails = (actorId) => {
      router.push(`/actors/${actorId}`);
    };

    const openAddActorForm = () => {
      selectedActor.value = null;
      showActorForm.value = true;
    };

    const closeActorForm = () => {
      showActorForm.value = false;
    };

    const handleActorSubmit = async (actor) => {
      if (actor.id) {
        await editActor(actor);
      } else {
        await addActor(actor);
      }
      fetchActors();
      closeActorForm();
    };

    onMounted(() => fetchActors());

    return { actors, searchQuery, currentPage, totalPages, showActorForm, selectedActor, fetchActors, searchActors, goToActorDetails, openAddActorForm, closeActorForm, handleActorSubmit };
  }
};
</script>
