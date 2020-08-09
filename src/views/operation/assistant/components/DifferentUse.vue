<template>
  <div class="differentUse">
    <el-form >
      <el-form-item>
        <el-radio-group v-model="application">
          <el-radio  :label="1" >拉取群组</el-radio>
          <el-radio  :label="2" >发送消息</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-button type="primary" @click="conservationDifferentUse" >确定</el-button>
      <el-button @click="close">取消</el-button>
    </el-form>
  </div>

</template>

<script>
  import {modifyPurpose} from "../../../../api/operation/assistant"
  export default {
    props:{
      purpose:Number,
      close:Function,
      id:Number
    },
    name: "differentUse",
    data(){
      return{
          application:''
      }
    },
    methods:{
      async conservationDifferentUse(){
        this.purpose = this.application;
        await modifyPurpose({purpose: this.purpose,id: this.id});
          this.close();

      }
    },
    mounted() {
      this.application = this.purpose
    }
  }
</script>

<style lang="scss" scoped>
  .differentUse{
    .el-radio{
      display: block;
      margin-bottom: 20px;
    }
  }

</style>
