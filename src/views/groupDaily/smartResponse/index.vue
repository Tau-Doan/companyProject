<template>
  <div class="app-container">
    <el-form ref="automaticAnswer" :model="automaticAnswer" :rules="automaticAnswerRules"  label-width="180px" label-position="left">
      <el-form-item label="智能回复">
        <el-switch v-model="automaticAnswer.status" :active-value="1" :inactive-value="2"></el-switch>
        <span class="smartReply">关闭后，机器人将不再和群内用户进行AI对话</span>
      </el-form-item>
      <el-form-item label="是否需要@助手号启动">
        <el-radio-group v-model="automaticAnswer.noticeAssistant">
          <el-radio :label="true">是</el-radio>
          <el-radio :label="false">否</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="选择目标群" prop="groupIds">
        <!--          选择目标群样式-->
        <div class="select-target-group">
          <div class="selectAvatar" v-if="automaticAnswer.groupList" :key="index"
               v-for="(item,index) in automaticAnswer.groupList" @mouseenter="handleEnter(true)"
               @mouseleave="handleEnter(false)">
            <el-image
              :src="item.groupAvatar"
              fit="cover"></el-image>
            <el-button v-show="isShow" @click="delGroup(item.groupId)" icon="el-icon-close" circle size="mini"></el-button>
          </div>
          <div class="addAvatarPushButton">
            <el-button @click="showComponent" circle><i class="el-icon-plus amplify"></i></el-button>
          </div>
        </div>
      </el-form-item>
      <div class="smartResponse">
        <el-button type="primary" @click="save">保存配置</el-button><br>
        <span>使用示例：微信群内@助手微信+“你想说的话”</span> <br>
        <span>回复范畴：图片搜索、笑话、故事、新闻资讯、绕口令、成语接龙、天气查询、列车查询、股票、汽油等</span>
      </div>

    </el-form>

    <el-dialog :close-on-click-modal="false" width="400px" height="700px" footer="222" :visible.sync="dialogView">
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
        @handleGroupList="selectGroupList"
        :initGroupList="initGroupList"
      ></selectGroup>
    </el-dialog>
  </div>
</template>

<script>
  import Vue from 'vue'

  import SelectGroup from '@/components/SelectGroup';
  import {save,getAutomaticAnswer} from '../../../api/groupDaily/smartResponse'
    export default {
      name: "smartResponse",
      components: {
        SelectGroup
      },
      mounted(){
        this.findAutomaticAnswer();
      },
      data(){
        return {
          dialogTitle: '选择群组',
          initGroupList: [], // 初始化目标群,解决dialog未加载调用不了子组件方法回显数据
          dialogView: false,
          isShow: false,
          isSelectAll: false,
          automaticAnswer: {
            groupList:[],
            groupIds: '',
            noticeAssistant: false, // 是否艾特助手号
            status: 1, // 状态，1开始 2关闭
          },
          automaticAnswerRules:{
            groupIds: [
              {  validator: this.valigroup, trigger: 'blur' },
            ],
          },
        }
      },

      methods:{
        //选中的群
        selectGroupList(list){
          this.automaticAnswer.groupList=list
        },
        valigroup(rule, value, callback) {
          if (!this.automaticAnswer.groupList || !this.automaticAnswer.groupList.length) {
            callback(new Error('请选择目标群'));
            return;
          }
          callback();
        },
        async findAutomaticAnswer(){
          const result = await getAutomaticAnswer();
          this.automaticAnswer = result.data;
          this.initGroupList = this.automaticAnswer.groupList;
        },
         save(){
          this.$refs["automaticAnswer"].validate(async (valid) => {
            if (!valid) {
              return false;
            }
            this.automaticAnswer.groupIds = this.automaticAnswer.groupList.map(item => item.groupId).join(',');
            await save(this.automaticAnswer)
            this.$message.success('保存成功')
          })
        },
        hideComponent() {
          this.dialogView = false;
        },
        saveComponentData(data) {
          this.automaticAnswer.groupList = data;
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
          const groupList = this.automaticAnswer.groupList;
          const index = groupList.findIndex(item => item.groupId === id);

          if (index !== -1) {
            groupList.splice(index, 1);
            // 修改本组件数据
            Vue.set(this.automaticAnswer, 'groupList', groupList)
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
      }
    }
</script>

<style lang="scss" scoped>
  .smartResponse{
  .el-button{
    margin-bottom: 30px;
  }
  span{
    font-size: 13px;
    color: #909399;
  }
  }
  .smartReply{
    font-size: 13px;
    margin-left: 40px;
    color: #909399;
  }
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
