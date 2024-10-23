<template>
  <div class="bg-gray-50 min-h-screen py-10">
    <div class="container mx-auto px-4">
      <h1 class="text-4xl font-extrabold text-center text-gray-900 mb-10">{{ category.title }}</h1>

      <h2 class="text-2xl font-bold text-gray-800 mb-5">Films associés</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div v-for="movie in movies" :key="movie.id" class="movie-card">
          <h3 class="movie-title">{{ movie.title }}</h3>
          <p>Date de sortie : {{ movie.releaseDate }}</p>
        </div>
      </div>

      <div v-if="movies.length === 0" class="col-span-full text-center text-gray-500">
        Aucun film trouvé dans cette catégorie.
      </div>
    </div>
  </div>
</template>

<script>
</script>

<style scoped>
.movie-card {
  padding: 20px;
  border: 1px solid #ddd;
  background-color: #fff;
  border-radius: 8px;
  transition: transform 0.3s, box-shadow 0.3s;
}

.movie-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}

.movie-title {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 10px;
}
</style>
