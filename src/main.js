// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import global_ from './components/tool/Global';
import App from './App';
import 'normalize.css';
Vue.config.productionTip = false
Vue.prototype.GLOBAL = global_;
/* eslint-disable no-new */
new Vue({
  el: '#app',
  template: '<App/>',
  components: { App }
})
