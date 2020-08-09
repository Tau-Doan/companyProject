<template>
  <div>
    <div class="groupActivitySelect">
      <div>
        <span class="firstSpan">群组筛选</span>
        <el-select v-model="groupIndex" @change="deptIdQuery" clearable placeholder="请选择">
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
          value-format="yyyy-MM-dd"
          @change="timeQuery"
          v-model="time"
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
        :data="groupActivitys">
        <el-table-column label="群名称" prop="name" align="center" width="331">
          <template slot-scope="scope">
            <div class="groupActivityList GroupNameListCircular">
              <el-image
                :src="scope.row.avatar"
                fit="cover"/>
              <span>{{scope.row.name}}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="群人数" prop="groupMemberNumber" align="center"/>
        <el-table-column label="发言人数" prop="speckMemberNumber" align="center"/>
        <el-table-column label="发言数" prop="speckNumber" align="center"/>
        <el-table-column label="发言率" prop="speckPercentage" align="center"/>
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
</template>

<script>
  import {pageQueryGroupLivenessStatistics} from "../../../../api/dataCentre/groupActivity"
  export default {
    name: "GroupActivityList",
    props: {
      groups: {
        type: Array,
        require: true
      }
    },
    data() {
      return {
        groupIndex: null,
        time: [],
        loading: false,
        pageParams: {
          pageindex: 1, // 当前页
          pagesize: 10, // 每页记录数
          startDate: '',
          endDate: '',
          chatRoomId: '',
        },
        chatRoomId: '',
        total: 0,//总记录数
        groupActivitys: [],
      }
    },

    methods: {
      //通过id查询
      deptIdQuery() {
        this.pageParams.chatRoomId = this.groupIndex !== null && this.groupIndex !== '' ? this.groups[this.groupIndex].chatRoomId : null;
        this.pageParams.pageindex = 1;
        this.pageQuery();
      },
      //统计时间
      timeQuery(data) {
        !data && (data = []);
        const [startDate, endDate] = data;
        this.pageParams.startDate = startDate;
        this.pageParams.endDate = endDate;
        this.pageParams.pageindex = 1;
        this.pageQuery();
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
        const result = await pageQueryGroupLivenessStatistics(this.pageParams);
          const {total, records, size, current} = result.data;
          this.total = parseInt(total);
          this.pageParams.pageindex = parseInt(current);
          this.pageParams.pagesize = parseInt(size);
          this.groupActivitys = records;
          this.loading = false;
      },
      exportedContent() {
        const fileName =  this.groupIndex !== null && this.groupIndex !== '' ? `${this.groups[this.groupIndex].name}_群活跃度统计报表` : '群活跃度统计报表';
        this.exportExcelFile('/admin/statistics/exportGroupLiveness2Excel', this.pageParams,fileName)
      }

    },
    mounted() {
      this.pageQuery();
    }

  }
</script>

<style lang="scss" scoped>
  .groupActivityList {
    display: flex;
    justify-content: space-around;
    align-items: center;
    span {
      padding-left: 20px;
      max-width: 210px;  
    }
    // .el-image{
    // }
  }

  .groupActivitySelect {
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
