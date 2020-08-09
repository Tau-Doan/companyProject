<template>
  <div class="app-container">
      <el-form ref="talkFrom" :rules="talkRules" :model="talk" label-width="15%" label-position="left">
        <el-form-item label="话题主题" prop="title">
          <el-input v-model="talk.title" placeholder="请输入不超过100字主题" maxlength="100"
                    show-word-limit/>
        </el-form-item>
        <el-form-item label="话题详情" prop="content">
          <el-input
            type="textarea"
            placeholder="请输入内容"
            v-model="talk.content"
            :rows="15"
            maxlength="500"
            show-word-limit
          >
          </el-input>
        </el-form-item>
        <el-form-item label="上传图片（支持上传一张图片）：" prop="image">
          <el-upload
            :headers="headers"
            :action="uploadServerUrl"
            :show-file-list="false"
            :multiple="true"
            :on-success="handleAvatarSuccess"
            :before-upload="checkPhoneFileTypeAndFileSize">
            <el-image v-if="talk.image" :src="talk.image" class="avatar"/>
            <i v-else class="el-icon-plus avatar-uploader-icon"/>
          </el-upload>
        </el-form-item>
        <div class="Content">
          <el-form-item label="选择目标群" prop="groupIds">
            <div class="selectTheTargetGroup">
              <div class="selectAvatar"  :key="index" v-for="(item,index) in talk.groupList" @mouseenter="handleEnter(true)"
                   @mouseleave="handleEnter(false)">
                <el-image
                  :src="item.groupAvatar"
                  fit="cover"/>
                <el-button v-show="isShow" circle type="text" @click="delGroup(item.groupId)"><i
                  class="el-icon-close"/></el-button>
              </div>
              <div class="addAvatarPushButton">
                <el-button  @click="showComponent" circle><i class="el-icon-plus amplify"></i></el-button>
              </div>
            </div>
          </el-form-item>
        </div>
        <el-form-item>
          <el-button type="primary" @click="saveTalk">发送</el-button>
          <el-button  @click="goBack">取消</el-button>
        </el-form-item>
      </el-form>

      <el-dialog :close-on-click-modal="false" width="30%" height="520px" footer="222" :visible.sync="dialogView">
        <div slot="title" class="dialog-footer">
          <h2 class="mt0">
            <span>选择目标群</span>
            <el-checkbox @change="updateAllGroupSelectStatus" v-model="isSelectAll" class="sdfr">全选
            </el-checkbox>
          </h2>
        </div>
        <component
          :is="componentName"
          ref="selectGroup"
          :updateSelectAllStatus="updateSelectAllStatus"
          :isSelect="true"
          :close="hideComponent"
          :isSelectAll="isSelectAll"
          @handleGroupList="selectGroupList"
          :saveComponentData="saveComponentData"
          :initGroupList="initGroupList"
        ></component>
      </el-dialog>
    </div>
</template>

<script>
  import Vue from 'vue'

  import { getToken } from "@/utils/auth";
  import SelectGroup from '../../../components/SelectGroup'
  const BASE_URL = process.env.VUE_APP_BASE_API;

  import { save} from "../../../api/interaction/talk"

  export default {
    name: "TalkRule",
    components: {
      SelectGroup
    },
    data() {
      return {
        headers: { Authorization: "Bearer " + getToken() },
        uploadServerUrl: `${BASE_URL}/common/upload`,
        uploadParams: {type: 'default'},
        isShow:false,
        isSelectAll: false,
        isSelectTime: false,
        isSelectNumber: false,
        initGroupList: [], // 初始化目标群,解决dialog未加载调用不了子组件方法回显数据
        dialogView: false,//是否显示窗口,
        componentName: 'SelectGroup',//打开的子组件
        dialogTitle: '选择群组',
        talk: {
          title: '',
          content: '',
          image: '',
          groupIds: '',
          groupList: []
        },
        talkRules: {
          title: [
            {required: true, message: '请输入话题主题', trigger: 'blur'},
            {min: 1, max: 100, message: '长度不能大于100字', trigger: 'blur'}
          ],
          // content: [{validator: this.validateContent, trigger: 'blur'}],
          content: [ {required: true, message: '请输入话题详情', trigger: 'blur'},
            {min: 1, max: 500, message: '长度不能大于500字', trigger: 'blur'}],
          groupIds: [{validator: this.validateGroupIds, trigger: 'blur'}],
          image: [{validator: this.validateImage, trigger: 'blur'}],
        }
      }
    },
    methods: {
      /* 选中的群*/
      selectGroupList(list){
        this.talk.groupList=list
      },
      goBack(){
          this.PubSub.publish('delTag',this.$route.path);
      },
      handleAvatarSuccess(res, file) {
        console.log(file)
        if (res.code !== 200) {
          this.$message.error(res.message);
          return;
        }
        this.talk.image = res.fileName;
        this.$forceUpdate();
      },
      validateImage(rule, value, callback) {
        if (!this.talk.image) {
          callback(new Error("请上传图片"));
          return;
        }

        callback();
      },
      handleEnter(isEnter) {
        return this.isShow = isEnter;
      },
      hideComponent() {
        this.dialogView = false;
      },
      saveComponentData(data) {
        this.talk.groupList = data;
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
        const groupList = this.talk.groupList;
        const index = groupList.findIndex(item => item.groupId === id);

        if (index !== -1) {
          groupList.splice(index, 1);
          // 修改本组件数据
          Vue.set(this.talk, 'groupList', groupList)
          // 修改子组件数据, 子组件渲染则调用
          if (this.$refs.SelectGroup) {
            this.$refs.SelectGroup.updateGroupSelectStatus(id);
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
        this.$refs.SelectGroup.updateAllGroupSelectStatus(this.isSelectAll);
      },
      /**
       * 更新选中状态
       */
      updateSelectAllStatus(isSelectAll) {
        this.isSelectAll = isSelectAll;
      },
      validateGroupIds(rule, value, callback) {
        if (!this.talk.groupList || !this.talk.groupList.length) {
          callback(new Error('请选择目标群'));
          return;
        }
        callback();
      },
      /**
       * 校验内容
       */
      validateContent(rule, value, callback) {
        // 获取富文本框内容
        const content = this.editor.txt.text();
        if (!content) {
          callback(new Error('请填写话题详情内容'));
          return;
        }
        callback();
      },

      /**
       * 保存话题
       */
       saveTalk() {

        this.$refs.talkFrom.validate(async (valid) => {
          if (!valid) {
            return false;
          }
            this.talk.content = this.talk.content;
            this.talk.groupIds = this.talk.groupList.map(item => item.id).join(',');

            await save(this.talk);
            this.$message.success("操作成功");
            this.PubSub.publish('delTag',this.$route.path);
        });
      },
    },
  }
</script>

<style scoped lang="scss">
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
