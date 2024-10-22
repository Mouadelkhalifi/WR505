<template>
  <div id="basket">
    <h1>In my basket:</h1>
    <ul v-for="item in basket">
      <li>
        {{ item.quantity }} :
        <span v-for="n in item.quantity">{{ item.type }}</span>
      </li>
    </ul>
  </div>
</template>

<style>
li { list-style: none; font-size: 2rem; }
</style>

<script>
export default {
  data() {
    return {
      basket: [
        { type: '🍌', quantity: 2 },
        { type: '🍎', quantity: 4 },
        { type: '🍒', quantity: 6 },
        { type: '🍉', quantity: 1 },
      ]
    }
  }
}
</script>