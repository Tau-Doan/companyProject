<template>
  <div class="app-container">
    <el-form :inline="true">
      <el-form-item label="">
        <el-input v-model="pageParams.keyword" placeholder="快速查询"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="searchQuery">查询</el-button>
        <el-button @click="toEdit">创建新话题</el-button>
      </el-form-item>
    </el-form>

    <el-table
      v-loading="loading"
      element-loading-text="拼命加载中"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.8)"
      :data="talks">
      <el-table-column label="话题主题"  width="300">
        <template slot-scope="scope">
          <div class="talkName">
            <span v-if="scope.row.title.length < 20">{{scope.row.title}}</span>
            <el-tooltip v-else class="item" effect="dark" :content="scope.row.title" placement="top-start">
              <span > {{scope.row.title}}</span>
            </el-tooltip>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="目标群" align="center">
        <template slot-scope="scope">
                        <span>{{scope.row.groupNumber}}[<a href="#" class="targetGroup"
                                                           @click="getGroupList(scope.row.id)">查看</a>]</span>
        </template>
      </el-table-column>
      <el-table-column label="背景图" align="center" >
        <template slot-scope="scope">
          <el-image
            style="width: 60px; height: 60px"
            :src="scope.row.image"
            fit="cover"/>
        </template>
      </el-table-column>
      <el-table-column label="发言次数" prop="totalSpeakNumber" align="center"></el-table-column>
      <el-table-column label="发言人数" prop="totalSpeakMember" align="center"></el-table-column>
      <el-table-column label="发起时间" prop="createTime" align="center"></el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button @click="detail(scope.row.id)" type="info">发言排行榜</el-button>
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
      :visible.sync="isShowGroupListPage"
      title="目标群"
      width="30%">
      <selectGroup v-if="isShowGroupListPage" :depts="deptList"/>
    </el-dialog>
  </div>
</template>

<script>
  import SelectGroup from '@/components/SelectGroup'

  import {getGroupList,pageQuery} from "../../../api/interaction/talk"
  export default {
    components: {
      SelectGroup
    },
    name: "gambit",
    data() {
      return {
        isShowGroupListPage: false, // 是否显示群列表
        deptList: [], // 部门和群数据
        talks: [],
        talkId: '',
        //表单
        loading: false,
        //分页
        pageParams: {
          page: 1, // 当前页
          size: 10, // 每页记录数
          keyword: '' // 过滤关键字
        },
        talkRankingList: [], // 排行榜数据
        total: 0, // 总页数
      }
    },
    methods: {
      detail(id){
        this.$router.push(`/interaction/talkDesc/${id}`);
      },
      //搜索查询
      searchQuery(){
        this.pageParams.page = 1;
        this.pageQuery()
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
        const result =  await pageQuery(this.pageParams);
          const {total, records, size, current} = result.data;
          this.total = parseInt(total);
          this.pageParams.page = parseInt(current);
          this.pageParams.size = parseInt(size);
          this.talks = records;
          this.loading = false;
      },
      // 获取目标群
      async getGroupList(id) {
          const result =  await getGroupList({id});
          this.deptList = result.data;
          this.isShowGroupListPage = true;
      },
      toEdit(){
        this.$router.push(`/interaction/editTalk`)
      },

    },
    mounted() {
      this.pageQuery();
    }
  }
</script>

<style scoped>

</style>
