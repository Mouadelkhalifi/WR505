<template>
  <div>
    <input type="range" min="0" max="40" v-model="temperature" />
    {{ temperature }} °C
    <span v-if="temperature >= 28" >🥵</span>
    <span v-else-if="temperature < 10" >🥶</span>
    <span v-else >😀</span>
  </div>
</template>

<script>
export default {
  data(){
    return { temperature: 20 }
  }
}
</script>
