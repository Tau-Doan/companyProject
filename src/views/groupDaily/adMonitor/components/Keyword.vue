<template>
  <div id="selg">
    <div id="conditionFrom">
      <div class='bdy'>
        <p class="tp">
          在下方输入
          {{title}}
          ,回车添加，最多50条</p>
        <el-tag :key='ind' v-for='ind in useArray' closable @close='remove(ind)' class='mt'>
          {{ind}}
        </el-tag>
        <el-input
          v-if='iptble'
          v-model='iptval'
          @keyup.enter.native='enter'
          @blur='enter'
          ref='svtagval'
          class='input-new-tag mt'
          size='small'
        ></el-input>
        <el-button
          @click="showInput"
          class="button-new-tag mt"
          size="small"
        >添加
        </el-button>
      </div>
      <div class="btng">
        <el-button @click="over(1)" size="small" type='primary' class="w80">创建</el-button>
        <el-button @click="over(0)" size="small" class="w80">取消</el-button>
      </div>
    </div>


  </div>
</template>

<script>

  export default {
    name: "Keyword",
    props: ['tp', 'arr'],
    data() {
      return {
        iptble: false,//输入框显示
        iptval: '',   //输入框输入值
        title: '',//哪个页面
        useArray: []
      }
    },
    created() {
    },
    watch: {
      tp(val) {
        this.chArr(val)
      }
    },
    mounted() {
      this.chArr(this.tp)
    },
    methods: {
      chArr(val) {
        this.useArray = this.arr ? (typeof (this.arr) == 'string' ? this.arr.split(',') : this.arr) : []
        switch (val) {
          case 0:
            this.title = '消息关键字'
            break;
          case 6:
            this.title = '昵称关键词'
            break;
          case 3:
            this.title = '网站白名单'
            break;
        }
      },
      remove(elem) {   //删除一个标签
        this.useArray.splice(this.useArray.indexOf(elem), 1)
      },
      enter() {    //新输入保存
        if (this.useArray && this.useArray.length > 50) {
          this.$message({
            message: '最多50条！',
            type: 'warning'
          })
        } else {
          if (this.useArray.length < 1) this.useArray = []
          var bool = true//正则分类验证
          switch (this.tp) {
            case 0:
              if ((/^\s*$/).test(this.iptval)) bool = false
              break;
            case 6:
              if ((/^\s*$/).test(this.iptval)) bool = false
              break;
            case 3:
              if ((/^\s*$/).test(this.iptval)) bool = false
              break;
          }
          if (bool) this.useArray.push(this.iptval)
          else this.$message('格式错误！')
        }

        this.iptble = false
        this.iptval = ''
      },
      showInput() {    //显示输入框
        this.iptble = true
        this.$nextTick(() => {
          this.$refs.svtagval.$refs.input.focus()
        })
      },                              //两个参数
      over(val) { //提交         标记   一个from,一个data
        if (val == 0) this.$emit('close')
        else {
          switch (this.tp) {
            case 0:
              this.$emit('save_mess_k', {arr: this.useArray})
              break;
            case 6:
              this.$emit('save_name_k', {arr: this.useArray})
              break;
            case 3:
              this.$emit('save_addr_k', {arr: this.useArray})
              break;
          }

        }
      }

    },


  }
</script>
<style scoped>
  .el-tag + .el-tag {
    margin-left: 10px;
  }

  .button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }

  .input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
  }


  #selg {
    margin: 0
  }

  .titleHeader {
    border-bottom: 2px solid #ccc
  }

  .tp {
    font-size: 15px;
    font-weight: 500;
    margin-top: -20px
  }

  .mt {
    margin-top: 10px !important
  }

  .bdy {
    width: 100%
  }

  .btng {
    height: 15%;
    margin-top: 4%
  }

  .w80 {
    width: 90px;
    margin-right: 14px
  }
</style>
