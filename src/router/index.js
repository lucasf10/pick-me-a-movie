import Vue from 'vue';
import VueRouter from 'vue-router';

import GroupsView from '../views/GroupsView.vue';
import LoginView from '../views/LoginView.vue';
import SignUpView from '../views/SignUpView.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/login',
    name: 'login',
    component: LoginView,
  },
  {
    path: '/signup',
    name: 'signup',
    component: SignUpView,
  },
  {
    path: '/',
    name: 'groups',
    component: GroupsView,
  },
];

const router = new VueRouter({
  routes,
});

export default router;
