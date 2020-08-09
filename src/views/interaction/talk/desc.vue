<template>
  <div class="app-container">
    <div id="conditionFrom">
      <span>话题名称：</span><span>#{{talkTitle}}#</span>
    </div>
    <div id="table">
      <el-table
        v-loading="loading"
        element-loading-text="拼命加载中"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(0, 0, 0, 0.8)"
        :data="talkRankingList">
        <el-table-column label="用户昵称" align="center" width="300">
          <template slot-scope="scope">
            <div class="talkGroupName  GroupNameList">
              <el-image :src="scope.row.headUrl" />
              <span >{{ scope.row.name }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="发言次数" prop="totalSpeakNumber" align="center"/>
        <el-table-column label="发言人数" prop="totalSpeakMember" align="center"/>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button type="text" @click="openTalkInteractionRankingListPage(scope.row.chatRoomId)">详情
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination
        v-show="total>0"
        :total="total"
        :page.sync="pageParams.pageindex"
        :limit.sync="pageParams.pagesize"/>
    </div>


    <el-dialog
      :close-on-click-modal="false"
      title="话题互动排行榜"
      :visible.sync="isOpenTalkInteractionRankingListPage"
      :before-close="handleTalkInteractionRankingListPageClose">
      <interactionRanking v-if="isOpenTalkInteractionRankingListPage" :talkTitle="talkTitle"
                                  :chatRoomId="chatRoomId" :talkId="pageParams.talkId"/>
    </el-dialog>
  </div>
</template>

<script>

  import interactionRanking from './components/Ranking'
  import {getTalkRankingList} from "../../../api/interaction/talk"

  export default {
    name: "talkRankingList",
    props: ['params'],
    components: {
      interactionRanking
    },
    data() {
      return {
        isOpenTalkInteractionRankingListPage: false, //是否打开互动排行榜页面
        talkRankingList: [], // 用户排行榜
        talkTitle: '话题',
        //表单
        loading: false,
        chatRoomId: '', // 群id
        //分页
        pageParams: {
          pageindex: 1, // 当前页
          pagesize: 10, // 每页记录数
          talkId: '' // 话题id
        },
        total: 0, // 总页数
      }
    },
    methods: {
      openTalkInteractionRankingListPage(chatRoomId) {
        this.chatRoomId = chatRoomId;
        this.isOpenTalkInteractionRankingListPage = true;
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
        const result = await getTalkRankingList(this.pageParams);
        const {total, records, size, current} = result.data.page;
        this.total = parseInt(total);
        this.pageParams.pageindex = parseInt(current);
        this.pageParams.pagesize = parseInt(size);
        this.talkRankingList = records;
        this.talkTitle = result.data.title;
        this.loading = false;

      },
      handleTalkInteractionRankingListPageClose() {
        this.isOpenTalkInteractionRankingListPage = false;
      }


    },
    mounted() {
      this.pageParams.talkId = this.$route.params.id;
      this.pageQuery();
    }
  }
</script>

<style scoped>

</style>
