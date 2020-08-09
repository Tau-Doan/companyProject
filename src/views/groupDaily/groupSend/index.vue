<template>
  <div class="app-container">
    <el-form :inline="true">
      <el-form-item>
        <el-input v-model="pageParams.keyWord" placeholder="快速查询"/>
      </el-form-item>
      <el-form-item >
        <el-button type="primary" icon="el-icon-search" size="mini" @click="searchQuery">查询</el-button>
      </el-form-item>
      <el-form-item>
        <el-button  icon="el-icon-plus" size="mini" type="" @click="toEdit">新建群发任务</el-button>
      </el-form-item>
    </el-form>
    <div class="switch-but-container">
<!--      <el-button v-for="(but) in componentButs"-->
<!--                 :key="but.type"-->
<!--                 @click="findGroupSend(but.type)"-->
<!--                 :type="but.type === 0?'primary':'info'"-->
<!--                 size="mini"-->
<!--                 icon="el-icon-chat-dot-round"-->
<!--                 v-text="but.name"-->
<!--      />-->
    </div>
    <el-table
      v-loading="loading"
      element-loading-text="拼命加载中"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.8)"
      :data="groupSends">
      <el-table-column label="发送内容" :show-overflow-tooltip="true" >
        <template slot-scope="scope">
          <span v-if="scope.row.content.indexOf('http') === -1"> {{scope.row.content}}</span>
            <el-image
              v-else
              style="width: 60px;height: 60px"
              :src="scope.row.content"
              fit="cover"/>
        </template>
      </el-table-column>
      <el-table-column label="发送类型" align="center" >
        <template slot-scope="scope">
          <span>{{scope.row.type === 1?'即时发送': '定时发送'}}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="type === 0" label="发送时间" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.sendTime?scope.row.sendTime: scope.row.timing}}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center">
        <template slot-scope="scope">
          <span>{{getSendStatus(scope.row)}}</span>
        </template>

      </el-table-column>
      <el-table-column label="目标群" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.groupNumber}}个
            <el-button type="text" @click="getGroupList(scope.row.id)" icon="el-icon-view">查看</el-button>
          </span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <div v-if="type === 0">
            <el-button type="text" v-if="scope.row.type === 1 && scope.row.status === 2"
                          @click="sendAgain(scope.row.id)">再次发送
            </el-button>
            <el-button type="text" @click="findApprovalDetails(scope.row.id)"
                       icon="el-icon-document" v-if=" scope.row.examine2By && user.userId != scope.row.examine2By ">审核详情
            </el-button>
            <el-button type="text" v-if="scope.row.status === 0"  @click="delSend(scope.row.id)"><i
              class="el-icon-delete delete"></i></el-button>
          </div>
          <div v-if="type === 1">
            <el-button icon="el-icon-document" type="text" @click="findApprovalDetails(scope.row.id)">审核详情</el-button>
            <el-button icon="el-icon-tickets" type="text" v-if="showAuditing(scope.row.status)" @click="reviewOperation(scope.row)">审核
            </el-button>
            <el-button icon="el-icon-circle-close" type="text" v-if="scope.row.status === -1 || scope.row.status === -2">审核不通过</el-button>
            <el-button icon="el-icon-circle-check" type="text" v-if="scope.row.status === 2">审核通过</el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="pageParams.page"
      :limit.sync="pageParams.pageSize"
      @pagination="pageQuery"/>

    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="isShowGroupListPage"
      title="目标群"
      width="30%">
      <selectGroup v-if="isShowGroupListPage" :isSelect="false" :depts="deptList"/>
    </el-dialog>

    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="isShowMassAudit"
      title="群发审核"
      width="30%">
      <el-form :model="auditingParams" :rules="auditingRules" ref="auditingForm" label-position="top"
               label-width="100px" class="demo-ruleForm">
        <el-form-item label="发送内容">
          <div>
            <span v-if="groupSend.contentType === 1">
                    {{groupSend.content}}
            </span>
            <div v-else class="sendContentImg">
              <div>
                <el-image
                  style="width: 60px; height: 60px"
                  :src="groupSend.content"
                  fit="cover"/>
              </div>
            </div>
          </div>
        </el-form-item>
        <el-form-item prop="remark">
          <el-input
            type="textarea"
            :rows="4"
            placeholder="请输入备注信息/审核失败信息"
            v-model="auditingParams.remark">
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="auditingGroupSend(1)">通过</el-button>
          <el-button @click="auditingGroupSend(2)">不通过</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="showApprovalDetails"
      title="审核详情"
      width="30%">
      <el-form :model="approvalDetails" ref="approvalDetailsForm" label-position="left" label-width="100px"
               class="demo-ruleForm">
        <el-form-item label="发起人">
          <span class="approvalDetailsSpan">{{approvalDetails.createMemberName}}</span>
        </el-form-item>
        <el-form-item label="发起时间">
          <span class="approvalDetailsSpan">{{approvalDetails.createTime}}</span>
        </el-form-item>
        <el-form-item label="初审人">
          <span class="approvalDetailsSpan">{{approvalDetails.firstTrialMemberName}}</span>
        </el-form-item>
        <el-form-item label="初审时间">
          <span class="approvalDetailsSpan">{{approvalDetails.firstTrialTime}}</span>
        </el-form-item>
        <el-form-item label="复审人">
          <span class="approvalDetailsSpan">{{approvalDetails.reexamineMemberName}}</span>
        </el-form-item>
        <el-form-item label="复审时间">
          <span class="approvalDetailsSpan">{{approvalDetails.reexamineTime}}</span>
        </el-form-item>
        <el-form-item label="状态">
          <span class="approvalDetailsSpan">{{getStatusAlias(approvalDetails.status)}}</span>
        </el-form-item>
        <el-form-item label="备注">
          <span class="approvalDetailsSpan">{{approvalDetails.remark}}</span>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>

  import {
    del,
    pageQuery,
    auditingGroupSend,
    findApprovalDetails,
    getGroupList,
    pageQueryAuditingList,
    sendAgain,
    findGroup

  } from '../../../api/groupDaily/groupSend';

  import SelectGroup from '@/components/SelectGroup';

  export default {
    name: "GroupSend",
    components: {
      SelectGroup
    },
    data() {
      return {
        componentButs: [
          {
            name: '群发列表',
            type: 0,
          },
          {
            name: '群发列表',
            type: 1,
          },
        ],
        user: {},
        approvalDetails: {},
        showApprovalDetails: false,
        auditingRules: {
          remark: [{validator: this.validateRemark, trigger: 'blur'}],
        },
        groupSend: {}, // 群审核对象
        isShowMassAudit: false,
        type: 0,
        deptList: [],
        isShowGroupListPage: false,
        total: 0,
        groupSends: [],
        loading: false,
        pageParams: {
          page: 1, // 当前页
          size: 10, // 每页记录数
          keyWord: ''
        },
        auditingParams: {
          id: '',
          auditingType: '',
          remark: '',
        }
      }
    },
    methods: {
      /**
       * 跳转新建群发
       */
      toEdit(){
        this.$router.push('/groupDaily/groupSendEdit')
      },
      //搜索查询
      searchQuery() {
        this.pageParams.page = 1;
        this.pageQuery()
      },
      /**
       * 获取状态别名
       * 0-待审核 1-初审通过 2-复审通过 3-已发送 -1-初审不通过 -2-复审不通过
       */
      getStatusAlias(status) {
        switch (status) {
          case 0:
            return '待审核';
          case 1:
            return '初审通过';
          case 2:
            return '复审通过';
          case 3:
            return '已发送';
          case -1:
            return '初审不通过';
          case -2:
            return '复审不通过';
        }
      },
      /**
       * 查询群发记录审核详情
       */
      async findApprovalDetails(id) {
        const result = await findApprovalDetails({id});
        this.approvalDetails = result.data;
        this.showApprovalDetails = true;
      },
      validateRemark(rule, value, callback) {
        if (this.auditingParams.auditingType === 2 && !this.auditingParams.remark) {
          return callback("请输入备注信息/审核失败信息");
        }
        callback();
      },
      /**
       * 显示审核组件
       */
      reviewOperation(groupSend) {
        this.groupSend = groupSend;
        this.isShowMassAudit = true
      },
      /**
       * 显示审核菜单
       */
      showAuditing(status) {
        const user = this.user;
        // 当前用户拥有初审权限
        if (user.authority === 1 && status === 0) {
          return status === 0
        }

        if (user.authority === 2 && status === 1) {
          return status === 1
        }
        // 已审核
        if (status === 2 || status === -2) {
          return false;
        }
        // // 是否为系统管理员
        return user.roleId === 1 && (status !== -1);
      },
      /**
       * 审核群发信息
       */
      auditingGroupSend(auditingType) {
        this.auditingParams.id = this.groupSend.id;
        this.auditingParams.auditingType = auditingType;
        this.$refs.auditingForm.validate(async (valid) => {
          if (!valid) {
            return false;
          }

          const result = await auditingGroupSend(this.auditingParams);
          this.$message.success('操作成功');
          this.pageQuery();
          this.auditingParams = {};
          this.isShowMassAudit = false;
        });
      },
      /**
       * 获取群发状态
       */
      getSendStatus(groupSend) {
        switch (groupSend.status) {
          case 0:
            return '待审核';
          case 1:
            return '初审通过';
          case 2:
            return groupSend.sendTime ? '已发送' : '待发送';
          case -1:
            return '初审未通过';
          case -2:
            return '复审未通过';
        }
      },
      findGroupSend(type) {
        this.type = type;
        this.pageParams = {
          page: 1, // 当前页
          size: 10, // 每页记录数
          keyWord: ''
        };
        this.pageQuery();
      },
      async getGroupList(id) {
        const result = await  findGroup( {id})
        // const result = await getGroupList({id});
        this.deptList = result.data;
        this.isShowGroupListPage = true;
      },
      /**
       * 再次发送消息
       * @param id
       */
      async sendAgain(id) {
        try {
          await this.$confirm(`你确定要再次发送此条消息嘛？`, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          });

          await sendAgain({id});
          this.$message.success('发送成功');
          this.pageQuery();
        } catch (e) {
        }
      },
      async pageQuery() {
        this.loading = true;

        const result = this.type === 0 ? await pageQuery(this.pageParams) : await pageQueryAuditingList(this.pageParams);

        const {total, records, size, current} = result.data;
        this.total = total;
        this.pageParams.page = current;
        this.pageParams.size = size;
        this.groupSends = records;
        this.loading = false;
      },
      async delSend(id) {
        try {
          await this.$confirm(`您确定要删除此群发消息记录吗？`, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          });

          await del({id});
          this.$message.success('删除成功');
          this.pageQuery();
        } catch (e) {
        }
      },
    },
    //解决页面缓存不刷新，更新数据
    activated: function() {
      this.pageQuery()
    },
    mounted() {
      this.pageQuery();
    }
  }
</script>

<style scoped>
  .switch-but-container{
    margin-bottom: 20px;
  }
</style>
