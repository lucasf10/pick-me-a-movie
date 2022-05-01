<template>
  <section>
    <top-header />
    <div class="page groups-page">
      <div class="box mt-4 mx-4">
        <h2 class="page-title mb-3">Groups</h2>
        <b-table
          :loading="loading"
          hoverable
          :paginated="formattedGroups && formattedGroups.length > 5"
          per-page="5"
          :data="formattedGroups"
          @click="$router.push(`/group/${$event.code}`);"
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
            <div class="actions">
              <b-tooltip
                label="Leave group"
                position="is-left"
              >
                <b-button
                  @click.prevent="leaveGroup($event, props.row.code)"
                  icon-left="delete"
                  size="is-small"
                />
              </b-tooltip>
              <b-tooltip
                label="Copy code"
                position="is-left"
              >
                <b-button
                  @click.prevent="copyToClipboard($event, props.row.code)"
                  icon-left="content-copy"
                  size="is-small"
                />
              </b-tooltip>
            </div>
          </b-table-column>
        </b-table>

        <div class="box-footer mt-4">
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
  </section>
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
    if (this.user) this.getGroupsAction({ userUID: this.user.uid });
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
    ...mapGetters('groups', ['formattedGroups', 'loading']),
    ...mapGetters('user', ['isLoggedIn', 'user']),
  },
  methods: {
    ...mapActions('groups', ['getGroupsAction', 'createGroupAction', 'joinGroupAction', 'leaveGroupAction']),
    ...mapActions('movies', ['getMoviesAction']),
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
    copyToClipboard(event, groupCode) {
      event.stopPropagation();
      navigator.clipboard.writeText(groupCode);
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

      @media screen and (max-width: 768px)
        position: absolute
        z-index: 999
        bottom: 45px
        width: 100%
        left: 0

    .b-table
      .table.is-hoverable
        thead
          th
            vertical-align: middle
            position: relative

        tbody
          tr
            transition: 0.3s
            &:not(.is-selected):hover
              background-color: rgba(142, 45, 226, 0.1)
              cursor: pointer

            td
              vertical-align: middle
              position: relative

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

      .actions
        display: flex
        gap: 8px

</style>
