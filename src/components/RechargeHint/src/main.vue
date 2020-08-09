<template>
  <transition>
    <el-dialog
      :visible.sync="visible"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      top="700px"
      :before-close="close"
      width="20%"
    >
      <div class="msg-show">温馨提示</div>
      <div class="pay-msg">vip收费功能，请开通vip后再使用</div>
      <el-row class="btn-msg">
        <el-button type="success" @click="close">确定</el-button>
        <el-button type="info" @click="close">取消</el-button>
      </el-row>

      <span slot="footer" class="dialog-footer">
  </span>
    </el-dialog>
  </transition>
</template>

<script>
  import store from '@/store' // js代码驱动的dom获取不到vuex值，手动引入解决
  import router from '@/router'
  export default {
    name: 'RechargeHint',
    computed: {
      visible(){
        return store.getters.rechargeHintVisible || false;
      }
    },
    methods: {
      /**
       * 关闭弹出层
       */
      close(){
        router.app.PubSub.publish('delTag',router.app.$route.path);
        // 关闭弹框
        //  debugger
        router.push('/product/vip')
        store.dispatch('UpdateRechargeHintVisible',false);
      }
    }
  };
</script>
<style lang="scss" scoped>
  /deep/.el-dialog{

    min-width:260px;
    margin-top:200px !important;
    margin: 0 auto;
    .msg-show{
    text-align: center;
    font-size: 30px;
    font-weight: bold;
    color: #176465;
  }
    .pay-msg{
      text-align: center;
      padding: 20px 0;
    }
    .btn-msg{
      text-align: center;
    }
  }


</style>
