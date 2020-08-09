<style scoped>
  * {
  }

  #selg {
    width: 100%;
    height: 100%;
    margin-top: -14px
  }

  .wr {
    font-family: "微软雅黑";
  }

  .p1 {
    margin: 0 0 10px 0
  }

  .p2 {
    color: #999;
    margin-top: 10px
  }

  .btn {
    width: 90px;
    height: 32px
  }

  .btnr {
    margin-left: 30px
  }
</style>

<template>
  <div id="selg">
    <p class='p1'>提醒语设置</p>
    <el-input
      class='wr'
      type="textarea"
      :autosize="{ minRows: 4, maxRows: 10}"
      maxlength="200"
      show-word-limit
      placeholder="输入警告语句"
      v-model="warn_word"
    >
    </el-input>
    <p class='p2'>注：如群成员连续频繁发广告，每分钟只警告回复一次</p>
    <el-button
      class='btn'
      size='mini'
      type='primary'
      @click='over(true)'
    >
      确定
    </el-button>
    <el-button
      @click='over(false)'
      class='btn btnr'
      size='mini'
    >
      取消
    </el-button>
  </div>
</template>

<script>
  var that
  export default {
    name: "group_warning",
    props: ['params'], // 父组件传递过来的数据
    data() {
      return {
        warn_word: '警告！本群禁止发广告！！请立即撤回！！否则发送广告者将会踢出群！！'
      }
    },
    mounted() {
      this.params && (this.warn_word = this.params)
    },
    methods: {
      over(boolea) {
        this.$emit('close', 4, boolea ? this.warn_word : null)
      }

    },


  }
</script>
