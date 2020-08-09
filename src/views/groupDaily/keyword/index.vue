<template>
  <div class="app-container">
    <el-form :model="pageParams" ref="queryForm" :inline="true">
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
        <el-button icon="el-icon-plus" @click="toEdit(0)" size="mini">新建关键词</el-button>
      </el-form-item>
    </el-form>
    <el-table v-loading="loading" :data="keywords">
      <el-table-column label="关键词" prop="keyword" :show-overflow-tooltip="true" width="300"/>
      <el-table-column label="匹配模式" prop="pattern" width="150">
        <template slot-scope='scope'>
          <span>{{scope.row.pattern===1?'精确匹配':'模糊匹配'}}</span>
        </template>
      </el-table-column>
      <el-table-column label="回复内容" prop="content" :show-overflow-tooltip="true" width="300">
        <template slot-scope='scope'>
          <span v-if="scope.row.contentType === 1"> {{scope.row.content}} </span>
          <el-image
            v-else
            :src="scope.row.content"
            fit="cover">
          </el-image>
        </template>
      </el-table-column>
      <el-table-column label="目标群" prop="contactPerson">
        <template slot-scope='scope'>
          {{scope.row.groupNumber}}个
          <el-button type="text" @click="getGroupList(scope.row.id)">查看</el-button>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="380" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="toEdit(scope.row.id)"
          >修改
          </el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="delKeyword(scope.row.id)"
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
      :visible.sync="showSelectGroup"
      title="目标群"
      width="30%">
      <select-group v-if="showSelectGroup" :isSelect="false" :depts="deptList"/>
    </el-dialog>

  </div>
</template>

<script>
  import SelectGroup from '@/components/SelectGroup'
  import {pageQuery, deleteKeyword, getGroupList,findGroup} from '@/api/groupDaily/keyword'
  import HitInfo from "./components/HitInfo";
  export default {
    name: "Keyword",
    components: {
      SelectGroup,
      HitInfo
    },
    data() {
      return {
        id: null, // 消息监控id
        componentTitle: '',
        show: false, //dialog开关
        deptList: [],
        showSelectGroup: false,
        loading: false,
        keywords: [],
        pageParams: {
          pages: 1, // 当前页
          size: 10, // 每页记录数
          keyWord: ''
        },
        total: 0
      }
    },
    methods: {
      // 搜索查询
      searchQuery() {
        this.pageParams.pages = 1;
        this.pageQuery();
      },
      //分页查询
      async pageQuery() {
        this.loading = true;
        const result = await pageQuery(this.pageParams);
        const {total, records, size, current} = result.data;
        this.total = total;
        this.pageParams.pages = current;
        this.pageParams.size = size;
        this.keywords = records;
        this.loading = false;
      },
      //删除
      async delKeyword(id) {
        try {
          await this.$confirm(`您确定要删除此关键字记录吗？`, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
          });
          await deleteKeyword({id});
          this.$message.success('删除成功');
          this.pageQuery();
        } catch (e) {
        }
      },
      // groupDaily/keyword/Edit/index
      //跳转编辑页面
      toEdit(id) {
        this.$router.push(`/groupDaily/keyword/${id}`)
      },



      //查询目标群
      async getGroupList(id) {
        // const result = await getGroupList({id});
        // this.deptList = result.data;
        // this.showSelectGroup = true;
        const result = await  findGroup( {id})
        this.deptList = result.data;
        console.log( this.deptList )
        this.showSelectGroup = true;

      },
    },
    //解决页面缓存不刷新，更新数据
    activated: function() {
      this.pageQuery()
    },
     async mounted() {
      this.pageQuery();
    },
  }
</script>

<style lang="scss" scoped>
  .clusterNameReply {
    display: flex;
    justify-content: flex-start;
    line-height: 60px;

    .el-image {
      width: 60px;
      height: 60px
    }

    span {
      width: 150px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
</style>
