<template>
  <div id="userControl">
    <div id="talkGroup">
      <span>话题名称：</span>
      <span   v-if="talkTitle.length < 40" >#{{talkTitle}}#</span>
      <el-tooltip v-else class="item" effect="dark" :content="talkTitle" placement="top-start">
        <span class="talkTitleName">#{{talkTitle}}#</span >
      </el-tooltip>
      <div class="talkInteractionRankingList">
        <el-image :src="groupAvatar" fit="cover"/>
        <span  v-if="groupName.length < 13" >{{groupName}}</span>
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
        :data="talkRankingList">
        <el-table-column label="用户昵称"  >
          <template slot-scope="scope">
            <div class="talkInteractionRankingListGroup GroupNameList">
              <el-image :src="scope.row.avatar" fit="cover"/>
              <span >{{ scope.row.memberName }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="发言次数" prop="totalSpeakNumber" align="center"/>
      </el-table>

      <pagination
        v-show="total>0"
        :total="total"
        :page.sync="pageParams.pageindex"
        :limit.sync="pageParams.pagesize"/>
    </div>
  </div>
</template>

<script>
  import {pageQueryTalkMemberRankingList} from "../../../../api/interaction/talk"

  export default {
    name: "TalkInteractionRankingList",
    props: {
      chatRoomId: {
        type: String,
        require: true
      },
      talkId: {
        type: Number,
        require: true
      },
      talkTitle: {
        type: String,
        require: true
      }
    },
    data() {
      return {
        groupAvatar: '', // 群头像
        groupName: '', // 群名称
        //表单
        talkRankingList: [{
          groupName: '2323132',
          speakNumber: '11次',
          memberName: '',
          speakPeople: '20人',
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
        const params = {...this.pageParams, talkId: this.talkId, chatRoomId: this.chatRoomId};
        const result = await pageQueryTalkMemberRankingList(params);
        const {total, records, size, current} = result.data.page;
        this.total = parseInt(total);
        this.pageParams.pageindex = parseInt(current);
        this.pageParams.pagesize = parseInt(size);
        this.talkRankingList = records;
        this.groupName = result.data.groupName;
        this.groupAvatar = result.data.groupAvatar;
        this.loading = false;
      },

    },
    mounted() {
      this.pageQuery();
    }
  }
</script>

<style scoped lang="scss">
  .talkInteractionRankingList{
    padding: 10px;
    box-sizing: border-box;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    span{
      margin-left: 50px;
    }

  }
</style>
