import { DialogProgrammatic as Dialog } from 'buefy';
import router from '@/router';
import {
  getAuth, createUserWithEmailAndPassword, updateProfile, signInWithEmailAndPassword,
} from 'firebase/auth';

const initialState = () => ({ user: null });

export default {
  state: initialState(),
  getters: {
  },
  mutations: {
    setUser(state, payload) {
      state.user = payload;
    },
  },
  actions: {
    signUpAction({ commit }, payload) {
      createUserWithEmailAndPassword(getAuth(), payload.email, payload.password)
        .then((userCredential) => {
          updateProfile(userCredential.user, {
            displayName: this.name,
          });
          commit('setUser', userCredential.user);
          router.push('/dashboard');
        }).catch((err) => {
          Dialog.alert(`Something went wrong: ${err}`);
        });
    },
    loginAction({ commit }, payload) {
      signInWithEmailAndPassword(getAuth(), payload.email, payload.password)
        .then((userCredential) => {
          commit('setUser', userCredential.user);
          router.push('/dashboard');
        })
        .catch((err) => {
          Dialog.alert(`Something went wrong: ${err}`);
        });
    },
  },
  namespaced: true,
};
