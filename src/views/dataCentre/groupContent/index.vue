<template>
  <div class="app-container">
    <div class="titleHeader">
      <span>群内容统计</span>
      <el-divider/>
    </div>
    <div class="groupContentStatistics">
      <div>
        <span class="firstSpan">群组筛选</span>
        <el-select v-model="groupIndex" @change="groupContentStatistics" clearable placeholder="请选择">
          <el-option
            v-for="(item,index) in groups"
            :key="index"
            :label="item.name"
            :value="index">
          </el-option>
        </el-select>
      </div>
      <div>
        <span>统计时间</span>
        <el-date-picker
          @change="timeSelection"
          v-model="statisticsTime"
          value-format="yyyy-MM-dd"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期">
        </el-date-picker>
      </div>
      <el-button type="primary" @click="exportedContent">导出</el-button>
    </div>
    <div id="table">
      <el-table
        v-loading="loading"
        element-loading-text="拼命加载中"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(0, 0, 0, 0.8)"
        :data="groupContentList">
        <el-table-column label="内容类型" prop="typeAlias" align="center"/>
        <el-table-column label="文字" prop="textNumber" align="center"/>
        <el-table-column label="图片" prop="photoNumber" align="center"/>
        <el-table-column label="语音" prop="audioNumber" align="center"/>
        <el-table-column label="链接" prop="linkNumber" align="center"/>
        <el-table-column label="其他" prop="otherNumber" align="center"/>
        <el-table-column label="合计" prop="totalMessageNumber" align="center"/>
      </el-table>
    </div>

  </div>
</template>

<script>
  import {getGroupContentStatistics,findAll} from "../../../api/dataCentre/groupContent"
  export default {
    name: "GroupContent",
    data() {
      return {
        groups: [],
        groupIndex: null,
        loading: false,
        groupContentList: [],
        statisticsTime: [],//时间
        params: {
          startDate: '',
          endDate: '',
          chatRoomId: '', // 群id
        }
      }
    },
    methods: {
      timeSelection(date) {
        !date && (date = []);
        const [startDate, endDate] = date;
        this.params.startDate = startDate;
        this.params.endDate = endDate;
        this.groupContentStatistics()

      },
      //群组列表
      async findGroups() {
          const result = findAll();
          this.groups = result.data;
          this.groups.unshift({name:'全部',deptId:0})
      },
      async groupContentStatistics() {
        this.params.chatRoomId = this.groupIndex ? this.groups[this.groupIndex].chatRoomId : '';
        this.loading = true;
        const result = await getGroupContentStatistics(this.params);
        this.groupContentList = result.data;
        this.loading = false;
      },
      /**
       * 导出数据
       */
      exportedContent() {
        const fileName = this.groupIndex ? `${this.groups[this.groupIndex].name}_群内容统计` : '群内容统计';
        this.exportExcelFile('admin/statistics/exportGroupContentStatistics2Excel', this.params,fileName)
      }
    },
    mounted() {
      this.findGroups();
      this.groupContentStatistics();
    }
  }
</script>

<style lang="scss" scoped>
  .groupContentStatistics {
    display: flex;
    justify-content: flex-start;
    flex-wrap: nowrap;
    margin-bottom: 20px;
    margin-top: 20px;

    span {
      margin: 0 20px 0 50px;
    }

    .firstSpan {
      margin-left: 0;
    }

    .el-button {
      margin-left: 50px;
    }
  }


</style>
