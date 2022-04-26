import Vue from 'vue';
import Vuex from 'vuex';
import createPersistedState from 'vuex-persistedstate';

import user from './store-user';
import groups from './store-groups';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    user,
    groups,
  },
  plugins: [
    createPersistedState({
      storage: window.sessionStorage,
    }),
  ],
});
