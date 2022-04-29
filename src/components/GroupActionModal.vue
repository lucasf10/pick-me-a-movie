<template>
  <div class="group-action-modal">
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
              ref="input"
            />
          </b-field>
        </section>
        <footer class="modal-card-foot is-flex is-justify-content-center">
          <b-button
            native-type="submit"
            :label="buttonLabel"
            type="is-primary"
            :disabled="!value"
          />
        </footer>
      </form>
    </div>
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
  mounted() {
    this.$refs.input.focus();
  },
  data() {
    return {
      value: '',
    };
  },
};
</script>

<style lang="sass">
  .group-action-modal
    margin: 0 20px

    .modal-card
      width: 100%

</style>
