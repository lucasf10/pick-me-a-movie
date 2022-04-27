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
        :data="groupList"
        @click="$router.push(`/group/${$event.code}`)"
      >
        <template #empty>
          <div class="has-text-centered">No groups yet.</div>
        </template>

        <b-table-column field="name" label="Name" centered v-slot="props">
          {{ props.row.name }}
        </b-table-column>

        <b-table-column field="first_name" label="By" centered v-slot="props">
          {{ props.row.created_by }}
        </b-table-column>

        <b-table-column field="at" label="At" centered v-slot="props">
          {{ props.row.created_at }}
        </b-table-column>

        <b-table-column field="n_movies" label="# Movies" centered v-slot="props">
          {{ props.row.n_movies }}
        </b-table-column>

        <b-table-column field="code" label="Code" centered v-slot="props">
          {{ props.row.code }}
        </b-table-column>

        <b-table-column v-slot="props">
          <b-button
            @click.prevent="leaveGroup($event, props.row.code)"
            icon-left="delete"
            size="is-small"
          />
        </b-table-column>
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
    this.getGroupsAction({ userUID: this.user.uid });
  },
  beforeMount() {
    if (!this.isLoggedIn) this.$router.push('/login');
  },
  data() {
    return {
      showJoinGroupModal: false,
      showCreateGroupModal: false,
    };
  },
  computed: {
    ...mapGetters('groups', ['groups']),
    ...mapGetters('user', ['isLoggedIn', 'user']),
    groupList() {
      return Object.entries(this.groups).map((group) => {
        const dateFormat = new Date(
          group[1].created_at.seconds * 1000 + group[1].created_at.nanoseconds / 100000,
        ).toDateString();
        return {
          name: group[1].name,
          created_by: group[1].created_by,
          code: group[0],
          created_at: dateFormat,
          n_movies: group[1].movies.length || 0,
        };
      });
    },
  },
  methods: {
    ...mapActions('groups', ['getGroupsAction', 'createGroupAction', 'joinGroupAction', 'leaveGroupAction']),
    onJoinGroup() {
      const groupCode = this.$refs.joinGroupModal.$data.value;
      if (groupCode && groupCode !== '') {
        this.joinGroupAction({
          groupCode,
          userUID: this.user.uid,
        });
      }
      this.showJoinGroupModal = false;
    },
    onCreateGroup() {
      const groupName = this.$refs.createGroupModal.$data.value;
      if (groupName && groupName !== '') {
        this.createGroupAction({
          groupName,
          userUID: this.user.uid,
          userDisplayName: this.user.displayName,
        });
      }
      this.showCreateGroupModal = false;
    },
    leaveGroup(event, groupCode) {
      event.stopPropagation();
      this.leaveGroupAction({ groupCode, userUID: this.user.uid });
    },
  },
};
</script>

<style lang="sass">
  .groups-page
    .button
      transition: 0.3s
      &:hover
        border-color: rgb(142, 45, 226)
        background-color: rgba(142, 45, 226, 0.1)

    .box-footer
      display: flex
      gap: 15px
      justify-content: center

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
