<template>
  <ol>
    <li :style="ghost1.style">
      <span :class="ghost1.anim" class="ghost">👻︎</span>
      I'm joyful and red
    </li>
    <li :style="ghost2.style">
      <span :class="ghost2.anim" class="ghost">👻︎</span>
      I'm jelly and green
    </li>
    <li :style="{ color : ghost3.isBlue ? 'blue' : '' }">
      <span :class="{wobbly: ghost3.isWobbly}" class="ghost">👻︎</span>
      I'm wobbly and blue
    </li>
  </ol>
</template>

<script>
import "../assets/ghosts.css";

export default {
  data(){
    return {
      ghost1: {
        anim: "joyful",
        style: "color: red"
      },
      ghost2: {
        anim: { jelly: true },
        style: { color: "green" }
      },
      ghost3: {
        isWobbly: true,
        isBlue: true
      }
    }
  }
}
</script>
