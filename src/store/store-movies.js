import {
  getDocs, getFirestore, query, collection, where, doc, deleteDoc,
  updateDoc, arrayRemove, addDoc, arrayUnion,
} from 'firebase/firestore';

const initialState = () => ({ movies: {} });

export default {
  state: initialState(),
  getters: {
    movies(state) {
      return state.movies;
    },
    formattedMovies(state, _, rootState) {
      return Object.entries(state.movies).map((movie) => ({
        name: movie[1].name,
        genre: movie[1].genre,
        avgRating: movie[1].avg_rating,
        userRating: movie[1].ratings?.[rootState.user.user.uid],
        createdBy: movie[1].created_by,
        movieId: movie[0],
      }));
    },
  },
  mutations: {
    setMovies(state, payload) {
      state.movies = payload;
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
        ratings: [],
      });
      console.log(docRef);
      await updateDoc(groupRef, {
        movies: arrayUnion(docRef),
      });
      dispatch('getMoviesAction', { groupId: payload.groupId });
    },
    clearMoviesAction({ commit }) {
      commit('setMovies', initialState().movies);
    },
  },
  namespaced: true,
};
