<template>
  <div class="app-container">
  <el-form :inline="true">
    <el-form-item label="" class="query-btn">
      <el-input v-model="pageParams.keyword" placeholder="快速查询" clearable />
      <el-button type="primary" @click="searchQuery" style="margin-top:20px">查询</el-button>
    </el-form-item>
<!--    <el-form-item>-->

<!--    </el-form-item>-->
    <el-form-item>
      <el-button @click="updateIntegralExchangeConfig" :type="integralExchangeConfig.configValue === '1'? 'primary': 'info'">{{integralExchangeConfig.configValue === '1'?'关闭' : '开启'}}积分转换</el-button>
    </el-form-item>
  </el-form>
  <el-table
    v-loading="loading"
    element-loading-text="拼命加载中"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0.8)"
    :data="integrals">
    <el-table-column label="微信群" prop="name">
      <template slot-scope="scope">
        <div class="integralGroupName GroupNameList">
          <el-image
            :src="scope.row.headUrl"
            fit="cover"

            />
          <span v-if="scope.row.name && scope.row.name.length < 15">{{scope.row.name}}</span>
          <el-tooltip v-else class="item" effect="dark" :content="scope.row.name" placement="top-start">
            <span> {{scope.row.name}}</span>
          </el-tooltip>
        </div>
      </template>
    </el-table-column>
    <el-table-column label="累计获取积分" prop="totalIntegral" align="center"/>
    <el-table-column label="已转换积分" prop="convertIntegral" align="center"/>
    <el-table-column label="剩余可用积分" prop="usableIntegral" align="center"/>
    <el-table-column label="操作" align="center">
      <template slot-scope="scope">
        <el-button type="text" @click="openUserIntegralDialog(scope.row.chatRoomId)">详情</el-button>
        <el-button type="text" @click="detail(scope.row.groupId)">积分转换记录</el-button>
      </template>
    </el-table-column>
  </el-table>
  <pagination
    v-show="total>0"
    :total="total"
    :page.sync="pageParams.pageindex"
    :limit.sync="pageParams.pagesize"/>
  <el-dialog
    :close-on-click-modal="false"
    title="用户积分详情"
    :visible.sync="showUserIntegralDialog"
    width="1000px"
    @close="clearName">

    <div class="user">
      <div class="inquiry">
        <el-input v-model="userIntegralParams.name" placeholder="快速查询" clearable />
        <el-button type="primary" @click="getUserIntegral">查询</el-button>
      </div>
      <div class="placeGroup">
        <div class="integralGroupName">
          <span>所属群：</span>
          <el-image
            :src="groupAvatar"
            fit="cover"/>
          <span>{{ groupName }}</span>
        </div>
      </div>
    </div>
    <el-scrollbar style="height: 300px">
      <el-table
        v-loading="userIntegralLoading"
        element-loading-text="拼命加载中"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(0, 0, 0, 0.8)"
        :data="userIntegrals">
        <el-table-column label="微信昵称" prop="name" >
          <template slot-scope="scope">
            <div class="weChatNumber GroupNameListCircular">
              <el-image
                :src="scope.row.avatar"
                fit="cover"/>
  <!--            <span >{{ scope.row.nickname }}</span>-->
            </div>
          </template>
        </el-table-column>
        <el-table-column label="群昵称" prop="nickname" align="center"></el-table-column>
        <el-table-column label="当前积分" prop="integral" align="center"></el-table-column>
        <el-table-column label="历史总积分" prop="historyTotalIntegral" align="center"></el-table-column>
      </el-table>
    </el-scrollbar>
  </el-dialog>
</div>
</template>

<script>
  import {updateIntegralExchangeConfig,
    getIntegralExchangeConfig,
    pageQueryIntegralStatisticsInfo,
    getMemberIntegralDetails} from "../../../api/interaction/integral"
  export default {
    name: "Integral",
    data() {
      return {
        integralExchangeConfig: {}, // 积分兑换配置
        //分页
        pageParams: {
          page: 1, // 当前页
          size: 10, // 每页记录数
          keyword: '' // 过滤关键字
        },
        integrals:[],
        total: 0, // 总页数
        loading: false,
        userIntegralLoading: false,
        showUserIntegralDialog: false,//弹框
        //用户积分详情
        userIntegrals: [],
        groupAvatar: '',
        groupName: '',
        avatar: '',
        userIntegralParams: {
          chatRoomId: '',
          name: ''
        },
      }
    },
    methods: {
      detail(id){
        this.$router.push(`/interaction/integralDetails/${id}`);
      },
      //搜索查询
      searchQuery(){
        this.pageParams.page = 1;
        this.pageQuery()
      },
      /**
       * 更新积分状态
       */
      updateIntegralExchangeConfig(){
        const status = this.integralExchangeConfig.configValue === '1'? '0': '1';

        this.$confirm(`你确定要${status === '0'?'关闭': '开启'}积分兑换吗？`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then( async () => {
          await updateIntegralExchangeConfig({status});
          this.$message.success('操作成功');
          this.integralExchangeConfig.configValue = status;
        })
      },
      /**
       * 获取积分兑换配置
       */
      async getIntegralExchangeConfig(){
        const result = await getIntegralExchangeConfig();
        this.integralExchangeConfig = result.data;
      },
      /**
       * 清理name
       */
      clearName(){
        this.userIntegralParams.name = ''
      },
      handleSizeChange(val) {
        this.pageParams.size = val;
        this.pageQuery();
      },
      handleCurrentChange(val) {
        this.pageParams.page = val;
        this.pageQuery();
      },
      // 分页查询
      async pageQuery() {
        this.loading = true;
        const result = await pageQueryIntegralStatisticsInfo(this.pageParams);
        const {total, records, size, current} = result.data;
        this.total = parseInt(total);
        this.pageParams.page = parseInt(current);
        this.pageParams.size = parseInt(size);
        this.integrals = records;
        this.loading = false;
      },
      openUserIntegralDialog(chatRoomId) {
        this.userIntegralParams.chatRoomId = chatRoomId;
        this.getUserIntegral();
      },
      async getUserIntegral() {
        this.showUserIntegralDialog = true;
        const result = await getMemberIntegralDetails(this.userIntegralParams);
        this.userIntegrals = result.data.memberIntegralDetails;
        this.groupName = result.data.groupName;
        this.groupAvatar = result.data.groupAvatar;
        this.loading = false;
      }

    },
    mounted() {
      // this.getIntegralExchangeConfig();
      this.pageQuery();


    }
  }
</script>

<style scoped lang="scss">
/* .GroupNameListCircular{
  display: flex;
  align-items: center;
} */
.user{
  .inquiry{
    display: flex;
    justify-content:flex-start;
    .el-input{
      width: 50%;
    }
    .el-button{
      margin-left: 5%;
      width: 10%;
    }
  }
}
.GroupNameList{

  text-align: center;


}
  .integralGroupName{
    padding: 20px 0;

    display: flex;
    justify-content: flex-start;
    align-items: center;
  }



</style>
