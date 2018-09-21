<template>
<div>
  <v-container fluid fill-height>
    <v-layout justify-center>
      <v-flex xs12 sm8 md6 lg4>
        <div class="text-xs-center">
        <h1>Currently logged in as: {{currentUser.email}}</h1>
        <h2 v-if="loggedIn">Logged in: {{ this.loggedIn }}</h2>
        <h2 v-else>Logged in: {{ this.loggedIn }}</h2>
        </div>
      <div class="text-xs-center" v-if="!loggedIn">
        <v-dialog v-model="register" max-width="500px" lazy>
          <v-btn slot="activator" color="primary" dark>Register 😺</v-btn>
            <v-card>
              <v-container>
                <v-card-title primary-title class="headline grey lighten-3">
                  Register a new account 😽
                </v-card-title>
                  <v-form v-model="valid" lazy-validation>
                    <v-text-field required :rules="emailRules" v-model="email" type="text" label="Email" required></v-text-field>
                    <v-text-field required :rules="passwordRules" v-model="password" type="password" label="Password" required></v-text-field>
                      <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn :disabled="!valid" color="blue darken-1" @click.native="dialog=false" v-on:click="signUp">Register 🐈</v-btn>
                      </v-card-actions>
                  </v-form>
              </v-container>
            </v-card>
          </v-dialog>
        <v-dialog v-model="login" max-width="500px" lazy>
          <v-btn slot="activator" color="primary" dark>Login 😽</v-btn>
            <v-card>
              <v-container>
                <v-card-title primary-title class="headline grey lighten-3">
                  Login 😽
                </v-card-title>
                  <v-form v-model="valid" lazy-validation>
                    <v-text-field required :rules="emailRules" v-model="email" type="text" label="Email" required></v-text-field>
                    <v-text-field required :rules="passwordRules" v-model="password" type="password" label="Password" required></v-text-field>
                      <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn :disabled="!valid" color="blue darken-1" @click.native="dialog=false" v-on:click="signIn">Sign In 🐈</v-btn>
                      </v-card-actions>
                  </v-form>
              </v-container>
            </v-card>
          </v-dialog>
        </div>
      <div class="text-xs-center" v-else>
        <v-btn color="primary" dark v-on:click="logOut">Logout</v-btn>
      <div class="text-xs-center">
        <v-dialog v-model="newMeow" max-width="500px" lazy>
          <v-btn slot="activator" color="primary" dark>New Meow 😺</v-btn>
            <v-card>
              <v-container>
                <v-card-title primary-title class="headline grey lighten-3">
                  New Meow 😽
                </v-card-title>
                  <v-form @submit.prevent="postMeow" v-model="valid" lazy-validation>
                    <v-text-field required :rules="nameRules" v-model="meowform.name" label="Name" :counter="10" required></v-text-field>
                    <v-text-field required :rules="contentRules" v-model="meowform.content" label="Content" required></v-text-field>
                      <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn :disabled="!valid" color="blue darken-1" @click.native="dialog=false" type="submit">Submit 🐈</v-btn>
                      </v-card-actions>
                  </v-form>
              </v-container>
            </v-card>
          </v-dialog>
        </div>
      </div>
      <div v-for="meow in meows" v-bind:key="meow.id">
        <v-card class="elevation-4 my-4">
          <v-card-title class="pb-0">
            <div>
              <h1>{{ meow.name }}</h1>
            </div>
          </v-card-title>
          <v-card-text class="pb-1 pt-1">
            <div>
              <p>{{ meow.content }}</p>
              <span class="text-xs-left">{{ meow.email }}</span>
              <p class="text-xs-right">{{ meow.created | filterDate }}</p>
            </div>
          </v-card-text>
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
import firebase from 'firebase/app'
import 'firebase/auth'
import moment from 'moment'

const axios = require('axios')
const APIURL = 'http://localhost:5000/meows'

export default {
  name: 'Main',
  data() {
    return {
      loggedIn: false,
      currentUser: false,
      valid: true,
      meows: null,
      register: null,
      login: null,
      newMeow: null,
      email: '',
      password: '',
      nameRules: [
        v => !!v || 'Name is required',
        v => (v && v.length <= 10) || 'Name must be less than 10 characters'
      ],
      contentRules: [
        v => !!v || 'Content is required',
      ],
      emailRules: [
        v => !!v || 'E-mail is required',
        v => /.+@.+/.test(v) || 'E-mail must be valid'
      ],
      passwordRules: [
        v => !!v || 'Password is required',
        v => (v && v.length >= 6) || 'Password must be more than 6 characters.'
      ],
      meowform: {
        name: '',
        content: '',
        selectedFile: null
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
      if(firebase.auth().currentUser) {
        this.loggedIn = true;
        this.currentUser = firebase.auth().currentUser
        console.log('logged in as ' + this.currentUser.email)
        console.log(this.loggedIn)
      }
      this.getMeows()
    },
    methods: {
      signUp: function() {
        firebase.auth().createUserWithEmailAndPassword(this.email, this.password).then(
          function(user) {
            alert('Created account.')
          },
          function(err) {
            alert('Error: ' + err.message)
            console.log('Error: ' + err.message)
          }
        )
      },
      signIn: function() {
        firebase.auth().signInWithEmailAndPassword(this.email, this.password).then(
          function(user) {
            console.log('Logged in.')
          },
          function(err) {
            console.log('Error: ' + err.message)
          }
        )
      },
      logOut: function() {
        firebase.auth().signOut().then(() => {
          alert('Logged out')
        })
      },
      getMeows() {
        axios.get(APIURL).then(response => {
          this.meows = response.data
          this.meows.reverse()
        })
      },
      postMeow() {
        let user = firebase.auth().currentUser
        name = this.meowform.name
        content = this.meowform.content
        let email = user.email
        const meowJSON = {
          name,
          content,
          email 
        }
          axios.post(APIURL, meowJSON)
          .then(response => {
            this.getMeows()
            this.meowform.name = ''
            this.meowform.content = ''
            this.selectedFile = null
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
