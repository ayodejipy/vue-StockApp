import Vue from "vue";
import axios from 'axios';
import VueAxios from 'vue-axios';
import Vuelidate from 'vuelidate';
import App from "./App.vue";
import router from "./router";
import { store } from "./store";

/** Vue.use() registers vue plugins for global use
 *  We need to make axios work globally and since axios is not a vue plugin
 *  we add it to Vue.prototype instance, hence, we can use it anywhere as 'this.$axios'
 */
Vue.use(VueAxios, axios);
Vue.prototype.$axios = axios;
axios.defaults.baseURL = "https://vue-stock-app-5e24b-default-rtdb.firebaseio.com/";

Vue.config.productionTip = false;

Vue.use(Vuelidate);

// Global currency format filter
Vue.filter('formatCurrency', (value) => {
  const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
  });
  return formatter.format(value);
});

// Global response interceptor to redirect users to login page when token expires
axios.interceptors.response.use( undefined, function(error) {
  if(error) {
    const originalRequest = error.config
    // console.log(originalRequest)
    if( error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      store.dispatch('auth/signout', { root: true })
      return
    }
  }
})


new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
