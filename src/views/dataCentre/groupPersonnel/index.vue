<template>
  <div class="app-container">
    <div class="titleHeader">
      <span>群人员统计</span>
      <el-divider/>
    </div>
    <div class="conditionFrom">
      <el-button :type="type === 1?'primary':''"  @click="changeType(1)">人员统计</el-button>
      <el-button :type="type === 2?'primary':''" @click="changeType(2)">上下级统计</el-button>
    </div>
    <component :groups="groups" :is="contentNames[type-1]"></component>
  </div>
</template>

<script>
  import PersonnelStatistics from "./components/PersonnelStatistics";
  import UpperAndLowerLevels from "./components/UpperAndLowerLevels"
  import {findAll} from "../../../api/dataCentre/groupPersonnel";

  export default {
    name: "GroupPersonnel",
    components:{
      PersonnelStatistics,
      UpperAndLowerLevels
    },
    data(){
      return{
        contentNames:['PersonnelStatistics', 'UpperAndLowerLevels'],
        type: 1,
        groups: [],
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
        this.groups.unshift({name:'全部'})
      },
    },
    mounted() {
      this.findGroup();
    }
  }
</script>

<style lang="scss" scoped>
</style>
