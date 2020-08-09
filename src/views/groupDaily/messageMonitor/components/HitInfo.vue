<template>
  <div class="app-container">
      <el-table :data="matchingMessageList">
        <el-table-column label="监控内容" prop='content'>
        </el-table-column>
        <el-table-column label="聊天内容" prop='messageContent' show-overflow-tooltip/>
        <el-table-column label="所属微信群" width="220px">
          <template slot-scope="slot">
            <div class="wxGroup">
              <el-image
                :src="slot.row.headUrl"
                fit="fit"/>
              <span class="name">{{slot.row.name}}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="发言人" prop='createNickname'>
        </el-table-column>
        <el-table-column label="时间" prop='dateTime' width="160">
        </el-table-column>
      </el-table>
  </div>

</template>
<script>
  import {getMatchingMessageList} from '../../../../api/groupDaily/messageMonitor';

  export default {
    name: "HitInfo",
    props: {
      id: Number
    },
    data() {
      return {
        matchingMessageList: []
      }
    },
    mounted() {
      this.getMatchingMessageList(this.id);
    },
    methods: {
      async getMatchingMessageList(id) {
        const result = await getMatchingMessageList({id});
        this.matchingMessageList = result.data;
      }
    }
  }
</script>
<style scoped lang="scss">

  .wxGroup {
    display: flex;
    justify-content: flex-start;
    align-items: center;

    span {
      width: 120px;
      display: flex;
      justify-content: flex-start;
      margin-left: 20px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .el-image {
      width: 40px;
      height: 40px
    }
  }

</style>
