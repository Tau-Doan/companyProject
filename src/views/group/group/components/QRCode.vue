<template>
  <div class="twoDimensionCode">
    <div >
      <el-image
      id="code"
      :src="wxGroupUrl"
      fit="cover"></el-image>
    </div>
    <el-button @click="copyGroupLink">复制二维码</el-button>
    <span>注：200人以上群二维码将无效</span>
  </div>
</template>

<script>
  import {getCode} from "../../../../api/groupDaily/group";
  export default {
      name: "qrCode",
      props: {
        groupId:Number
      },
      data(){
        return{
          wxGroupUrl:''
        }
      },
      methods:{
        copyGroupLink(){
          this.getSelect(document.querySelector('#code'));
          document.execCommand('copy');
          // copy之后清空选择区域
          window.getSelection().removeAllRanges();
          this.$message.success('复制成功');
        },

        getSelect (targetNode) {
          if (window.getSelection) {
            //chrome等主流浏览器
            let selection = window.getSelection();
            let range = document.createRange();
            range.selectNode(targetNode);
            selection.removeAllRanges();
            selection.addRange(range);
          } else if (document.body.createTextRange) {
            //ie
            let range = document.body.createTextRange();
            range.moveToElementText(targetNode);
            range.select();
          }
        },

        async getCode(){
          const result = await getCode({id:this.groupId})
          this.wxGroupUrl = result.msg
          !this.wxGroupUrl && this.$message.warning("二维码正在生成中，请稍后");
        }


      },
      mounted() {
        this.getCode()
      }
    }
</script>

<style lang="scss" scoped>
  /*弹框二维码*/
  .twoDimensionCode {
    height: 300px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
  div {
    width: 200px;
    height: 200px;
  }
  .el-button {
    width: 200px;
  }
  }
</style>
