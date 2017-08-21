import Vue from 'vue'
import VueResource from 'vue-resource';
import VueRouter from 'vue-router';
import Validator from './common/form/validator';
import './common/form/form';
import './common/pagination/paginator';

Vue.use(Validator, {
    messages: {
        required_failed: "The :field is required.",

    },
    rules: {

    }
});
Vue.use(VueRouter);
Vue.use(VueResource);


import routes from './routes';
const router = new VueRouter({
    mode: 'history',
    routes
});

import App from './App.vue'


new Vue({
    router,
  el: '#app',
  render: h => h(App)
})
