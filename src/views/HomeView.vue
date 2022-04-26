<template>
  <div class="home">
    <b-button
      @click=logoutAction
      type="primary"
      class="mt-2 mb-4"
    >Logout</b-button>
  </div>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  name: 'HomeView',
  methods: {
    ...mapActions('user', ['logoutAction']),
  },
};
</script>
