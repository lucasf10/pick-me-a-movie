import {
  collection, getFirestore, addDoc, getDocs,
  Timestamp, updateDoc, arrayUnion, doc, query, where,
  arrayRemove,
} from 'firebase/firestore';
import { showToast } from '../utils/functions';

const initialState = () => ({ groups: {}, loading: false });

export default {
  state: initialState(),
  getters: {
    groups(state) {
      return state.groups;
    },
    formattedGroups(state) {
      return Object.entries(state.groups).map((group) => {
        const dateFormat = new Date(
          group[1].created_at.seconds * 1000 + group[1].created_at.nanoseconds / 100000,
        ).toDateString();
        return {
          name: group[1].name,
          created_by: group[1].created_by,
          code: group[0],
          created_at: dateFormat,
          n_movies: group[1].movies.length || 0,
        };
      });
    },
    loading(state) {
      return state.loading;
    },
  },
  mutations: {
    setGroups(state, payload) {
      state.groups = payload;
    },
    setLoading(state, payload) {
      state.loading = payload;
    },
  },
  actions: {
    async getGroupsAction({ commit }, payload) {
      commit('setLoading', true);
      const snapshots = await getDocs(query(
        collection(getFirestore(), 'groups'),
        where('users', 'array-contains', payload.userUID),
      ));
      const groups = {};
      snapshots.forEach((snap) => {
        groups[snap.id] = snap.data();
      });
      commit('setGroups', groups);
      commit('setLoading', false);
    },
    async createGroupAction({ dispatch }, payload) {
      const { groupName, userDisplayName, userUID } = payload;
      await addDoc(collection(getFirestore(), 'groups'), {
        name: groupName,
        users: [userUID],
        created_at: Timestamp.fromMillis(new Date().getTime()),
        movies: [],
        created_by: userDisplayName,
      });
      showToast(`Group ${groupName} created`);
      dispatch('getGroupsAction', { userUID });
    },
    async joinGroupAction({ dispatch }, payload) {
      const { userUID, groupCode } = payload;
      await updateDoc(doc(getFirestore(), 'groups', groupCode), {
        users: arrayUnion(payload.userUID),
      });
      showToast(`Joined group ${groupCode}`);
      dispatch('getGroupsAction', { userUID });
    },
    async leaveGroupAction({ dispatch }, payload) {
      const { userUID, groupCode } = payload;
      await updateDoc(doc(getFirestore(), 'groups', groupCode), {
        users: arrayRemove(userUID),
      });
      showToast(`Left group ${groupCode}`);
      dispatch('getGroupsAction', { userUID });
    },
    clearGroupsAction({ commit }) {
      commit('setGroups', initialState().groups);
    },
  },
  namespaced: true,
};
