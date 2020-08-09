<template>
  <div class="app-container">
    <div class="groupEssenceHead">
      <div class="groupEssenceTargetGroup">
        <span>选择目标群 </span>
        <div class="selectTheTargetGroup">
          <div class="selectAvatar" v-if="group.groupId" @mouseenter="handleEnter(true)"
               @mouseleave="handleEnter(false)">
            <el-image
              :src="group.groupAvatar"
              fit="cover"/>
            <el-button v-show="isShow"  @click="delGroup(group.groupId)"  circle size="mini"    icon="el-icon-close"></el-button>
          </div>
          <div class="addAvatarPushButton">
            <el-button circle @click="showComponent"><i class="el-icon-plus amplify"/>
            </el-button>
          </div>
        </div>
      </div>

      <div class="groupEssenceTime">
        <span class="demonstration">开始时间</span>
        <el-date-picker
          @change="handlerDateChange"
          v-model="dateArray"
          value-format="yyyy-MM-dd HH:mm:ss"
          type="datetimerange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期">
        </el-date-picker>
        <el-button type="primary" @click="findMessageList">查询</el-button>
      </div>
    </div>

    <!--      列表-->
    <h1 v-if="!messageList.length">暂无记录</h1>
    <div v-else class="messageList" >
      <el-scrollbar style="height:100%;overflow: hidden">
      <el-checkbox-group
        v-model="messageIds"
        @change="handleCheckedMessageChange"
      >
        <div class="groupEssence" :key="index" v-for="(item,index) in messageList" >
          <el-checkbox name="type" :label="item.id">
            <div class="groupEssenceCheckbox">
              <div class="groupEssenceCheckboxContent">
                <div class="groupEssenceCheckboxAvatar">
                  <el-image
                    :src="item.avatar"
                    fit="cover"></el-image>
                </div>
                <div class="groupEssenceChatContent">
                  <div class="groupEssenceName">{{item.nickname}}</div>
                  <div class="groupEssenceChat">
                    <div class="MessageContent">
                      <span v-if="item.msgType === 2001">{{item.content}}</span>
                    </div>
                    <div v-if="item.msgType === 2002" style="max-width: 200px">
                      <el-image
                        fit="cover"
                        :src="item.content">
                      </el-image>
                    </div>
                    <div class="AudioPlayback" v-if="item.msgType === 2003">
                      <el-button @click="play(item)" :class="!item.isPlay?'el-icon-video-play':'el-icon-video-pause'"/>
                    </div>
                    <el-button v-if="item.msgType === 2004" type="primary" @click="openVideoPlay(item.shareUrl)">播放视频
                    </el-button>
                    <span v-if="item.msgType === 2005">{{item.shareUrl}}</span>
                    <span v-if="item.msgTYpe === 2013">{{tiem.content}}</span>
                  </div>
                </div>
              </div>
              <div class="groupEssenceCheckTime">
                <span>{{item.msgTime}}</span>
              </div>
            </div>
          </el-checkbox>
        </div>
      </el-checkbox-group>
      </el-scrollbar>
    </div>
    <div class="submitTo" v-if="(this.dialogView == false)">
      <el-checkbox
        :indeterminate="isIndeterminate"
        v-model="checkAll"
        @change="handleCheckAllChange">全选
      </el-checkbox>
      <el-button type="primary" @click="openSavePage">提交</el-button>
      <el-button @click="cancel">取消</el-button>
    </div>


    <el-dialog width="360px" title="选择目标群" height="520px" footer="222" :visible.sync="dialogView"
               :close-on-click-modal="false">
      <component
        :is="componentName"
        ref="selectGroup"
        :close="hideComponent"
        :updateSelectAllStatus="updateSelectAllStatus"
        :isSelect="true"
        :isSelectAll="false"
        :saveComponentData="saveComponentData"
        @handleGroupList="selectGroupList"
        :initGroupList="initGroupList">
      </component>
    </el-dialog>

    <el-dialog width="560px" title="生成群精华" height="520px" footer="222" :visible.sync="dialogCream"
               :close-on-click-modal="false">
      <el-form ref="essence" :model="essence" label-position="top" :rules="essenceRule" label-width="80px">
        <div class="groupEssenceNameContent">
          <el-form-item label="群精华名称" prop="name">
            <el-input v-model="essence.name" placeholder="请输入内容"></el-input>
          </el-form-item>
          <el-form-item label="群精华首图" prop="image">
            <div class="groupEssenceNameContentImg">
              <div class="searchPhotoButton">
                <el-upload
                  class="avatar-uploader"
                  :headers="headers"
                  :action="uploadServerUrl"
                  :show-file-list="false"
                  :multiple="true"
                  :on-success="handleAvatarSuccess"
                  :before-upload="checkPhoneFileTypeAndFileSize">
                  <el-image
                    v-if="essence.image" :src="essence.image"
                    style="width: 100px; height: 100px"
                    fit="fit"></el-image>
                  <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                </el-upload>
              </div>
            </div>
          </el-form-item>
          <el-button class="saveBut" type="primary" @click="save">确定</el-button>
        </div>
      </el-form>

    </el-dialog>

    <!--视频弹框组件-->
    <el-dialog
      title="播放视频"
      :visible.sync="showVideoPlay"
      width="30%">
      <video-play :videoUrl="videoUrl" v-if="showVideoPlay"/>
      <span slot="footer" class="dialog-footer">
                    <el-button @click="showVideoPlay = false">关闭</el-button>
                 </span>
    </el-dialog>
  </div>
</template>

<script>
  import BenzAMRRecorder from "benz-amr-recorder";

  import SelectGroup from '@/components/SelectGroup';
  import VideoPlay from '@/components/VideoPlay';
  import { getToken } from "@/utils/auth";

  import {findOne,findMessageList,save} from '../../../api/groupDaily/groupEssence';

  const BASE_URL = process.env.VUE_APP_BASE_API;
  export default {
    name: "edit",
    components: {
      SelectGroup,
      VideoPlay
    },
    data() {
      return {
        videoUrl: '',
        showVideoPlay: false,
        headers: { Authorization: "Bearer " + getToken() },
        uploadServerUrl: `${BASE_URL}/common/upload`,
        groupEssenceName: '',
        dialogCream: false,
        checkAll: false,
        isIndeterminate: true,
        initGroupList: [], // 初始化目标群,解决dialog未加载调用不了子组件方法回显数据
        dialogView: false,//是否显示窗口,
        componentName: 'selectGroup',//打开的子组件
        dialogTitle: '选择群组',
        isShow: false,  //删除群按钮
        dateArray: [],//时间
        essence: {
          image: '',
          groupId: '',
          messageIds: '',
          name: '',
        },
        messageIds: [], // 选中的群消息
        parameter: {
          groupId: '',
          startDate: '',
          endDate: '',
        },
        group: {},
        messageList: [],
        essenceRule: {
          image: [
            {validator: this.validateImage, trigger: 'blur'},
          ],
          name: [
            {required: true, message: '请输入群精华名称', trigger: 'blur'},
          ],
        },
      }
    },
    methods: {
      //选中的群
      selectGroupList(list){
        if(list.length>1){
          this.$message.error('只能选择一个群');
          return
        }
        this.group=list[0]
      },
      openVideoPlay(videoUrl) {
        this.videoUrl = videoUrl;
        this.showVideoPlay = true;
      },
      /**
       * 暂停所有播放
       */
      pause() {
        this.messageList.forEach(source => {
          if (source.amr && source.amr.isPlaying()) {
            source.amr.pause();
          }
        });
      },
      // 播放音频
      async play(item) {
        // 创建amr
        try {

          if (!item.amr) {
            item.amr = new BenzAMRRecorder();
            await item.amr.initWithUrl(item.content); // 初始化
          }
        } catch (e) {
          this.$message.error('音频初始化失败，请检查网络或者音频地址');
          return false;
        }

        if (!item.isPlay) {
          item.amr.play();
          item.isPlay = true;
        } else {
          item.amr.pause();
          item.isPlay = false;
        }
        item.amr.onEnded(() => {
          item.isPlay = false;
          this.$forceUpdate();
        });

        this.messageList.filter(message => message.msgType === 2003)
          .forEach(message => {
            if (message.id !== item.id && message.amr) {
              message.amr.pause();
              message.isPlay = false;
            }
          });
        this.$forceUpdate();
      },
      async findOne(id) {
        const result = await findOne({id});
        const {messageList, messageIds, group} = result.data;
        this.essence = result.data;
        this.group = group;
        this.messageList = Object.freeze(messageList);
        this.messageIds = messageIds.split(',').map(item => parseInt(item));

        this.checkAll = this.messageList.length === this.messageIds.length;
      },
      validateImage(rule, value, callback) {
        if (!this.essence.image) {
          callback(new Error('请选择群精华首图'));
          return;
        }
        callback();
      },
      /**
       * 打开保存页面
       */
      openSavePage() {
        if (!this.messageIds.length) {
          this.$message.error('请选择群消息');
          return;
        }
        this.dialogCream = true
      },
      /**
       * 保存
       */
      save() {
        this.$refs['essence'].validate(async (valid) => {
          if (!valid) {
            return false;
          }
          this.essence.messageIds = this.messageIds.join(',');
          this.essence.groupId = this.group.groupId;

          await save(this.essence);
          this.cancel();
          //调转到上一级
          this.$router.go(-1)
        });
      },
      /**
       * 取消
       */
      cancel(){
        // 发布删除tag删除
        this.PubSub.publish('delTag',this.$route.path);
      },
      /**
       * 处理时间改变
       */
      handlerDateChange(date) {
        !date && (date = []);
        const [startDate, endDate] = date;
        this.parameter.startDate = startDate;
        this.parameter.endDate = endDate;
        this.findMessageList();
      },
      handleAvatarSuccess(res, file) {
        if (res.code !== 200) {
          this.$message.error(res.msg);
          return;
        }
        this.essence.image = res.url;
      },
      handleCheckedMessageChange(value) {
        let checkedCount = value.length;
        this.checkAll = checkedCount === this.messageList.length;
        this.isIndeterminate = checkedCount > 0 && checkedCount < this.messageList.length;
      },
      handleCheckAllChange(val) {
        this.messageIds = !val ? [] : this.messageList.map(item => item.id);
        this.isIndeterminate = false;
      },
      async findMessageList() {
        const groupId = this.group.groupId;
        if (!groupId) {
          this.$message.error('请选择群');
          return;
        }
        this.parameter.groupId = groupId;

        const result = await findMessageList(this.parameter);

        this.messageList = Object.freeze(result.data);
        this.messageList.forEach(item => item.checked = false);
      },
      handleEnter(isEnter) {
        return this.isShow = isEnter;
      },
      hideComponent() {
        this.dialogView = false;
      },
      saveComponentData(data) {
        if (data && data.length > 1) {
          this.$message.warning("只能选择一个群哦");
          return;
        }
        [this.group] = data;
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
        this.group = {};
        // 修改子组件数据, 子组件渲染则调用
        if (this.$refs.selectGroup) {
          this.$refs.selectGroup.updateGroupSelectStatus(id);
        } else {
          this.initGroupList = [this.group]; // 解构，防止数组强引用
        }
        // 强制刷新
        this.$forceUpdate();
      },
      updateSelectAllStatus(isSelectAll) {
      },

    },
    mounted() {
      const {id} = this.$route.params;
      parseInt(id) && this.findOne(id);
    },
    destroyed() {
      this.pause();
    }
  }
</script>

<style scoped lang="scss">
  .app-main{
    background-color: #F5F5F5;
  }
  .app-container{
    height: 100%;
  }
  .contentContainer {
  }

  .saveBut{
    width: 200px;
    margin: 0 auto;
  }

  .groupEssenceHead {
    width: 80%;
    display: flex;
    justify-content: space-between;
    flex-wrap: nowrap;
    align-items: center;

    .groupEssenceTargetGroup {
      /*width: 300px;*/
      display: flex;
      justify-content: center;
      height: 64px;
      line-height: 64px;
      .selectTheTargetGroup{
        display: flex;
        justify-content: space-between;
      }
      .selectAvatar{
        .el-image{
          width: 80px;
          height: 80px;
        }
      }
      span {
        margin-right: 25px;
      }
    }
    .groupEssenceTime {
      width: 600px;
      display: flex;
      justify-content: space-between;
      flex-wrap: nowrap;
      align-items: center;
      .el-date-picker {
        margin: auto 20px;
      }
    }
  }

  /*多选框*/
  .groupEssenceCheckbox {
    display: flex;
    justify-content: space-between;
    flex-wrap: nowrap;
    flex-direction: row;
    align-items: flex-start;
    width: 50vw;
    min-width: 900px;
    border-radius: 4px;
    color: #303133;
    transition: .3s;
    .groupEssenceCheckboxContent {
      display: flex;
      justify-content: flex-start;
      flex-wrap: nowrap;
      flex-direction: row;
      align-items: flex-start;
      .groupEssenceChatContent {
        display: flex;
        justify-content: flex-start;
        flex-wrap: wrap;
        flex-direction: column;
        .groupEssenceName {
          max-width: 88%;
          margin: 10px 0;
          color: #5e6d82;
          word-break: break-all;
          white-space:normal;
          overflow: hidden;
        }
        .groupEssenceChat {
          display: flex;
          justify-content: flex-start;
          flex-wrap: wrap;
          flex-direction: column;
          .el-button{
            width: 100px;
          }
          .MessageContent{
            width: 35vw;
            word-wrap: break-word;
            word-break: break-all;
            overflow: hidden;
            span{
              display: block;
              word-wrap: break-word;
              word-break: break-all;
            }
          }
        }
      }
    }

    .groupEssenceCheckboxAvatar {
      margin: 0 15px;

      .el-image {
        width: 50px;
        height: 50px
      }
    }

    .groupEssenceCheckTime {
      margin: 10px 0;
    }
  }

  .messageList{
    height:60vh;
    background-color: #F5F5F5;
  }

  .groupEssence {
    width: 55vw;
    min-width: 1000px;
    padding: 15px;
    margin: 15px 0;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, .1);
    border-radius: 4px;
    border: 1px solid #ebeef5;
    background-color: #fff;
    /*overflow: hidden;*/
    color: #303133;
    transition: .3s;
    .el-checkbox, .el-checkbox__input {
      white-space: normal;
      word-break: break-all;
    }
  }

  .submitTo {
    /*width: 250px;*/
    width: 80%;
    position: fixed;
    bottom: 20px;
    right: 0;
    left: 219px;
    padding-left: 37px;
    /*background-color: #F5F5F5;*/
    z-index: 9999;
    .el-checkbox {
      margin-right: 10px;
    }
  }

  .groupEssenceNameContent {
    display: flex;
    justify-content: space-between;
    flex-direction: column;

    .el-input {
      width: 300px;
    }

    .groupEssenceNameContentImg {
      display: flex;

      .el-image {
        width: 100px;
        height: 100px;
      }
    }
  }

  .searchPhotoButton {
    width: 98px;
    height: 98px;
    border: 1px dashed #d9d9d9;
    margin-left: 10px;

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
      font-size: 28px;
      color: #8c939d;
      width: 90px;
      height: 90px;
      line-height: 90px;
      text-align: center;
    }

    .avatar {
      width: 178px;
      height: 178px;
      display: block;
    }
  }

  //隐藏el-scrollbar的X滚动条
  .el-scrollbar{
    /*margin: 20px;*/
    margin: 20px 0 0 20px;
    padding-bottom:5px ;
    box-sizing: border-box;
    overflow-x: hidden;
  }
  /deep/.el-scrollbar__wrap {
    overflow-x: hidden;
  }
 /deep/ .el-scrollbar__bar.is-horizontal{
    display: none;
  }
  //选择小图标在上面
  .selectTheTargetGroup{
    display: flex;
    align-items: center;
  }
  .selectAvatar{
    position: relative;
    margin-top: 20px;
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
