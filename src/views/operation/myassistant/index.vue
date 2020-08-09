<template>
  <div class="app-container">
     <el-row :gutter="10" class="mb8">
        <el-col :span="1.5">
          <el-button
            type="primary"
            icon="el-icon-plus"
            size="mini"
          >新增助手</el-button>
        </el-col>
     </el-row>
<!-- 表单 -->
    <el-table
              v-loading="loading"
              element-loading-text="拼命加载中"
              element-loading-spinner="el-icon-loading"
              element-loading-background="#fff"
              >
        <el-table-column label="微信图像" align="left">
            <template slot-scope="scope">
                <el-image
                        class="avatar"
                        style="width: 60px; height: 60px"
                        :src="scope.row.content"
                        fit="cover"></el-image>
            </template>
        </el-table-column>
        <el-table-column label="机器人信息" prop="desc" align="left"></el-table-column>
        <el-table-column label="账号信息" prop="answer" align="left"></el-table-column>
        <el-table-column label="状态" prop="createTime" align="left">
            <template slot-scope="scope">
                <div class="status">
                    <el-button type="text" >登录</el-button>
                </div>
            </template>
        </el-table-column>
        <el-table-column label="用户二维码" prop="number" align="center"></el-table-column>
        <el-table-column label="自动加好友" prop="number" align="center"></el-table-column>
        <el-table-column label="操作" align="center">
            <template slot-scope="scope">
                <div class="operate">
                    <el-button type="text" @click="toEdit(scope.row.id)">
                        <i class="el-icon-edit operateButton"></i>
                    </el-button>
                    <el-button type="text" @click="del(scope.row.id)">
                        <i class="el-icon-delete operateButton"></i>
                    </el-button>
                </div>
            </template>
        </el-table-column>
    </el-table>
<!-- 分页 -->
      <pagination
      :total="total"/>
  </div>
</template>
<script>
  import MyassistantContent from "./components/MyassistantContent";
  // import {pageQuery,deleteGame} from "../../../api/operation/"

  export default {
    name:'Myassistant',
    components:{
      MyassistantContent,
    },
    props: {
      params: Object
    },
    data() {
      return {
          gameSources: [],
          contentNames: ['MyassistantContent'],
          gameName: ['新增助手'],
          loading: false,
          pageParams: {
            pageindex: 1, // 当前页
            pagesize: 10, // 每页记录数
            keyword: '', // 过滤关键字
            type: 1 // 默认为看图猜字
          },
          total: 0
      }
    },
  }
</script>

<style lang='scss' scoped>
.wrap-button{
  padding:0px 20px 20px 0px;
  box-sizing: border-box;
}
</style>
