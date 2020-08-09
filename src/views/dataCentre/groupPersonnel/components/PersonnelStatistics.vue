<template>
  <!--  人员统计-->
  <div>
    <div class="groupPersonnel">
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
          @change="timeQuery"
          value-format="yyyy-MM-dd"
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
        :data="personnelStatistics">
        <el-table-column label="群名称" prop="name"  :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <div class="groupActivityList GroupNameListCircular">
              <el-image
                :src="scope.row.avatar"
                fit="cover"/>
                <span >{{scope.row.name}}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="群人数" prop="groupMemberNumber" align="center"/>
        <el-table-column label="入群人数" prop="enterGroupNumber" align="center"/>
        <el-table-column label="退群人数" prop="exitGroupNumber" align="center"/>
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
  import {pageQueryGroupMemberStatistics} from "../../../../api/dataCentre/groupPersonnel";

  export default {
    name: "personnelStatistics",
    props: {
      groups: {
        type: Array,
        require: true
      }
    },
    data() {
      return {
        groupIndex: null,
        loading: false,
        pageParams: {
          pageindex: 1, // 当前页
          pagesize: 10, // 每页记录数
          startDate: '',
          endDate: '',
          chatRoomId: '',
        },
        total: 0,//总记录数
        personnelStatistics: [],
        chatRoomId: '',
        time: []
      }
    },
    methods: {
      deptIdQuery() {
        this.pageParams.chatRoomId = this.groupIndex?this.groups[this.groupIndex].chatRoomId : '';
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
        const result = await pageQueryGroupMemberStatistics(this.pageParams);
        const {total, records, size, current} = result.data;
        this.total = total;
        this.pageParams.pageindex = current;
        this.pageParams.pagesize = size;
        this.personnelStatistics = records;
        this.loading = false;
      },
      exportedContent() {
        const fileName = this.groupIndex ? `${this.groups[this.groupIndex].name}_上下级统计报表` : '上下级统计报表';
        this.exportExcelFile('/admin/statistics/exportGroupMemberStatistics2Excel', this.pageParams,fileName)
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
    justify-content: flex-start;
    align-items: center;
    span {
      max-width: 280px;
      padding-left: 20px;;
    }
  }

  .groupPersonnel {
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
  .el-image{
 position: relative;
    display: inline-block;
    overflow: hidden
  }

</style>
