import Vue from 'vue';
import Vuex from 'vuex';
import createPersistedState from 'vuex-persistedstate';

import user from './store-user';
import groups from './store-groups';
import movies from './store-movies';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    user,
    groups,
    movies,
  },
  plugins: [
    createPersistedState({
      storage: window.sessionStorage,
    }),
  ],
});
