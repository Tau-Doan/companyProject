<style scoped>
  #selg, .content {
    width: 99%;
    height: 100%;
    margin-left: 1%
  }

  .m0 {
    margin: 0 !important
  }

  .p2 {
    margin: 12px 0 0 0;
    color: #888
  }

  .roww {
    position: reletive;
    margin-bottom: 20px;
    height: 40px
  }

  .lab {
    float: left;
    width: 24%;
    height: 98%;
    font-size: 16px
  }

  .box {
    float: left;
    width: 60%;
    height: 98%%;
    left: 32%;
    position: absolute;
  }

  .first > span {
    font-size: 12px;
    display: block;
    float: left
  }

  .mess {
    margin-left: -2px;
    width: 60px;
  }

  .info {
    position: absolute;
    left: 120px
  }

  .btn {
    height: 36px;
    width: 110px
  }
</style>

<template>
  <div id="selg">
    <div class='content'>
      <!-- <div class='roww'>
         <div class='lab'>
             管理员提醒开关
         </div>
         <div class='box first'>
             <el-switch v-model='is_rem'></el-switch>
             <span v-if='is_rem' class='mess'>(已开启)</span>
             <span v-else class='mess'></span>
             <span class='info'>关闭后，将不会发送消息提醒管理员</span>
         </div>
       </div>-->

      <div class='roww' style='height:90px'>
        <div class='lab'>
          提醒内容
        </div>
        <div class='box'>
          <p class='m0'>管理员，您好！【昵称】在【群名称】发链接，链接为：【链接地址】</p>
          <p class='p2'>举例：管理员，您好！何璐菊在好猫交流群发链接，链接为：www.baidu.com</p>
        </div>
      </div>
      <div class='roww'>
        <div class='lab'>
          提醒对象
        </div>
        <div class='box' style='color:black'>
          发送广告用户所在群组的管理员
        </div>
      </div>
      <el-button @click='save' class='btn' type='primary'>保存配置</el-button>
    </div>
  </div>
</template>

<script>
  export default {
    name: "remadm",
    props: ['params'],
    data() {
      return {
        is_rem: false
      }
    },
    created() {

    },
    mounted() {
      // this.params && (this.params === 3) && (this.is_rem = true)
    },
    methods: {
      save() {
        this.$emit('close', 5)
      }

    },


  }
</script>
