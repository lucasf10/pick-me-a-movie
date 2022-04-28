const initialState = () => ({ movies: {} });

export default {
  state: initialState(),
  getters: {
    movies(state) {
      return state.groups;
    },
  },
  mutations: {
    setMovies(state, payload) {
      state.movies = payload;
    },
  },
  actions: {
    clearMoviesAction({ commit }) {
      commit('setMovies', initialState().movies);
    },
  },
  namespaced: true,
};
