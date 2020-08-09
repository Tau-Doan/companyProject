<template>
  <div class="app-container">
    <el-form :model="signInRule" :rules="signInRules" ref="signInFrom" label-width="100px">
      <div class="rule">
        <div class="integral title">
          <span>签到积分设置</span>
        </div>
        <div class="Content">
          <el-form-item prop="continuityOne">
            第一天签到得
            <el-input v-model="signInRule.continuityOne" style="width: 50px"></el-input>
            积分
          </el-form-item>
          <el-form-item prop="continuityTwo">
            第二天签到得
            <el-input v-model="signInRule.continuityTwo" style="width: 50px"></el-input>
            积分
          </el-form-item>
          <el-form-item prop="continuityThree">
            第三天签到得
            <el-input v-model="signInRule.continuityThree" style="width: 50px"></el-input>
            积分
          </el-form-item>
          <el-form-item prop="continuityFour">
            第四天签到得
            <el-input v-model="signInRule.continuityFour" style="width: 50px"></el-input>
            积分
          </el-form-item>
          <el-form-item prop="continuityFive">
            第五天签到得
            <el-input v-model="signInRule.continuityFive" style="width: 50px"></el-input>
            积分
          </el-form-item>
          <el-form-item prop="continuitySix">
            连续签到5日以后，后面每日签到都可获得
            <el-input v-model="signInRule.continuitySix" style="width: 50px"></el-input>
            积分，如期间有所中断，则重新开始计算
          </el-form-item>
        </div>
      </div>
      <el-divider></el-divider>

      <div class="rule">
        <div class="time title">
          <span>签到时间设置</span>
        </div>
        <div class="Content ">
          <el-form-item prop="timeLimitType">
            <el-radio-group @change="$forceUpdate()" v-model="signInRule.timeLimitType">
              <el-radio class="lineFeed" :label="1">全天任意时间段</el-radio>
              <el-radio :label="2">指定时间段
                <el-time-picker
                  @focus="$forceUpdate()"
                  value-format="HH:mm"
                  :disabled="signInRule.timeLimitType != '2'"
                  is-range
                  v-model="signInRule.timeLimitArray"
                  range-separator="至"
                  start-placeholder="开始时间"
                  end-placeholder="结束时间"
                  placeholder="选择时间范围">
                </el-time-picker>
              </el-radio>
            </el-radio-group>
          </el-form-item>
        </div>
      </div>
      <el-divider></el-divider>


      <div class="rule">
        <div class="time title">
          <span>签到指令</span>
        </div>
        <div class="Content">
          <el-form-item prop="instructionsType">
            <el-radio-group @change="$forceUpdate()" v-model="signInRule.instructionsType">
              <el-radio :label="1" class="lineFeed">默认签到指令（群友每日在群内发送“签到”时可调出群签到链接）</el-radio>
              <el-radio :label="2">自定义签到指令
                <el-input :disabled="signInRule.instructionsType != '2'"
                          v-model="signInRule.instructions" style="width: 150px"></el-input>
              </el-radio>
            </el-radio-group>
          </el-form-item>
        </div>
      </div>
      <el-divider></el-divider>

      <div class="rule">
        <div class="time title">
          <span>签到提醒设置</span>
        </div>
        <div class="Content reminderSettings ">
          <el-form-item label="提醒开关">
            <el-switch v-model="signInRule.ifRemind"
                       active-color="#13ce66"
            ></el-switch>
          </el-form-item>
          <el-form-item label="提醒时间" prop="remindTime">
            <el-time-picker
              v-model="signInRule.remindTime"
              align="right"
              value-format="HH:mm"
              :picker-options="{}"
              placeholder="任意时间点">
            </el-time-picker>
          </el-form-item>
          <el-form-item label="提醒内容" prop="remindContent">
            <el-input disabled v-model="signInRule.remindContent" style="width: 300px"></el-input>
            <el-button-group>
              <el-button @click="showComponent(1)">文本</el-button>
              <el-button @click="showComponent(2)">图片</el-button>
            </el-button-group>
          </el-form-item>
        </div>
      </div>
      <el-divider></el-divider>

      <div class="rule">
        <div class="time title">
          <span>选择目标群</span>
        </div>
        <div class="Content">
          <el-form-item prop="groupList">
            <div class="select-target-group">
              <div class="selectAvatar" :key="index" v-for="(item,index) in signInRule.groupList" @mouseenter="handleEnter(true)"
                   @mouseleave="handleEnter(false)">
                <el-image
                  :src="item.groupAvatar"
                  fit="cover"></el-image>
                <el-button v-show="isShow" circle type="text" @click="delGroup(item.groupId)"><i
                  class="el-icon-close"></i></el-button>
              </div>
              <div class="addAvatarPushButton">
                <el-button @click="showComponent(3)"  circle><i class="el-icon-plus amplify"></i></el-button>
              </div>
            </div>
          </el-form-item>
        </div>
      </div>

      <el-form-item>
        <el-button type="primary" @click="saveSignInRule">保存</el-button>
      </el-form-item>
    </el-form>

    <el-dialog :close-on-click-modal="false" :width="dialogWidth" height="300px" footer="222" :visible.sync="dialogView">
      <div slot="title" class="dialog-footer">
        <h2 class="mt0">
          <span>{{componentAlias}}</span>
          <el-checkbox @change="updateAllGroupSelectStatus" v-show="componentName === 'SelectGroup'"
                       v-model="isSelectAll" >全选
          </el-checkbox>
        </h2>
      </div>
      <component
        ref="SelectGroup"
        :updateSelectAllStatus="updateSelectAllStatus"
        :isSelect="true"
        :isSelectAll="isSelectAll"
        :initGroupList="initGroupList"
        :is="componentName"
        :close="hideComponent"
        @handleGroupList="selectGroupList"
        :saveComponentData="saveComponentData"/>
    </el-dialog>
  </div>
</template>

<script>
  import Vue from 'vue'

  import SelectGroup from '@/components/SelectGroup';
  import SelectText from '../../../components/SelectText'
  import SelectPhoto from '../../../components/SelectPhoto'
  import {save,findSignInRule} from "../../../api/interaction/signIn";

  export default {
    name: "SignIn/rule",
    components: {
      SelectText,
      SelectPhoto,
      SelectGroup
    },

    data() {
      return {
        isShow:false,
        isSelectTime: false,
        isSelectNumber: false,
        isSelectAll: false,
        initGroupList: [], // 初始化目标群,解决dialog未加载调用不了子组件方法回显数据
        dialogWidth: '28%', // 弹出层宽度
        componentName: 'SelectText',// 组件名称
        componentAlias: '选择', // 组件标题
        componentType: 1,
        signInRules: {
          continuityOne: [
            {required: true, message: '请填写第一天签到得多少积分', trigger: 'blur'},
          ],
          continuityTwo: [
            {required: true, message: '请填写第二天签到得多少积分', trigger: 'blur'},
          ],
          continuityThree: [
            {required: true, message: '请填写第三天签到得多少积分', trigger: 'blur'},
          ],
          continuityFour: [
            {required: true, message: '请填写第四天签到得多少积分', trigger: 'blur'},
          ],
          continuityFive: [
            {required: true, message: '请填写第五天签到得多少积分', trigger: 'blur'},
          ],
          continuitySix: [
            {required: true, message: '请填写连续签到5日以后得多少积分', trigger: 'blur'},
          ],
          timeLimitType: [{validator: this.validateTimeLimitType, trigger: 'blur'}],
          instructionsType: [{validator: this.validateInstructions, trigger: 'blur'}],
          remindTime: [{validator: this.validateRemindTime, trigger: 'blur'}],
          remindContent: [{validator: this.validateRemindContent, trigger: 'blur'}],
          groupList: [{validator: this.validateGroupList, trigger: 'blur'}]
        }, // 表单校验规则
        signInRule: {
          contentType: 1,
          timeLimitArray: [], // 指定时间段数组
          timeLimitType: 1,// 1：全天时间段，2:自定义
          instructionsType: 2, // 签到指令类型1：默认，2:自定义
          continuityOne: 0,
          continuityTwo: 0,
          continuityThree: 0,
          continuityFour: 0,
          continuityFive: 0,
          continuitySix: 0,
          timeLimit: 0,  // 签到指定时间段
          instructions: '',  // 签到指令
          ifRemind: 0, // 是否提醒
          remindTime: '', // 提醒时间
          remindContent: '', // 提醒内容
          groupIds: '',
          groupList: [], //群数组
        },
        dialogView: false,//是否显示窗口,
      }
    },
    methods: {
      /* 选中的群*/
      selectGroupList(list){
        this.signInRule.groupList=list
      },
      /**
       * 取消
       */
      cancel() {
        // 发布删除tag删除
        this.PubSub.publish('delTag',this.$route.path);
      },
      handleEnter(isEnter) {
        return this.isShow = isEnter;
      },
      hideComponent() {
        this.dialogView = false;
      },
      /**
       * 删除目标群
       * @param id 群id
       */
      delGroup(id) {
        const groupList = this.signInRule.groupList;
        const index = groupList.findIndex(item => item.groupId === id);

        if (index !== -1) {
          groupList.splice(index, 1);
          // 修改本组件数据
          Vue.set(this.signInRule, 'groupList', groupList)
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
      // 保存组件内容
      saveComponentData(data, type) {
        switch (type) {
          case 1: // 保存文本

            this.signInRule.remindContent = data;
            this.signInRule.contentType = 1;
            break;
          case 2: { // 保存图片
            this.signInRule.contentType = 2;
            this.signInRule.remindContent = data;
            break;
          }
          case 3: {
            this.signInRule.groupList = data;
            break;
          }
        }
        this.hideComponent();
      },
      hideComponent() {
        this.dialogView = false;
      },
      // 显示组件
      showComponent(componentType) {
        this.isAll = false; // 默认不显示
        // 1 选择文本  2选择图片 3选择群组
        switch (componentType) {
          case 1: {
            this.dialogWidth = '38%';
            this.componentName = 'SelectText';
            break;
          }
          case 2: {
            this.dialogWidth = '38%';
            this.componentName = 'SelectPhoto';
            break;
          }
          case 3: {
            this.dialogWidth = '30%';
            this.componentName = 'SelectGroup';
            break;
          }
        }

        this.dialogView = true;
      },
      validateTimeLimitType(rule, value, callback) {
        if (!value) {
          callback(new Error('请选择签到时间'));
        }

        // 默认签到时间，直接放行
        if (value === 1) {
          callback();
          return;
        }
        // 没有选择签到日期
        if (!this.signInRule.timeLimitArray || !this.signInRule.timeLimitArray.length) {
          callback(new Error('请设置签到日期'));
        }

        // 签到日期更新到对象中
        this.signInRule.timeLimit = this.signInRule.timeLimitArray.join('-')
        callback();

      },
      /**
       * 校验签到指令
       */
      validateInstructions(rule, value, callback) {
        if (!value) {
          callback(new Error('请选择签到指令'));
        }

        // 默认签到指令，直接放行
        if (value === 1) {
          callback();
          return;
        }
        // 没有选择签到日期
        if (!this.signInRule.instructions) {
          callback(new Error('请设置签到指令'));
        }

        // 签到日期更新到对象中
        this.signInRule.timeLimit = this.signInRule.timeLimitArray.join('-')
        callback();

      },
      validateRemind() {
        return !this.signInRule.ifRemind || this.signInRule.ifRemind === 1
      },
      validateGroupList(rule, value, callback) {
        if (!this.signInRule.groupList || !this.signInRule.groupList.length) {
          callback(new Error('请选择目标群'));
          return;
        }
        callback();
      },
      /**
       * 校验提醒时间
       */
      validateRemindTime(rule, value, callback) {
        // 如果提醒开关true，则校验内容
        if (this.validateRemind()) {
          callback();
          return;
        }
        // 校验内容是否为空
        if (value === '00:01' || !value) {
          callback(new Error('请设置提醒时间'));
          return;
        }

        callback();

      },
      // 校验提醒内容
      validateRemindContent(rule, value, callback) {
        if (this.validateRemind()) {
          callback();
          return;
        }

        // 校验内容
        if (!value) {
          callback(new Error('设选择提醒内容'));
        }

        callback();
      },
      // 保存签到规则
      saveSignInRule() {
        this.$refs['signInFrom'].validate( async (valid) => {
          if (!valid) {
            this.$message.error('请填写表单内容');
            return false;
          }

          // 处理数据
          const ifRemind = this.signInRule.ifRemind ? 1 : 0;
          this.signInRule.ifRemind = ifRemind;
          this.signInRule.groupIds = this.signInRule.groupList.map(item => item.groupId).join(',');
          this.signInRule.instructions = this.signInRule.instructionsType === 1 ? '签到' : this.signInRule.instructions;
          this.signInRule.timeLimit = this.signInRule.timeLimitType === 1 ? '00:00-23:59' : this.signInRule.timeLimit;
          console.log(this.signInRule.groupIds)
          // 保存数据
          await save(this.signInRule);
          this.$message.success("保存成功");
          this.cancel();
          this.$router.go(-1)


          // 回显选择框
          this.signInRule.ifRemind = ifRemind === 1;
          this.signInRule.timeLimitArray = this.signInRule.timeLimit.split('-');

        });
      },
      /**
       * 查询签到规则
       */
       async findSignInRule() {
         const result = await findSignInRule();
          this.signInRule = result.data;
          this.deptList = result.data.deptList;
          this.groupList = this.signInRule.groupList;

          this.initGroupList = [...this.signInRule.groupList];
          // 回显签到日期
          this.signInRule.timeLimitArray = this.signInRule.timeLimit.split('-');

          // 签到时间段类型
          this.signInRule.timeLimitType = this.signInRule.timeLimit === '00:00-23:59' ? 1 : 2;// 1：全天时间段，2:自定义
          this.signInRule.instructionsType = this.signInRule.instructions === '签到' ? 1 : 2;// 签到指令类型1：默认，2:自定义

          // 回显提醒开关
          this.signInRule.ifRemind = this.signInRule.ifRemind === 1;

      },
    },
    mounted() {
      // 查询签到规则
      this.findSignInRule();
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

</style>
