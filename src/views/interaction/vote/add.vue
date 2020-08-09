<template>
  <div class="app-container">
    <el-form ref="voteForm" :rules="voteRules" :model="vote" label-width="50%" label-position="top">
      <el-form-item prop="title">
        <span class="rowHeight">投票主题</span>
        <el-input v-model="vote.title" placeholder="请输入不超过100字主题" maxlength="100"
                  show-word-limit/>
      </el-form-item>
      <el-form-item prop="content">
        <span class="rowHeight">投票详情</span>
        <el-input
          type="textarea"
          placeholder="请输入内容"
          v-model="vote.content"
          :rows="15"
          maxlength="500"
          show-word-limit
        >
        </el-input>
      </el-form-item>
      <el-form-item prop="voteTime">
        <span class="rowHeight votingTime">投票时间</span>
        <el-date-picker
          v-model="vote.voteArray"
          value-format="yyyy-MM-dd HH:mm:ss"
          type="datetimerange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期">
        </el-date-picker>
      </el-form-item>

      <el-form-item prop="option" label-position="right">
        <span class="rowHeight votingTime">定义选项</span>
        <el-button type="primary" @click="addOptionNumber">新增选项</el-button>
        <div class="option">
          <div :key="index" v-if="index < optionNumber" v-for="(item,index) in options" class="custom">
            <span>{{item.name}}</span>
            <el-input v-model="item.content" placeholder="请输入" style="width: 120px"></el-input>
          </div>
        </div>
      </el-form-item>
      <el-form-item label="上传图片（支持上传一张图片）：" prop="image">
        <el-upload
          :headers="headers"
          :action="uploadServerUrl"
          :show-file-list="false"
          :multiple="true"
          :on-success="handleAvatarSuccess"
          :before-upload="checkPhoneFileTypeAndFileSize">
          <el-image v-if="vote.image" :src="vote.image" class="avatar"/>
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>
      <div class="Content">
        <span class="rowHeight">选择目标群</span>
        <el-form-item prop="groupIds">
          <div class="selectTheTargetGroup">
            <div class="selectAvatar"  :key="index" v-for="(item,index) in vote.groupList" @mouseenter="handleEnter(true)"
                 @mouseleave="handleEnter(false)">
              <el-image
                :src="item.groupAvatar"
                fit="cover"></el-image>
              <el-button v-show="isShow" circle type="text" @click="delGroup(item.groupId)"><i
                class="el-icon-close"></i></el-button>
            </div>
            <div class="addAvatarPushButton">
              <el-button  @click="showComponent" circle><i class="el-icon-plus amplify"></i></el-button>
            </div>
          </div>
        </el-form-item>
      </div>

      <el-form-item>
        <el-button type="primary" @click="save">发送</el-button>
        <el-button @click="close">取消</el-button>
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
      <component :is="componentName"
                 ref="selectGroup"
                 :close="hideComponent"
                 :updateSelectAllStatus="updateSelectAllStatus"
                 :isSelect="true"
                 :isSelectAll="isSelectAll"
                 :saveComponentData="saveComponentData"
                 :initGroupList="initGroupList"/>
    </el-dialog>

  </div>

</template>

<script>
  import Vue from 'vue'

  import { getToken } from "@/utils/auth";
  import SelectGroup from '../../../components/SelectGroup'
  const BASE_URL = process.env.VUE_APP_BASE_API;
  import {save} from "../../../api/interaction/vote"

  export default {
    name: "addVote",
    components: {
      SelectGroup
    },
    data() {
      return {
        headers: { Authorization: "Bearer " + getToken() },
        uploadServerUrl: `${BASE_URL}/common/upload`,
        uploadParams: {type: 'default'},
        uploadName: 'image',
        isShow:false,
        isSelectTime: false,
        isSelectNumber: false,
        initGroupList: [], // 初始化目标群,解决dialog未加载调用不了子组件方法回显数据
        isSelectAll: false,
        componentName: 'SelectGroup',
        dialogView: false,//是否显示窗口,
        // 选项名称数组
        optionNumber: 0, // option显示数量
        options: [
          {name: '选项一', content: '',},
          {name: '选项二', content: '',},
          {name: '选项三', content: '',},
          {name: '选项四', content: '',},
          {name: '选项五', content: '',},
          {name: '选项六', content: '',}
        ],
        vote: {
          groupIds: '',
          title: '',
          content: '',
          option1: '',
          option2: '',
          option3: '',
          option4: '',
          option5: '',
          option6: '',
          startTime: '',
          image: '',
          endTime: '',
          voteArray: [], // 投票时间数组
          groupList: []
        },
        voteRules: {
          title: [
            {required: true, message: '请输入话题主题', trigger: 'blur'},
            {min: 1, max: 100, message: '长度不能大于100字', trigger: 'blur'}
          ],
          content: [
            {required: true, message: '请输入投票详情', trigger: 'blur'},
            {min: 1, max: 500, message: '长度不能大于500字', trigger: 'blur'}
          ],
          // content: [{validator: this.validateContent, trigger: 'blur'}],
          groupIds: [{validator: this.validateGroupIds, trigger: 'blur'}],
          option: [{validator: this.validateOption, trigger: 'blur'}],
          voteTime: [{validator: this.validateVoteTime, trigger: 'blur'}],
          image: [
            {required: true, message: '请上传图片', trigger: 'blur'},
          ],
        },
      }
    },
    methods: {
      handleAvatarSuccess(res, file) {
        if (res.code !== 200) {
          this.$message.error(res.message);
          return;
        }
        this.vote.image = res.fileName;
        this.$forceUpdate();
      },
      handleEnter(isEnter) {
        return this.isShow = isEnter;
      },
      hideComponent() {
        this.dialogView = false;
      },
      saveComponentData(data,) {
        this.vote.groupList = data;
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
        const groupList = this.vote.groupList;
        const index = groupList.findIndex(item => item.groupId === id);

        if (index !== -1) {
          groupList.splice(index, 1);
          // 修改本组件数据
          Vue.set(this.vote, 'groupList', groupList);
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
      // 投票时间
      validateVoteTime(rule, value, callback) {
        if (!this.vote.voteArray || !this.vote.voteArray.length) {
          callback(new Error('请填写投票时间'));
        }

        callback();

      },
      // 校验选项
      validateOption(rule, value, callback) {

        const optionNumber = this.optionNumber;
        // 校验选项内容
        for (let i = 0; i < optionNumber; i++) {
          const option = this.options[i]
          if (!option.content) {
            callback(new Error('请填写选项内容'));
            return;
          }
        }
        callback();
      },
      // 校验群id
      validateGroupIds(rule, value, callback) {
        if (!this.vote.groupList || !this.vote.groupList.length) {
          callback(new Error('请选择目标群'));
          return;
        }
        callback();
      },
      // 校验内容
      validateContent(rule, value, callback) {
        // 获取富文本框内容
        const content = this.vote.content;
        if (!content) {
          callback(new Error('请填写话题详情内容'));
          return;
        }
        callback();
      },
      /**
       * 增加option数量
       */
      addOptionNumber() {
        const optionNumber = this.optionNumber + 1;

        if (optionNumber > 6) {
          this.$message.info('选项最多只能为6个')
          return;
        }

        this.optionNumber = optionNumber;
      },
      save() {
        this.$refs.voteForm.validate(async (valid) => {
          if (!valid) {
            return false;
          }

          const [startTime, endTime] = this.vote.voteArray;
          // 赋值选项数据
          this.options.forEach((item,index) => this.vote[`option${index + 1}`] = item.content);

          this.vote.content =  this.vote.content;
          this.vote.groupIds = this.vote.groupList.map(item => item.groupId).join(',');
          this.vote.startTime = startTime;
          this.vote.endTime = endTime;

          await save(this.vote);
          this.$message.success("操作成功");
          this.PubSub.publish('delTag',this.$route.path);
        });
      },
      close(){
        this.PubSub.publish('delTag',this.$route.path);
      },
      // 初始化富文本
      initEditor() {
        this.editor = getEditorInstance(this.$refs.editorElem);
        // 创建富文本
        this.editor.create();
      }
    },
    mounted() {
      // this.initEditor();
    }
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
  .custom{
    .el-input{
      margin: 5px 0;
    }
  }
</style>
