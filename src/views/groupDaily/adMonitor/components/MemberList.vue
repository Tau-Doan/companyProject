<template>
  <div id="selg">
    <p class="tp">群成员列表</p>
    <el-container>
      <el-main style="height:300px">
        <div v-if="memberWhiteList" class="row">
          <div v-for='(item,index) in memberWhiteList' :key='index'>
            <div class='box'>
              <el-image :src="item.memberAvatar"/>
            </div>
            <span>{{item.memberName}}</span>
            <span @click='remove(item.memberId)' class='dt'><el-icon
              class='el-icon-circle-close cspit'></el-icon></span>
          </div>
          <div class="bbtn">
            <el-button
              class='btn'
              @click="show_select"
              type='primary'
            >
              添加群成员
            </el-button>
          </div>
        </div>
      </el-main>
      <el-footer>
        <div class='bbox'>
          <el-button @click='over(true)' class='fl' type='primary'>确定</el-button>
          <div></div>
          <el-button @click='over(false)' class='fl'>取消</el-button>
        </div>
      </el-footer>
    </el-container>

  </div>
</template>

<script>

  export default {
    name: "MemberList",
    props: {
      memberWhiteList: Array,
      delMember: Function
    },
    created() {
      this.ids = typeof (this.idString) == 'string' ? this.idString.split(',') : this.idString
      this.memberList = typeof (this.wlist) == 'string' ? this.wlist.split(',') : this.wlist
    },
    mounted() {
    },
    methods: {
      reff(idd, listt) {
        this.ids = typeof (idd) == 'string' ? idd.split(',') : idd
        this.memberList = typeof (listt) == 'string' ? listt.split(',') : listt
      },
      show_select() {//本页面切换到选择群成员页面
        let pageJson = {
          type: 'toSele',
          pageName: 'w_m_select',
          pageTitle: '选择群成员',
          iddata: this.ids,
          data: this.memberList,
          override_dialog_width: '800px'
        }
        this.$emit('cPage', pageJson)
      },
      remove(memberId) {  //删除一个白名单群员
        const index = this.memberWhiteList.findIndex(item => item.memberId === memberId);
        this.memberWhiteList.splice(index, 1);
        // 删除添加群成员组件数据
        this.delMember(memberId);
      },
      over(bool) {//bool等于true确定，false取消
        this.$emit('close', 2, this.memberList)
      }

    },
  }
</script>
<style scoped>
  * {
  }

  .titleHeader {
    border-bottom: 2px solid #ccc
  }

  #selg {
    margin-top: -36px;
    height: 400px
  }

  .tp {
    font-size: 18px;
    margin: 0
  }

  .row {
    width: 100%;
  }

  .row > div, .bbtn {
    float: left;
    width: 49%;
    height: 60px;
    margin-top: 4%
  }

  .row > div > span {
    width: 100px;
    margin-left: 8px;
    display: block;
    float: left;
    overflow: hidden;
    line-height: 58px;
    height: 58px;
    font-size: 18px
  }

  .row > div > .box {
    border-radius: 58px;
    overflow: hidden
  }

  .row > div > .box, .row > div > .box > img {
    width: 58px;
    height: 54px;
    float: left
  }

  .row > div > .dt {
    margin: 0;
    width: 22px;
    margin-top: 8px;
    font-size: 20px;
    height: 20px;
    line-height: 20px;
    font-weight: 700
  }

  .bbtn {
    width: 92% !important;
    float: left;
    height: 50px
  }

  .bbtn > .btn {
    width: 180px
  }

  .row > .ll {
  }

  .row > .rr {
  }

  .bbox {
    width: 100%;
    height: 40px;
    margin-top: 40px
  }

  .bbox > div {
    float: left;
    width: 30px;
    height: 40px
  }

  .fl {
    float: left;
    width: 90px
  }
</style>
