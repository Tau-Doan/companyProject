<template>
  <div class="app-container">
    <el-form class="edit-group-send-container" ref="groupSendForm" :model="groupSend" :rules="groupSendRules">
      <el-form-item label="发送内容" prop="content">
        <el-input   v-model="groupSend.content"
                    size="small"
                    disabled
                    style="width: 240px"/>
        <el-button-group>
          <el-button
            size="mini"
            type="primary"
            icon="el-icon-tickets"
            @click="showComponent(1)"
          >文本</el-button>
          <el-button
            size="mini"
            icon="el-icon-picture-outline"
            @click="showComponent(2)"
          >图片</el-button>
          <el-button
            size="mini"
            icon="el-icon-picture-outline"
            @click="showComponent(4)"
          >视频</el-button>
          <el-button
            size="mini"
            icon="el-icon-picture-outline"
            @click="showComponent(5)"
          >音乐</el-button>

        </el-button-group>
      </el-form-item>
      <el-form-item label="选择目标群" prop="groupList">
        <div class="select-target-group">
          <div class="select-avatar" v-if="groupSend.groupList" :key="index"
               v-for="(item,index) in groupSend.groupList"
               @mouseenter="handleEnter(true)"
               @mouseleave="handleEnter(false)">
            <el-image
              :src="item.groupAvatar"
              fit="cover"></el-image>
            <el-button v-show="isShow" @click="delGroup(item.groupId)" icon="el-icon-close" circle size="mini"  />
          </div>
          <el-button @click="showComponent(3)" size="medium" icon="el-icon-plus" circle/>
        </div>
      </el-form-item>
      <el-form-item label="发送时间" prop="timing">
        <el-radio-group v-model="groupSend.type">
            <el-radio :label="1">即时发送</el-radio>
            <el-radio :label="2">定时发送
              <el-date-picker
                :disabled="groupSend.type === 1"
                v-model="groupSend.timing"
                value-format="yyyy-MM-dd HH:mm:ss"
                type="datetime"
                placeholder="选择日期时间">
              </el-date-picker>
            </el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item>
          <el-button
            size="mini"
            type="primary"
            icon="el-icon-circle-check"
            @click="save(false)"
          >直接提交</el-button>
<!--          <el-button-->
<!--            size="mini"-->
<!--            type="success"-->
<!--            icon="el-icon-document"-->
<!--            @click="save(true)"-->
<!--          >提交审核</el-button>-->
          <el-button
            size="mini"
            icon="el-icon-circle-close"
            @click="goBack"
          >取消</el-button>
      </el-form-item>
    </el-form>

    <el-dialog :close-on-click-modal="false" :width="dialogWidth" :visible.sync="dialogView">
      <div slot="title" class="dialog-footer">
          <span>{{dialogTitle}}</span>
          <el-checkbox @change="updateAllGroupSelectStatus"
                       v-if="componentName === 'selectGroup'"
                       v-model="isSelectAll">全选
          </el-checkbox>
      </div>
      <component
        ref="selectGroup"
        :is="componentName"
        :close="hideComponent"
        :saveComponentData="saveComponentData"
        :updateSelectAllStatus="updateSelectAllStatus"
        :isSelect="true"
        @handleGroupList="selectGroupList"
        :isSelectAll="isSelectAll"
        :initGroupList="initGroupList"/>
    </el-dialog>

  </div>
</template>

<script>
  import Vue from 'vue'

  import SelectGroup from '@/components/SelectGroup'
  import SelectPhoto from '@/components/SelectPhoto'
  import SelectText from '@/components/SelectText'
  import SelectVideo from "@/components/VideoPlay"
  import GuessSong from "@/components/GuessSong"

  import {save} from '../../../api/groupDaily/groupSend'

  export default {
    name: "edit",
    components: {
      SelectGroup,
      SelectPhoto,
      SelectText,
      SelectVideo,
      GuessSong

    },
    data() {
      return {
        reviewer:{
          type: [],
        },
        isShow: true,
        dialogTitle: '',
        dialogReviewer:false,
        dialogView: false,
        isSelectAll: false,
        dialogWidth: '666px',
        componentName: 'selectText',// 组件名称
        initGroupList: [], // 初始化目标群,解决dialog未加载调用不了子组件方法回显数据
        groupSendRules: {
          content: [{ required: true, message: '请输入回复内容', trigger: 'blur' }],
          groupList: [{ validator: this.validateGroupList, trigger: 'blur' }],
          timing: [{ validator: this.validateTiming, trigger: 'blur' }],
        },
        groupSend: {
          groupList: [],
          content: '',
          contentType: 1, // 内容类型 1-文本 2-图片
          type: 1, // 发送类型 1-及时发送 2-定时发送
          groupIds: '',
          timing: '',
          isAuditing: true
        },
      }
    },
    methods: {
      //选中的群
      selectGroupList(list){
        this.groupSend.groupList=list
      },
      validateTiming(rule, value, callback){
        if(this.groupSend.type === 2 && !this.groupSend.timing){
          callback(new Error('请选择定时发送日期'));
          return;
        }
        callback();
      },
      //选择群的表单校验
      validateGroupList(rule, value, callback){
        if (! this.groupSend.groupList || !this.groupSend.groupList.length) {
          callback(new Error('请选择目标群'));
          return;
        }
        callback();
      },
      /**
       * 保存群发信息
       * @param isAuditing 是否提交审核
       */
      save(isAuditing) {
        this.$refs['groupSendForm'].validate(async (valid) => {
          if (!valid) {
            return;
          }
          this.groupSend.isAuditing = isAuditing;

          if( this.groupSend.type ===1){
            this.groupSend.timing = ''
          }
          // 处理关键字数据
          this.groupSend.groupIds = this.groupSend.groupList.map(item => item.groupId).join(',');

          await save(this.groupSend);
          this.$message.success('保存成功');
          this.goBack();

        })
      },
      goBack(){
        this.PubSub.publish('delTag',this.$route.path);
      },
      hideComponent() {
        this.dialogView = false;
      },
      saveComponentData(data, type) {
        switch (type) {
          case 1: // 保存文本
            this.groupSend.content = data;
            this.groupSend.contentType = 1;
            break;
          case 2: { // 保存图片
            this.groupSend.contentType = 2;
            this.groupSend.content = data;
            break;
          }
          case 3: {
            this.groupSend.groupList = data;
            break;
          }
        }
        this.dialogView = false;
      },
      // 显示组件
      showComponent(componentType) {

        // 1 选择文本  2选择图片 3选择群组
        switch (componentType) {
          case 1: {
            this.dialogWidth = '500px';
            this.dialogTitle = '选择文本';
            this.componentName = 'selectText';
            break;
          }
          case 2: {
            this.dialogWidth = '500px';
            this.dialogTitle = '选择图片';
            this.componentName = 'selectPhoto';
            break;
          }
          case 3: {
            this.dialogWidth = '360px';
            this.dialogTitle = '选择群组';
            this.componentName = 'selectGroup';
            break;
          }
          case 4: {
            this.dialogWidth = '620px';
            this.dialogTitle = '视频';
            this.componentName = 'SelectVideo';
            break;
          }
          case 5: {
            this.dialogWidth = '620px';
            this.dialogTitle = '音乐';
            this.componentName = 'GuessSong';
            break;
          }
        }

        this.dialogView = true;
      },
      /**
       * 删除目标群
       * @param id 群id
       */
      delGroup(id) {
        const groupList = this.groupSend.groupList;
        const index = groupList.findIndex(item => item.groupId === id);

        if (index !== -1) {
          groupList.splice(index, 1);
          // 修改本组件数据
          Vue.set(this.groupSend, 'groupList', groupList)
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

      //关键词的添加
      handleClose(tag) {
        this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1);
      },
      handleEnter(isEnter) {
        return this.isShow = isEnter;
      }
    }
  }
</script>

<style  lang="scss" scoped>
  .el-radio-group{
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    height: 100px;
  }
</style>
