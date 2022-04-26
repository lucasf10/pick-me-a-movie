import Vue from 'vue';
import { initializeApp } from 'firebase/app';
import {
  Input, Field, Icon, Button, Dialog,
} from 'buefy';

import App from './App.vue';
import './registerServiceWorker';
import router from './router';
import store from './store';

import 'buefy/dist/buefy.css';
import '@mdi/font/css/materialdesignicons.css';
import '@/assets/scss/global.scss';

Vue.config.productionTip = false;

// Firebase congfid

const firebaseConfig = {
  apiKey: 'AIzaSyChm9uPm3Z4EcdNDGqtyd8401sRL5Cieck',
  authDomain: 'pick-me-a-movie.firebaseapp.com',
  projectId: 'pick-me-a-movie',
  storageBucket: 'pick-me-a-movie.appspot.com',
  messagingSenderId: '1030583053842',
  appId: '1:1030583053842:web:ecaecc12ea110718e7b2cb',
};

initializeApp(firebaseConfig);

// Buefy components

Vue.use(Input);
Vue.use(Field);
Vue.use(Icon);
Vue.use(Button);
Vue.use(Dialog);

// Vue instance

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
