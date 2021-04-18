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

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
