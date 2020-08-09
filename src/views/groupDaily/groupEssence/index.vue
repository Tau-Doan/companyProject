<template>
  <div class="app-container">
    <el-form ref="queryForm" :inline="true">
      <el-form-item>
        <el-input
          v-model="pageParams.name"
          placeholder="快速查询"
          clearable
          size="small"
          style="width: 240px"
          @keyup.enter.native="searchQuery"/>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="searchQuery">搜索</el-button>
        <el-button icon="el-icon-plus" @click="toEdit(0)" size="mini">生成群精华</el-button>
      </el-form-item>
    </el-form>


    <el-table
      v-loading="loading"
      element-loading-text="拼命加载中"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.8)"
      :data="groupEssences">
      <el-table-column label="群精华链接" width="330" align="center">
        <template slot-scope="scope">
          <div class="essenct_menu GroupNameList">
            <el-image
              style="width: 60px; height: 60px"
              :src="scope.row.image"
              fit="cover"></el-image>
            <span>{{scope.row.name}}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="目标群" align="center">
        <template slot-scope='scope'>
          {{scope.row.groupNumber}}个
          <el-button type="text" @click="showComponent(scope.row)"   icon="el-icon-edit">修改</el-button>
        </template>
      </el-table-column>
      <el-table-column prop="number" label="总浏览量" align="center"></el-table-column>
      <el-table-column label="创建时间" align="center" prop="createTime"/>
      <el-table-column label="操作" align="center">
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
              @click="delGroupEssence(scope.row.id)"
            >删除
            </el-button>
            <el-button size="mini"
                       type="text"
                       icon="el-icon-s-promotion"
                       @click="handleShare(scope.row.id,scope.row.shareGroupIds)"
            >一键分享</el-button>
        </template>
      </el-table-column>

    </el-table>
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="pageParams.pageindex"
      :limit.sync="pageParams.pagesize"
      @pagination="pageQuery"/>

    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="dialogView"
      title="目标群"
      width="360px">
      <div slot="title" class="dialog-footer">
        <h2 class="mt0">
          <span>选择目标群</span>
          <el-checkbox @change="updateAllGroupSelectStatus" v-model="isSelectAll" >全选
          </el-checkbox>
        </h2>
      </div>
      <selectGroup
        :close="hideComponent"
        v-if="dialogView"
        ref="selectGroup"
        :updateSelectAllStatus="updateSelectAllStatus"
        :isSelect="true"
        :isSelectAll="true"
        :saveComponentData="saveComponentData"
        :initGroupList="initGroupList"
      ></selectGroup>
    </el-dialog>
  </div>
</template>

<script>
  import SelectGroup from '@/components/SelectGroup';

  import {pageQuery,del,share,addShareGroups} from '../../../api/groupDaily/groupEssence';

  export default {
    name: "GroupEssence",
    components: {
      SelectGroup
    },
    data() {
      return {
        loading:false,
        dialogTitle: '选择群组',
        initGroupList: [], // 初始化目标群,解决dialog未加载调用不了子组件方法回显数据
        dialogView: false,
        isShow: false,
        isSelectAll: false,
        isShowGroupListPage: false,
        groupList: [],
        pageParams: {
          pagesize: 10, //每页的数据条数
          pageindex: 1,
          name: '',
        },
        groupEssenceId: null,
        selectGroupType: 1, // 1只回显群数据 2可以修改数据
        deptList: [],
        total: 0,
        groupEssences: [],
      }
    },
    mounted() {
      this.pageQuery();
    },
    methods: {
      /**
       * 跳转编辑页面
       */
      toEdit(id){
        this.$router.push(`/groupDaily/groupEssence/${id}`)
      },
      //搜索查询
      searchQuery(){
        this.pageParams.pageindex = 1;
        this.pageQuery()
      },
      // 删除欢迎语
      async delGroupEssence(id) {
        try {
          await this.$confirm(`您确定要删除此群精华链接嘛？`, '提示', {
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
      // 干掉第一个逗号
      handlerStrFirstComma(groupIds) {
        const index = groupIds.indexOf(',');
        return index === 0 ? groupIds.substr(1) : groupIds;
      },
      /**
       * 分享
       */
      handleShare(id, shareGroupIds) {
        // 没有群id则让用户选择群id
        if (!shareGroupIds) {
          this.groupEssenceId = id;
          this.selectGroupType = 2;
          this.dialogView = true;
          return;
        }

        this.share(id);
      },
      async share(id){
        try {
          await this.$confirm(`您确定分享吗？`, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          });

          const result = await share({id});
          this.$message.success(result.message);
        } catch (e) {
        }
      },

      hideComponent() {
        this.dialogView = false;
      },
      async saveComponentData(data) {
        this.groupList = data;

        const groupIds = this.groupList.map(item => item.groupId);
        const id = this.groupEssenceId;

        await addShareGroups({id,groupIds})
        await share({id});

        this.pageQuery();
        this.$message.success('操作成功');
        this.dialogView = false;
      },
      /**
       * 更新所有群选中状态
       */
      updateAllGroupSelectStatus() {
        this.$refs.selectGroup.updateAllGroupSelectStatus(this.isSelectAll);
      },
      /**
       * 更新选中状态
       */
      updateSelectAllStatus(isSelectAll) {
        this.isSelectAll = isSelectAll;
      },
      handleEnter(isEnter) {
        return this.isShow = isEnter;
      },

      async pageQuery() {
        this.loading = true;
        const result = await pageQuery(this.pageParams);
        const {total, records, size, current} = result.data;
        this.total = total;
        this.pageParams.pageindex = current;
        this.pageParams.pagesize = size;
        this.groupEssences = records;

        // 处理逗号
        this.groupEssences.forEach(item => {
          const shareGroupIds = this.handlerStrFirstComma(item.shareGroupIds);
          item.shareGroupIds = shareGroupIds;
          item.groupNumber = shareGroupIds ? shareGroupIds.split(',').length : 0;
        });

        this.loading = false;
      },
      // 显示组件
      showComponent(groupEssence) {
        const {shareGroupIds,id} = groupEssence;
        this.groupEssenceId = id;
        this.initGroupList = shareGroupIds.split(',').map(item => ({groupId: parseInt(item)}));
        this.dialogView = true;
      },

    }

  }
</script>

<style scoped lang="scss">
  .GroupNameList{
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
    .el-image{
      width: 30%;
    }
    >span{
      width: 70%;

    }
  }


</style>
