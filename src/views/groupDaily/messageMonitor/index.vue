<template>
  <div class="app-container">
    <el-form ref="queryForm" :inline="true">
      <el-form-item>
        <el-input
          v-model="pageParams.keyWord"
          placeholder="快速查询"
          clearable
          size="small"
          style="width: 240px"
          @keyup.enter.native="searchQuery"/>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="searchQuery">搜索</el-button>
        <el-button icon="el-icon-plus" @click="toEdit(0)" size="mini">新建监控内容</el-button>
      </el-form-item>
    </el-form>

    <el-table :data="messageMonitors">
      <el-table-column label="监控内容" prop='content'>
      </el-table-column>
      <el-table-column label="目标群">
        <template slot-scope="slot">
          <span>{{slot.row.groupNumber}}个</span>
          <el-button @click='showComponent(1,slot.row.id)' type="text"   icon="el-icon-view">查看</el-button>
        </template>
      </el-table-column>
      <el-table-column label="命中次数">
        <template slot-scope="slot">
          <span>{{slot.row.matchingNumber}}次</span>
          <span v-if='slot.row.matchingNumber>0'>
            <el-button type="text" @click='showComponent(2,slot.row.id)' icon="el-icon-view">查看</el-button>
          </span>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope='slot'>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="toEdit(slot.row.id)"
          >修改
          </el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="delMessageMonitor(slot.row.id)"
          >删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="pageParams.page"
      :limit.sync="pageParams.size"
      @pagination="pageQuery"/>

    <el-dialog
      :close-on-click-modal="false"
      :width="dialogWidth"
      :title="componentTitle"
      :visible.sync="show">
      <component :id="id" :is="componentName" v-if="show" :isSelect="false" :depts="deptList"/>
    </el-dialog>
  </div>
</template>

<script>
  import SelectGroup from '@/components/SelectGroup';
  import HitInfo from "./components/HitInfo";

  import {getGroupList,pageQuery,del} from '../../../api/groupDaily/messageMonitor';
  import {findGroup} from '../../../api/group'
  export default {
    name: "MessageMonitor",
    data() {
      return {
        dialogWidth:'',
        id: null, // 消息监控id
        componentTitle: '',
        total: 0,
        componentName: 'selectGroup',
        messageMonitors: [],
        loading: false,
        deptList: [],
        pageParams: {
          page: 1, // 当前页
          size: 10, // 每页记录数
          keyWord: ''
        },
        show: false, //dialog开关
        dialog: 'sel_group',//显示的组件
      }
    },
    components: {
      SelectGroup,
      HitInfo
    },
    methods: {

      toEdit(id){
        this.$router.push(`/groupDaily/messageMonitor/${id}`)
      },
      //搜索查询
      searchQuery(){
        this.pageParams.page = 1;
        this.pageQuery()
      },
      /**
       * 显示组件
       * @param type
       * @param id
       */
      showComponent(type, id) {
        switch (type) {
          case 1: {
            this.componentTitle = '目标群';
            this.getGroupList(id);
            this.componentName = 'SelectGroup';
            this.dialogWidth='30%'
            break;
          }
          case 2: {
            this.id = id;
            this.componentTitle = '命中记录';
            this.componentName = 'HitInfo';
            this.show = true;
            this.dialogWidth='650px'
            break;
          }
        }

      },

      async getGroupList(id) {
        const result = await getGroupList({id});
        this.deptList = result.data;
        this.show = true;
      },

      async pageQuery() {
        this.loading = true;
        const result = await pageQuery(this.pageParams);
        const {total, records, size, current} = result.data;
        this.total = total;
        this.pageParams.page = current;
        this.pageParams.size = size;
        this.messageMonitors = records;
        this.loading = false;
      },
      async delMessageMonitor(id) {
        try {
          await this.$confirm(`您确定要删除嘛？`, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          });
          await del({id});
          this.$message.success('删除成功');
          this.pageQuery();
        } catch (e) {
        }
      },
    },
    //解决页面缓存不刷新，更新数据
    activated: function() {
      this.pageQuery()
    },
    mounted() {
      this.pageQuery();
    }
  }
</script>

<style scoped>

</style>
