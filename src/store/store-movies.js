import {
  getDocs, getFirestore, query, collection, where, doc, deleteDoc,
  updateDoc, arrayRemove, addDoc, arrayUnion,
} from 'firebase/firestore';
import Vue from 'vue';

const initialState = () => ({ movies: {}, loading: false });

export default {
  state: initialState(),
  getters: {
    movies(state) {
      return state.movies;
    },
    formattedMovies(state) {
      return Object.entries(state.movies).map((movie) => {
        const rates = Object.values(movie[1].ratings || {});
        const avg = (rates.reduce((a, b) => Number(a) + Number(b), 0)) / rates.length;
        const avgRounded = Math.round(avg * 100) / 100;

        return {
          name: movie[1].name,
          genre: movie[1].genre,
          avgRating: avgRounded,
          ratings: movie[1].ratings,
          createdBy: movie[1].created_by,
          watched: movie[1].watched,
          movieId: movie[0],
        };
      });
    },
    loading(state) {
      return state.loading;
    },
  },
  mutations: {
    setMovies(state, payload) {
      state.movies = payload;
    },
    setField(state, payload) {
      if (state.movies[payload.movieId]) {
        state.movies[payload.movieId][payload.field] = payload.value;
      }
    },
    setMovieRate(state, payload) {
      const { rate, movieId, userId } = payload;
      if (state.movies[movieId]) {
        if (!state.movies[movieId].ratings) state.movies[movieId].ratings = {};
        Vue.set(state.movies[movieId].ratings, userId, Number(rate));
      }
    },
    setLoading(state, payload) {
      state.loading = payload;
    },
  },
  actions: {
    async getMoviesAction({ commit }, payload) {
      if (!payload.preventLoading) await commit('setLoading', true);
      const movies = {};
      const groupRef = doc(getFirestore(), 'groups', payload.groupId);
      const snapshots = await getDocs(query(
        collection(getFirestore(), 'movies'),
        where('group', '==', groupRef),
      ));
      snapshots.forEach((snap) => {
        movies[snap.id] = snap.data();
      });
      await commit('setMovies', movies);
      if (!payload.preventLoading) await commit('setLoading', false);
    },
    async removeMovieAction({ dispatch }, payload) {
      const { movieId, groupId } = payload;
      const movieRef = doc(getFirestore(), 'movies', movieId);
      await deleteDoc(movieRef);
      await updateDoc(doc(getFirestore(), 'groups', groupId), {
        movies: arrayRemove(movieRef),
      });
      dispatch('getMoviesAction', { groupId: payload.groupId });
    },
    async addMovieAction({ dispatch }, payload) {
      const groupRef = doc(getFirestore(), 'groups', payload.groupId);
      const docRef = await addDoc(collection(getFirestore(), 'movies'), {
        name: payload.name,
        genre: payload.genre,
        group: groupRef,
        created_by: payload.userDisplayName,
        watched: false,
        ratings: {},
      });
      await updateDoc(groupRef, {
        movies: arrayUnion(docRef),
      });
      dispatch('getMoviesAction', { groupId: payload.groupId });
    },
    async updateMovieAction({ commit }, payload) {
      const { movieId, field, value } = payload;
      const movieRef = doc(getFirestore(), 'movies', movieId);
      await updateDoc(movieRef, {
        [field]: value,
      });
      commit('setField', { movieId, field, value });
    },
    async rateMovieAction({ commit }, payload) {
      const { movieId, userId, rate } = payload;
      const movieRef = doc(getFirestore(), 'movies', movieId);
      await commit('setMovieRate', { movieId, userId, rate: Number(rate) });
      await updateDoc(movieRef, { [`ratings.${userId}`]: Number(rate) });
    },
    clearMoviesAction({ commit }) {
      commit('setMovies', initialState().movies);
    },
  },
  namespaced: true,
};
