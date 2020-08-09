<template>
  <div>
    <div id="userControl">
      <div id="voteGroup">
        <span>投票名称：</span>
        <span   v-if="voteTitle.length < 30" >#{{voteTitle}}#</span>
        <el-tooltip v-else class="item" effect="dark" :content="voteTitle" placement="top-start">
          <span class="voteGroupSpan">#{{voteTitle}}#</span >
        </el-tooltip>
        <div class="groupVote">
          <el-image :src="groupAvatar" fit="cover"/>
          <span  v-if="groupName.length < 13" >{{ groupName }}</span>
          <el-tooltip v-else class="item" effect="dark" :content="groupName" placement="top-start">
            <span >{{groupName}}</span >
          </el-tooltip>
        </div>
      </div>
      <div id="table">
        <el-table
          v-loading="loading"
          element-loading-text="拼命加载中"
          element-loading-spinner="el-icon-loading"
          element-loading-background="rgba(0, 0, 0, 0.8)"
          :data="voteDetails">
          <el-table-column label="用户昵称"   >
            <template slot-scope="scope">
              <div class="voteGroup GroupNameList">
                <el-image :src="scope.row.memberAvatar" fit="cover" />
                <span >{{ scope.row.nickname }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="投票结果" prop="voteResult"  align="center" />
          <el-table-column label="投票时间" prop="voteTime"  align="center" />
        </el-table>
        <div class="paginationV">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="pageParams.pageindex"
            :page-sizes="[10, 20, 50, 100]"
            :page-size="pageParams.pagesize"
            layout="total, sizes, prev, pager, next"
            background
            :total="total">
          </el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {pageQueryMemberVoteList} from "../../../../api/interaction/vote"
  export default {
    name:"details",
    props: {
      chatRoomId: {
        type: String,
        require: true
      },
      voteId: {
        type: String,
        require: true
      },
      voteTitle: {
        type: String,
        require: true
      }
    },
    data() {
      return {
        groupAvatar: '', // 群头像
        groupName:'', // 群名称
        //表单
        voteDetails: [{
          voteResult:'',
          voteTime:'',
        }],
        loading: false,
        //分页
        pageParams: {
          pageindex: 1, // 当前页
          pagesize: 10, // 每页记录数
        },
        total: 0, // 总页数
      }
    },
    methods: {
      handleSizeChange(val) {
        this.pageParams.pagesize = val;
        this.pageQuery();
      },
      handleCurrentChange(val) {
        this.pageParams.pageindex = val;
        this.pageQuery();
      },
      // 分页查询
      async pageQuery() {
        this.loading = true;
        const params = {...this.pageParams,voteId: this.voteId,chatRoomId: this.chatRoomId};
        const result = await pageQueryMemberVoteList(params);
        const {total, records, size, current} = result.data.page;
        this.total = parseInt(total);
        this.pageParams.pageindex = parseInt(current);
        this.pageParams.pagesize = parseInt(size);
        this.voteDetails = records;
        this.groupName = result.data.groupName;
        this.voteTitle = result.data.title;
        this.groupAvatar = result.data.groupAvatar;
        this.loading = false;
      },
    },
    mounted() {
      this.pageQuery();
    }
  }
</script>

<style scoped>

</style>
