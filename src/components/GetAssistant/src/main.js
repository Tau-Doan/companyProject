import Vue from 'vue';
import Main from './main.vue';
let GetAssistantConstructor = Vue.extend(Main);
const GetAssistant = function(options) {
  if (Vue.prototype.$isServer) return;
  options = options || {};
  options = {$store: Vue.prototype.$store};
  const instance = new GetAssistantConstructor({
    data: options
  });
  instance.$mount();
  document.body.appendChild(instance.$el);
  return instance;
};

export default GetAssistant;
