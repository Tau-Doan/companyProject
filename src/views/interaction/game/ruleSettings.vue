<template>
  <div class="app-container">
    <div class="titleHeader">
      <span>{{names[type-1]}}设置</span>
      <el-divider/>
    </div>
    <div class="settings">
      <el-form ref="gameRuleFrom" :rules="gameRules" :model="gameRule" label-width="200px" label-position="left">
        <el-form-item label="任何成员都可指令触发游戏" prop="ifAll" class="asss">
          <el-switch v-model="gameRule.ifAll" class="instruct"/>
        </el-form-item>
        <el-form-item label="指令需要@助手才生效" prop="ifAssustant">
          <el-switch v-model="gameRule.ifAssustant" class="instruct"/>
        </el-form-item>
        <el-form-item label="开始指令" prop="startInstructs">
          <div class="TimingList">
            <div class="Timing" :key="index" v-for="(item,index) in startInstructs">
              <el-input v-model="item.content"
                        style="width: 120px;margin-left: 20px"/>
              <el-button class="deleteTime" @click="delItem(index,startInstructs)" type="text" circle>
                <i class="el-icon-circle-close"/>
              </el-button>
            </div>
            <el-button class="instruct" @click="addInstructs">+</el-button>
          </div>
        </el-form-item>

        <el-form-item label="结束指令" prop="endInstructs">
          <div class="TimingList">
            <div class="Timing" :key="index" v-for="(item,index) in endInstructs">
              <el-input v-model="item.content"
                        style="width: 120px;margin-left: 20px"/>
              <el-button class="deleteTime" @click="delItem(index,endInstructs)" type="text" circle>
                <i class="el-icon-circle-close"/>
              </el-button>
            </div>
            <el-button class="instruct" @click="addEndInstructs">+</el-button>
          </div>
        </el-form-item>

        <el-form-item label="每日定时发起时间" prop="times">
          <div class="TimingList">
            <div class="Timing" v-for="(item,index) in times" :key="index">
              <el-time-picker
                class="settingsTime"
                value-format="HH:mm"
                v-model="item.content"
                placeholder="任意时间点">
              </el-time-picker>
              <el-button class="deleteTime" @click="delItem(index,times)" type="text" circle>
                <i class="el-icon-circle-close"/>
              </el-button>
            </div>
            <el-button class="instruct el-icon-plus" @click="addTimes"/>
          </div>

        </el-form-item>
        <el-form-item label="选择目标群" prop="groupIds">
          <div class="select-target-group">
            <div class="selectAvatar" :key="index" v-for="(item,index) in gameRule.groupList"
                 @mouseenter="handleEnter(true)"
                 @mouseleave="handleEnter(false)">
              <el-image
                :src="item.groupAvatar"
                fit="cover"/>
              <el-button v-show="isShow"  type="text" @click="delGroup(item.groupId)" icon="el-icon-close" circle size="mini" >
               </el-button>
            </div>
            <div class="addAvatarPushButton">
              <el-button @click="showComponent" circle size="medium" icon="el-icon-plus" >
<!--                <i class="el-icon-plus amplify" />-->
              </el-button>
            </div>
          </div>
        </el-form-item>

        <el-form-item label="参与者得">
          <el-input v-model="gameRule.integral" style="width: 80px;margin-left: 20px"/>
          <span class="Integral">积分</span>
          <span class="gameIntegral">猜中者额外得</span>
          <el-input v-model="gameRule.reward" style="width: 80px"/>
          <span class="Integral">积分</span>
        </el-form-item>

        <el-form-item>
          <span class="instruct">每题游戏时长2分钟，2分钟后为自动结束</span>
        </el-form-item>

        <el-button type="primary" @click="save">保存配置</el-button>
      </el-form>
    </div>

    <el-dialog :close-on-click-modal="false" width="400px" height="520px" footer="222" :visible.sync="dialogView">
      <div slot="title" class="dialog-footer">
        <h2 class="mt0">
          <span>选择群</span>
          <el-checkbox @change="updateAllGroupSelectStatus" v-model="isSelectAll" class="sdfr">全选
          </el-checkbox>
        </h2>
      </div>
      <selGroup
        ref="SelectGroup"
        :is="componentName"
        :close="hideComponent"
        :saveComponentData="saveComponentData"
        :updateSelectAllStatus="updateSelectAllStatus"
        :isSelect="true"
        :isSelectAll="isSelectAll"
        :initGroupList="initGroupList"
        @handleGroupList="selectGroupList"
      />
    </el-dialog>
  </div>
</template>

<script>
  import Vue from 'vue'

  import SelectGroup from '@/components/SelectGroup';
  import {save, findOne} from "../../../api/interaction/game"

  export default {
    name: "RuleSettings",
    components: {
      SelectGroup
    },
    props: {
      params: Number
    },
    data() {
      return {
        isShow: false,
        dialogView: false,
        isSelectTime: false,
        isSelectNumber: false,
        componentName: 'SelectGroup',// 组件名称
        isSelectAll: false,
        initGroupList: [], // 初始化目标群,解决dialog未加载调用不了子组件方法回显数据
        gameRules: {
          ifAll: [{required: true, message: '请设置是否任何成员都可以出发指令', trigger: 'blur'}],
          ifAssustant: [{required: true, message: '请设置指令需要@助手才生效', trigger: 'blur'}],
          startInstructs: [{validator: this.validateStartInstructs, trigger: 'blur'}],
          endInstructs: [{validator: this.validateEndInstructs, trigger: 'blur'}],
          times: [{validator: this.validateTimes, trigger: 'blur'}],
          groupIds: [{validator: this.validateGroupIds, trigger: 'blur'}],
        },
        names: ['看图猜字', '猜歌名', '脑筋急转弯', '歇后语'],
        type: 0,
        startInstructs: [], // 开始指令
        defaultStartInstructs: {
          '1': [{content: '看图猜字'}, {content: '开始猜图'}],
          '2': [{content: '猜歌名'}, {content: '听歌识曲'}],
          '3': [{content: '脑筋急转弯'}, {content: '开始脑洞大开'}],
          '4': [{content: '说个歇后语'}, {content: '猜歇后语'}],
        },
        endInstructs: [], // 结束指令
        defaultEndInstructs: {
          '1': [{content: '终止猜图'}],
          '2': [{content: '停止猜歌名'}],
          '3': [{content: '终止脑筋急转弯'}],
          '4': [{content: '停止歇后语'}]
        },
        times: [{content: ''}],
        gameRule: {
          id: null,
          type: null,
          ifAll: false,
          ifAssustant: false,
          startInstruct: '',
          endInstruct: '',
          time: '',
          groupIds: '',
          status: 0,
          groupList: [],
          reward: 2,
          integral: 2
        },
      }
    },
    methods: {
      /* 选中的群*/
      selectGroupList(list){
        this.gameRule.groupList=list
      },
      /**
       * 删除item元素
       */
      delItem(index, arr) {
        arr.splice(index, 1);
      },
      //显示删除按钮
      handleEnter(isEnter) {
        return this.isShow = isEnter;
      },
      hideComponent() {
        this.dialogView = false;
      },
      saveComponentData(data) {
        this.gameRule.groupList = data;
        this.dialogView = false;
      },
      // 显示组件
      showComponent() {
        // 1 选择文本  2选择图片 3选择群组
        this.componentName = 'SelectGroup';
        this.dialogView = true;
      },
      /**
       * 删除目标群
       * @param id 群id
       */
      delGroup(id) {
        const groupList = this.gameRule.groupList;
        const index = groupList.findIndex(item => item.groupId === id);

        if (index !== -1) {
          groupList.splice(index, 1);
          // 修改本组件数据
          Vue.set(this.gameRule, 'groupList', groupList)
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
      // 校验内容
      validateStartInstructs(rule, value, callback) {
        const startInstructs = this.startInstructs;
        startInstructs.forEach(item => {
          if (!item.content) {
            callback(new Error('请完善开始数据'));
            return;
          }
        });
        callback();
      },
      validateEndInstructs(rule, value, callback) {
        const startInstructs = this.endInstructs;
        startInstructs.forEach(item => {
          if (!item.content) {
            callback(new Error('请完善结束指令数据'));
            return;
          }
        });
        callback();
      },
      validateTimes(rule, value, callback) {
        const times = this.times;
        times.forEach(item => {
          if (!item.content) {
            callback(new Error('请完善定时发送时间数据'));
            return;
          }
        });

        callback();
      },
      validateGroupIds(rule, value, callback) {
        const groupList = this.gameRule.groupList;

        if (!groupList || !groupList.length) {
          callback(new Error('请选择目标群'));
          return;
        }
        callback();
      },
      save() {
        this.$refs.gameRuleFrom.validate(async (valid) => {
            if (!valid) {
              return false;
            }
            this.gameRule.endInstruct = this.endInstructs.map(item => item.content).join(',');
            this.gameRule.startInstruct = this.startInstructs.map(item => item.content).join(',');
            this.gameRule.time = this.times.map(item => item.content).join(',');
            this.gameRule.groupIds = this.gameRule.groupList.map(item => item.groupId).join(',');
            delete this.gameRule.status;
            await save(this.gameRule);
            this.$message.success("操作成功");
            this.$store.dispatch("tagsView/delView", this.$route);
            this.$router.push({path: "/interaction/game"})
          }
        )
        ;
      },
      // 增加开始指令
      addInstructs() {
        this.startInstructs.push({content: ''})
      }
      ,
      // 增加结束指令指令
      addEndInstructs() {
        this.endInstructs.push({content: ''})
      }
      ,
      // 增加结束指令指令
      addTimes() {
        this.times.push({content: ''})
      }
      ,
      async findOne() {
        const type = this.type;
        const result = await findOne({type});
        this.gameRule = result.data;
        // [{content: '猜歌名'},{content: '听歌识曲'}]
        // 处理回显
        this.endInstructs = this.gameRule.endInstruct ? this.gameRule.endInstruct.split(',').map(content => ({content})) : this.defaultEndInstructs[type];
        this.startInstructs = this.gameRule.startInstruct ? this.gameRule.startInstruct.split(',').map(content => ({content})) : this.defaultStartInstructs[type];

        this.times = this.gameRule.time.split(',').map(content => ({content}));
        this.initGroupList = this.gameRule.groupList;

        this.loading = false;
      }
    },
    mounted() {
      this.type = this.$route.params.type;
      this.findOne();
    }
  }
</script>

<style lang="scss" scoped>
  .settings {
    .settingsTime {
      width: 120px;
      margin-left: 20px;
    }

    .instruct {
      margin-left: 20px;
    }

    .gameIntegral {
      margin: 0 40px 0 100px;
    }

    .Integral {
      margin-left: 10px;
    }
  }

  .selectTheTargetGroup {
    padding-left: 20px;
  }

  .TimingList {
    display: flex;

    .Timing {
      position: relative;

      .deleteTime {
        width: 16px;
        height: 16px;
        padding: 0;
        align-items: center;
        text-align: center;
        position: absolute;
        top: -5px;
        left: 129px;

        i {
          align-items: center;
          text-align: center;
        }
      }
    }
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
