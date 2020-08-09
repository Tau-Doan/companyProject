<template>
  <div class="app-container">
    <el-form class="demo-form-inline" label-width="100px" ref="messageMonitorForm" :model="messageMonitor"
             :rules="messageMonitorRules">
      <el-form-item prop="content" label="监控内容">
        <div class='addKeywords'>
          <el-tag
            :key="index"
            v-for="(tag,index) in contArr"
            closable
            :disable-transitions="false"
            @close="handleClose(tag)">
            <span class='switch_word'>{{tag}}</span>
          </el-tag>
          <el-input
            class="input-new-tag"
            v-if="inputVisible"
            v-model="inputValue"
            ref="saveTagInput"
            size="small"
            @keyup.enter.native="put"
            @blur="put">
          </el-input>
          <el-button v-if="contArr.length < 10" class="button-new-tag" size="small" @click="showInput">
            <span @click='showInput' class="switch_word">+添加监控内容</span>
          </el-button>
        </div>
      </el-form-item>
      <el-form-item prop="groupList" label="选择目标群">
        <div class="selectTheTargetGroup">
          <div class="selectAvatar" v-if="messageMonitor.groupList" :key="index"
               v-for="(item,index) in messageMonitor.groupList" @mouseenter="handleEnter(true)"
               @mouseleave="handleEnter(false)">
<!--            改图片-->
            <el-image
              :src="item.groupAvatar"
              fit="cover"></el-image>
            <el-button v-show="isShow" @click="delGroup(item.groupId)" icon="el-icon-close" circle size="mini"   >

           </el-button>
          </div>
          <div class="addAvatarPushButton">
            <el-button @click="showComponent(3)" size="medium" icon="el-icon-plus" circle></i></el-button>
          </div>
        </div>
      </el-form-item>

      <el-form-item>
        <el-checkbox v-model='messageMonitor.pattern' :true-label="1" :false-label="2">
          <el-tooltip class="item" effect="dark" content="设置精确匹配" placement="bottom">
            <span>精确匹配<i class="el-icon-question"></i></span>
          </el-tooltip>
        </el-checkbox>
        <div class="pt10px">
          <el-button type="primary" @click="save">提交</el-button>
          <el-button @click="cancel">取消</el-button>
        </div>
      </el-form-item>
    </el-form>

    <el-dialog :close-on-click-modal="false"  width="30%" footer="222" :visible.sync="dialogView">
      <div slot="title" class="dialog-footer">
        <h2 class="mt0">

          <span>选择目标群</span>
          <el-checkbox @change="updateAllGroupSelectStatus" v-model="isSelectAll" class="sdfr">全选
          </el-checkbox>
        </h2>
      </div>
      <selectGroup
        :close="hideComponent"
        ref="selectGroup"
        :updateSelectAllStatus="updateSelectAllStatus"
        :isSelect="true"
        :isSelectAll="true"
        :saveComponentData="saveComponentData"
        :initGroupList="initGroupList"
        @handleGroupList="selectGroupList"
      ></selectGroup>
    </el-dialog>


  </div>
</template>

<script>
  import {findOne, save} from '../../../api/groupDaily/messageMonitor'
  import SelectGroup from '@/components/SelectGroup';

  export default {
    name: "edit",
    components: {
      SelectGroup
    },
    data() {
      return {
        messageMonitorRules: {
          groupList: [{validator: this.validateGroupList, trigger: 'blur'}],
          content: [{validator: this.validateContent, trigger: 'blur'}],
        },
        dialogTitle: '选择群组',
        initGroupList: [], // 初始化目标群,解决dialog未加载调用不了子组件方法回显数据
        dialogView: false,
        isShow: false,
        isSelectAll: false,
        messageMonitor: {
          content: '',
          groupIds: '',
          groupList: [],
          pattern: 1, // 匹配模式 1-精准匹配 2-模糊匹配
        },

        inputVisible: false,//打开输入框
        inputValue: '',//输入值
        contArr: [],//内容数组
      }
    },
    methods: {
      /* 选中的群*/
      selectGroupList(list){
        this.messageMonitor.groupList=list
      },
      /**
       * 取消
       */
      cancel() {
        // 发布删除tag删除
        this.PubSub.publish('delTag', this.$route.path);
      },
      async findOne(id) {
        const result = await findOne({id});

        this.messageMonitor = result.data;
        // 拆分关键字
        this.contArr = this.messageMonitor.content.split(',');
        this.initGroupList = this.messageMonitor.groupList;
      },
      // 校验监控内容
      validateContent(rule, value, callback) {
        if (!this.contArr || !this.contArr.length) {
          callback(new Error('请输入监控内容'));
          return;
        }
        callback();
      },
      //选择群的表单校验
      validateGroupList(rule, value, callback) {
        if (!this.messageMonitor.groupList || !this.messageMonitor.groupList.length) {
          callback(new Error('请选择目标群'));
          return;
        }
        callback();
      },
      save() {
        this.$refs['messageMonitorForm'].validate(async (valid) => {
          if (!valid) {
            return;
          }
          //处理从点击修改进来该页面的
          if(this.$route.params.id>0){
            this.messageMonitor.groupList[0].id=this.messageMonitor.groupList[0].groupId
          }
          // 处理关键字数据
          this.messageMonitor.content = this.contArr.join(',');
          this.messageMonitor.groupIds = this.messageMonitor.groupList.map(item => item.groupId).join(',');

          await save(this.messageMonitor);
          this.$message.success("操作成功");
          this.cancel();
          //调转到上一级
          this.$router.go(-1)
        })
      },
      hideComponent() {
        this.dialogView = false;
      },
      saveComponentData(data) {
        this.messageMonitor.groupList = data;
        this.dialogView = false;
      },
      // 显示组件
      showComponent() {
        this.dialogView = true;
      },
      /**
       * 删除目标群
       * @param id 群id
       */
      delGroup(id) {
        const groupList = this.messageMonitor.groupList;
        const index = groupList.findIndex(item => item.groupId === id);

        if (index !== -1) {
          groupList.splice(index, 1);
          // 修改本组件数据
          Vue.set(this.messageMonitor, 'groupList', groupList)
          // 修改子组件数据, 子组件渲染则调用
          if (this.$refs.selectGroup) {
            this.$refs.selectGroup.updateGroupSelectStatus(id);
          } else {
            this.initGroupList = [...groupList]; // 解构，防止数组强引用
          }
          // 强制刷新
          this.$forceUpdate();
        }

      },
      /**
       * 更新所有群选中状态
       */
      updateAllGroupSelectStatus() {
        this.$refs.selectGroup.updateAllGroupSelectStatus(this.isSelectAll);
      },
      /**
       * 更新选中状态
       */
      updateSelectAllStatus(isSelectAll) {
        this.isSelectAll = isSelectAll;
      },

      handleEnter(isEnter) {
        return this.isShow = isEnter;
      },
      showInput() {//显示iput
        this.inputVisible = true
        this.$nextTick(() => {
          this.$refs.saveTagInput.$refs.input.focus();
        });
      },
      put() {//添加一个content
        let val = this.inputValue;
        if (val) {
          this.contArr.push(val)
        }
        this.inputVisible = false;
        this.inputValue = ''
      },
      handleClose(tag) { //移除一个content
        this.contArr.splice(this.contArr.indexOf(tag), 1)
      },
    },
    mounted() {
      const {id} = this.$route.params;
      console.log(this.$route.params)
      parseInt(id) && this.findOne(id);
    }
  }
</script>

<style lang="scss" scoped>
  .selectTheTargetGroup{
    display: flex;
    align-items: center;
  }
  .selectAvatar{
    position: relative;
    .el-image{
      margin-right: 15px;
    }
    .el-button{
      position: absolute;
      padding: 0;
      top: 0;
      right: 9px
    }
  }

</style>
