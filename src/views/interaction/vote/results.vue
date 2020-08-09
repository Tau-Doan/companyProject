<template>
  <div class="app-container">
  <el-table
    v-loading="loading"
    element-loading-text="拼命加载中"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0.8)"
    :data="voteResults">
    <el-table-column label="群名称" >
      <template slot-scope="scope">
        <div class="voteResultsGroup GroupNameList">
          <el-image :src="scope.row.groupAvatar"  fit="cover" />
          <span >{{ scope.row.groupName }}</span>
        </div>
      </template>
    </el-table-column>
    <el-table-column label="投票次数" prop="voteNumber" />
    <el-table-column label="投票结果" prop="voteResult" />
    <el-table-column label="操作" align="center">
      <template slot-scope="scope">
        <el-button type="text" @click="openVoteDetailsPage(scope.row.chatRoomId)">详情</el-button>
      </template>
    </el-table-column>
  </el-table>

  <el-dialog
    :close-on-click-modal="false"
    title="投票结果"
    :visible.sync="isOpenVoteDetailsPage"
    :before-close="handleVoteDetailsPageClose">
    <voteDetails v-if="isOpenVoteDetailsPage" :talkTitle="voteTitle" :chatRoomId="chatRoomId" :voteId="params"/>
  </el-dialog>
</div>
</template>

<script>
  import voteDetails from './components/VoteDetails'

  import {pageQueryVoteResult} from "../../../api/interaction/vote"
  export default {

    name: "voteResults",
    props: ['params'],
    components: {voteDetails},
    data() {
      return {
        title: '',
        loading: false,
        isOpenVoteDetailsPage: false,
        voteTitle: '投票名称',
        voteResults: [],//投票结果
        pageParams: {
          pageindex: 1, // 当前页
          pagesize: 10, // 每页记录数
          id: '' // 投票id
        },
        total: 0, // 总页数
        chatRoomId: ''
      }
    },
    methods: {
      openVoteDetailsPage(chatRoomId) {
        this.chatRoomId = chatRoomId;
        this.isOpenVoteDetailsPage = true;
      },


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
        const result = await pageQueryVoteResult(this.pageParams);
        const {total, records, size, current} = result.data.page;
        this.total = parseInt(total);
        this.pageParams.pageindex = parseInt(current);
        this.pageParams.pagesize = parseInt(size);
        this.voteResults = records;
        this.title = result.data.title;
        this.loading = false;
      },
      handleVoteDetailsPageClose() {
        this.isOpenVoteDetailsPage = false;
      }


    },
    mounted() {
      this.pageParams.id = this.$route.params.id;
      this.pageQuery();
    }
  }
</script>

<style scoped>

</style>
