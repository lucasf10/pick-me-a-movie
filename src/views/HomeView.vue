<template>
  <div class="home">
    <top-header backButton />
    <b-button
      @click=logoutAction
      type="primary"
      class="mt-2 mb-4"
    >Logout</b-button>
  </div>
</template>

<script>
import { mapActions } from 'vuex';
import TopHeader from '../components/TopHeader.vue';

export default {
  name: 'HomeView',
  components: {
    'top-header': TopHeader,
  },
  methods: {
    ...mapActions('user', ['logoutAction']),
  },
};
</script>
