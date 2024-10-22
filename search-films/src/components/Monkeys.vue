<template>
  <div>
  <span v-for="monkey in monkeys" @click="switchMonkey($event, monkey)">
    {{ monkey.hasEyesOpen ? '🙉' : '🙈' }}
  </span>
    <br/>
    <button v-on:click="addMonkey" >Add monkey</button>
  </div>
</template>

<style>span { font-size: 2rem; }</style>

<script>
export default {
  data(){
    return {
      monkeys: [
        { hasEyesOpen: false }
      ]
    }
  },
  methods: {
    addMonkey(){
      this.monkeys.push({ hasEyesOpen: false })
    },
    switchMonkey($event, monkey){
      monkey.hasEyesOpen = !monkey.hasEyesOpen
    }
  }
}
</script>
