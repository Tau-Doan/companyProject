<template>
  <div class="app-container">
    <el-form :inline="true">
      <el-form-item >
        <el-input v-model="pageParams.nickname" placeholder="快速查询" clearable />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="pageQuerySignInfo">查询</el-button>
      </el-form-item>
    </el-form>

    <el-table
      v-loading="signInInfosLoading"
      element-loading-text="拼命加载中"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.8)"
      :data="signInInfos">
      <el-table-column label="微信号" prop="name" align="center">
        <template slot-scope="scope">
          <div class="signInName  GroupNameList">
            <el-image
              :src="scope.row.headImgUrl"
              fit="cover"/>
            <span>{{ scope.row.nickname }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="当前拥有积分" prop="currentIntegral" align="center"/>
      <el-table-column label="历史总积分" prop="historyTotalIntegral" align="center"/>
      <el-table-column label="历史总签到次数" prop="historyTotalSignInMemberNumber" align="center"/>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button type="text" @click="getSignDetail(scope.row.memberUserWxid)">详情</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="pageParams.pageindex"
      :limit.sync="pageParams.pagesize"/>

    <!--弹出群成员签到详情-->
    <el-dialog
      :close-on-click-modal="false"
      title="群成员签到详情"
      :visible.sync="signDetailVisible"
      width="60%"
      center>
      <el-table
        v-loading="memberSignDetailInfoLoading"
        element-loading-text="拼命加载中"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(0, 0, 0, 0.8)"
        :data="memberSignDetailInfo">
        <el-table-column label="微信号" prop="name" align="center">
          <template slot-scope="scope">
            <div class="wxSignInName GroupNameList">
              <el-image
                :src="scope.row.headImgUrl"
                fit="cover"/>
              <span>{{ scope.row.nickname }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="当前拥有积分" prop="currentIntegral" align="center"/>
        <el-table-column label="历史总积分" prop="historyTotalIntegral" align="center"/>
        <el-table-column label="历史总签到次数" prop="historyTotalSignInMemberNumber" align="center"/>
      </el-table>

      <!--日历-->
      <el-calendar>
        <template
          slot="dateCell"
          slot-scope="{date, data}">
          <p :class="data.isSelected ? 'is-selected' : ''">
            {{ data.day.split('-').slice(1).join('-') }} {{ checkMemberIsSignIn(data.day) ? '✔️' : ''}}
          </p>
        </template>
      </el-calendar>

    </el-dialog>
  </div>
</template>

<script>
  import {getMemberSignInfo,pageQueryGroupSignInfo,} from "../../../api/interaction/signIn"
  export default {
    name: "SignInDesc",
    props: ['params'],
    mounted() {
      const chatRoomId = this.$route.params.id;
      if (chatRoomId) {
        this.pageParams.chatRoomId = chatRoomId;
        this.pageQuerySignInfo();
      }
    },
    data() {
      return {
        pageParams: {
          pageindex: 1,
          pagesize: 10,
          chatRoomId: null, // 微信id
          nickname: '' // 过滤关键字
        },
        total: 0, // 总记录数
        signInInfosLoading: false,
        signInInfos: [], // 签到详情数组
        memberSignHistoryRecord: [], // 用户签到记录
        signDetailVisible: false, // 用户签到日期
        memberSignDetailInfo: [], // 用户详情
        memberSignDetailInfoLoading: false,
      }
    },
    methods: {
      // 用户是否签到
      checkMemberIsSignIn(day) {
        return this.memberSignHistoryRecord.filter(item => item.signDate === day).length > 0
      },
      handleSizeChange(pageSize) {
        this.pageParams.pagesize = pageSize;
        this.pageQuerySignInfo();
      },
      handleCurrentChange(pageIndex) {
        this.pageParams.pageindex = pageIndex;
        this.pageQuerySignInfo();
      },
      /**
       * 分页查询签到信息
       */
      async pageQuerySignInfo() {
          const result = await pageQueryGroupSignInfo(this.pageParams);
          this.signInInfosLoading = true;
          const {total, records, size, current} = result.data;
          this.total = parseInt(total);
          this.pageParams.pageindex = parseInt(current);
          this.pageParams.pagesize = parseInt(size);
          this.signInInfos = records;
          this.signInInfosLoading = false;
      },
      // 获取签到详情
      async getSignDetail(memberUserWxId) {
        // 群id
          const chatRoomId = this.$route.params.id;
          const result = await getMemberSignInfo({memberUserWxId, chatRoomId});
          this.memberSignDetailInfoLoading = true;
          this.memberSignDetailInfo = [];

          this.memberSignHistoryRecord = result.data.memberSignHistoryRecord;
          // 删除多余数据
          delete result.data.memberSignHistoryRecord;
          this.memberSignDetailInfo.push(result.data);
          this.signDetailVisible = true;
          this.memberSignDetailInfoLoading = false;
      },

      openSignIn() {
        this.openSignIn = true;
      },
      memberSignIn1: () => {
        this.$emit("cPage", "memberSignIn")
      }
    },
  }
</script>

<style scoped>

</style>
