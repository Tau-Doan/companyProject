<template>
  <div class="app-container">
        <div class="titleHeader">
            <span>群健康趋势</span>
            <el-divider/>
        </div>
        <el-form  :inline="true">
            <el-form-item label="时间范围:">
                <el-date-picker
                        value-format="yyyy-MM-dd"
                        v-model="time"
                        type="daterange"
                        @change="timeSelection"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期">
                </el-date-picker>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="findGroupHealthTrend">查询</el-button>
            </el-form-item>
        </el-form>
        <div class="Statistics">
            <div class="statisticalContent">
                <span>{{groupHealthTrend.memberCount}}</span>
                <span>总人数</span>
            </div>
            <div class="statisticalContent">
                <span>{{groupHealthTrend.totalEnterGroupNumber}}</span>
                <span>总入群人数</span>
            </div>
            <div class="statisticalContent">
                <span>{{groupHealthTrend.totalExitGroupNumber}}</span>
                <span>总退群人数</span>
            </div>
            <div class="statisticalContent">
                <span>{{groupHealthTrend.totalSpeakMemberNumber}}</span>
                <span>总发言人数</span>
            </div>
            <div class="statisticalContent">
                <span>{{groupHealthTrend.memberRateOfRise}}</span>
                <span>人员增长率</span>
            </div>
            <div class="statisticalContent">
                <span>{{groupHealthTrend.speckRateOfRise}}</span>
                <span>发言增长率</span>
            </div>
        </div>

        <div id="mainChart" class="chartClass"></div>

    </div>
</template>

<script>
    // 按需引入
    import echarts from 'echarts/lib/echarts';
    import 'echarts/lib/chart/line';
    import 'echarts/lib/component/tooltip';
    import 'echarts/lib/component/title';
    import 'echarts/lib/component/legend'
    import {findGroupHealthTrend, getCurrentUserDeptTree} from "../../../api/dataCentre/groupHealth";

    export default {
        name: "GroupHealth",
        data() {
            return {
                deptProps: {
                    label: 'name',
                    value: 'deptId',
                    children: 'children',
                    checkStrictly: true
                },
                deptIds: [],
                deptList: [],
                groupHealthTrend: {},
                dateTimes: [],
                time: [],
                speckIncreaseList: [], // 发言增长数据
                memberIncreaseList: [], // 用户增长数据
                params: {
                    startDate: '',
                    endDate: ''
                }
            }
        },
        methods: {
            timeSelection(date) {
                !date && (date = []);
                const [startDate, endDate] = date;
                this.params.startDate = startDate;
                this.params.endDate = endDate;
            },
            /**
             * 获取群趋势相关信息
             */
            async findGroupHealthTrend() {
                this.params.deptId = this.deptIds[this.deptIds.length - 1];
                const result = await findGroupHealthTrend(this.params);
                    this.groupHealthTrend = result.data;
                    // 初始化图表
                    this.dateTimes = this.groupHealthTrend.speckIncreaseList.map(item => item.dateTime);
                    this.memberIncreaseList = this.groupHealthTrend.memberIncreaseList.map(item => item.rateOfRise);
                    this.speckIncreaseList = this.groupHealthTrend.speckIncreaseList.map(item => item.rateOfRise);
                    this.initMainChart();
            },
            /**
             * 初始化图表
             */
            initMainChart() {
                // 基于准备好的dom，初始化echarts实例
                let myChart = echarts.init(document.getElementById('mainChart'));
                // 绘制图表
                let option = {
                    title: {
                        text: '增长率'
                    },
                    tooltip: {
                        trigger: 'axis',
                        formatter: "<br/>{b} : {c}%"
                    },
                    legend: {
                        data: ['人员增长率', '发言增长率']
                    },
                    grid: {
                        left: '3%',
                        right: '4%',
                        bottom: '3%',
                        containLabel: true
                    },
                    toolbox: {
                        feature: {
                            saveAsImage: {}
                        }
                    },
                    xAxis: {
                        type: 'category',
                        boundaryGap: false,
                        data: this.dateTimes,
                    },
                    yAxis: {
                        type: 'value',
                        axisLabel: {
                            formatter: '{value} %'
                        }
                    },
                    series: [
                        {
                            name: '人员增长率',
                            type: 'line',
                            stack: '总量',
                            data: this.memberIncreaseList
                        },
                        {
                            name: '发言增长率',
                            type: 'line',
                            stack: '总量',
                            data: this.speckIncreaseList
                        }
                    ]
                };

                myChart.setOption(option);
            }
        },
        mounted() {
            this.findGroupHealthTrend();
        }
    }
</script>

<style lang="scss" scoped>
    .groupHealth {
        .el-button {
            margin-left: 20px;
        }
    }

    // 设置图表的样式
    .chartClass {
        margin-top: 30px;
        width: 100%;
        height: 400px;
    }

    .Statistics {
        display: flex;
        justify-content: space-between;
        margin-top: 20px;
        width: 90%;

        .statisticalContent {
            width: 150px;
            height: 100px;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            border: 1px #DCDFE6 solid;

            span:nth-child(1) {
                color: #282828;
                font-size: 30px;
            }

            span:nth-child(2) {
                color: #282828;
                font-size: 14px;
            }
        }

        div:nth-child(5) {
            background-color: #DCDFE6;
        }

        div:nth-child(6) {
            background-color: #DCDFE6;
        }

    }

</style>
