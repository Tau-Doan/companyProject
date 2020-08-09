<template>
  <div class="app-container">
  <el-table
    v-loading="loading"
    element-loading-text="拼命加载中"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0.8)"
    :data="games">
    <el-table-column label="游戏名称" prop="name"  align="center" ></el-table-column>
    <el-table-column label="目标群"  align="center" width="300">
      <template slot-scope="scope">
        <span class="'look-mr">{{scope.row.groupNumber}}个</span> &nbsp<el-button  @click="getGroupList(scope.row.id)" size="small" round type="success" >查看</el-button>
      </template>
    </el-table-column>
    <el-table-column label="操作" align="center">
      <template slot-scope="scope">
        <el-button size="small" round  @click="closeOrOpenGame(scope.row)" type="danger">{{scope.row.status === -1?'开启':'关闭'}}</el-button>
        <el-button size="small" round  @click="toEdit(scope.row.type)" type="warning"  >设置</el-button>
        <el-button size="small" round  @click="openGameDetailsPage(scope.row.type)"  type="info">游戏详情</el-button>
      </template>
    </el-table-column>
  </el-table>

  <el-dialog
    :close-on-click-modal="false"
    :visible.sync="isShowGroupListPage"
    title="目标群"
    width="30%">
    <selectGroup v-if="isShowGroupListPage" :depts="deptList"/>
  </el-dialog>

  <!--游戏详情-->
  <el-dialog
    width="70vw"
    :close-on-click-modal="false"
    :visible.sync="isShowGameDetailsPage"
    :title="gameNames[type-1] + '游戏详情'"
    @close="closeGameDetailsPage">
    <gameDetails v-if="isShowGameDetailsPage" :type="type"/>
  </el-dialog>
</div>
</template>

<script>
  import SelectGroup from '@/components/SelectGroup';
  import GameDetails from "./components/GameDetails";

  import {getAll,getGroupList,openGame,closeGame} from "../../../api/interaction/game"
  import drawingDefalut from "../../../utils/generator/drawingDefalut";
  export default {
    name: "groupGame",
    props: ['changePage'],
    components: {
      SelectGroup,
      GameDetails
    },
    data(){
      return{
        components: [],
        gameNames: ['看图猜字','猜歌名','脑筋急转弯','歇后语'],
        isShowGroupListPage: false,
        isShowGameDetailsPage: false,
        type: '',
        deptList: [],
        loading:false,
        games:[],
        groupNumber:'',
      }
    },
    methods:{
      toEdit(type){
        this.$router.push({ path: `/interaction/RuleSettings/${type}`});
      },
      /**
       * 关闭游戏详情页面
       */
      closeGameDetailsPage(){
        this.isShowGameDetailsPage = false;
      },
      /**
       * 打开游戏详情页面
       */
      openGameDetailsPage(type){
        this.isShowGameDetailsPage = true;
        this.type = type;
      },
      /**
       * 关闭游戏
       * @param type 类别
       */
        closeOrOpenGame(gameRule){
        const params={}
        params.type=gameRule.type
        params.status=gameRule.status
        //0为关闭，-1打开
        const {type,status} = gameRule;
        let url = 'admin/WtGameRule/';
        const isClose = status===-1
        const urlSuffix =isClose ? 'open' : 'close';
        this.$confirm(`你确定${isClose?'开启':'关闭'}此游戏嘛？`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then( async () => {
          let result=''
          if(urlSuffix==='open'){
            result=await openGame(params)

          }else if(urlSuffix==='close'){
            result=await closeGame(params)
          }
          console.log(result)
          if (result.code === 200) {
                this.$message.success(result.msg);
              } else {
                this.$message.error(result.message);
              }
          this.$forceUpdate()
          this.getAll()


          // this.$Request.get(`${url}${urlSuffix}` , {type}, (result) => {
          //   if (result.code === 200) {
          //     gameRule.status = isClose?0:-1;
          //     this.$message.success(result.message);
          //   } else {
          //     this.$message.error(result.message);
          //   }
          // })
        })

      },
      async getAll() {
        const result = await getAll();
          if (result.code === 200) {
            this.games = result.data;
          } else {
            this.$message.error(result.message);
          }
          this.loading = false;
      },
      // 获取目标群
      async getGroupList(id){
        const result = await getGroupList({id});
          this.deptList = result.data;
          this.isShowGroupListPage = true;
      }

    },
    activated: function() {
      this.closeOrOpenGame()
    },
    mounted() {

      this.getAll()
    }
  }
</script>

<style scoped lang="scss">
.look-mr{
  display: inline-block;
  margin-right: 10px;
}
</style>
