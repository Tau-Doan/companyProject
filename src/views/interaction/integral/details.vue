<template>
    <div id="userControl">

            <el-form :inline="true">
                <el-form-item label="" class="query-btn">
                    <el-input v-model="pageParams.keyword" placeholder="快速查询" clearable />
                    <el-button type="primary" @click="pageQuery">查询</el-button>
                </el-form-item>
            </el-form>
        <div id="table">
            <el-table
                    v-loading="loading"
                    element-loading-text="拼命加载中"
                    element-loading-spinner="el-icon-loading"
                    element-loading-background="rgba(0, 0, 0, 0.8)"
                    :data="integralDetails">
                <el-table-column label="微信号" align="center" width="300">
                    <template slot-scope="scope">
                        <div class="wxName GroupNameListCircular ">
                            <el-image
                                    :src="scope.row.memberAvatar"
                                    fit="cover"/>
                            <span>{{ scope.row.memberName }}</span>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="所属群" prop="Number" align="center">
                    <template slot-scope="scope">
                        <div class="integralDetailsGroupName GroupNameList ">
                            <el-image
                                    :src="scope.row.groupAvatar"
                                    fit="cover"/>
                            <span>{{ scope.row.groupName }}</span>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="转换积分数量" prop="integral" align="center"></el-table-column>
                <el-table-column label="时间" prop="createTime" align="center"></el-table-column>
                <el-table-column label="状态" prop="statusAlias" align="center"></el-table-column>
            </el-table>
          <pagination
            v-show="total>0"
            :total="total"
            :page.sync="pageParams.pageindex"
            :limit.sync="pageParams.pagesize"/>
        </div>
    </div>
</template>

<script>
  import {pageQuery} from "../../../api/interaction/integral"
    export default {
        name: "details",
        props: {
            params: Number,
        },
        data() {
            return {
                integralDetails: [],
                //分页
                pageParams: {
                    pageindex: 1, // 当前页
                    pagesize: 10, // 每页记录数
                    keyword: '', // 过滤关键字
                    groupId: '', // 群id
                },
                total: 0, // 总页数
                loading: false,
                memberAvatar: '',
                memberName: '',
                groupAvatar: '',
                groupName: ''
            }
        },
        methods: {
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
              const result = await pageQuery(this.pageParams);
              const {total, records, size, current} = result.data;
              this.total = total;
              this.pageParams.pageindex = current;
              this.pageParams.pagesize = size;
              this.integralDetails = records;
              this.loading = false;
            },
        },
        mounted() {
          this.pageParams.groupId = this.$route.params.id;
          this.pageQuery();
        }
    }
</script>

<style scoped lang="scss">
  .query-btn{
    padding: 20px;
    box-sizing: border-box;

    width: 100%;
    display: flex;
    justify-content: flex-start;
  .el-input{
    width: 60%;
  }
  .el-button{
    width: 30%;
  }
  }
</style>
