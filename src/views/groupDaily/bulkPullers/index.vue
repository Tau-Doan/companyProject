<template>
    <div class="app-container">
      <el-form :inline="true">
        <el-form-item label="助手号">
          <el-select v-model="robotId" clearable placeholder="请选择">
            <el-option
              v-for="(item,index) in robots"
              :key="index"
              :label="item.nickName"
              :value="item.robotId"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="findGroupAndMember">查询</el-button>
        </el-form-item>
      </el-form>

      <div>
        <el-form :model="bulkPullersForm" :rules="bulkPullersRules" ref="bulkPullersForm"  class="demo-ruleForm">
          <el-form-item  prop="groups">
            <span>请选择需要的群（共 <span>{{selectGroups.length}}</span> 个）</span>
            <el-button @click="clearData(1)">清空所有的群</el-button>
            <div class="selectGroupList ">
              <div class="groupPhoto" :key="index" v-for="(item,index) in selectGroups">
                <el-image
                  :src="item.headUrl"
                  fit="cover">
                </el-image>
                <span>{{item.name}}</span>
              </div>
              <div class="addGroupButton">
                <el-button class="el-icon-plus avatar-uploader-icon" @click="showComponent(0)" type="primary"/>
                <span>添加微信群</span>
              </div>
            </div>
            <el-divider></el-divider>
          </el-form-item>
          <el-form-item  prop="members">
            <span>选择好友（共 <span>{{selectMembers.length}}</span> 个）</span>
            <el-button @click="clearData(2)">清空好友</el-button>
            <div class="selectGroupList">
              <div class="groupPhoto" :key="index" v-for="(item,index) in selectMembers">
                <el-image
                  :src="item.vcHeadImgUrl"
                  fit="cover">
                </el-image>
                <span>添加微信号</span>
              </div>
              <div class="addGroupButton">
                <el-button class="el-icon-plus avatar-uploader-icon" @click="showComponent(1)" type="primary"/>
                <span>添加微信号</span>
              </div>
            </div>
            <el-divider></el-divider>
          </el-form-item>
          <el-button type="primary" @click="batchInviteMember">立即创建</el-button>
        </el-form>
      </div>

      <el-dialog
        :close-on-click-modal="false"
        title="选择人员"
        :visible.sync="dialogVisible"
        width="450px"
        center>
        <component ref="componentRef" :members="members" :saveComponentData="saveComponentData" :closeComponent="closeComponent" :groups="groups" :is="componentNames[componentType]"/>
      </el-dialog>
    </div>
</template>

<script>
  import SelectGroup from './components/SelectGroup'
  import SelectMember from './components/SelectMember'
  import {batchInGroup,findMemberByRobotId,findWtGroupByRobotId,getAllWtRobot} from '../../../api/groupDaily/bulkPullers'
  export default {
    name: "BulkPullers",
    components: {
      SelectGroup,
      SelectMember
    },
    data() {
      return {
        componentType: 0,
        dialogVisible: false,
        componentNames: ['SelectGroup','SelectMember'],
        robots: [],
        groups: [],
        selectGroups: [], // 选中的群数据
        selectMembers: [],
        members: [],
        flag: false, // 已查询标志
        robotId: null,
        bulkPullersForm: {
          GroupNumber: 0,//选择群数量
          friendNumber: 0,//选择群数量
        },//表单
        //校验
        bulkPullersRules: {
          groups: [{ validator: this.validateGroups, trigger: 'blur' }],
          members: [{ validator: this.validateMembers, trigger: 'blur' }]
        },
      }
    },
    methods: {
      validateGroups(rule, value, callback){
        if(!this.selectGroups || !this.selectGroups.length){
          return callback(new Error('请选择需要的群'));
        }
        callback();
      },
      validateMembers(rule, value, callback){
        if(!this.selectMembers || !this.selectMembers.length){
          return callback(new Error('请选择用户'));
        }
        callback();
      },
      /**
       * 批量邀请人
       */
      batchInviteMember(){
        this.$refs.bulkPullersForm.validate(async (valid) => {
          if (!valid) {
            return;
          }

          const params = {
            robotId: this.robotId,
            groupIds: this.selectGroups.map(item => item.id).join(','), // 群id
            vcFriendSerialNos: this.selectMembers.map(item => item.vcFriendSerialNo).join(','), // 好友编号集合
          };
            await batchInGroup(params);
            this.$message.success('操作成功')
            this.clearData(1);
            this.clearData(2);
        });
      },
      /**
       * 清理数据
       */
      clearData(type = 1){
        switch (type) {
          case 1:{
            this.selectGroups = [];
            break;
          }
          case 2:{
            this.selectMembers = [];
            break;
          }
        }
        const componentRef = this.$refs.componentRef;
        // 调用组件清理方法
        if(componentRef){
          componentRef.clearData();
        }
      },
      /**
       * 保存选中的数据
       */
      saveComponentData(type,data){
        switch (type) {
          case 1:{
            this.selectGroups = data;
            break;
          }
          case 2:{
            this.selectMembers = data;
            break;
          }
        }

        this.dialogVisible = false;
      },
      /**
       * 关闭组件
       */
      closeComponent(){
        this.dialogVisible = false;
      },
      /**
       * 获取群和好友信息
       */
      findGroupAndMember(){
        if (!this.robotId) {
          this.$message.warning('助手号未选择');
          return;
        }

        this.flag = true;
        this.findGroup();
        this.findMember();

        // 清理选择数据
        this.clearData(1);
        this.clearData(2);

        this.$message.success('查询成功')
      },
      /**
       * 查询用户
       */
     async findMember(){
        const result = await findMemberByRobotId({robotId: this.robotId});
        this.members = result.memberList;
      },
      /**
       * 获取群信息
       */
      async findGroup(){
          const result = await findWtGroupByRobotId({robotId: this.robotId});
          this.groups = result.wtGroupList;
      },
      /**
       * 获取所有的助手号
       */
      async getAllRobot() {
        const result = await getAllWtRobot();
        this.robots = result.wtRobotList;
      },
      /**
       * 添加微信群
       */
      showComponent(type) {
        if(!this.flag){
          this.$message.warning('请先查询数据');
          return;
        }
        this.componentType = type;
        this.dialogVisible = true;
      },
    },
    mounted() {
      this.getAllRobot();
    }
  }
</script>

<style lang="scss" scoped>
  .selectGroupList{
    display: flex;
    justify-content: flex-start;
    margin: 20px 0;
    flex-wrap:wrap;
  .groupPhoto{
    display: flex;
    flex-direction:column;
    align-items: center;
    margin:  5px;
  span{
    width: 100px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    text-align:center;
  }
  .el-image{
    width: 100px;
    height: 100px
  }
  }

  /* 群照片添加按钮*/
  .addGroupButton{
    display: flex;
    /*justify-content:center;*/
    align-items: center;
    flex-wrap:nowrap;
    flex-direction:column;

    /*display: inline-block;*/
    /*border: 1px dashed #d9d9d9;*/
    margin:  5px;
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 20px;
    color: #8c939d;
    width: 100px;
    height: 100px;
    line-height: 80px;
    text-align: center;
    background-color: #C0C4CC;
    border: 1px dashed #d9d9d9;
  }
  .avatar {
    width: 100px;
    height: 100px;
    display: block;

  }
  }
  }
</style>
