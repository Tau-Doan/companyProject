import Vue from 'vue';
import Main from './main.vue';
let RechargeHintConstructor = Vue.extend(Main);

const RechargeHint = function(options) {
  if (Vue.prototype.$isServer) return;
  options = options || {};
  options = {$store: Vue.prototype.$store};
  const instance = new RechargeHintConstructor({
    data: options
  });
  instance.$mount();
  document.body.appendChild(instance.$el);
  return instance;
};

export default RechargeHint;
