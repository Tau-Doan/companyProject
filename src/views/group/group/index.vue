<template>
  <div class="app-container">
    <el-form :model="pageParams" ref="queryForm" :inline="true" label-width="68px">
      <el-form-item label="所属用户" prop="organization">
        <el-input
          v-model="pageParams.organization"
          placeholder="请输入所属用户"
          clearable
          size="small"
          style="width: 240px"
          @keyup.enter.native="handleQuery"/>
      </el-form-item>
      <el-form-item label="群名称" prop="groupName">
        <el-input
          v-model="pageParams.groupName"
          placeholder="请输入群名称"
          clearable
          size="small"
          style="width: 240px"
          @keyup.enter.native="handleQuery"/>
      </el-form-item>
      <el-form-item label="群主昵称" prop="groupOwnerNickname">
        <el-input
          v-model="pageParams.groupOwnerNickname"
          placeholder="请输入群主昵称"
          clearable
          size="small"
          style="width: 240px"
          @keyup.enter.native="handleQuery"/>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="updateGroup">刷新群组</el-button>
      </el-form-item>
    </el-form>


    <el-table v-loading="loading" :data="groupList" >
      <el-table-column label="群名称"  prop="groupIds" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <div class="table-photos">
            <el-image
              :src="scope.row.headUrl"
              fit="fit"/>
            <span>{{scope.row.name}}  </span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="群主昵称" prop="name" :show-overflow-tooltip="true" >
        <template slot-scope="scope">
          <div class="table-photos">
            <el-image
              :src="scope.row.memberHeadImgUrl"
              fit="fit"/>
            <span>{{scope.row.nickname}}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="群人数" align="center" prop="number"/>
      <el-table-column label="是否直播群" align="center" prop="ifLiveGroup" :formatter="liveGroupFormat"/>
      <el-table-column label="所属用户" align="center" prop="userName"  />
      <el-table-column label="群成员信息" align="center" >
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="updateGroupMember(scope.row.id)"
          >刷新群成员信息</el-button>
        </template>
      </el-table-column>
<!--      <el-table-column label="手机号码" align="center" prop="contactInformation" width="120" />-->
<!--      <el-table-column label="所属机构" align="center" prop="deptName"/>-->
      <el-table-column label="操作" align="center" width="300" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="updateGroupUrl(scope.row.id)"
          >更新群二维码</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-circle-check"
            @click="openGroupInfo(scope.row.id,1)"
          >复制群二维码</el-button>
          <el-button
          size="mini"
          type="text"
          icon="el-icon-delete"
          @click="openGroupInfo(scope.row,2)"
          v-if="user.roles[0]==='admin' "
        >编辑群信息</el-button>
<!--          <el-button-->
<!--            size="mini"-->
<!--            type="text"-->
<!--            icon="el-icon-delete"-->
<!--            @click="updateGroupMember(scope.row.id)"-->
<!--          >刷新群成员信息</el-button>-->
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="delGroup(scope.row.id)"
            v-if="user.roles[0]==='admin' "
          >删除群组</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="pageParams.pageindex"
      :limit.sync="pageParams.pagesize"
      @pagination="handleQuery"
    />
    <el-dialog :title="title" :visible.sync="openComponent" width="500px">
      <component v-if="openComponent" :groupId="groupId" @close="closeDialog"  :handleQuery="handleQuery"   :data="groupMessage" :is="components[type]" />
    </el-dialog>
  </div>
</template>

<script>
  import {pageQuery,updateGroup,updateQRCode,updateGroupMember,deleteGroup} from '../../../api/groupDaily/group';
  import QRCode from "./components/QRCode";
  import Edit from './components/Edit'
  import {mapState} from 'vuex'
  export default {
    name: "Group",
    components:{
      QRCode,
      Edit
    },
      data(){
          return{
            groupMessage:{},
            groupId:0,
            title:'',//弹框标题
            openComponent:false,//显示弹框
            components: ['QRCode','Edit'],
            type:0,

            loading:false,
            groupList:[],//群组列表数据
            // 非单个禁用
            single: true,
            // 非多个禁用
            multiple: true,
            // 查询参数
            pageParams: {
              groupOwnerNickname:'',
              deptId: "",
              name: "",
              nickname: "",
              pageindex: 1,
              pagesize: 10
            },
            total: 0,  // 总条数
          }
      },
      computed:{
        ...mapState(['user'])
      },
      methods:{

          //分页查询
        async handleQuery(){
          this.loading = true;
          const result = await pageQuery(this.pageParams);

          // const result = await pageQuery();
          const {total, records, size, current} = result.data;
          this.total = total;
          this.pageParams.page = current;
          this.pageParams.size = size;
          this.groupList = records;
          this.loading = false;
        },

        //刷新群组信息
        async updateGroup() {
          await updateGroup({});
          this.$message.success("群组信息刷新成功！");

        },

       /* //二维码的弹框
        copyGroupUrl(id) {
          this.openComponent = true;
          this.title = '扫描该二维码可加人入群';
          this.type=0;
          this.groupId = id;
        },

        editGroupDept(scopeData) {
          this.openComponent = true;
          this.title = '编辑群信息';
          this.type=1;
          this.groupMessage  = scopeData;
        },*/
        openGroupInfo(data,title){
          this.openComponent = true;
          switch (title) {
            case 1:
              this.title = '扫描该二维码可加人入群';
              this.groupId = data;
              this.type = 0;
              break;
            case 2:
              this.title = '编辑群信息';
              this.groupMessage = data;
              this.type = 1;
              break;
          }
        },



        //更新二维码
        async updateGroupUrl(id) {
          await updateQRCode({id});
          this.$message.success("二维码正在生成中....");

        },
        async updateGroupMember(id){
          await updateGroupMember({id});
          this.$message.success("刷新成功");
        },
       async delGroup(id){
         try {
          await this.$confirm('此操作将永久删除该群列表, 是否继续?', '提示', {
             confirmButtonText: '确定',
             cancelButtonText: '取消',
             type: 'warning'
           });
           await deleteGroup({id});
           this.handleQuery()
           this.$message.success("删除成功");
         } catch (e) {
         }
        },
        closeDialog(){
          this.openComponent =false;
        },
        liveGroupFormat(row, column) {
          if(1 === row.ifLiveGroup) {
            return "是";
          }
          return "否";
        }

      },
    mounted() {
          this.handleQuery()
    }

  }
</script>
<style lang="scss" scoped>
  .table-photos{
    .el-image{
      /*width: 45%;*/
    }
    span{
      width: 50%;
      display: inline-block;
      overflow: hidden;
      text-overflow:ellipsis;
      white-space: nowrap
    }
  }
  .small-padding{
    display: flex;
    justify-content: flex-start;
  }

</style>
