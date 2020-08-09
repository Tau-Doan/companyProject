import Vue from 'vue'

import Cookies from 'js-cookie'

import 'normalize.css/normalize.css' // a modern alternative to CSS resets

import Element from 'element-ui'
import './assets/styles/element-variables.scss'
import {PubSub} from 'pubsub-js'

import '@/assets/styles/index.scss' // global css
import '@/assets/styles/ruoyi.scss' // ruoyi css
import App from './App'
import store from './store'
import router from './router'
import permission from './directive/permission'


import './assets/icons' // icon
import './permission' // permission control
import { getDicts } from "@/api/system/dict/data";
import { getConfigKey } from "@/api/system/config";
import {
  parseTime,
  resetForm,
  addDateRange,
  selectDictLabel,
  download,
  handleTree,
  checkPhoneFileTypeAndFileSize,
  exportExcelFile,
  getUrlParam
} from "@/utils/commons";
import Pagination from "@/components/Pagination";

import RechargeHint from '@/components/RechargeHint'

import GetAssistant from "./components/GetAssistant/index.js";
// 全局方法挂载
Vue.prototype.getDicts = getDicts;
Vue.prototype.getConfigKey = getConfigKey;
Vue.prototype.parseTime = parseTime;
Vue.prototype.resetForm = resetForm;
Vue.prototype.addDateRange = addDateRange;
Vue.prototype.selectDictLabel = selectDictLabel;
Vue.prototype.getUrlParam = getUrlParam;
Vue.prototype.download = download;
Vue.prototype.handleTree = handleTree;
Vue.prototype.checkPhoneFileTypeAndFileSize = checkPhoneFileTypeAndFileSize;
Vue.prototype.PubSub = PubSub;
Vue.prototype.exportExcelFile = exportExcelFile;

Vue.prototype.msgSuccess = function (msg) {
  this.$message({ showClose: true, message: msg, type: "success" });
};

Vue.prototype.msgError = function (msg) {
  this.$message({ showClose: true, message: msg, type: "error" });
};

Vue.prototype.msgInfo = function (msg) {
  this.$message.info(msg);
};

// 会员充值提示组件
Vue.prototype.$RechargeHint = RechargeHint;
//助手
Vue.prototype.$GetAssistant = GetAssistant;

// 全局组件挂载
Vue.component('Pagination', Pagination);

Vue.use(permission);

/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online! ! !
 */

Vue.use(Element, {
  size: Cookies.get('size') || 'medium' // set element-ui default size
});

Vue.config.productionTip = false;

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
});
