<template>
  <div class="pick-movie-modal">
    <div class="modal-card m-auto">
      <form>
        <header class="modal-card-head">
          <p class="modal-card-title">Add Movie</p>
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

export default {
  name: 'AddMovieModal',
  props: {
    drawableData: Array,
  },
  mounted() {
    this.pickMovie();
  },
  data() {
    return {
      pickedMovie: null,
    };
  },
  methods: {
    generateRandomInteger(min, max) {
      return Math.floor(min + Math.random() * (max + 1 - min));
    },
    pickMovie() {
      if (this.drawableData && this.drawableData.length > 0) {
        const randomIndex = this.generateRandomInteger(0, this.drawableData.length - 1);
        this.pickedMovie = this.drawableData[randomIndex];
      }
    },
  },
};
</script>

<style lang="sass">
  .pick-movie-modal
    .modal-card
      width: 100%

</style>
