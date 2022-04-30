<template>
  <div class="mobile-movie-filter only-mobile">
    <h3 class="mt-1 mb-2">Filters</h3>
    <b-input
      @input="(val) => onInput(val, 1)"
      placeholder="Name"
      type="text"
      class="mb-2"
    />
    <b-input
      @input="(val) => onInput(val, 2)"
      placeholder="Genre"
      type="text"
      class="mb-2"
    />
    <b-input
      @input="(val) => onInput(val, 3)"
      placeholder="Added by"
      type="text"
    />
  </div>
</template>

<script>

export default {
  name: 'MobileMovieFilter',
  props: {
    onInput: Function,
  },
};
</script>

<style lang="sass">

</style>
