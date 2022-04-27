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
    setGroups(state, payload) {
      state.groups = payload;
    },
  },
  actions: {
    async getGroupsAction({ commit }, payload) {
      const snapshots = await getDocs(query(
        collection(getFirestore(), 'groups'),
        where('users', 'array-contains', payload.userUID),
      ));
      const groups = {};
      snapshots.forEach((snap) => {
        groups[snap.id] = snap.data();
      });
      console.log(groups);
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
