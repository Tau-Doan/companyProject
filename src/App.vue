<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
  import RechargeHint from '@/components/RechargeHint'
  import GetAssistant from "./components/GetAssistant/index.js";

  export default {
    name: 'App',
    mounted() {
      // 渲染充值提示页面
      RechargeHint();
      //领取小助手页面
      GetAssistant()
    }
  }
</script>

<style lang="css">
  .el-tooltip__popper {
    max-width: 500px
  }
</style>
