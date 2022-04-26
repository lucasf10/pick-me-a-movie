import { DialogProgrammatic as Dialog } from 'buefy';
import router from '@/router';
import {
  getAuth, createUserWithEmailAndPassword, updateProfile, signInWithEmailAndPassword,
} from 'firebase/auth';
import {
  collection, getFirestore, getDocs,
} from 'firebase/firestore';

const initialState = () => ({ groups: {} });

export default {
  state: initialState(),
  getters: {
    groups(state) {
      return state.groups;
    },
  },
  mutations: {
    setUser(state, payload) {
      state.user = payload;
    },
    setGroups(state, payload) {
      state.groups = payload;
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
      commit('setUser', null);
      router.push('/login');
    },
    async getGroups({ commit }) {
      const snapshots = await getDocs(collection(getFirestore(), 'groups'));
      const groups = {};
      snapshots.forEach((doc) => {
        groups[doc.id] = doc.data();
      });
      commit('setGroups', groups);
    },
  },
  namespaced: true,
};
