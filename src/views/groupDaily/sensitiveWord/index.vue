<template>
  <div class="app-container">
    <el-form ref="queryForm" :inline="true">
      <el-form-item label="发言内容">
        <el-input v-model="params.messageContent"
                  size="small"
                  style="width: 240px"
                  @keyup.enter.native="searchQuery" clearable placeholder="请输入发言内容"/>
      </el-form-item>
      <el-form-item label="群名称">
        <el-input v-model="params.groupName"
                  clearable
                  size="small"
                  style="width: 240px"
                  @keyup.enter.native="searchQuery" placeholder="请输入群名称"/>
      </el-form-item>
      <el-form-item label="群用户">
        <el-input v-model="params.nickName"
                  clearable
                  size="small"
                  style="width: 240px"
                  @keyup.enter.native="searchQuery" placeholder="请输入群用户名称"/>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="searchQuery">查询</el-button>
        <el-button size="mini" icon="el-icon-plus"  @click="isShowSensitiveWords">设置敏感词</el-button>
      </el-form-item>
    </el-form>

    <el-table
      v-loading="loading"
      element-loading-text="拼命加载中"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.8)"
      :data="messageSensitiveHitLogs">
      <el-table-column label="发言内容" prop="messageContent"/>
      <el-table-column label="所在群">
        <template slot-scope="scope">
          <div class="sensitiveWordGroup">
            <el-image
              style="width: 60px; height: 60px"
              :src="scope.row.groupAvatar"
              fit="fit"/>
            <span>{{scope.row.groupName}}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="群用户" prop="name">
        <template slot-scope="scope">
          <div class="sensitiveWordGroup">
            <el-image
              style="width: 60px; height: 60px"
              class="sensitiveWordUse"
              :src="scope.row.memberAvatar"
              fit="fit"/>
            <span>{{scope.row.memberName}}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="操作" prop="name">
        <template slot-scope="scope">
          <el-button  type="text" v-if="scope.row.handleWay===1 || scope.row.handleWay===2 ||scope.row.handleWay===3"  disabled>已处理</el-button>
          <div v-else >
            <el-button type="text"   @click="addMessageSensitiveHitLog(1,scope.row.id)">警告</el-button>
            <el-button type="text"   @click="addMessageSensitiveHitLog(2,scope.row.id)">踢人</el-button>
            <el-button type="text"   @click="addMessageSensitiveHitLog(3,scope.row.id)">忽略</el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="params.pageindex"
      :limit.sync="params.pagesize"
      @pagination="pageQuery"/>



    <el-dialog
      :close-on-click-modal="false"
      title="设置敏感词"
      :visible.sync="dialogSensitiveWords"
      width="30%"
      center>
      <div>
        <div>在下方输入敏感词，回车添加，最多50个</div>
        <div class='sensitiveWords'>
          <el-tag
            :key="index"
            v-for="(tag,index) in sensitiveWords"
            closable
            :disable-transitions="false"
            @close="handleClose(tag)">
            <span class='switch_word'>{{tag}}</span>
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
          <el-button  v-if="!inputVisible && sensitiveWords.length < 50" class="button-new-tag" size="small" @click="addSensitiveWords" icon="el-icon-plus">
            添加敏感词
          </el-button>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
    <el-button type="primary" @click="saveSensitiveWord">保 存</el-button>
    <el-button @click="dialogSensitiveWords = false">取 消</el-button>
  </span>
    </el-dialog>

    <el-dialog
      :close-on-click-modal="false"
      title="群内警告设置"
      :visible.sync="dialogGroupWarning"
      width="30%"
      center>
      <div>
        <div>提醒语设置</div>
        <el-input type="textarea"
                  :rows="5"
                  placeholder="请输入内容"
                  v-model="messageSensitiveHitLog.warnContent"/>
      </div>
      <span slot="footer" class="dialog-footer">
    <el-button type="primary" @click="saveHandlerWay">发 送</el-button>
    <el-button @click="dialogGroupWarning = false">取 消</el-button>
  </span>
    </el-dialog>
  </div>
</template>

<script>
  import Vue from 'vue'
  import {Parser} from "xml2js";
  const xmlParser = new Parser();
  import {getInfo,save,modify,pageQuery } from '../../../api/groupDaily/sensitiveWord'
  export default {
    name: "SensitiveWord",
    data() {
      return {
        textarea: '',
        sensitiveWords: [],
        inputVisible: false,
        inputValue: '',
        dialogGroupWarning: false,
        dialogSensitiveWords: false,
        loading: false,
        url: 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg',
        messageSensitiveHitLogs: [],
        params: {
          pageindex: 1,
          pagesize: 10,
          messageContent: '',
          groupName: '',
          nickName: '',
        },
        messageSensitiveHitLog: {
          id: '',
          handleWay: '',
          warnContent: '警告！本群禁止发送涉黄、涉政、涉黑、地域歧视、言语谩骂等不良行为！！请立即撤回！！否则发送者将会踢出群！！',
        },
        total: 0,
      }
    },
    methods: {
      /**
       * 设置内容
       * @param item 内容
       * @param key key
       */
      setContent(item,key='content'){
        xmlParser.parseString(item.messageContent,(err,result) => {
          try {
            item.messageContent = result.msg.appmsg[0][key][0];
          }catch (e) {
            item.messageContent = '';
          }
        })
      },
      //搜索查询
      searchQuery(){
        this.params.pageindex = 1;
        this.pageQuery()
      },
      /**
       * 获取敏感词信息
       */
      async getSensitiveWord() {
          const result = await getInfo();
          const sensitiveWord = result.data;
          this.sensitiveWords = sensitiveWord ? result.data.split(',') : [];
      },
      /**
       * 保存敏感词
       */
      async saveSensitiveWord() {
          const info = this.sensitiveWords.join(',');
          await save({info});
          this.$message.success('操作成功');
          this.dialogSensitiveWords = false;
      },
      handleClose(tag) {
        this.sensitiveWords.splice(this.sensitiveWords.indexOf(tag), 1);
      },
      addSensitiveWords() {
        this.inputVisible = true;
        this.$nextTick(_ => {
          this.$refs.saveTagInput.$refs.input.focus();
        });
      },

      handleInputConfirm() {
        let inputValue = this.inputValue;
        if (inputValue) {
          this.sensitiveWords.push(inputValue);
        }
        this.inputVisible = false;
        this.inputValue = '';
      },
      //设置敏感词
      isShowSensitiveWords() {
        this.dialogSensitiveWords = true
      },
      /**
       * 添加处理方式
       */
      addMessageSensitiveHitLog(way, id) {
        let message = '';
        // 处理方式 1-警告 2-踢人 3-忽略
        switch (way) {
          case 1: {
            message = '';
            this.dialogGroupWarning = true;
            break;
          }
          case 2: {
            message = '您确定踢出此用户嘛？';
            break;
          }
          case 3: {
            message = '你确定忽略此条记录嘛?';
            break;
          }
        }

        this.messageSensitiveHitLog.id = id;
        this.messageSensitiveHitLog.handleWay = way;

        if (message) {
          this.$confirm(message, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.saveHandlerWay();
          })
        }
      },
      /**
       * 保存处理方式
       */
      async saveHandlerWay() {
          await modify(this.messageSensitiveHitLog);
          this.$message.success('操作成功');
          this.dialogGroupWarning = false;
          // 更新处理状态
          const id = this.messageSensitiveHitLog.id;
          // 查询下标
          const index = this.messageSensitiveHitLogs.findIndex(item => item.id = id);
          const messageSensitiveHitLog = this.messageSensitiveHitLogs[index];
          messageSensitiveHitLog.status = 1;
          // 保存到数组
          Vue.set(this.messageSensitiveHitLogs,index,messageSensitiveHitLog);
          this.pageQuery();
      },
      /**
       * 查询消息
       */
      async pageQuery() {
          this.loading = true;
          const result = await pageQuery(this.params);
          const {total, records, size, current} = result.data;
          this.total = total;
          this.params.pageindex = current;
          this.params.pagesize = size;
          // records.forEach(item => this.setContent(item,'title'));
          this.messageSensitiveHitLogs = records;
          this.loading = false;
      },
    },
    mounted() {
      this.getSensitiveWord();
      this.pageQuery();
    }
  }
</script>

<style scoped lang="scss">
 .sensitiveWordGroup{
   display: flex;
   justify-content: flex-start;
   align-items: center;
   >span{
     margin-left: 15px;
   }
 }
</style>
