<template>
  <section>
    <top-header backButton shouldClearMoviesOnBack />
    <div class="page movies-page">
      <div class="box mt-4 mx-4">
        <h2 class="page-title mb-3">{{ this.group && this.group.name }}</h2>
        <mobile-movie-filter :onInput="fillRealFilterInput" />
        <b-table
          ref="table"
          :data="formattedMovies"
          :loading="loading"
          checkable
          checkbox-position="left"
          checkbox-type="is-primary"
          :checked-rows="watchedMovies"
          @check="onCheckRow"
        >

          <template #empty>
            <div class="has-text-centered my-2" v-if="!loading">
              No movies yet.
            </div>
          </template>

          <b-table-column
            field="name"
            label="Name"
            header-class="name-column"
            centered
            :searchable="!isListEmpty"
            v-slot="props"
          >
            {{ props.row.name }}
          </b-table-column>

          <b-table-column
            field="genre"
            label="Genre"
            centered
            :searchable="!isListEmpty"
            v-slot="props"
          >
            {{ props.row.genre }}
          </b-table-column>

          <b-table-column field="avgRating" label="Avg. Rating" centered v-slot="props">
            {{ props.row.avgRating || '-' }}
          </b-table-column>

          <b-table-column field="userRating" label="Your Rating" centered v-slot="props">
            <div>
              {{ props.row.ratings && props.row.ratings[user.uid] || '-' }}
            </div>
            <b-field>
              <select
                @change="rateMovie($event, props.row.movieId)"
              >
                <option
                  v-for="i in 10"
                  :selected="props.row.ratings && i === props.row.ratings[user.uid]"
                  :value="i"
                  :key="i">
                  {{ i }}
                </option>
              </select>
            </b-field>
          </b-table-column>

          <b-table-column
            :searchable="!isListEmpty"
            field="createdBy"
            label="Added By"
            centered
            v-slot="props"
          >
            {{ props.row.createdBy }}
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

        <div class="box-footer mt-4">
          <b-button
            @click="showPickMovieModal = true"
            :disabled="isListEmpty"
          >Pick me a movie</b-button>
          <b-button @click="showAddMovieModal = true">Add a movie</b-button>
        </div>
      </div>

      <b-modal v-model="showAddMovieModal" width="500px">
        <add-movie-modal
          ref="addMovieModal"
          @submit="onAddMovie"
        />
      </b-modal>

      <b-modal v-model="showPickMovieModal" width="500px">
        <pick-movie-modal
          ref="pickMovieModal"
          @close="showPickMovieModal = false"
          :drawableMovie="($refs.table && $refs.table.visibleData) || []"
        />
      </b-modal>
    </div>
  </section>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import { triggerEvent } from '../utils/functions';
import TopHeader from '../components/TopHeader.vue';
import AddMovieModal from '../components/AddMovieModal.vue';
import PickMovieModal from '../components/PickMovieModal.vue';
import MobileMovieFilter from '../components/MobileMovieFilter.vue';

export default {
  name: 'MoviesView',
  mounted() {
    this.getMoviesAction({ groupId: this.$route.params.id });
  },
  data() {
    return {
      group: null,
      showAddMovieModal: false,
      showPickMovieModal: false,
      showRatingSelect: null,
    };
  },
  beforeMount() {
    if (!this.isLoggedIn) this.$router.push('/login');
    const group = this.groups && this.groups[this.$route.params.id];
    if (!group) {
      this.$router.push('/');
    } else {
      this.group = group;
    }
  },
  components: {
    'top-header': TopHeader,
    'add-movie-modal': AddMovieModal,
    'pick-movie-modal': PickMovieModal,
    'mobile-movie-filter': MobileMovieFilter,
  },
  computed: {
    ...mapGetters('user', ['isLoggedIn', 'user']),
    ...mapGetters('groups', ['groups']),
    ...mapGetters('movies', ['formattedMovies', 'loading']),
    watchedMovies() {
      return this.formattedMovies.filter((movie) => movie.watched);
    },
    isListEmpty() {
      return this.formattedMovies && this.formattedMovies.length === 0;
    },
  },
  methods: {
    ...mapActions('movies', ['getMoviesAction', 'removeMovieAction', 'addMovieAction', 'updateMovieAction', 'rateMovieAction']),
    removeMovie(event, movieId) {
      event.stopPropagation();
      this.removeMovieAction({ movieId, groupId: this.$route.params.id });
    },
    onAddMovie() {
      const { name, genre } = this.$refs.addMovieModal.$data;
      if (name && genre && name !== '' && genre !== '') {
        this.addMovieAction({
          name,
          genre,
          userDisplayName: this.user.displayName,
          groupId: this.$route.params.id,
        });
      }
      this.showAddMovieModal = false;
    },
    onCheckRow(checkedList, row) {
      this.updateMovieAction({
        movieId: row.movieId,
        field: 'watched',
        value: checkedList.indexOf(row) > -1,
        groupId: this.$route.params.id,
      });
    },
    rateMovie(event, movieId) {
      event.preventDefault();
      this.rateMovieAction({
        movieId,
        userId: this.user.uid,
        rate: event.target.value,
      });
    },
    fillRealFilterInput(val, columnIndex) {
      const inputElement = document.querySelectorAll('.table .control input')[columnIndex - 1];
      inputElement.value = val;
      triggerEvent(inputElement, 'input');
    },
  },
};
</script>

<style lang="sass">
  .movies-page
    .button
      transition: 0.3s
      &:hover
        border-color: rgb(142, 45, 226)
        background-color: rgba(142, 45, 226, 0.1)

    .box-footer
      display: flex
      gap: 15px
      justify-content: center

      @media screen and (max-width: 768px)
        position: absolute
        z-index: 999
        bottom: 45px
        width: 100%
        left: 0

    .table-wrapper
      overflow-x: initial

      .table
        .field
          position: absolute
          width: 100%
          height: 100%
          top: 0
          display: flex
          align-items: center
          justify-content: center
          opacity: 0

          select
            position: relative
            left: -10px
            cursor: pointer

        thead
          label.b-checkbox.checkbox
            display: none

          input
            height: 2.014em
            font-size: 0.9rem

          th
            vertical-align: middle
            position: relative

        tbody
          tr
            .b-checkbox.checkbox:not(.button)
              @media screen and (max-width: 768px)
                margin-right: 0

                .control-label
                  display: none

            &.is-checked
              td
                &:not(:first-child):not(:last-child)
                  @media screen and (min-width: 769px)
                    background: repeating-linear-gradient(180deg, #7957d5 0%, #7957d5 100%)
                    background-size: 100% 2px
                    background-position: center
                    background-repeat: no-repeat

              @media screen and (max-width: 768px)
                background-color: rgba(142, 45, 226, 0.1)
                border: 1px solid rgb(142, 45, 226)

            td
              vertical-align: middle
              position: relative
</style>
