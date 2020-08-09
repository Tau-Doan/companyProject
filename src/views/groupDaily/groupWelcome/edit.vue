<template>
  <div class="app-container">
    <el-form class="demo-form-inline" label-position="left" label-width="100px"  ref="welcomeForm" :model="welcome" :rules="welcomeRules">
      <el-form-item label="发送内容"  prop="content">
          <el-input   v-model="welcome.content"
                       clearable
                       size="small"
                       style="width: 240px"   disabled />
          <el-button-group>
       <el-button
              size="mini"
              icon="el-icon-tickets"
              type="primary"
              @click="showComponent(1)"
            >文本</el-button>
            <el-button
              size="mini"
              icon="el-icon-picture-outline"
              @click="showComponent(2)"
            >图片</el-button>
          </el-button-group>
      </el-form-item>
      <el-form-item label="选择目标群" prop="groupList">
        <div class="select-target-group">
          <div class="select-avatar" v-if="welcome.groupList" :key="index"
               v-for="(item,index) in welcome.groupList"
               @mouseenter="handleEnter(true)"
               @mouseleave="handleEnter(false)">
            <el-image
              :src="item.groupAvatar"
              fit="cover"/>
            <el-button  v-show="isShow"  @click="delGroup(item.groupId)" size="mini"   icon="el-icon-close"  circle/>
          </div>
          <el-button @click="showComponent(3)" size="medium" icon="el-icon-plus" circle/>
        </div>
      </el-form-item>
      <el-form-item label="发送时间" prop="isSelectTime">
        <el-checkbox v-model="isSelectTime">
          <el-tooltip class="item" effect="dark" content="设置发送时间间隔为5秒，最快每5秒发送一次欢迎语，并 @ 5秒内进群的所有人" placement="top">
            <span>设置发送时间间隔
              <i class="el-icon-question"/>
            </span>
          </el-tooltip>
          <el-select :disabled="!isSelectTime"  v-model="welcome.timeInterval" placeholder="请选择">
            <el-option
              v-for="(item,index) in timeInterval"
              :key="index"
              :label="`${item}秒`"
              :value="item">
            </el-option>
          </el-select>
        </el-checkbox>
      </el-form-item>
      <el-form-item label="发送人数" prop="isSelectNumber">
          <el-checkbox v-model="isSelectNumber">
            <el-tooltip class="item" effect="dark" content="设置发送人数间隔为5人，每进群5人发送一次欢迎语，并 @ 这5个人" placement="bottom">
                <span>设置发送人数间隔
                    <i class="el-icon-question"/>
                </span>
            </el-tooltip>
            <el-select :disabled="!isSelectNumber" v-model="welcome.numberInterval" placeholder="请选择">
              <el-option
                v-for="(item,index) in memberInterval"
                :key="index"
                :label="`${item}人`"
                :value="item">
              </el-option>
            </el-select>
          </el-checkbox>
      </el-form-item>

        <el-button
          size="mini"
          type="success"
          icon="el-icon-circle-check"
          @click="save"
        >提交</el-button>
        <el-button
          size="mini"
          icon="el-icon-circle-close"
          @click="cancel"
        >取消</el-button>
    </el-form>

    <el-dialog :close-on-click-modal="false" :width="dialogWidth" height="520px" footer="222" :visible.sync="dialogView">
      <div slot="title" class="dialog-footer">
          <span>{{dialogTitle}}</span>
          <el-checkbox v-model="isSelectAll" @change="updateAllGroupSelectStatus" v-if="componentName === 'SelectGroup'" >
            全选
          </el-checkbox>
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
        :dialogView="dialogView"
      />
    </el-dialog>
  </div>
</template>

<script>
  import Vue from 'vue'
  import SelectGroup from '@/components/SelectGroup'
  import SelectPhoto from '@/components/SelectPhoto'
  import SelectText from '@/components/SelectText'
  import {save,findOne} from '@/api/groupDaily/groupWelcome'

  export default {
    name: "edit",
    components: {
      SelectGroup,
      SelectPhoto,
      SelectText,
    },
    props: {
      params: Number
    },
    data() {
      return {
        dialogTitle: '',
        isShow: false,
        dialogWidth: '300px',
        isSelectTime: false,
        isSelectNumber: false,
        componentName: 'selectText',// 组件名称
        initGroupList: [], // 初始化目标群,解决dialog未加载调用不了子组件方法回显数据
        welcome: {
          id: '',
          content: '',
          type: 1,
          timeInterval: 1, //时间间隔
          numberInterval: 1, //人数间隔
          groupList: [], // 群组数据
          groupIds: []
        },
        welcomeId: null, // 入群欢迎语id
        isSelectAll: false,
        timeInterval: [1,5,10,30,60],//发送时间间隔
        memberInterval: [1,5,10,20],//发送人数间隔
        dialogView: false,//是否显示窗口,
        //校验规则
        welcomeRules: {
          content: [{required: true, message: '请输入内容或者照片', trigger: 'blur'},],
          groupList: [{validator: this.validateGroupList, trigger: 'blur'}],
          isSelectTime: [{validator: this.validateIsSelectTime, trigger: 'blur'}],
          isSelectNumber: [{validator: this.validateIsSelectNumber, trigger: 'blur'}],
        }

      }
    },
    methods: {
      //选择群的表单校验
      validateGroupList(rule, value, callback) {
        if (!this.welcome.groupList || !this.welcome.groupList.length) {
          callback(new Error('请选择目标群'));
          return;
        }
        callback();
      },
      //设置发送时间校验
      validateIsSelectTime(rule, value, callback) {
        if (this.isSelectTime && (!this.welcome.timeInterval || !this.welcome.timeInterval)) {
          callback(new Error('请设置发送时间'));
          return;
        }
        callback();
      },
      //设置发送人数校验
      validateIsSelectNumber(rule, value, callback) {
        if (this.isSelectNumber && (!this.welcome.numberInterval || !this.welcome.numberInterval)) {
          callback(new Error('请设置发送人数'));
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
            this.welcome.type = 1;
            this.welcome.content = data;
            break;
          case 2: { // 保存图片
            this.welcome.type = 2;
            this.welcome.content = data;
            break;
          }
          default: {
            this.welcome.groupList = data;
            break;
          }
        }
        this.dialogView = false;
      },
      // 显示组件
      showComponent(componentType) {
        // this.isAll = false; // 默认不显示
        // 1 选择文本  2选择图片 3选择群组

        switch (componentType) {
          case 1: {
            this.dialogWidth = '440px';
            this.componentName = 'SelectText';
            this.dialogTitle = '选择文字';
            break;
          }
          case 2: {
            this.dialogWidth = '550px';
            this.componentName = 'SelectPhoto';
            this.dialogTitle = '选择图片';
            break;
          }
          case 3: {
            this.dialogWidth = '400px';
            this.componentName = 'SelectGroup';
            this.dialogTitle = '选择群组';
            break;
          }
        }

        this.dialogView = true;
      },
      /**
       * 取消
       */
      cancel(){
        // 发布删除tag删除
        this.PubSub.publish('delTag',this.$route.path);
      },
      /**
       * 删除目标群
       * @param id 群id
       */
      delGroup(id) {

        const groupList = this.welcome.groupList;
        const index = groupList.findIndex(item => item.groupId === id);

        if (index !== -1) {
          groupList.splice(index, 1);
          // 修改本组件数据
          Vue.set(this.welcome, 'groupList', groupList)
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

      /**
       * 查询欢迎语详细信息
       * @param id
       */
      async findOne(id) {
        const result = await findOne({id});
        this.welcome = result.data;
        this.isSelectTime = this.welcome.timeInterval > 0;
        this.isSelectNumber = this.welcome.numberInterval > 0;
        this.initGroupList = [...this.welcome.groupList];
      },
      /**
       * 保存入群欢迎语
       */
      save() {
        this.$refs['welcomeForm'].validate(async (valid) => {
          if (!valid) {
            return;
          }
          !this.isSelectNumber && (this.welcome.numberInterval = 0);
          !this.isSelectTime && (this.welcome.timeInterval = 0);
          console.log( this.welcome)
          this.welcome.groupIds = this.welcome.groupList.map(item => item.groupId).join(',');
          const result = await save(this.welcome);
          this.$notify({
            title: result.msg,
            type: 'success'
          });
          this.cancel();
          //调转到上一级
          this.$router.go(-1)
        });

      },
      //选中的群
      selectGroupList(list){
        this.welcome.groupList=list
        console.log(this.welcome.groupList)
      }
    },
    mounted() {
      const {id} = this.$route.params;
      parseInt(id) && this.findOne(id);
    }
  }
</script>
