<template>
  <div class="app-container">
    <el-form class="demo-form-inline" ref="keywordForm" label-width="100px" :model="wtKeyword" :rules="keywordRules">
      <el-form-item label="关键词添加" prop="dynamicTags">
        <div class="addKeywords">
          <el-tag
            :key="tag"
            v-for="tag in dynamicTags"
            closable
            :disable-transitions="false"
            @close="handleClose(tag)">
            {{tag}}
          </el-tag>
          <el-input
            class="input-new-tag"
            v-if="inputVisible"
            v-model="inputValue"
            ref="saveTagInput"
            size="small"
            @keyup.enter.native="handleInputConfirm"
            @blur="handleInputConfirm">
          </el-input>
          <el-button  v-else class="button-new-tag" size="small" icon="el-icon-plus" @click="showInput">关键字</el-button>
        </div>
      </el-form-item>
      <el-form-item label="回复内容" prop="content">
          <el-input size="small" style="width: 400px" v-model="wtKeyword.content" disabled placeholder="输入回复内容"/>
          <el-button-group>
            <el-button size="mini" icon="el-icon-tickets" type="primary" @click="showComponent(1)">文本</el-button>
            <el-button size="mini" icon="el-icon-picture-outline" @click="showComponent(2)">图片</el-button>
          </el-button-group>
      </el-form-item>
      <el-form-item label="选择目标群" prop="groupList">
        <div class="select-target-group">
          <div class="select-avatar" v-if="wtKeyword.groupList" :key="index"
               v-for="(item,index) in wtKeyword.groupList"
               @mouseenter="handleEnter(true)"
               @mouseleave="handleEnter(false)">
            <el-image
              :src="item.groupAvatar"
              fit="cover"/>
            <el-button  v-show="isShow"  @click="delGroup(item.groupId)" size="mini"   icon="el-icon-close"  circle/>
          </div>
            <el-button @click="showComponent(3)" circle><i class="el-icon-plus amplify"></i></el-button>
        </div>
      </el-form-item>
      <el-form-item label="匹配模式">
        <div class="row">
          <el-checkbox :false-label="2" :true-label="1" v-model="wtKeyword.pattern">
            <el-tooltip placement="right">
              <div slot="content">勾选则聊天内容与关键词完全一致时触发回复；<br/>不勾选则聊天中包含关键词时即触发回复</div>
              <span>精确匹配<i class="el-icon-question"/></span>
            </el-tooltip>
          </el-checkbox>
        </div>
      </el-form-item>
        <el-button type="primary" @click="save">提交</el-button>
        <el-button @click="cancel">取消</el-button>
    </el-form>

    <el-dialog :close-on-click-modal="false" :width="dialogWidth" height="520px" footer="222" :visible.sync="dialogView">
      <div slot="title" class="dialog-footer">
        <h2 class="mt0">
          <span>{{dialogTitle}}</span>
          <el-checkbox @change="updateAllGroupSelectStatus" v-if="componentName === 'selectGroup'"
                       v-model="isSelectAll" class="sdfr">全选
          </el-checkbox>
        </h2>
      </div>
      <component
        ref="selectGroup"
        :is="componentName"
        :close="hideComponent"
        :saveComponentData="saveComponentData"
        :updateSelectAllStatus="updateSelectAllStatus"
        :isSelect="true"
        :isSelectAll="isSelectAll"
        :initGroupList="initGroupList"
        @handleGroupList="selectGroupList"
      ></component>
    </el-dialog>

  </div>
</template>

<script>
  import Vue from 'vue'
  import SelectGroup from '@/components/SelectGroup'
  import SelectPhoto from '@/components/SelectPhoto'
  import SelectText from '@/components/SelectText'

  import {findOne, save} from '../../../api/groupDaily/keyword'
    export default {
      name: "Edit",
      props: {
        params: Number
      },
      components:{
        SelectGroup,
        SelectPhoto,
        SelectText
      },
      data(){
          return{
            //校验规则
            keywordRules: {
              dynamicTags: [{validator: this.validateDynamicTags, trigger: 'blur'}],
              content: [{required: true, message: '请输入内容或者照片', trigger: 'blur'}],
              groupList: [{validator: this.validateGroupList, trigger: 'blur'}],
            },
            isShow: false,
            dialogTitle: '',
            dialogView: false,
            isSelectAll: false,
            dialogWidth: '30%',
            componentName: 'selectText',// 组件名称
            initGroupList: [], // 初始化目标群,解决dialog未加载调用不了子组件方法回显数据
            wtKeyword: {
              keyword: '',
              pattern: 2, // 匹配模式1-精准匹配 2-模糊匹配',
              groupIds: '',
              content: '',
              contentType: 1,
              groupList: [],
            },
            //关键词的添加
            dynamicTags: [],
            inputVisible: false,
            inputValue: '',
          }
      },
      methods:{
        /* 选中的群*/
        selectGroupList(list){
          this.wtKeyword.groupList=list
          console.log(this.wtKeyword.groupList)
        },
        //选择群的表单校验
        validateGroupList(rule, value, callback) {
          if (!this.wtKeyword.groupList || !this.wtKeyword.groupList.length) {
            callback(new Error('请选择目标群'));
            return;
          }
          callback();
        },
        //设置添加关键词
        validateDynamicTags(rule, value, callback) {
          if (!this.dynamicTags || !this.dynamicTags.length) {
            callback(new Error('请设置添加关键词'));
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
        saveComponentData(data, type) {
          switch (type) {
            case 1: // 保存文本
              this.wtKeyword.contentType = 1;
              this.wtKeyword.content = data;
              break;
            case 2: { // 保存图片
              this.wtKeyword.contentType = 2;
              this.wtKeyword.content = data;
              break;
            }
            case 3: {
              this.wtKeyword.groupList = data;
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
              this.componentName = 'selectText';
              break;
            }
            case 2: {
              this.dialogWidth = '500px';
              this.componentName = 'selectPhoto';
              break;
            }
            case 3: {
              this.dialogWidth = '360px';
              this.componentName = 'selectGroup';
              this.dialogTitle = '选择群组';
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
          const groupList = this.wtKeyword.groupList;
          const index = groupList.findIndex(item => item.groupId === id);

          if (index !== -1) {
            groupList.splice(index, 1);
            // 修改本组件数据
            Vue.set(this.wtKeyword, 'groupList', groupList)
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

        showInput() {
          this.inputVisible = true;
          this.$nextTick(() => {
            this.$refs.saveTagInput.$refs.input.focus();
          });
        },

        handleInputConfirm() {
          let inputValue = this.inputValue;
          if(inputValue.length > 20){
            this.$message.warning('关键字长度不能大于20');
            return;
          }
          if (inputValue) {
            this.dynamicTags.push(inputValue);
          }
          this.inputVisible = false;
          this.inputValue = '';
        },
        /**
         * 保存关键字
         */
        save() {
          this.$refs['keywordForm'].validate(async (valid) => {
            if (!valid) {
              return;
            }
           // console.log( this.wtKeyword.groupList[0])
            //处理从点击修改进来该页面的
            if(this.$route.params.id>0){
              this.wtKeyword.groupList[0].id=this.wtKeyword.groupList[0].groupId
            }
            // 处理关键字数据
            this.wtKeyword.keyword = this.dynamicTags.join(',');
            this.wtKeyword.groupIds = this.wtKeyword.groupList.map(item => item.groupId).join(',');
            await save(this.wtKeyword);
            this.$message.success("保存成功");
            this.cancel()
            //调转到上一级
            this.$router.go(-1)
          })
        },
        /**
         * 取消
         */
        cancel(){
          // 发布删除tag删除
          this.PubSub.publish('delTag',this.$route.path);
        },

        //查询所有的群
        async findOne(id) {
        const result = await  findOne({id});
        this.wtKeyword = result.data;
        // 拆分关键字
        this.dynamicTags = this.wtKeyword.keyword.split(',')
        this.initGroupList = this.wtKeyword.groupList;
        },
        //判断是否点击调转过来的界面



      },
      mounted() {
        const {id} = this.$route.params;


        parseInt(id) && this.findOne(id);
      }
    }
</script>

<style lang="scss" scoped>
  .addKeywords {
    height: 32px;
    .input-new-tag {
      width: 90px;
      margin-left: 10px;
      vertical-align: bottom;
    }
    .button-new-tag {
      margin-left: 10px;
      height: 32px;
      line-height: 30px;
      padding-top: 0;
      padding-bottom: 0;
    }
    .el-tag + .el-tag {
      margin-left: 10px;
    }
  }
</style>
