<template>
  <header class="py-1 px-3 is-flex is-justify-content-space-between is-align-items-center">
    <div class="back-button-wrapper">
      <b-button
        @click=goBack
        icon-left="arrow-left"
        size="is-medium"
        v-if="backButton"
      />
    </div>
    <app-logo />
    <div class="logout-button-wrapper">
      <b-button
        @click=logout
        icon-left="logout"
        size="is-medium"
      />
    </div>
  </header>
</template>

<script>
import { mapActions } from 'vuex';
import Logo from './Logo.vue';

export default {
  name: 'TopHeader',
  props: {
    backButton: Boolean,
    shouldClearMoviesOnBack: Boolean,
  },
  components: {
    'app-logo': Logo,
  },
  methods: {
    ...mapActions('user', ['logoutAction']),
    ...mapActions('groups', ['clearGroupsAction']),
    ...mapActions('movies', ['clearMoviesAction']),
    goBack() {
      this.$router.back();
      if (this.shouldClearMoviesOnBack) this.clearMoviesAction();
    },
    logout() {
      this.logoutAction();
      this.clearGroupsAction();
      this.clearMoviesAction();
    },
  },
};
</script>

<style scoped lang="sass">
  header
    background-color: #ffffff
    -webkit-box-shadow: 0px 5px 15px 5px rgba(0,0,0,0.19)
    box-shadow: 0px 5px 15px 5px rgba(0,0,0,0.19)

    .button
      border: none
      padding: 0 0.5rem
      font-size: 1.5rem
      transition: 0.3s

      &:hover
        opacity: 0.7

</style>
