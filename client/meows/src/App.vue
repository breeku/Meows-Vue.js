<template>
  <div id="app">
    <v-app id="inspire">
      <v-content>
        <Main/>
      </v-content>
    </v-app>
  </div>
</template>

<script>
import Main from './components/Main.vue'

export default {
  name: 'app',
  components: {
    Main
  }
}
</script>

<style>
Main {
  background: linear-gradient(120deg, rgba(161, 196, 253, 0.95) 0%, rgba(194, 233, 251, 0.95) 100%), url(bg/topography.svg);
}
</style>
