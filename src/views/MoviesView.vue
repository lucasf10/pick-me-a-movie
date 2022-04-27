<template>
  <section class="movies-page">
    <top-header backButton />
      <div class="box mt-4 mx-4">
        <h2 class="page-title mb-3">{{ this.group && this.group.name }}</h2>
        <b-table :data="group && group.movies || []" :columns="columns"></b-table>
      </div>
  </section>
</template>

<script>
import { mapGetters } from 'vuex';
// import { getDocs, getFirestore } from 'firebase/firestore';
import TopHeader from '../components/TopHeader.vue';

export default {
  name: 'MoviesView',
  mounted() {
    this.group = this.groups && this.groups[this.$route.params.id];
    // console.log(this.group.movies);
  },
  data() {
    return {
      group: null,
      columns: [
        {
          field: 'id',
          label: 'ID',
          width: '40',
          numeric: true,
        },
        {
          field: 'first_name',
          label: 'First Name',
        },
        {
          field: 'last_name',
          label: 'Last Name',
        },
        {
          field: 'date',
          label: 'Date',
          centered: true,
        },
        {
          field: 'gender',
          label: 'Gender',
        },
      ],
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
    ...mapGetters('groups', ['groups']),
  },
};
</script>

<style lang="sass">

</style>
