import { DialogProgrammatic as Dialog } from 'buefy';
import router from '@/router';
import {
  getAuth, createUserWithEmailAndPassword, updateProfile, signInWithEmailAndPassword,
} from 'firebase/auth';

const initialState = () => ({ user: null });

export default {
  state: initialState(),
  getters: {
    isLoggedIn(state) {
      return !!state.user;
    },
    user(state) {
      return state.user;
    },
  },
  mutations: {
    setUser(state, payload) {
      state.user = payload;
    },
  },
  actions: {
    signUpAction({ commit }, payload) {
      createUserWithEmailAndPassword(getAuth(), payload.email, payload.password)
        .then(async (userCredential) => {
          await updateProfile(userCredential.user, {
            displayName: payload.name,
          });
          commit('setUser', userCredential.user);
          router.push('/');
        }).catch((err) => {
          Dialog.alert(`Something went wrong: ${err}`);
        });
    },
    loginAction({ commit }, payload) {
      signInWithEmailAndPassword(getAuth(), payload.email, payload.password)
        .then((userCredential) => {
          commit('setUser', userCredential.user);
          router.push('/');
        })
        .catch((err) => {
          Dialog.alert(`Something went wrong: ${err}`);
        });
    },
    logoutAction({ commit }) {
      sessionStorage.clear();
      commit('setUser', initialState().user);
      router.push('/login');
    },
  },
  namespaced: true,
};
