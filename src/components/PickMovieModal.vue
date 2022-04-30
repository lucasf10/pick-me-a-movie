<template>
  <div class="pick-movie-modal">
    <div class="modal-card m-auto">
      <form>
        <header class="modal-card-head">
          <p class="modal-card-title">Pick Movie</p>
        </header>
        <section class="modal-card-body">
          <div v-if="pickedMovie">
            You should watch {{ pickedMovie.name }}
          </div>
          <div v-else>
            Nothing to show.
          </div>
        </section>
        <footer class="modal-card-foot is-flex is-justify-content-center">
          <b-button
            @click="$emit('close')"
            label="Close"
            type="is-primary"
          />
        </footer>
      </form>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'AddMovieModal',
  mounted() {
    this.pickMovie();
  },
  data() {
    return {
      pickedMovie: null,
    };
  },
  computed: {
    ...mapGetters('movies', ['formattedMovies']),
    notWatchedMovies() {
      return this.formattedMovies.filter((movie) => !movie.watched);
    },
  },
  methods: {
    generateRandomInteger(min, max) {
      return Math.floor(min + Math.random() * (max + 1 - min));
    },
    pickMovie() {
      if (this.notWatchedMovies && this.notWatchedMovies.length > 0) {
        const randomIndex = this.generateRandomInteger(0, this.notWatchedMovies.length - 1);
        this.pickedMovie = this.notWatchedMovies[randomIndex];
      }
    },
  },
};
</script>

<style lang="sass">
  .pick-movie-modal
    margin: 20px

    .modal-card
      width: 100%

</style>
