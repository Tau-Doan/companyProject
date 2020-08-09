<template>
  <div class="app-container">
    <el-form ref="queryForm" :inline="true" >
      <el-form-item>
        <el-input   v-model="pageParams.keyWord" @keyup.enter.native="searchQuery" placeholder="快速查询" clearable/>
      </el-form-item>
      <el-form-item>
        <el-button  type="primary" icon="el-icon-search" size="mini" @click="searchQuery">搜索</el-button>
      </el-form-item>
      <el-form-item>
        <el-button  icon="el-icon-plus" size="mini" @click="toEdit(0)">新建欢迎语</el-button>
      </el-form-item>
    </el-form>

    <el-table
      v-loading="loading"
      element-loading-text="加载中......"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.8)"
      :data="welcomes">
      <el-table-column label="入群欢迎语"  :show-overflow-tooltip="true"  >
        <template slot-scope="scope">
          <el-image  v-if="scope.row.content.indexOf('http') !== -1" :src="scope.row.content" style="width: 80px"/>
          <span v-else> {{scope.row.content}}</span>
        </template>
      </el-table-column>
      <el-table-column label="目标群" align="center" >
        <template slot-scope="slot">
            <span>{{slot.row.groupNumber}}个
              <el-button type="text"  size="medium" @click="getGroupList(slot.row.id)">查看</el-button>
            </span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="slot">
          <div class="operate">
            <el-button
              size="mini"
              type="text"
              icon="el-icon-edit"
              @click="toEdit(slot.row.id)"
            >修改</el-button>
            <el-button
              size="mini"
              type="text"
              icon="el-icon-delete"
              @click="delWelcome(slot.row.id)"
            >删除</el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>


    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="pageParams.page"
      :limit.sync="pageParams.pageSize"
      @pagination="pageQuery"/>

    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="showSelectGroup"
      title="目标群"
      width="30%">
      <select-group v-if="showSelectGroup" :isSelect="false" :depts="deptList"/>
    </el-dialog>
  </div>
</template>

<script>
  import {pageQuery,getGroupList,del,findGroup} from '@/api/groupDaily/groupWelcome'
  import SelectGroup from '@/components/SelectGroup'

  export default {
    name: "GroupWelcome",
    components: {
      SelectGroup
    },
    data(){
      return {
        deptList: [],
        showSelectGroup: false,
        welcomes: [],
        loading: false,//加载效果开关
        keyWord: '',  //查询关键字
        isAll: false,//全选反选传递
        dialogView: false,//dialog开关
        pageParams: {
          page: 1, // 当前页
          size: 10, // 每页记录数
          keyWord: ''
        },
        total: 0
      }
    },
    methods: {
      /**
       * 跳转编辑页面
       */
      // groupDaily/groupWelcome/edit
      toEdit(id){
        this.$router.push(`/groupDaily/groupWelcome/${id}`)
      },
      //搜索查询
      searchQuery(){
        this.pageParams.page = 1;
        this.pageQuery()
      },
      // 删除欢迎语
      delWelcome(id) {
        this.$confirm(`您确定要删除此欢迎语嘛？`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          const result = await del({id});
          this.$message.success('删除成功');
          this.pageQuery();
        })
      },
      /**
       * 分页查询
       */
      async pageQuery() {
        this.loading = true;
        const result = await pageQuery(this.pageParams);
        const {total, records, size, current} = result.data;
        this.total = total;
        this.pageParams.page = current;
        this.pageParams.size = size;
        this.welcomes = records;
        this.loading = false;

      },
      /*
      点检跳转多少页面
      *
      /
      /**
       * 获取目标群数据
       */
      async getGroupList(id) {
        const result = await findGroup({id});
        this.deptList = result.data;
        console.log( this.deptList )
        this.showSelectGroup = true;
      },
    },
    //解决页面缓存不刷新，更新数据
    activated: function() {
      this.pageQuery()
    },
    mounted() {
      this.pageQuery();
    },
  }

</script>
