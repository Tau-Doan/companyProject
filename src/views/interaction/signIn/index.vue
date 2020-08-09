<template>
  <div class="app-container">
    <el-form :inline="true">
      <el-form-item label="">
        <el-input v-model="pageParams.groupName" placeholder="快速查询" clearable />
      </el-form-item>
      <el-form-item label="查询时间">
        <el-select v-model="pageParams.type" clearable placeholder="请选择查询时间">
          <el-option v-for="item in selectDateTypes" :key="item.value" :label="item.label"
                     :value="item.value"/>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          @click="searchQuery"
        >查询</el-button>
        <el-button
          size="mini"
          type="success"
          icon="el-icon-delete"
          @click="toEdit"
        >编辑签到规则</el-button>
      </el-form-item>
    </el-form>

    <el-table
      v-loading="loading"
      element-loading-text="拼命加载中"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.8)"
      :data="signIns">
      <el-table-column label="微信群" :show-overflow-tooltip="true"  prop="name" width="330">
        <template slot-scope="scope">
          <div class="signInGroup">
            <el-image
              style="width: 100px;height: 100px;"
              :src="scope.row.headUrl"
              fit="cover"/>
              <span class="name-left"> {{scope.row.name}}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="历史总积分" prop="totalIntegral" />
      <el-table-column label="历史总签到人数" prop="historyTotalSignInMemberNumber"/>
      <el-table-column label="历史总签到次数" prop="historyTotalSignInNumber" />
      <el-table-column label="操作"  align="center">
        <template slot-scope="scope">
          <el-button  type="text" @click="detail(scope.row.chatRoomId)" ><i class="el-icon-document-checked"></i>详情</el-button>
        </template>
      </el-table-column>
    </el-table>
<!--    <pagination-->
<!--      v-show="total>0"-->
<!--      :total="total"-->
<!--      :page.sync="pageParams.pageindex"-->
<!--      :limit.sync="pageParams.pagesize"/>-->
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="pageParams.page"
      :limit.sync="pageParams.pageSize"
      @pagination="pageQuery"/>
  </div>
</template>

<script>
  import {pageQuery} from '../../../api/interaction/signIn'
  export default {
    name: "SignIn",
    data() {
      return {
        pageParams: {
          pageindex: 1, // 当前页
          pagesize: 10, // 每页记录数
          groupName: '', // 群名称过滤key
          type: '' //时间查询类型1：当天，2：本月
        },
        total: 0, // 总页数
        input: '',
        selectDateTypes: [
          {
            value: '',
            label: '全部'
          },
          {
            value: '1',
            label: '当天'
          },
          {
            value: '2',
            label: '本月'
          }
        ],
        value: '',
        signIns: [], // 签到列表
        loading: false,
      }
    },
    methods: {
      // 详情
      detail(chatRoomId){
        this.$router.push(`/interaction/signInDesc/${chatRoomId}`);
      },
      handleSizeChange(val) {
        this.pageParams.pagesize = val;
        this.pageQuery();
      },
      handleCurrentChange(val) {
        this.pageParams.pageindex = val;
        this.pageQuery();
      },
      //搜索查询
      searchQuery(){
        this.pageParams.pageindex = 1;
        this.pageQuery()
      },
      // 分页查询
      async pageQuery() {
          this.loading = true;
          const result = await pageQuery(this.pageParams);
          const {total, records, size, current} = result.data;
          this.total = parseInt(total);
          this.pageParams.pageindex = parseInt(current);
          this.pageParams.pagesize = parseInt(size);
          this.signIns = records;
          this.loading = false;
      },
      toEdit(){
        this.$router.push(`/interaction/signInRule`)
      },
    },
    mounted() {
      this.pageQuery();
    }
  }
</script>

<style lang="scss" scoped>
  .signInGroup{
    display: flex;
    align-items: center;
    .name-left{
      padding-left: 15px;
    }
  }

</style>
