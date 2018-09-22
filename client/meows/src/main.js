import firebase from 'firebase/app'
import 'firebase/auth'
import Vue from 'vue'
import './plugins/vuetify'
import App from './App.vue'

var config = {
  apiKey: "",
  authDomain: "",
  projectId: "",
};

firebase.initializeApp(config);

Vue.config.productionTip = false;

firebase.auth().onAuthStateChanged(function (user) {
  if (app) {
    new Vue({
      render: h => h(App)
    }).$mount('#app')
  }
})