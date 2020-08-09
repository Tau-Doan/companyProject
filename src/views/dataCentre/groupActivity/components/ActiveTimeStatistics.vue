<template>
    <div>
        <!--  活跃时段统计-->
        <div class="groupActivitySelect">
            <div>
                <span class="firstSpan">群组筛选</span>
                <el-select v-model="chatRoomId" @change="deptIdQuery" clearable placeholder="请选择">
                    <el-option
                            v-for="(item,index) in groups"
                            :key="item.chatRoomId"
                            :label="item.name"
                            :value="item.chatRoomId">
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
        </div>
        <div id="table">
            <el-table
                    v-loading="loading"
                    element-loading-text="拼命加载中"
                    element-loading-spinner="el-icon-loading"
                    element-loading-background="rgba(0, 0, 0, 0.8)"
                    :data="activeTimeStatistics">
                <el-table-column label="时间段" align="center">
                    <template slot-scope="scope">
                        {{`${scope.row.startTime}至${scope.row.endTime}:00:00`}}
                    </template>
                </el-table-column>
                <el-table-column label="发言人数" prop="speakMemberNumber" align="center"></el-table-column>
                <el-table-column label="发言次数" prop="speakNumber" align="center"></el-table-column>
            </el-table>
            <div class="paginationV">
                <el-pagination
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        :current-page="pageParams.pageindex"
                        :page-sizes="[4,10, 20, 50, 100]"
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
  import {pageQueryGroupLivenessByTimeQuantumStatistics} from "../../../../api/dataCentre/groupActivity"
    export default {
        name: "activeTimeStatistics",
        props: {
            groups: {
                type: Array,
                require: true
            }
        },
        data() {
            return {
                loading: false,
                pageParams: {
                    pageindex: 1, // 当前页
                    pagesize: 10, // 每页记录数
                    startDate: '',
                    endDate: '',
                    chatRoomId: '',
                },
                total: 0,//总记录数
                activeTimeStatistics: [],
                time: [],
                chatRoomId: '',
            }
        },

        methods: {
            //通过id查询
            deptIdQuery() {
                this.pageParams.chatRoomId = this.chatRoomId;
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
                const result = await pageQueryGroupLivenessByTimeQuantumStatistics(this.pageParams);
                const {total, records, size, current} = result.data;
                this.total = parseInt(total);
                this.pageParams.pageindex = parseInt(current);
                this.pageParams.pagesize = parseInt(size);
                this.activeTimeStatistics = records;
                this.loading = false;
            },
        },
        mounted() {
            this.pageQuery()
        }
    }
</script>

<style lang="scss" scoped>
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
