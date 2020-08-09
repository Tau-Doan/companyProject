<template>
  <div class="app-container">
    <el-form :inline="false" label-position="left" label-width="150px"  :model="form" ref="adMonitorForm" :rules="advertisingMonitoringRules" class="demo-form-inline">
      <h4>广告类型</h4>
      <el-form-item  label="广告类型设置">
          <el-checkbox v-model='form.ifMonitorVideo' >发视频</el-checkbox>
          <el-checkbox v-model='form.ifMonitorUrl' name='type' >发链接</el-checkbox>
          <el-checkbox v-model='form.ifMonitorMini' name='type'>发小程序</el-checkbox>
      </el-form-item>
      <el-form-item label="消息包含特殊关键字">
        <el-button
          style="color:#000;"
          size="medium"
          type="text"
          @click="opDialog(0)"
        >设置 <i class="el-icon-s-tools el-icon--right"/> </el-button>
      </el-form-item>
      <el-form-item label="昵称包含特殊关键字">
        <el-button
          style="color:#2f2f2f;"
          size="medium"
          type="text"
          @click="opDialog(6)"
        >设置 <i class="el-icon-s-tools el-icon--right"/></el-button>
      </el-form-item>
        <h4>白名单设置</h4>
      <el-form-item label="群成员白名单">
        <el-button
          style="color:#000;"
          size="medium"
          type="text"
          @click="opDialog(2)"
        >设置 <i class="el-icon-s-tools el-icon--right"/> </el-button>
      </el-form-item>
      <el-form-item label="网站白名单">
        <el-button
          style="color:#000;"
          size="medium"
          type="text"
          @click="opDialog(3)"
        >设置 <i class="el-icon-s-tools el-icon--right"/> </el-button>
      </el-form-item>
      <h4>处理方法</h4>
      <el-form-item label="踢人">
            <el-switch :active-value="1" :inactive-value="-1" v-model='form.handleType' @change="handlerWitchChange"/>
            <span>（当助手号为群主或者管理员时有效）</span>
      </el-form-item>
      <el-form-item label="群内警告回复">
        <el-switch :active-value="2" :inactive-value="-1" v-model='form.handleType' @change="handlerWitchChange"/>
        <el-button
          style="color:#000;"
          size="medium"
          type="text"
          @click="opDialog(4)"
        >设置 <i class="el-icon-s-tools el-icon--right"/> </el-button>
      </el-form-item>
      <el-form-item label="即时提醒群管理员">
          <el-switch :active-value="3" :inactive-value="-1" v-model='form.handleType' @change="handlerWitchChange"/>
        <el-button
          style="color:#000;"
          size="medium"
          type="text"
          @click="opDialog(5)"
        >设置 <i class="el-icon-s-tools el-icon--right"/> </el-button>
        <span>（当助手号与管理员为好友时有效）</span>
      </el-form-item>
      <el-form-item label="选择目标群" prop="groupList">
        <div class="select-target-group">
          <div class="select-avatar" v-if="form.groupList" :key="index"
               v-for="(item,index) in form.groupList"
               @mouseenter="handleEnter(true)"
               @mouseleave="handleEnter(false)">
            <el-image
              :src="item.groupAvatar"
              fit="cover"></el-image>
            <el-button v-show="isShow" @click="delGroup(item.groupId)" icon="el-icon-close" circle size="mini"  />
          </div>
          <el-button @click="showComponent" size="medium" icon="el-icon-plus" circle/>
        </div>
      </el-form-item>
      <el-button @click="save" type='primary'>保存配置</el-button>
    </el-form>




    <el-dialog :close-on-click-modal="false" id='dialog' :width="dialog_width" height="520px" footer="222"
               :visible.sync="show">
      <div slot="title" class="dialog-footer">
          <span>{{title}}</span>
<!--          <el-checkbox @change="chilFunc" v-model="isAll">全选</el-checkbox>-->
      </div>
      <!--           通过ref调用子组件函数                                                               -->
      <component
        :params="params"
        :wlist='wlist'
        :tp='tp'
        ref='sg_mod'
        @cPage='change_page'
        :idString="idString"
        :arr='arr'
        :is="dialog"
        :ckAll='isAll' @unAc='isAll=false'
        :memberWhiteList="memberWhiteList"
        :delMember="delMember"
        @dese="isAll=false"
        @close="over"
        @save_mess_k='save_mess_k'
        @save_name_k='save_name_k'
        @save_addr_k='save_addr_k'
      />
    </el-dialog>


    <!--群选择组件-->
    <el-dialog :close-on-click-modal="false" :width="dialogWidth" title="选择群白名单"
               :visible.sync="showSelectGroupComponent">
      <selectGroup
        ref="selectGroup"
        :close="hideComponent"
        :saveComponentData="saveComponentData"
        :updateSelectAllStatus="updateSelectAllStatus"
        :isSelect="true"
        :isSelectAll="isSelectAll"
        @handleGroupList="selectGroupList"
        :initGroupList="initGroupList"/>
    </el-dialog>

    <!--选择群成员白名单-->
    <el-dialog :close-on-click-modal="false" width="1000px" height="520px" :visible.sync="showSelectMemberComponent">
      <div slot="title" class="dialog-footer m0">
        <h2 class="mt0">
          <span>选择群用户</span>
        </h2>
      </div>
      <selectMember
        :memberWhiteList="memberWhiteList"
        ref="selectMemberComponent"
        @cPage='change_page'
        :closeSelectMember="closeSelectMember"/>
    </el-dialog>


  </div>
</template>

<script>
  import Vue from 'vue'

  import SelectMember from './components/SelectMember';
  import SelectGroup from '@/components/SelectGroup';
  import Keyword from './components/Keyword';
  import MemberList from "./components/MemberList";
  import Warning from "./components/Warning";
  import RemindAdmin from './components/RemindAdmin'

  import {getAdMonitor,modify} from '../../../api/groupDaily/adMonitor'
  import {Message} from "element-ui";

  export default {
    name: "AdMonitor",
    components: {
      SelectMember,
      SelectGroup,
      Keyword,
      MemberList,
      Warning,
      RemindAdmin
    },
    data() {
      return {
        memberWhiteList: [],
        showSelectGroupComponent: false,
        showSelectMemberComponent: false,
        dialogVisibleWhiteList:false,
        dialogView: false,
        isSelectAll: false,
        dialogWidth: '360px',
        initGroupList: [],
        isShow: false,
        gidArr: [],//群id数组
        groupList: [],
        params: '', // 传递给子组件数据
        dialog_width: '540px',
        kg: false,
        /*--------------上面是静态数据-----------------*/
        isAll: false,//全选非全选
        dialog: '',//打开的dialog使用的组件
        title: 'def',
        wlist: [],
        show: false,
        //最终保存的数据在form对象里面
        idString: [],
        tp: 0,//分辨
        wlview: 'w_m_select',
        wlshow: false,
        isRemindAdministrators: false, // 是否提醒管理员
        arr: [],// 域白名单页面,目标群选择页面
        form: {
          ifMonitorVideo: false,
          ifMonitorUrl: false,
          ifMonitorMini: false,
          messageKeyword: "",//消息关键字
          nicknameKeyword: "",//昵称关键字
          memberWhiteList: "",//白名单成员
          domainWhiteList: "",//白名单域名
          handleType: null,  //处理方式 1-踢人 2-警告回复 3-提醒群管理员
          kickingAPlayer: false, // 是否踢人
          warnContent: '',//警告回复
          groupIds: [], //群组选择
          groupList: [],
          memberList: []
        },
        advertisingMonitoringRules:{
          groupList: [
            {validator: this.validateGroupList, trigger: 'blur'}
          ],
        }
      }
    },
    created() {
      this.getAdMonitor();
    },
    methods: {
      //选中的群
      selectGroupList(list){
        this.form.groupList=list
      },
      // 删除用户
      delMember(memberId){
        const selectMemberComponent = this.$refs.selectMemberComponent;
        selectMemberComponent && selectMemberComponent.delMember(memberId);
      },
      handlerWitchChange(){
        this.$forceUpdate();
      },
      validateGroupList(rule, value, callback) {
        if (!this.form.groupList || !this.form.groupList.length) {
          callback(new Error('请选择目标群'));
          return;
        }
        callback();
      },
      hideComponent() {
        this.showSelectGroupComponent = false;
      },
      saveComponentData(data) {
        this.form.groupList = data;
        this.showSelectGroupComponent = false;
      },
      // 显示组件
      showComponent() {
        this.showSelectGroupComponent = true;
      },
      /**
       * 删除目标群
       * @param id 群id
       */
      delGroup(id) {
        const groupList = this.form.groupList;
        const index = groupList.findIndex(item => item.groupId === id);

        if (index !== -1) {
          groupList.splice(index, 1);
          // 修改本组件数据
          Vue.set(this.form, 'groupList', groupList)
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
      save() {//保存配置

        this.$refs.adMonitorForm.validate(async (valid) => {
          if (!valid) {
            return false;
          }
          if (typeof (this.form.memberWhiteList) != 'string')
            this.form.memberWhiteList = this.idFormat(this.form.memberWhiteList, "jarr_to_arr").join(',');

          if (typeof (this.form.groupList) != 'string')
            this.form.groupIds = this.idFormat(this.form.groupList, "jarr_to_arr", "groupId").join(',')

          if (typeof (this.form.nicknameKeyword) != 'string')
            this.form.nicknameKeyword = this.idFormat(this.form.nicknameKeyword, "jarr_to_arr").join(',')

          if (typeof (this.form.messageKeyword) != 'string')
            this.form.messageKeyword = this.idFormat(this.form.messageKeyword, "jarr_to_arr").join(',')



          if (typeof (this.form.domainWhiteList) != 'string')
            this.form.domainWhiteList = this.form.domainWhiteList.join(',')

          this.form.memberWhiteList = this.memberWhiteList.map(item => item.memberId).join(',');

          this.form.adType = 1
          delete this.form.memberList
          this.form.groupIds = this.form.groupList.map(item => item.groupId).join(',');

          // 校验处理方式
          if(this.form.handleType === -1){
            this.$message.error('请选择处理方式');
            return;
          }

          await modify(this.form);
          this.$notify({
            title: '成功',
            message: '广告监控操作成功',
            type: 'success'
          });
          // this.$message.success('操作成功');
        })
      },
      async getAdMonitor() {

        const res = await getAdMonitor({});
        this.form = res.data;
        this.memberWhiteList = this.form.memberList;
        this.initGroupList = [...this.form.groupList];
        this.form.handleType === 1 && (this.form.kickingAPlayer = true)
      },
      change_page(pageJson) {  //改变dialog显示的子组件
        switch (pageJson.type) {
          case 'memberWhiteList':{
            this.memberWhiteList = pageJson.data;
            this.showSelectMemberComponent = false;
            this.opDialog(2);
            break;
          }
          case 'toSele':
            this.show = false;
            this.showSelectMemberComponent = true;
            break;
          case 'over':
            this.idString = pageJson.iddata
            this.wlist = pageJson.data
            this.wlshow = false
            this.$refs.sg_mod.reff(pageJson.iddata, pageJson.data)
            this.show = true
            break;
          case 'onlyReturn':
            this.wlshow = false
            this.show = true
            break;
        }
        this.title = pageJson.pageTitle
      },

      ////该函数是针对 【显示用json数组】 【提交用逗号风格的字符串】
      //参数释义： 数据  类型 键名（可不传）如果存在key参数，就会指定为提取名为groupid的值，或者默认（id）的值）
      idFormat(parm, type, key) {
        var data = []
        switch (type) {
          case "jarr_to_arr": //json数组转ids字符串
            if (parm === undefined || parm == null || parm == '' || parm.length == 0 || typeof (parm) == 'string') return []
            var isJson = typeof parm[0] === 'object' && parm[0] !== null//是json还是普通数组
            parm.forEach(val => {
              data.push(isJson ? (key && key == 'groupId' ? val.groupId : val.id) : val)
            })
            break;
          case "arr_to_str"://数字数组拼接字符串
            data = parm.join(',')
            break;
        }
        return data
      },
      /**
       * 关闭用户选择组件
       */
      closeSelectMember(){
        this.showSelectMemberComponent = false;
        this.opDialog(2);
      },
      opDialog(type) {//打开dialog

        switch (type) {
          default:
            break;
          case 0://消息和昵称关键字都使用key_set页面
            this.title = '消息特殊关键字设置';
            this.tp = 0
            this.arr = this.form.messageKeyword;
            this.dialog = 'Keyword'
            break;
          case 6://
            this.title = '昵称特殊关键字设置';
            this.tp = 6
            this.arr = this.form.nicknameKeyword;
            this.dialog = 'Keyword';
            break;
          case 1://选择目标群
            this.title = '选择目标群';
            this.dialog = 'SelectGroup';
            this.idString = this.form.groupIds;//在dialog下的组件绑定了会传给子组件的
            this.arr = this.form.groupList;
            break;
          case 2://
            this.title = '群成员白名单设置';
            this.dialog = 'MemberList';
            // this.dialog_width='360px'
            // this.$forceUpdate()
            break;
          case 3://
            this.title = '网站白名单设置';
            this.tp = 3;
            this.arr = this.form.domainWhiteList;
            this.dialog = 'Keyword';
            break;
          case 4://
            this.params = this.form.warnContent;
            this.title = '群内警告回复设置';
            this.dialog = 'Warning';
            break;
          case 5://
            this.params = this.form.handleType;
            this.title = '即时提醒群管理者设置';
            this.dialog = 'RemindAdmin';
            break;
        }
        this.show = true//打开窗口
      },
      over(from, data) {//关闭窗口
        switch (from) {
          case 1:// 选择目标群dialog 返回     为了保证组件的复用性
            if (data) {
              this.gidArr = data.ids
              this.groupList = data.list
            }
            break;
          case 2:// 群成员白名单dialog 返回
            if (data) {
              this.memberWhiteList = data;
              this.showSelectMemberComponent = false;
            }
            break;
          case 4://群内警告回复 dialog 返回
            this.form.warnContent = data
            this.kg = false
            break;
          case 5:// 即时提醒群管理者dialog 返回
             this.isRemindAdministrators = data;
            break;
        }
        this.show = false
      },
      save_mess_k(parm) {
        this.form.messageKeyword = parm.arr;
        this.show = false
      },
      save_name_k(parm) {
        this.form.nicknameKeyword = parm.arr;
        this.show = false
      },
      save_addr_k(parm) {
        this.form.domainWhiteList = parm.arr;
        this.show = false
      },
      chilFunc() { //群组 dialog的函数
        this.$refs.sg_mod.allck(this.isAll)   //点击全选以后，调用子组件控制全选的函数
      },

    },
  }
</script>

<style scoped>

</style>
