import { DialogProgrammatic as Dialog } from 'buefy';
import router from '@/router';
import {
  getAuth, createUserWithEmailAndPassword, updateProfile, signInWithEmailAndPassword,
} from 'firebase/auth';
import {
  collection, getFirestore, addDoc, getDocs,
  Timestamp, updateDoc, arrayUnion, doc, query, where,
  arrayRemove,
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
    async getGroupsAction({ commit }, payload) {
      const snapshots = await getDocs(query(
        collection(getFirestore(), 'groups'),
        where('users', 'array-contains', payload.userUID),
      ));
      const groups = {};
      snapshots.forEach((snap) => {
        groups[snap.id] = snap.data();
      });
      commit('setGroups', groups);
    },
    async createGroupAction({ dispatch }, payload) {
      await addDoc(collection(getFirestore(), 'groups'), {
        name: payload.groupName,
        users: [payload.userUID],
        created_at: Timestamp.fromMillis(new Date().getTime()),
        movies: [],
        created_by: payload.userDisplayName,
      });
      dispatch('getGroupsAction', { userUID: payload.userUID });
    },
    async joinGroupAction({ dispatch }, payload) {
      await updateDoc(doc(getFirestore(), 'groups', payload.groupCode), {
        users: arrayUnion(payload.userUID),
      });
      dispatch('getGroupsAction', { userUID: payload.userUID });
    },
    async leaveGroupAction({ dispatch }, payload) {
      await updateDoc(doc(getFirestore(), 'groups', payload.groupCode), {
        users: arrayRemove(payload.userUID),
      });
      dispatch('getGroupsAction', { userUID: payload.userUID });
    },
  },
  namespaced: true,
};
