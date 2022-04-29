import {
  getDocs, getFirestore, query, collection, where, doc, deleteDoc,
  updateDoc, arrayRemove, addDoc, arrayUnion,
} from 'firebase/firestore';
import Vue from 'vue';

const initialState = () => ({ movies: {} });

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
  },
  actions: {
    async getMoviesAction({ commit }, payload) {
      const movies = {};
      const groupRef = doc(getFirestore(), 'groups', payload.groupId);
      const snapshots = await getDocs(query(
        collection(getFirestore(), 'movies'),
        where('group', '==', groupRef),
      ));
      snapshots.forEach((snap) => {
        movies[snap.id] = snap.data();
      });
      commit('setMovies', movies);
    },
    async removeMovieAction({ dispatch }, payload) {
      const movieRef = doc(getFirestore(), 'movies', payload.movieId);
      await deleteDoc(movieRef);
      await updateDoc(doc(getFirestore(), 'groups', payload.groupId), {
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
    async updateMovieAction({ dispatch }, payload) {
      const movieRef = doc(getFirestore(), 'movies', payload.movieId);
      await updateDoc(movieRef, {
        [payload.field]: payload.value,
      });
      dispatch('getMoviesAction', { groupId: payload.groupId });
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
