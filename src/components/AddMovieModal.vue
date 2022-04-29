<template>
  <div class="add-movie-modal">
    <div class="modal-card m-auto">
      <form @submit.prevent="$emit('submit');">
        <header class="modal-card-head">
          <p class="modal-card-title">Add Movie</p>
        </header>
        <section class="modal-card-body">
          <b-field>
            <b-input
              v-model="name"
              type="text"
              placeholder="Name"
              ref="nameInput"
            />
          </b-field>

          <b-field>
            <b-input
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
  data() {
    return {
      name: '',
      genre: '',
    };
  },
};
</script>

<style lang="sass">
  .add-movie-modal
    margin: 0 20px

    .modal-card
      width: 100%

</style>
