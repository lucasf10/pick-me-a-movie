import Vue from 'vue';
import { initializeApp } from 'firebase/app';
import {
  Input, Field, Icon, Button, Dialog, Table, Modal, Tooltip, Select, Toast, Autocomplete,
} from 'buefy';

import App from './App.vue';
import './registerServiceWorker';
import router from './router';
import store from './store';

import 'buefy/dist/buefy.css';
import '@mdi/font/css/materialdesignicons.css';
import '@/assets/scss/global.sass';

Vue.config.productionTip = false;

// Firebase config

const firebaseConfig = {
  apiKey: process.env.VUE_APP_API_KEY,
  authDomain: process.env.VUE_APP_AUTH_DOMAIN,
  projectId: process.env.VUE_APP_PROJECT_ID,
  storageBucket: process.env.VUE_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.VUE_APP_MESSAGING_SENDER_ID,
  appId: process.env.VUE_APP_APP_ID,
};

initializeApp(firebaseConfig);

// Buefy components

Vue.use(Input);
Vue.use(Field);
Vue.use(Icon);
Vue.use(Button);
Vue.use(Dialog);
Vue.use(Table);
Vue.use(Modal);
Vue.use(Tooltip);
Vue.use(Select);
Vue.use(Toast);
Vue.use(Autocomplete);

// Vue instance

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
