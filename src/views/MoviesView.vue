<template>
  <section class="movies-page">
    <top-header backButton />
    Movies page: {{ $route.params.id }}
  </section>
</template>

<script>
import { mapGetters } from 'vuex';
import TopHeader from '../components/TopHeader.vue';

export default {
  name: 'MoviesView',
  data() {
    return {

    };
  },
  beforeMount() {
    if (!this.isLoggedIn) this.$router.push('/login');
  },
  components: {
    'top-header': TopHeader,
  },
  computed: {
    ...mapGetters('user', ['isLoggedIn']),
  },
};
</script>

<style lang="sass">

</style>
