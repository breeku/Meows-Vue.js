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
</style>
