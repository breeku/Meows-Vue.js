<template>
<div>
  <v-container fluid fill-height>
    <v-layout justify-center>
      <v-flex xs12 sm8 md6 lg4>
        <div class="text-xs-center">
        <h1 class="display-4 mb-2 mt-1 font-weight-thin">Meows 🐈</h1>
        </div>
      <div class="text-xs-center" v-if="!loggedIn">
        <v-dialog v-model="register" max-width="500px" lazy>
          <v-btn large slot="activator" color="primary" dark>Register 😺</v-btn>
            <v-card>
              <v-container>
                <v-card-title primary-title class="headline grey lighten-3">
                  Register a new account 😽
                </v-card-title>
                  <v-form v-model="valid" lazy-validation>
                    <v-text-field required :rules="emailRules" v-model="email" type="text" label="Any email, there is no address confirmation" required></v-text-field>
                    <v-text-field required :rules="passwordRules" v-model="password" type="password" label="Password" required></v-text-field>
                      <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn :disabled="!valid" color="blue darken-1" @click.native="register=false" v-on:click="signUp">Register 🐈</v-btn>
                      </v-card-actions>
                  </v-form>
              </v-container>
            </v-card>
          </v-dialog>
        <v-dialog v-model="login" max-width="500px" lazy>
          <v-btn large slot="activator" color="primary" dark>Login 😽</v-btn>
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
                        <v-btn :disabled="!valid" color="blue darken-1" @click.native="login=false" v-on:click="signIn">Sign In 🐈</v-btn>
                      </v-card-actions>
                  </v-form>
              </v-container>
            </v-card>
          </v-dialog>
        </div>
      <div class="text-xs-center" v-else>
        <v-btn large color="primary" dark v-on:click="logOut">Logout</v-btn>
      <div class="text-xs-center">
        <v-dialog v-model="newMeow" max-width="500px" lazy>
          <v-btn large slot="activator" color="primary" dark>New Meow 😺</v-btn>
            <v-card>
              <v-container>
                <v-card-title primary-title class="headline grey lighten-3">
                  New Meow 😽
                </v-card-title>
                  <v-form v-model="valid" lazy-validation>
                    <v-text-field required :rules="nameRules" v-model="meowform.name" label="Title" required></v-text-field>
                    <v-text-field required :rules="contentRules" v-model="meowform.content" label="Content" required></v-text-field>
                      <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn :disabled="!valid" color="blue darken-1" @click.native="newMeow=false" v-on:click="postMeow">Submit 🐈</v-btn>
                      </v-card-actions>
                  </v-form>
              </v-container>
            </v-card>
          </v-dialog>
        </div>
      </div>
      <div v-if="loading" class="text-xs-center">
        <v-progress-circular :size="80" indeterminate color="primary"></v-progress-circular>
      </div>
      <transition-group name="slide-y-transition">
      <div v-for="(meow, id) in meows" v-bind:key="id">
        <v-card class="elevation-4 mt-3 mb-4 pb-2 pt-1 meows" color="blue">
          <v-card-title class="pb-0">
            <div>
              <h1 class="display-1">{{ meow.name }}</h1>
            </div>
          </v-card-title>
          <v-card-text class="pb-0 pt-0">
            <div>
              <p>{{ meow.content }}</p>
            </div>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <p class="text-xs-right">{{ meow.created | filterDate }}</p>
            <div v-if="meow.own">
              <v-btn slot="activator" small depressed color="white">Modify</v-btn>
              <v-btn slot="activator" small depressed color="white">Remove</v-btn>
            </div>
          </v-card-actions>
        </v-card>
      </div>
      </transition-group>
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
import firebase from "firebase/app";
import "firebase/auth";
import moment from "moment";

const axios = require("axios");
// const APIURL = 'http://localhost:5000/meows'
const APIURL = 'https://meows-vue-api.now.sh/meows'
let userToken = null;
let user = null;
let uid = null;

export default {
  name: "Main",
  data() {
    return {
      loggedIn: false,
      allowModify: false,
      loading: false,
      account: "",
      valid: true,
      meows: null,
      register: null,
      login: null,
      newMeow: null,
      email: "",
      password: "",
      
      nameRules: [v => !!v || "Title is required"],
      contentRules: [v => !!v || "Content is required"],
      emailRules: [
        v => !!v || "E-mail is required",
        v => /.+@.+/.test(v) || "E-mail must be valid"
      ],
      passwordRules: [
        v => !!v || "Password is required",
        v => (v && v.length >= 6) || "Password must be more than 6 characters."
      ],
      meowform: {
        name: "",
        content: "",
      }
    };
  },
  filters: {
    filterDate: function(value) {
      if (value) {
        return moment(String(value)).fromNow();
      }
    }
  },
  created() {
    if (firebase.auth().currentUser) {
      this.loggedIn = true;
      user = firebase.auth().currentUser;
      this.account = user;
      if (this.loggedIn == true) {
        firebase
          .auth()
          .currentUser.getIdToken()
          .then(function(idToken) {
            userToken = idToken;
            uid = user.uid;
          })
          .catch(function(error) {
            alert("Oops: " + error);
          });
      }
    }
    this.getMeows();
  },
  methods: {
    signUp: function() {
      firebase
        .auth()
        .createUserWithEmailAndPassword(this.email, this.password)
        .then(
          user => {
            // after created
          },
          err => {
            alert("Error: " + err.message);
          }
        );
    },
    signIn: function() {
      firebase
        .auth()
        .signInWithEmailAndPassword(this.email, this.password)
        .then(
          user => {
            // after signin
          },
          err => {
            alert("Error: " + err.message);
          }
        );
    },
    logOut: function() {
      firebase
        .auth()
        .signOut()
        .then(() => {
          // after logout
        });
    },
    getMeows: function() {
      this.loading = true;
      axios.get(APIURL).then(response => {
        this.loading = false;
        this.meows = response.data;
        for (let a = 0; a < this.meows.length; a++) {
          let obj = this.meows[a];
          if (uid != null) {
            if (obj.uid == uid) {
              obj["own"] = "yes";
            } else {
            }
          }
        }
        this.meows.reverse();
      });
    },
    postMeow: function() {
      let name = this.meowform.name;
      let content = this.meowform.content;
      let email = user.email;
      const meowJSON = {
        name,
        content,
        email,
        uid,
        userToken
      };
      axios
        .post(APIURL, meowJSON)
        .then(response => {
          this.getMeows();
          this.meowform.name = "";
          this.meowform.content = "";
        })
        .catch(error => {
          console.log(error);
        });
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.meows {
  color: white;
}
p {
  margin: 5px;
}
</style>