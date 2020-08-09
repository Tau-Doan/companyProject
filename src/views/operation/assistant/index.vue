<template>
    <div class="app-container">
<!--      <el-form :inline="true" >-->
<!--        <el-form-item label="状态">-->
<!--          <el-select v-model="pageParams.status" placeholder="请选择"  clearable>-->
<!--            <el-option-->
<!--              v-for="item in options"-->
<!--              :key="item.value"-->
<!--              :label="item.label"-->
<!--              :value="item.value">-->
<!--            </el-option>-->
<!--          </el-select>-->
<!--        </el-form-item>-->
<!--        <el-form-item label="名称">-->
<!--          <el-input v-model="pageParams.nickName" placeholder="请输入内容" clearable/>-->
<!--        </el-form-item>-->

<!--        <el-form-item>-->
<!--          <el-button type="primary" plain @click="queryAssistantNumber">查询</el-button>-->
<!--          <el-button  plain @click="refreshAssistantNumber">刷新助手号</el-button>-->
<!--        </el-form-item>-->
<!--      </el-form>-->


<!--      <el-table-->
<!--        v-loading="loading"-->
<!--        element-loading-text="拼命加载中"-->
<!--        element-loading-spinner="el-icon-loading"-->
<!--        element-loading-background="rgba(0, 0, 0, 0.8)"-->
<!--        :data="assistantNumberManagements">-->
<!--        <el-table-column  label="助手号" class="sensitiveWordGroup">-->
<!--          <template slot-scope="scope">-->
<!--            <div class="sensitiveWordGroup">-->
<!--              <el-image-->
<!--                style="width:100px; height: 100px"-->
<!--                :src="scope.row.headImgUrl"-->
<!--                fit="fit"/>-->
<!--              <span class="msg-name">{{scope.row.nickName}}</span>-->
<!--            </div>-->
<!--          </template>-->
<!--        </el-table-column>-->
<!--        <el-table-column  label="覆盖群组" prop="name">-->
<!--          <template slot-scope="scope">-->
<!--            <div>-->
<!--              <span>{{scope.row.groupNumber}}</span>-->
<!--              [<el-button @click="getGroupList(scope.row.id)" type="text">详情</el-button>]-->
<!--            </div>-->
<!--          </template>-->
<!--        </el-table-column>-->
<!--        <el-table-column  label="覆盖人数" prop="sumNuserCount"/>-->
<!--        <el-table-column  label="状态" prop="status">-->
<!--          <template slot-scope="scope">-->
<!--            <span v-if="scope.row.status==10">正常</span>-->
<!--            <span v-else-if="scope.row.status==11" class="abnormal" >异常</span>-->
<!--          </template>-->
<!--        </el-table-column>-->
<!--      </el-table>-->

<!--      <pagination-->
<!--        v-show="total>1"-->
<!--        :total="total"-->
<!--        :page.sync="pageParams.pageindex"-->
<!--        :limit.sync="pageParams.pagesize"/>-->

<!--      <el-dialog-->
<!--        :close-on-click-modal="false"-->
<!--        :visible.sync="isShowAssistantNumberManagement"-->
<!--        :title="HelperName[type]"-->
<!--        width="700px"-->
<!--        center>-->
<!--        <component  v-if="isShowAssistantNumberManagement"-->
<!--                    :close="close"-->
<!--                    :purpose="purpose"-->
<!--                    :isSelect="false"-->
<!--                    :depts="deptList"-->
<!--                    :id="id"-->
<!--                    :is="components[type]" />-->
<!--      </el-dialog>-->
<!--      第三方链接-->
      <iframe name="my-iframe" id="my-iframe"
              src="http://wx.iutils.cn/#/autoLogin?username=yike&password=MjEyMThjY2E3NzgwNGQyYmExOTIyYzMzZTAxNTExMDU=&redirect=%2FmyRobot"
              frameborder="0"
              width="100%" height="700px"
              scrolling="no">第三方链接</iframe>
    </div>
</template>

<script>
  import DifferentUse from "./components/DifferentUse"
  import SelectGroup from '@/components/SelectGroup'

  import {pageQuery,getGroupList,refershRobot} from "../../../api/operation/assistant"
  export default {
    components: { DifferentUse, SelectGroup},
    name: "assistant",
    data(){
      return{
        deptList: [],
        id:0,
        purpose: 0,//正常
        isShowAssistantNumberManagement:false,
        loading:false,
        components: ['DifferentUse','SelectGroup'],
        HelperName:['用途','覆盖群组'],
        type:0,
        assistantNumberManagements:[],
        options: [{value: '10', label: '正常'},
          {value: '11', label: '异常'}],//下拉框
        pageParams: {
          pageindex: 1, // 当前页
          pagesize: 10,
          status: null,// 每页记录数
          nickName:'',
        },
        total: 1, // 总页数

      }
    },
    methods:{
      //刷新助手号
      async refreshAssistantNumber(){
          await refershRobot();
          this.$message({
            message: '刷新成功',
            type: 'success'
          });
          this.pageQuery();
      },
      close(){
        this.isShowAssistantNumberManagement =false;
        this.pageQuery();
      },

      //查询助手号
      queryAssistantNumber(){
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
      //分页查询
      async pageQuery(){
        this.loading = true;
        const result = await pageQuery(this.pageParams);
          const {total, records, size, current} = result.data;
          this.total = total;
          this.pageParams.pageindex = current;
          this.pageParams.pagesize = size;
          this.assistantNumberManagements = records;
          this.loading = false;
      },
     async getGroupList(id) {
          this.type = 1;
          const result = await getGroupList({id});
          this.deptList = result.data;
          this.isShowAssistantNumberManagement = true;
      },
      openDifferentUse(purpose,id){
        this.isShowAssistantNumberManagement =true;
        this.type = 0;
        this.purpose = purpose;
        this.id = id
      },
    },
    mounted() {
      this.pageQuery()
    }
  }
</script>

<style lang='scss' scoped>
.sensitiveWordGroup{
  display: flex;
  align-items: center;
  .msg-name{
    padding-left:20px;
  }
}
</style>
