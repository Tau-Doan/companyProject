<template>
  <div class="app-container">
      <el-form :inline="true">
        <el-form-item label="">
          <el-input v-model="pageParams.keyword" placeholder="快速查询" clearable />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="searchQuery">查询</el-button>
          <el-button @click="toEdit">创建群投票</el-button>
        </el-form-item>
      </el-form>
      <el-table
        v-loading="loading"
        element-loading-text="拼命加载中"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(0, 0, 0, 0.8)"
        :data="votes">
        <el-table-column label="话题主题" align="center" width="300">
          <template slot-scope="scope">
            <div class="voteName">
              <span v-if="scope.row.title.length < 25">{{scope.row.title}}</span>
              <el-tooltip v-else class="item" effect="dark" :content="scope.row.title" placement="top-start">
                <span > {{scope.row.title}}</span>
              </el-tooltip>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="目标群" align="center">
          <template slot-scope="scope">
                        <span>{{scope.row.groupNumber}}个[<a href="javascript:void(0)"
                                                            @click="getGroupList(scope.row.id)"
                                                            class="targetGroup">查看</a>]</span>
          </template>
        </el-table-column>
        <el-table-column label="参与次数" prop="partakeNumber" align="center"/>
        <el-table-column label="背景图" align="center" >
          <template slot-scope="scope">
            <el-image
              style="width: 60px; height: 60px"
              :src="scope.row.image"
              fit="cover"/>
          </template>
        </el-table-column>
        <el-table-column label="投票时间" align="center" width="400">
          <template slot-scope="scope">
            {{`${scope.row.startTime}至${scope.row.endTime}`}}
          </template>
        </el-table-column>

        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button @click="detail(scope.row.id)" type="text">投票详情</el-button>
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
        width="700px"
        :visible.sync="isShowGroupListPage"
        title="目标群">
        <selectGroup v-if="isShowGroupListPage" :depts="deptList"/>
      </el-dialog>
    </div>
</template>

<script>
  import SelectGroup from '@/components/SelectGroup'

  import {getGroupList,pageQuery} from "../../../api/interaction/vote"
  export default {
    name: "vote",
    components: {
      SelectGroup
    },
    data() {
      return {
        deptList: [],
        isShowGroupListPage: false, // 是否显示群列表
        votes: [],
        talkId: '',
        //表单
        loading: false,
        //分页
        pageParams: {
          page: 1, // 当前页
          size: 10, // 每页记录数
          keyword: '' // 过滤关键字
        },
        talkRankingListPageParams: {
          pageindex: 1, // 当前页
          pagesize: 10, // 每页记录数
          talkId: '' // 话题id
        },
        talkRankingList: [], // 排行榜数据
        total: 0, // 总页数
      }
    },
    methods: {
      detail(id){
        this.$router.push(`/interaction/voteResults/${id}`);
      },
      //新建群投票
      toEdit(){
        this.$router.push(`/interaction/addVote`)
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
        const result = await pageQuery(this.pageParams);
        const {total, records, size, current} = result.data;
        this.total = parseInt(total);
        this.pageParams.page = parseInt(current);
        this.pageParams.size = parseInt(size);
        this.votes = records;
        this.loading = false;
      },
      // 获取目标群
      async getGroupList(id) {
        const result = getGroupList(id);
        this.deptList = result.data;
        this.isShowGroupListPage = true;
      },


    },
    mounted() {
      this.pageQuery();
    }
  }
</script>

<style scoped>

</style>
