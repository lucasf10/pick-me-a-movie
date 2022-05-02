<template>
  <div class="add-movie-modal">
    <div class="modal-card m-auto">
      <form @submit.prevent="$emit('submit');">
        <header class="modal-card-head">
          <p class="modal-card-title">Add Movie</p>
        </header>
        <section class="modal-card-body">
          <b-field>
            <b-autocomplete
              :data="movies"
              placeholder="Name"
              field="title"
              v-model="name"
              ref="nameInput"
              :loading="isFetchingMovies"
              @typing="getAsyncMovieData"
              @select="option => genre = option.genres.join(' / ')"
            >
              <template slot-scope="props">
                <div class="media">
                  <div class="media-left">
                    <img
                      v-if="props.option.poster_path"
                      :alt="props.option.title"
                      width="32"
                      :src="`https://image.tmdb.org/t/p/w500/${props.option.poster_path}`"
                    >
                  </div>
                  <div class="media-content">
                    {{ props.option.title }}
                    <br>
                    <small>
                      <span v-for="(genre, index) in props.option.genres" :key="index">
                        <span v-if="index !== 0"> / </span>{{ genre }}</span>
                        <template v-if="props.option.genres.length > 0">,</template>
                        rated <b>{{ props.option.vote_average }}</b>
                    </small>
                  </div>
                </div>
              </template>
            </b-autocomplete>
          </b-field>

          <b-field>
            <b-input
              v-show="!($refs.nameInput && $refs.nameInput.isActive)"
              v-model="genre"
              type="text"
              placeholder="Genre"
            />
          </b-field>
        </section>
        <footer class="modal-card-foot is-flex is-justify-content-center">
          <b-button
            native-type="submit"
            label="Add"
            type="is-primary"
            :disabled="!name || !genre"
          />
        </footer>
      </form>
    </div>
  </div>
</template>

<script>
import debounce from 'lodash/debounce';

export default {
  name: 'AddMovieModal',
  props: {
    title: String,
    buttonLabel: String,
    placeholder: String,
  },
  mounted() {
    this.$refs.nameInput.focus();
  },
  beforeMount() {
    const API_URL = 'https://api.themoviedb.org/3/genre/movie/list';
    fetch(`${API_URL}?api_key=${process.env.VUE_APP_TMDB_API_KEY}&language=en-US`)
      .then((res) => res.json())
      .then(({ genres }) => {
        this.genres = {};
        genres.forEach((genre) => { this.genres[genre.id] = genre.name; });
      })
      .catch((error) => {
        this.genres = {};
        throw error;
      });
  },
  data() {
    return {
      name: '',
      genre: '',
      movies: [],
      genres: {},
      isFetchingMovies: false,
    };
  },
  computed: {
    isAutocompleteActive() {
      return this.$refs.nameInput && this.$refs.nameInput.isActive;
    },
  },
  methods: {
    getAsyncMovieData: debounce(function (query) {
      const API_URL = 'https://api.themoviedb.org/3/search/movie';
      if (!query.length) {
        this.movies = [];
        return;
      }
      this.isFetchingMovies = true;
      fetch(`${API_URL}?api_key=${process.env.VUE_APP_TMDB_API_KEY}&query=${query}&language=en-US&include_adult=true`)
        .then((res) => res.json())
        .then(({ results }) => {
          this.movies = [];
          results.forEach((item) => {
            const movie = item;
            movie.genres = item.genre_ids.map((genreId) => this.genres[genreId]);
            this.movies.push(movie);
          });
        })
        .catch((error) => {
          this.movies = [];
          throw error;
        })
        .finally(() => {
          this.isFetchingMovies = false;
        });
    }, 500),
  },
};
</script>

<style lang="sass">
  .add-movie-modal
    margin: 20px

    .modal-card
      width: 100%

      .autocomplete
          .dropdown-menu
            position: initial

</style>
