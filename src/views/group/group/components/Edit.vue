<template>
  <div id="editGroupName">
    <el-form :model="groupMessage" label-width="80px" :rules="organizationRules" ref="ruleForm">
<!--      <el-form-item label="组织架构" prop="deptParentIds">-->
<!--        <treeselect v-model="groupMessage.deptId" :options="deptList" placeholder="请选择归属组织架构"/>-->
<!--        &lt;!&ndash;        <el-cascader v-model="deptParentIds"   :options="deptList" :props="deptProps" clearable/>&ndash;&gt;-->
<!--      </el-form-item>-->
      <el-form-item label="群名称">
        <el-input placeholder="群名称" v-model="groupMessage.name" readonly></el-input>
      </el-form-item>
      <el-form-item label="所属用户" prop="groupMessage.userId">
        <el-select v-model="groupMessage.userId" placeholder="请选择" :style="{width: '100%'}">
          <el-option
            v-for="user in userList"
            :key="user.userId"
            :label="user.userName"
            :value="user.userId"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="直播群" prop="groupMessage.ifLiveGroup">
        <el-select v-model="groupMessage.ifLiveGroup" placeholder="请选择" :style="{width: '100%'}">
          <el-option
            v-for="liveGroup in options"
            :key="liveGroup.ifLiveGroup"
            :label="liveGroup.desc"
            :value="liveGroup.ifLiveGroup"
          ></el-option>
        </el-select>
      </el-form-item>

<!--      <el-form-item label="联系方式" prop="contactInformation">-->
<!--        <el-input v-model="groupMessage.contactInformation"/>-->
<!--      </el-form-item>-->
      <el-form-item>
        <el-button type="primary" @click="save">提交</el-button>
        <el-button @click="close">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import Treeselect from "@riophae/vue-treeselect";
  import "@riophae/vue-treeselect/dist/vue-treeselect.css";

  import {editGroupMessage, getTreeDepts, getGroupInfo} from "../../../../api/groupDaily/group";
  import {validPhone} from '../../../../utils/validate'

  export default {
    name: "edit",
    props: {
      data: Object,
      handleQuery: Function
    },
    components: {Treeselect},
    data() {
      return {
        options: [
          {
            ifLiveGroup: 0,
            desc: "否"
          },
          {
            ifLiveGroup: 1,
            desc: "是"
          }
        ],
        groupMessage: {},
        deptOptions: undefined,// 部门树选项
        deptList: [],
        deptParentIds: [], // 存储机构id集合
        deptProps: {
          value: 'id',
          children: 'children',
          checkStrictly: true,
        },
        organizationRules: {
          contactPerson: [
            {required: true, message: '请输入联系人', trigger: 'blur'}
          ],
          contactInformation: [{validator: this.validateMobile, trigger: ['change', 'blur']}],
        },
        userList: []
      }
    },
    watch: {
      data: {
        handler() {
          this.deptParentIds = this.data.deptParentIds ? this.data.deptParentIds.split(',').map(item => parseInt(item)) : [];
        },
        deep: true,
        immediate: true
      }
    },
    methods: {
      //手机验证
      validateMobile(rule, value, callback) {
        return validPhone(value) ? callback() : callback(new Error('号码格式不正确'));
      },
      //提交
      save() {
        this.$refs['ruleForm'].validate(async (valid) => {
          if (!valid) {
            return false;
          }
          await editGroupMessage(this.groupMessage);
          this.handleQuery();
          this.close();
        })
      },
      async getGruop(){
        const result = await getGroupInfo();
        this.userList = result.data;

      },
      close(){
        this.$emit("close");
      },

      //  获取机构
      async getTreeDepts() {
        const result = await getTreeDepts();
        this.deptList = result.data;
      },
    },
    mounted() {
      this.groupMessage = {...this.data}
      this.getGruop()
    }
  }
</script>

<style scoped>

</style>
