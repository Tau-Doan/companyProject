<template>
  <div class="app-container">
        <div class="gameDetails">
            <span>期数</span>
            <el-select v-model="currentPeriodIndex" @change="getDetailsBySourceId" placeholder="请选择">
                <el-option
                        v-for="(item,index) in periods"
                        :key="index"
                        :label="`第${item}期`"
                        :value="index">
                </el-option>
            </el-select>
        </div>

        <component :gameSourceMap="gameSourceMap" :is="componentNames[type-1]"/>

        <div class="statistics">
            <span>参与人数：{{gameSourceMap?gameSourceMap.partakeMemberNumber : ''}}人</span>
            <span>发言次数：{{gameSourceMap?gameSourceMap.speakNumber:''}}次</span>
            <span>猜中者：{{gameSourceMap?gameSourceMap.guessNumber:''}}人</span>
            <span>发起时间：{{gameSourceMap?gameSourceMap.createTime:''}}</span>
        </div>

        <div id="table">
            <el-table
                    v-loading="loading"
                    element-loading-text="拼命加载中"
                    element-loading-spinner="el-icon-loading"
                    element-loading-background="rgba(0, 0, 0, 0.8)"
                    :data="memberSources">
                <el-table-column label="微信号" align="center" width="300">
                    <template slot-scope="scope">
                        <div class="gameDetailsGroup">
                            <img :src="scope.row.avatar" width='60' height='60'>
                            <span style="margin-left: 20px">{{ scope.row.nickname }}</span>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="参与记录" prop="answer" align="center"></el-table-column>
                <el-table-column label="本次获取积分" prop="integral" align="center"></el-table-column>
                <el-table-column label="参与时间" prop="involvementTime" align="center" width="400"></el-table-column>
            </el-table>
        </div>

    </div>
</template>

<script>
  import AllegoricalSaying from "@/components/AllegoricalSaying"
  import BrainTwister from "@/components/BrainTwister"
  import GuessSong from "@/components/GuessSong"
  import GuessWord from "@/components/GuessWord"

import {getGameDetail} from "../../../../api/interaction/game"
    export default {
        name: "GameDetails",
        components: {
            AllegoricalSaying,
            BrainTwister,
            GuessSong,
            GuessWord
        },
        props: {
            type: Number
        },
        data() {
            return {
                currentPeriodIndex: null ,// 当前周期
                gameDetails: {}, // 游戏详情数据
                componentNames: ['guessWord', 'guessSong', 'brainTwister', 'allegoricalSaying'],
                //下拉框
                periods: [],
                value: '',

                url: 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg',
                loading: false,

                // 请求参数
                params: {
                    type: '', // 游戏类别
                    number: '' // 游戏内容id
                },
                gameSourceMap: {}, // 游戏内容统计
                memberSources: [], // 用户游戏记录
                sourceIds: [],// 题目id集合
            }
        },
        methods: {
            getDetailsBySourceId() {
                this.params.number = this.periods[this.currentPeriodIndex];
                this.getGameDetail();
            },

            /**
             * 查询游戏内容详情数据
             */
            async getGameDetail() {
                this.loading = true;
                const result = await getGameDetail(this.params);
                    this.gameDetails = result.data;
                    const {gameSourceMap, periods, memberSources} = result.data;
                    !gameSourceMap && this.$message.info('无游戏内容');
                    this.gameSourceMap = gameSourceMap;
                    !this.periods.length && (this.periods = periods || []);
                    this.memberSources = memberSources;
                    // 添加周期查询所有
                    // this.periods.unshift({period: '-1'});
                    this.periods.length && this.currentPeriodIndex == null && (this.currentPeriodIndex = 0);

                    this.loading = false;
            }

        },
        mounted() {
            this.params.type = this.type;
            this.getGameDetail();
        }

    }
</script>

<style lang="scss" scoped>
    .gameDetails {
        span {
            margin-right: 40px;
        }
    }

    #conditionFrom {
        margin: 20px auto 40px;

        .el-button {
            width: 110px;
        }
    }

    .gameContent {
        display: flex;
        height: 60px;
        line-height: 60px;
        font-size: 17px;
        .GroupNameList{
          width: 80% !important;
        }

        /*!*猜歌名*!*/
        span {
            line-height: 60px;
        }

        video {
            border: 0;
            outline: none;
        }

    }

    .statistics {
        display: flex;
        justify-content: space-between;
        padding-right: 50px;
       box-sizing: border-box;
        margin: 20px auto;
    }

    #table {
        margin-top: 20px;
    }

    .gameDetailsGroup {
        display: flex;
        justify-content: flex-start;
        line-height: 60px;
        margin-left: 20px;
    }

</style>
