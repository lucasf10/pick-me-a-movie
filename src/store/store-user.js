import { DialogProgrammatic as Dialog } from 'buefy';
import router from '@/router';
import {
  getAuth, createUserWithEmailAndPassword, updateProfile, signInWithEmailAndPassword,
} from 'firebase/auth';

const initialState = () => ({ user: null, loading: false });

export default {
  state: initialState(),
  getters: {
    isLoggedIn(state) {
      return !!state.user;
    },
    user(state) {
      return state.user;
    },
    loading(state) {
      return state.loading;
    },
  },
  mutations: {
    setUser(state, payload) {
      state.user = payload;
    },
    setLoading(state, payload) {
      state.loading = payload;
    },
  },
  actions: {
    signUpAction({ commit }, payload) {
      commit('setLoading', true);
      createUserWithEmailAndPassword(getAuth(), payload.email, payload.password)
        .then(async (userCredential) => {
          await updateProfile(userCredential.user, {
            displayName: payload.name,
          });
          commit('setUser', userCredential.user);
          router.push('/');
          commit('setLoading', false);
        }).catch((err) => {
          Dialog.alert(`Something went wrong: ${err}`);
          commit('setLoading', false);
        });
    },
    loginAction({ commit }, payload) {
      commit('setLoading', true);
      signInWithEmailAndPassword(getAuth(), payload.email, payload.password)
        .then((userCredential) => {
          commit('setUser', userCredential.user);
          router.push('/');
          commit('setLoading', false);
        })
        .catch((err) => {
          Dialog.alert(`Something went wrong: ${err}`);
          commit('setLoading', false);
        });
    },
    logoutAction({ commit }) {
      localStorage.clear();
      commit('setUser', initialState().user);
      router.push('/login');
    },
  },
  namespaced: true,
};
