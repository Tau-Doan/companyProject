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
    import {getAssistant} from "../../api/group";
    export default {
        props: {
        },
      data() {
        return {

          assistantInfo:{}
        }
      },
      methods:{
        async getErVCode(){
          this.cipher=this.$store.state.user.cipher
          const id= this.cipher
          const result= await getAssistant(id)
          this.assistantInfo=result.data
        },
        close(){}
      },
      computed:{
        // ...mapGetters(['cipher']),
        visible(){
          if(this.$store.state.user.name=='admin'){
            return false
          }
          // if(store.user.name==='admin'){
          //   return false
          // }
          return this.$store.getters.ifAddRobot || false;
        },
        cipher(){
          return this.$store.getters.cipher
        }
      },
      mounted() {
          console.log( this.$store.getters.cipher)
      }

    };
</script>
