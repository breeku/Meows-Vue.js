<template>
<div>
  <v-container fluid fill-height>
    <v-layout justify-center>
      <v-flex xs12 sm8 md6 lg4>
      <div class="text-xs-center">
        <v-dialog v-model="dialog" max-width="500px">
          <v-btn slot="activator" color="primary" dark>New Meow 😺</v-btn>
            <v-card>
              <v-container>
                <v-card-title primary-title class="headline grey lighten-3">
                  New Meow 😽
                </v-card-title>
                  <v-form @submit.prevent="postMeow" v-model="valid" lazy-validation>
                    <v-text-field required :rules="nameRules" v-model="meow.name" label="Name" :counter="10" required></v-text-field>
                    <v-text-field required :rules="contentRules" v-model="meow.content" label="Content" required></v-text-field>
                      <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn :disabled="!valid" color="blue darken-1" @click.native="dialog=false" type="submit">Submit 🐈</v-btn>
                      </v-card-actions>
                  </v-form>
              </v-container>
            </v-card>
          </v-dialog>
        </div>
      <div v-for="meow in meows" v-bind:key="meow.id">
        <v-card class="elevation-4 my-4">
          <v-card-title primary-title>
            <div>
              <h2>{{ meow.name }}</h2>
              <p>{{ meow.content }}</p>
              <p>{{ meow.created | filterDate }}</p>
            </div>
          </v-card-title>
        </v-card>
      </div>
      </v-flex>
    </v-layout>
  </v-container>
  <v-footer class="pa-3">
    <v-spacer></v-spacer>
    <div>
      &copy; {{ new Date().getFullYear() }}
    </div>
  </v-footer>
</div>
</template>

<script>
const axios = require('axios')
const APIURL = 'http://localhost:5000/meows'
import moment from 'moment'

export default {
  name: 'Main',
  data() {
    return {
      valid: true,
      meows: null,
      dialog: null,
      nameRules: [
        v => !!v || 'Name is required',
        v => (v && v.length <= 10) || 'Name must be less than 10 characters'
      ],
      contentRules: [
        v => !!v || 'Content is required',
      ],
      meow: {
        name: '',
        content: ''
      }
    }
  },
  filters: {
    filterDate: function(value) {
      if (value) {
      return moment(String(value)).fromNow()
      }
    }
  },
    created() {
      this.getMeows()
    },
    methods: {
      getMeows() {
        axios.get(APIURL).then(response => {
          this.meows = response.data
          this.meows.reverse()
        })
      },
      postMeow() {
        name = this.meow.name
        content = this.meow.content
        const meowJSON = {
          name,
          content
        }
          axios.post(APIURL, meowJSON)
          .then(response => {
            this.getMeows()
            this.meow.name = ''
            this.meow.content = ''
            console.log(response)
          }).catch(error => {
            console.log(error)
          })
      }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
</style>
