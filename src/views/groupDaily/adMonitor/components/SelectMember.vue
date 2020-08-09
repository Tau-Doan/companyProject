<template>
  <div class="selectGroup">
    <div class="selectGroupTabulation">
      <el-tree
        :data="deptList"
        :props="deptProps"
        node-key="deptId"
        :default-checked-keys="[-1]"
        @node-click="handleNodeClick"/>
    </div>
    <div  class="selectGroupName">
      <div class="selectGroupContent">
        <span v-if="!groupList || !groupList.length">暂无数据</span>
        <div class="selectGroupPhoto" :class="{active: index === groupIndex}" @click="handlerGroupSelect(item.memberList,index)" :key="index" v-for="(item,index) in groupList">
          <el-image
            style="width: 60px;height: 60px;"
            :src="item.groupAvatar"
            fit="contain">
          </el-image>
          <span class="selectGroupPhotoName">{{ item.groupName}}</span>
        </div>
      </div>
    </div>
    <div class="selectGroupName">
      <div class="selectGroupContent">
        <div>
            <el-input v-model="memberSearchName" @input="searchMember" placeholder="请输入内容"/>
        </div>
        <div class="memberList" :class="{active: memberIds.includes(member.memberId)}" :key="index" v-for="(member,index) in filterMemberList">
          <el-checkbox-group @change="handlerMemberChange" v-model="memberIds">
            <el-checkbox  class="bulkPullersCheckbox" :label="member.memberId" v-model="member.select"  @change="addMember(member)">
              <div class="bulkPullersGroup">
                <el-image
                  style="width: 60px;height: 60px;"
                  :src="member.memberAvatar"
                  fit="contain">
                </el-image>
                <span class="selectGroupPhotoName">{{ member.memberName}}</span>
              </div>
            </el-checkbox>
          </el-checkbox-group>
        </div>
      </div>
      <div>
        <el-button type="primary" @click="save">确定</el-button>
        <el-button @click="close">取消</el-button>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "selectMember",
    props: {
      closeSelectMember: Function,
      memberWhiteList: Array
    },
    data() {
      return {
        deptProps: {
          children: 'children',
          label: 'name'
        },
        groupIndex: -1,
        memberSearchName: '',
        filterMemberList: [],
        memberIds: [],
        selectMembers: [],
        deptList:[],
        groupList:[],
        memberList: [],
      }
    },
    methods:{
      close(){
        this.memberSearchName = '';
        this.searchMember();
        this.closeSelectMember();
        // 默认显示全部机构群列表
        this.groupList = this.deptList[0] ? this.deptList[0].groupList : [];
        // 默认显示第一个群成员列表
        this.groupList && this.groupList.length && this.handlerGroupSelect( this.groupList[0].memberList,0);
      },
      /**
       * 搜索用户
       */
      searchMember(){
        this.filterMemberList = this.memberList.filter(item => item.memberName.indexOf(this.memberSearchName) !== -1);
      },
      /**
       * 添加用户
       */
      addMember(member){
        const index = this.memberIds.findIndex(item => item === member.memberId);

        if(index !== -1){
          this.selectMembers.push(member);
        }else{
          const memberIndex = this.selectMembers.findIndex(item => item === member);
          this.selectMembers.splice(memberIndex,1);
        }
      },
      delMember(memberId){
        const index = this.memberIds.findIndex(item => item === memberId);
        this.memberIds.splice(index,1);
      },
      /**
       * 保存数据
       */
      save(){
        if(!this.selectMembers || !this.selectMembers.length){
          this.$message.warning('请选择群用户');
          return;
        }
        let pageJson={
          type:'memberWhiteList',
          pageName:'w_m_select',
          pageTitle:'选择群成员',
          data:this.selectMembers,
          override_dialog_width:'800px'
        };

        // 默认显示全部机构群列表
        this.groupList = this.deptList[0] ? this.deptList[0].groupList : [];
        // 默认显示第一个群成员列表
        this.groupList && this.groupList.length && this.handlerGroupSelect( this.groupList[0].memberList,0);

        this.memberSearchName = '';
        this.searchMember();
        this.$emit('cPage',pageJson)
      },
      handlerMemberChange(){
        this.$forceUpdate();
      },
      /**
       * 处理节点选中
       * @param data
       */
      handleNodeClick(data) {
        this.groupList = data.groupList;
        this.memberList = [];
        this.filterMemberList = [];
      },
      findDepts(){
        this.$Request.get('/admin/sysDept/findAllDeptAndMember',{},result => {
          this.deptList = result.data;
         this.init();
        })
      },
      /**
       * 初始化显示
       */
      init(){
        // 默认显示全部机构群列表
        this.groupList = this.deptList[0] ? this.deptList[0].groupList : [];
        // 默认显示第一个群成员列表
        this.groupList && this.groupList.length && this.handlerGroupSelect( this.groupList[0].memberList,0);
        // 初始化相关
        this.handlerMemberSelect();
      },
      /**
       * 处理群用户回显
       */
      handlerMemberSelect(){
        this.memberIds = this.memberWhiteList.map(item => item.memberId);
        this.selectMembers = [...this.memberWhiteList]
      },
      /**
       * 处理群选中
       */
      handlerGroupSelect(memberList,index){
        this.groupIndex = index;
        this.memberList = memberList;
        this.filterMemberList = [...memberList];
        this.memberSearchName = "";
      }
    },
    mounted() {
      this.findDepts();
    }
  }
</script>

<style lang="scss" scoped>
  .selectGroup {
    display: flex;
    justify-content: flex-start;
    /*margin-top: 5px;*/
    height: 400px;
    .selectGroupTabulation {
      width: 250px;
      border: 1px #E4E7ED solid;
    }
    .selectGroupName {
      width: 400px;
      display: flex;
      justify-content: space-between;
      flex-flow: column nowrap;
      height: 100%;
      /*border: 1px #E4E7ED solid;*/
      .selectGroupContent{
        overflow: auto;
      }

      .selectGroupPhoto,.memberList {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        margin-bottom: 10px;
        padding-left: 20px;
        .bulkPullersGroup{
          display: flex;
          align-items: center;
          justify-content: flex-start;
          flex-flow: row nowrap;
          .el-image{
            width: 60px;
            height: 60px;
            box-sizing:border-box;
            margin: 0 15px;
            border-radius: 50%;
          }
          .selectGroupPhotoName{
            display: block;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
        }
      }
    }
  }

  .selectGroupContent .active {
    background-color: #F5F7FA;
  }

  .selectGroupContent{
    .selectGroupPhoto:hover,.memberList:hover{
      background-color: #F5F7FA;
    }
  }


    .bulkPullersCheckbox{
    display: flex;
    align-items: center;
    margin-bottom: 10px;
    /*flex-flow: column nowrap;*/
  }
</style>
