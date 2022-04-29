<template>
  <section class="login-page">
    <div class="container">
      <div class="box">
        <app-logo spaced />
        <form @submit.prevent="signUp">
          <b-field>
              <b-input
                ref="nameInput"
                placeholder="Nome"
                v-model="name"
                type="text"
                required
                icon="account"
              >
              </b-input>
          </b-field>

          <b-field>
              <b-input
                placeholder="Email"
                v-model="email"
                type="email"
                icon="email"
                required
              >
              </b-input>
          </b-field>

          <b-field>
            <b-input
              placeholder="********"
              v-model="password"
              type="password"
              icon="lock"
              required
              password-reveal
            >
            </b-input>
          </b-field>

          <b-field
            :type="passwordsNotMatching ? 'is-danger' : 'no-danger'"
            :message="passwordsNotMatching ? 'Passwords must match' : undefined"
          >
            <b-input
              placeholder="********"
              v-model="confirmPassword"
              type="password"
              icon="lock-alert"
              required
            >
            </b-input>
          </b-field>

          <b-button
            native-type="submit"
            class="mt-2 mb-4"
            :loading="loading"
            :disabled="!isFormValid"
          >
            Sign Up
          </b-button>
        </form>
        <div class="switch-form">
          <p>Already have an account? <router-link to="/login">Sign in!</router-link></p>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import Logo from '../components/Logo.vue';

export default {
  name: 'SignUpView',
  data() {
    return {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      passwordsNotMatching: false,
    };
  },
  components: {
    'app-logo': Logo,
  },
  beforeMount() {
    if (this.isLoggedIn) this.$router.push('/');
  },
  mounted() {
    this.$refs.nameInput.focus();
  },
  computed: {
    ...mapGetters('user', ['isLoggedIn', 'loading']),
    isFormValid() {
      return (
        this.name
        && this.email
        && this.password
        && this.confirmPassword
        && this.password === this.confirmPassword
      );
    },
  },
  watch: {
    confirmPassword(newValue) {
      if (newValue !== this.password) this.passwordsNotMatching = true;
      else this.passwordsNotMatching = false;
    },
  },
  methods: {
    ...mapActions('user', ['signUpAction']),
    signUp() {
      this.signUpAction({ email: this.email, password: this.password, name: this.name });
    },
  },
};
</script>

<style lang="sass">
  .login-page
    height: 100%
    display: flex
    justify-content: center
    align-items: center

    .box
      margin: 0 auto
      width: 350px
</style>
