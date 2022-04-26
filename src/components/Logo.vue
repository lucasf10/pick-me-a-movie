<template>
  <div :class="`logo-wrapper ${spaced ? 'mb-4' : ''}`">
    <span class="logo">Pick me a movie</span>
  </div>
</template>

<script>

export default {
  name: 'AppLogo',
  props: {
    spaced: Boolean,
  },
};
</script>

<style scoped lang="sass">

</style>
