<template>
  <div class="app-container">
    <div class="messageQuery">
      <div class="messageQueryHead">
<!--        <div class="messageQueryHeadSelect">-->
<!--          <span>机构</span>-->
<!--          <el-select v-model="params.deptId" clearable @change="findGroupByDeptId" placeholder="请选择">-->
<!--            <el-option-->
<!--              v-for="(item,index) in depts"-->
<!--              :key="index"-->
<!--              :label="item.deptName"-->
<!--              :value="item.deptId">-->
<!--            </el-option>-->
<!--          </el-select>-->
<!--        </div>-->
        <div class="messageQueryHeadSelect">
          <span>群组</span>
          <el-select v-model="params.groupId" placeholder="请选择">
            <el-option
              v-for="(item,index) in groups"
              :key="index"
              :label="item.name"
              :value="item.groupId">
            </el-option>
          </el-select>
        </div>
        <div class="messageQueryHeadSelect">
          <span>消息类型</span>
          <el-select v-model="params.msgType" placeholder="请选择">
            <el-option
              v-for="(item,index) in messageTypes"
              :key="index"
              :label="item.name"
              :value="item.type">
            </el-option>
          </el-select>
        </div>
        <div class="messageQueryHeadSelect">
          <span class="demonstration">筛选时间</span>
          <el-date-picker
            @change="handlerDateChange"
            v-model="dateArray"
            type="datetimerange"
            value-format="yyyy-MM-dd HH:mm:ss"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
        </div>
        <div class="keywordSpan messageQueryHeadSelect">
          <span>关键词</span>
          <el-input v-model="params.content" placeholder="请输入内容"/>
        </div>
        <div class="messageQueryHeadSelect">
          <el-button type="primary" plain @click="pageQuery">查询</el-button>
        </div>

      </div>
      <div class="messageQuery">
        <span v-if="!messageList || !messageList.length">暂无数据</span>
        <div v-else class="messageQueryContent" :key="index" v-for="(item,index) in messageList">
          <div class="chat">
            <div class="chatRecords">
              <div class="avatar">
                <img :src="item.avatar" alt="">
              </div>
              <div class="chatContent">
                <div class="timeAndName">
                  <span class="groupName">{{item.nickname}}</span>
                  <div class="chatTime">{{item.msgTime}}</div>
                </div>
                <div class="chatSpecificContent">
                                    <span v-if="item.msgType === 1000
                                     || item.msgType === 2001">
                                        {{item.content}}
                                    </span>
                  <div class="AudioPlayback" v-if="item.msgType === 2003">
                    <el-button @click="play(item)"
                               :class="!item.isPlay?'el-icon-video-play':'el-icon-video-pause'"/>
                  </div>
                  <el-image v-if="item.msgType === 2002" :src="item.content" alt=""/>
                  <el-button v-if="item.msgType === 2004" type="primary" @click="openVideoPlay(item.shareUrl)">播放视频</el-button>
                  <span v-if="item.msgType === 2005">{{item.shareUrl}}</span>
                  <span v-if="item.msgType === 2013">{{item.content}} <span class="applet">(小程序分享)</span></span>

                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
      <pagination
        v-show="total>0"
        :total="total"
        :page.sync="params.pageindex"
        :limit.sync="params.pagesize"
        @pagination="pageQuery"/>
      <!--弹框组件-->
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

  </div>
</template>

<script>
  import BenzAMRRecorder from "benz-amr-recorder";
  import VideoPlay from "../../../components/VideoPlay"
  import {Parser} from "xml2js";

  import {findAll,findGroupByDeptId,pageQueryMessageList,findDeptGroupTree} from "../../../api/groupDaily/messageQuery"

  const xmlParser = new Parser();
  export default {
    name: "MessageQuery",
    components: {VideoPlay},
    data() {
      return {
        showVideoPlay: false,
        videoUrl: '', // 视频播放地址
        depts: [], // 机构数据
        messageTypes: [
          // {type: 1000, name: '通知'},
          {type: 2001, name: '文字'},
          {type: 2002, name: '图片'},
          {type: 2003, name: '语音'},
          {type: 2004, name: '视频'},
          {type: 2005, name: '链接'},
          {type: 2006, name: '名片'},
          {type: 2010, name: '文件'},
          {type: 2013, name: '小程序'},
        ],
        messageList: [], // 消息数据
        groups: [],
        dateArray: [], // 日期数组
        total: 0,
        params: {
          groupId: null, // 群组id
          startDate: '', // 开始时间
          endDate: '', // 结束时间
          msgType: '', // 文件类型
          content: '', // 消息内容
          pageindex: 1,
          pagesize: 10,
          deptId: null, // 机构id
        }
      }
    },
    methods: {

      /**
       * 设置内容
       * @param item 内容
       * @param key key
       */
      setContent(item,key='content'){
        xmlParser.parseString(item.content,(err,result) => {
          try {
            item.content = result.msg.appmsg[0][key][0];
          }catch (e) {
            item.content = '';
          }
        })
      },
      /**
       * 打开视频播放组件
       */
      openVideoPlay(videoUrl){
        this.videoUrl = videoUrl;
        this.showVideoPlay = true;
      },
      pageQuery(){
        this.params.pageindex = 1;
        this.pageQueryMessageList();
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

        this.messageList
          .filter(message => message.msgType === 2003)
          .forEach(message => {
            if (message.id !== item.id && message.amr) {
              message.amr.pause();
              message.isPlay = false;
            }
          });
        this.$forceUpdate();
      },
      /**
       * 处理日期改变
       */
      handlerDateChange(date) {
        !date && (date = []);
        const [startDate, endDate] = date;
        this.params.startDate = startDate;
        this.params.endDate = endDate;
      },

      /**
       * 根据部门id查询群数据
       */
      // async findGroupByDeptId() {
      //   if (!this.params.deptId) {
      //     this.groups = [];
      //     return;
      //   }
      //   const result = await findGroupByDeptId({deptId: this.params.deptId});
      //   // this.groups = result.data;
      // },
      /**
       * 查询消息
       */
      async pageQueryMessageList() {
          const result = await pageQueryMessageList(this.params);
          const {total, records, size, current} = result.data;
          this.total = total;
          this.params.pageindex = current;
          this.params.pagesize = size;
          // 处理视频
          if(this.params.msgType === 2013){
            records.forEach(item => this.setContent(item,'title'))
          }
          this.messageList = records;
      },
      // 群组
      async getGroupNumber(){
        const result= await findDeptGroupTree()
        this.groups= result.data
        console.log(result)
      }
    },
    mounted() {
      this.getGroupNumber()

    },
    destroyed() {
      this.pause();
    }
  }
</script>

<style lang="scss" scoped>
  .messageQueryHead {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    flex-wrap: wrap;
    /*min-width: 1465px;*/
    margin: 20px 0;

    .messageQueryHeadSelect {
      margin-right: 25px;
      margin-bottom: 20px;
    }

    .el-select {
      width: 170px;
    }

    span {
      margin-right: 8px;
    }

    .keywordSpan {
      /*display: flex;*/
      /*flex-direction: row;*/
      line-height: 40px;
      align-items: center;

      .el-input {
        width: 170px;
      }
    }
  }

  .messageQueryContent {
    padding: 0.625rem;

    .chat {
      display: flex;
      width: 35vw;
      justify-content: space-between;
      padding: 0.625rem;
      margin-bottom: 0.625rem;
      box-shadow: 0 2px 12px 0 rgba(0, 0, 0, .1);
      border-radius: 4px;
      border: 1px solid #ebeef5;
      background-color: #fff;
      overflow: hidden;
      color: #303133;
      transition: .3s;
      .chatRecords {
        width: 100%;
        display: flex;
        justify-content: flex-start;
        flex-wrap: nowrap;

        .avatar {
          img {
            width: 3rem;
            height: 3rem;
          }
        }

        .chatContent {
          width: 27vw;
          margin: 0 0 .625rem 0.6rem;

          .timeAndName {
            width: 26vw;
            min-width: 220px;
            display: flex;
            justify-content: space-between;
          }

          .groupName {
            margin-bottom: 0.625rem;
            display: block;
            /*white-space: nowrap;*/
            /*overflow: hidden;*/
            /*text-overflow: ellipsis;*/
          }

          .chatSpecificContent {
            display: inline-block;
            line-height: 24px;
            /*padding: 5px 0;*/
            word-wrap: break-word;
            word-break: break-all;
            overflow: hidden;

            img {
              min-width: 100px;
              max-width: 400px;
            }
          }
        }
      }

    }
  }
  .applet{
    font-size: 12px;
    color: #909399;
  }

</style>
