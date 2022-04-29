<template>
  <section class="login-page">
    <div class="container">
      <div class="box">
        <app-logo spaced />
        <form @submit.prevent="login()">
          <b-field>
              <b-input
                ref="emailInput"
                required
                placeholder="Email"
                v-model="email"
                type="email"
                icon="email"
              >
              </b-input>
          </b-field>

          <b-field>
            <b-input
              required
              placeholder="********"
              v-model="password"
              type="password"
              icon="lock"
              password-reveal
            >
            </b-input>
          </b-field>

          <b-button
            native-type="submit"
            class="mt-2 mb-4"
            :loading="loading"
            :disabled="!email || !password || $refs.emailInput.hasMessage"
          >
            Login
          </b-button>
        </form>
        <div class="switch-form">
          <p>Don't have an account? <router-link to="/signup">Sign up!</router-link></p>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import Logo from '../components/Logo.vue';

export default {
  name: 'LoginView',
  data() {
    return {
      email: '',
      password: '',
    };
  },
  beforeMount() {
    if (this.isLoggedIn) this.$router.push('/');
  },
  mounted() {
    this.$refs.emailInput.focus();
  },
  components: {
    'app-logo': Logo,
  },
  computed: {
    ...mapGetters('user', ['isLoggedIn', 'loading']),
  },
  methods: {
    ...mapActions('user', ['loginAction']),
    login() {
      this.loginAction({ email: this.email, password: this.password });
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
