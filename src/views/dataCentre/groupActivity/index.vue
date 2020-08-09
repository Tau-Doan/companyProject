<template>
  <div class="app-container">
    <div class="titleHeader">
      <span>群活跃度</span>
      <el-divider/>
    </div>
    <div class="conditionFrom">
      <el-button :type="type === 1?'primary':''"  @click="changeType(1)">群活跃度统计</el-button>
      <el-button :type="type === 2?'primary':''" @click="changeType(2)">活跃时段统计</el-button>
    </div>
    <component :groups="groups" :is="contentNames[type-1]"/>
  </div>
</template>

<script>
  import GroupActivityList from "./components/GroupActivityList";
  import ActiveTimeStatistics from "./components/ActiveTimeStatistics"

  import {findAll} from "../../../api/dataCentre/groupActivity"
  export default {
    name: "GroupActivity",
    components:{
      GroupActivityList,
      ActiveTimeStatistics
    },
    data(){
      return{
        contentNames:['GroupActivityList','ActiveTimeStatistics'],
        type: 1,
        groups: []
      }
    },
    methods:{
      // 页面切换
      changeType(type){
        this.type = type;
      },
      //群组
      async findGroup() {
        const result = await findAll();
        this.groups = result.data;
        this.groups.unshift({name:'全部',deptId:0})
      },
    },
    mounted() {
      this.findGroup();
    }
  }
</script>

<style lang="scss"  scoped>
</style>
