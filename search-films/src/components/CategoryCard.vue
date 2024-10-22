<template>
  <div class="category-card">
    <h3>{{ category.title }}</h3>
  </div>
</template>

<script>
export default {
  props: {
    category: {
      type: Object,
      required: true,
    },
  },
};
</script>

<style scoped>
.category-card {
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #f9f9f9;
  margin-bottom: 10px;
}
</style>
