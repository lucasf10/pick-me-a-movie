<template>
  <section class="login-page">
    <div class="container">
      <div class="box">
        <app-logo spaced />
        <form @submit.prevent="signUp">
          <b-field>
              <b-input
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

          <b-field>
            <b-input
              placeholder="********"
              v-model="confirmPassword"
              type="password"
              icon="lock-alert"
              required
              password-reveal
            >
            </b-input>
          </b-field>

          <b-button native-type="submit" class="mt-2 mb-4">Sign Up</b-button>
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
    };
  },
  components: {
    'app-logo': Logo,
  },
  beforeMount() {
    if (this.isLoggedIn) this.$router.push('/');
  },
  computed: {
    ...mapGetters('user', ['isLoggedIn']),
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
