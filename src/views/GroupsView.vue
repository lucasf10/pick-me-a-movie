<template>
  <div class="groups-page">
    <top-header />
    <div class="box mt-4 mx-4">
      <h2 class="page-title mb-3">Groups</h2>
      <b-table
        class="mb-4"
        hoverable
        :paginated="groups && Object.values(groups).length > 5"
        per-page="5"
        :data="Object.values(groups)"
        :columns="columns"
        @click="selectMovie($event.code)"
      >
        <template #empty>
          <div class="has-text-centered">No groups yet.</div>
        </template>
      </b-table>

      <div class="box-footer">
        <b-button @click="showJoinGroupModal = true">Join a group</b-button>
        <b-button @click="showCreateGroupModal = true">Create a group</b-button>
      </div>
    </div>

    <b-modal v-model="showJoinGroupModal" width="500px">
      <group-action-modal
        ref="joinGroupModal"
        title="Join Group"
        placeholder="Group code"
        buttonLabel="Join"
        @submit="onJoinGroup"
      />
    </b-modal>

    <b-modal v-model="showCreateGroupModal" width="500px">
      <group-action-modal
        ref="createGroupModal"
        title="Create Group"
        placeholder="Group name"
        buttonLabel="Create"
        @submit="onCreateGroup"
      />
    </b-modal>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import TopHeader from '../components/TopHeader.vue';
import GroupActionModal from '../components/GroupActionModal.vue';

export default {
  name: 'HomeView',
  components: {
    'top-header': TopHeader,
    'group-action-modal': GroupActionModal,
  },
  mounted() {
    this.getGroups();
  },
  beforeMount() {
    if (!this.isLoggedIn) this.$router.push('/login');
  },
  data() {
    return {
      columns: [
        {
          field: 'name',
          label: 'Name',
          centered: true,
        },
        {
          field: 'created_by',
          label: 'By',
          centered: true,
        },
        {
          field: 'created_at',
          label: 'At',
          centered: true,
        },
        {
          field: 'n_movies',
          label: '# Movies',
          centered: true,
        },
        {
          field: 'code',
          label: 'Code',
          centered: true,
        },
      ],
      showJoinGroupModal: false,
      showCreateGroupModal: false,
    };
  },
  computed: {
    ...mapGetters('groups', ['groups']),
    ...mapGetters('user', ['isLoggedIn']),
    groupList() {
      return this.groups.map();
    },
  },
  methods: {
    ...mapActions('groups', ['getGroups']),
    selectMovie(movieCode) {
      console.log('movieCode', movieCode);
    },
    onJoinGroup() {
      console.log('onJoinGroup', this.$refs.joinGroupModal.$data.value);
    },
    onCreateGroup() {
      console.log('onCreateGroup', this.$refs.createGroupModal.$data.value);
    },
  },
};
</script>

<style lang="sass">
  .groups-page
    .box-footer
      display: flex
      gap: 15px
      justify-content: center

      .button
        transition: 0.3s
        &:hover
          border-color: rgb(142, 45, 226)
          background-color: rgba(142, 45, 226, 0.1)

    .b-table
      .table.is-hoverable
        tbody
          tr
            transition: 0.3s
            &:not(.is-selected):hover
              background-color: rgba(142, 45, 226, 0.1)
              cursor: pointer

      .pagination
        padding: 5px

        .pagination-link
          font-size: 0.8rem
          transition: 0.3s

          &:hover
            border-color: rgb(142, 45, 226)
            background-color: rgba(142, 45, 226, 0.1)

        .pagination-next,
        .pagination-previous
          padding-left: 0.3em
          padding-right: 0.3em

    .modal-card
      width: 100%

</style>
