<template>
  <section class="movies-page">
    <top-header backButton shouldClearMoviesOnBack />
      <div class="box mt-4 mx-4">
        <h2 class="page-title mb-3">{{ this.group && this.group.name }}</h2>
        <b-table
          :data="formattedMovies"
          checkable
          checkbox-position="left"
          checkbox-type="is-primary"
        >

          <template #empty>
            <div class="has-text-centered">No movies yet.</div>
          </template>

          <b-table-column field="name" label="Name" centered v-slot="props">
            {{ props.row.name }}
          </b-table-column>

          <b-table-column field="genre" label="Genre" centered v-slot="props">
            {{ props.row.genre }}
          </b-table-column>

          <b-table-column field="avgRating" label="Avg. Rating" centered v-slot="props">
            {{ props.row.avgRating || '-' }}
          </b-table-column>

          <b-table-column field="userRating" label="Your Rating" centered v-slot="props">
            {{ props.row.userRating || '-' }}
          </b-table-column>

          <b-table-column v-slot="props">
            <div class="actions">
              <b-tooltip
                label="Remove movie"
                position="is-left"
              >
                <b-button
                  @click.prevent="removeMovie($event, props.row.movieId)"
                  icon-left="delete"
                  size="is-small"
                />
              </b-tooltip>
            </div>
          </b-table-column>
        </b-table>
      </div>
  </section>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import TopHeader from '../components/TopHeader.vue';

export default {
  name: 'MoviesView',
  mounted() {
    this.group = this.groups && this.groups[this.$route.params.id];
  },
  data() {
    return {
      group: null,
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
    ...mapGetters('movies', ['formattedMovies']),
  },
  methods: {
    ...mapActions('movies', ['getMoviesAction', 'removeMovieAction']),
    removeMovie(event, movieId) {
      event.stopPropagation();
      this.removeMovieAction({ movieId, groupId: this.$route.params.id });
    },
  },
};
</script>

<style lang="sass">
  .movies-page
    thead
      label.b-checkbox.checkbox
        display: none
    tbody
      tr
        &.is-checked
          td:not(:first-child):not(:last-child)
              background: repeating-linear-gradient(180deg, #7957d5 0%, #7957d5 100%)
              background-size: 100% 2px
              background-position: center
              background-repeat: no-repeat

        td
          vertical-align: middle
</style>
