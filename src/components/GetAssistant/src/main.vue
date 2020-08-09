<template>
  <transition>
    <el-dialog
      :visible.sync="visible"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      top="700px"
      :before-close="close"
      width="30%"
    >
      <div  style="border-bottom:1px solid #E9E9E9;padding:20px 20px 5px 20px">
        <i class="el-icon-s-custom"></i>领取小助手
      </div>
      <el-container style="position: relative;">
        <el-main >
          <div style="margin: 5px 0">1微信扫一扫下方二维码，<span style="color:red">添加客服为好友</span></div>
          <div style="margin: 5px 0">2将你的<span style="color:red">企业名称</span>和<span style="color:red">代管理的微信群数量</span>发给客服后，客服将为你分配小微助手</div>
          <div style="margin: 5px 0">3添加小助手后将暗号{{cipher}}发给小助手，激活账户开始使用</div>
          <div style="width: 200px; height: 200px;margin: 10px auto;">
            <el-image
              style="width: 200px; height: 200px; "
              :src="assistantInfo.personQrcode"
              ></el-image>
          </div>
        </el-main>
      </el-container>
      <span slot="footer" class="dialog-footer">
  </span>
    </el-dialog>
  </transition>
</template>

<script>
  import store from '@/store' // js代码驱动的dom获取不到vuex值，手动引入解决
  import {getAssistant} from '../../../api/group'
  export default {
    name: 'GetAssistant',
    computed: {
      cipher() {
        return store.getters.cipher
      },
      visible(){
          if(store.state.user.name=='admin'){
            return false
          }
          if(store.state.user.token){
            this.getErVCode()
          }
          return store.getters.ifAddRobot || false;
      },

    },
    data() {
      return {
        assistantInfo:{}
      }
    },
    methods: {
      /**
       * 关闭弹出层
       */
      close(){
        store.dispatch('GetInfo')
      },
      //得到二维码
     async getErVCode(){
        const result= await getAssistant(this.cipher)
        this.assistantInfo=result.data
      }
    },
     mounted() {
      // if(store.getters.token){
      //   this.getErVCode()
      // }
    }
  };
</script>
<style lang="scss" scoped>
 /deep/ .el-dialog__body{
    padding: 0;
  }
  /deep/.el-dialog{
    padding: 0;
    min-width:260px;
    margin-top:150px !important;
    margin: 0 auto;
  }
</style>
