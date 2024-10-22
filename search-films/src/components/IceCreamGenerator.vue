<template>
  <div id="icecream-store">
    <h1>Icecream store</h1>

    <label>Quantity: <input v-model="quantity" type="number"></label>

    <label>Size:
      <select v-model="size">
        <option value="100">Small</option>
        <option value="150">Medium</option>
        <option value="200">Giant</option>
      </select>
    </label>

    <label>Flavour:</label>
    <label><input type="radio" name="flavour" v-model="flavour" value="#F3E5AB">Vanilla</label>
    <label><input type="radio" name="flavour" v-model="flavour" value="#5B2F00" />Chocolate</label>
    <label><input type="radio" name="flavour" v-model="flavour" value="#DE0934" />Strawberry</label>

    <label><input type="checkbox" v-model="napkin"> Napkin</label>

    <IceCreams :quantity="quantity" :flavour="flavour" :size="size" :napkin="napkin" />
  </div>
</template>

<style>label { display: block }</style>

<script>
import IceCreams from "./IceCreams.vue";

export default {
  components: { IceCreams },
  data(){
    return {
      quantity: 1,
      flavour: "#5B2F00",
      size: 150,
      napkin: true
    }
  }
}
</script>
