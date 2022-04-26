<template>
  <div class="modal-card m-auto">
    <form @submit.prevent="$emit('submit');">
      <header class="modal-card-head">
        <p class="modal-card-title">{{ title }}</p>
      </header>
      <section class="modal-card-body">
        <b-field>
          <b-input
            v-model="value"
            type="text"
            :placeholder="placeholder"
            required
          />
        </b-field>
      </section>
      <footer class="modal-card-foot is-flex is-justify-content-center">
        <b-button
          native-type="submit"
          :label="buttonLabel"
          type="is-primary"
        />
      </footer>
    </form>
  </div>
</template>

<script>

export default {
  name: 'GroupActionModal',
  props: {
    title: String,
    buttonLabel: String,
    placeholder: String,
  },
  data() {
    return {
      value: '',
    };
  },
};
</script>

<style lang="sass">
  .groups-modal-page
    .modal-card
      width: 100%

</style>
