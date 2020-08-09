<template>
  <div class="app-container">
    <div class="titleHeader">
      <span>{{id?'编辑':'新增'}}{{gameName[type-1]}}素材</span>
      <el-divider></el-divider>
    </div>
    <div class="addGuessWord">
      <el-form ref="sourceFrom" :rules="rules" :model="source" label-position="top">
        <el-form-item v-if="type === 1 || type === 2 " :label="type === 1?'上传图片（支持上传一张图片）:':'上传语音（支持一段语音）：'"
                      prop="content">
          <el-upload
            class="avatar-uploader"
            :headers="headers"
            :action="uploadServerUrl"
            :show-file-list="false"
            :multiple="true"
            :on-success="handleAvatarSuccess"
            :before-upload="checkPhoneFileTypeAndFileSize">
            <img v-if="source.content && type === 1" :src="source.content" class="avatar">
            <div v-if="source.content && type === 2" class="audio AudioPlayback">
              <el-button :class="!source.isPlay?'el-icon-video-play':'el-icon-video-pause'"/>
            </div>
            <i v-if="!source.content" class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="题目" v-if="type ===3 || type ===4" prop="title">
          <el-input v-model="source.content" placeholder="请输入题目"></el-input>
        </el-form-item>
        <el-form-item label="答案" prop="answer">
          <el-input v-model="source.answer" placeholder="请输入答案"></el-input>
        </el-form-item>
        <el-form-item :label="descTypes[type - 1]" v-if="showDescTypes.includes(type)" prop="desc">
          <el-input v-model="source.desc" max="20" :type="type === 2?'number':'text'"
                    :placeholder="`请输入${descTypes[type - 1]}`"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="save(source)">保存</el-button>
          <el-button @click="revert">取消</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
  import {getToken} from "@/utils/auth";
  import BenzAMRRecorder from "benz-amr-recorder";

  const BASE_URL = process.env.VUE_APP_BASE_API;
  import {save, findOne} from "../../../api/operation/material"

  export default {
    name: "AddSource",
    props: ['params'],
    data() {
      return {
        headers: {Authorization: "Bearer " + getToken()},
        uploadServerUrl: `${BASE_URL}/common/upload`,
        uploadParams: {type: 'default'},
        descTypes: ['类型', '时长', '原因'],
        showDescTypes: [1, 2, 3], // 显示描述的类型
        uploadName: 'image',
        imageUrl: '',
        type: "",
        source: {
          answer: "",
          desc: '',
          contentType: 1,
          content: ''
        },
        id: '', // 游戏素材id
        gameName: ['看图猜字', '猜歌名', '脑筋急转弯', '歇后语'],
        rules: {
          desc: [{validator: this.validateDesc, trigger: 'blur'}],
          answer: [
            {required: true, message: '请输入答案', trigger: 'blur'}
          ],
          content: [{validator: this.validateContent, trigger: 'blur'}],
          title: [{validator: this.validateTitle, trigger: 'blur'}]
        }
      }

    },
    methods: {
      pause() {
        if (this.source.amr && this.source.amr.isPlaying()) {
          this.source.amr.pause();
        }
      },
      async play(item) {
        try {
          // 创建amr
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
        // 播放完成监听
        item.amr.onEnded(() => {
          item.isPlay = false;
          this.$forceUpdate();
        });

        this.$forceUpdate();
      },
      /**
       * 校验描述
       */
      validateDesc(rule, value, callback) {
        if (!value) {
          return callback(new Error(`请输入${this.descTypes[this.type - 1]}`));
        }

        if (this.type === 2 && value > 60) {
          return callback(new Error('语音时长不能大于60秒'));
        }

        callback();
      },
      validateTitle(rule, value, callback) {
        if (!this.source.content) {
          callback(new Error('请输入题目'));
          return false;
        }
        callback();
      },

      validateContent(rule, value, callback) {

        let errorMessage = '';

        switch (this.type) {
          case 1:
          case 2:
            errorMessage = '请上传素材';
            break;
          case 3:
          case 4:
            errorMessage = '请输入题目';
            break;
        }


        if (!this.source.content) {
          callback(new Error(errorMessage));
          return;
        }

        callback();

      },
      /**
       * 图片上传成功处理
       * @param res
       * @param file
       */
      handleAvatarSuccess(res, file) {
        if (res.code !== 200) {
          this.$message.error(res.message);
          return;
        }
        this.source.content = res.fileName;
        this.$forceUpdate();
      },
      beforeAvatarUpload(file) {
        switch (this.type) {
          case 1: { // 上传图片
            this.checkPhoneFileTypeAndFileSize(file);
            break;
          }
          case 2: { // 处理音频
            this.checkAudioFileTypeAndFileSize(file);
            break;
          }
        }
      },
      getContentType() {
        let contentType = 1;
        switch (this.type) {
          case 1: {
            // 图片
            contentType = 2;
            break;
          }
          case 2: {
            // 音频
            contentType = 3;
            break;
          }
          case 3:
          case 4: {
            // 文字
            contentType = 1;
            break;
          }
        }

        return contentType;
      },
      save() {
        this.$refs.sourceFrom.validate(async (valid) => {
          if (!valid) {
            return false;
          }

          // 设置文件类型
          this.source.contentType = this.getContentType();
          this.source.type = this.type;
          await save(this.source);
          this.$message.success("添加成功");
          this.revert();
        });
      },

      /**
       * 返回
       */
      revert() {
        this.$store.dispatch("tagsView/delView", this.$route);
        this.$router.push({path: "/operation/material"})

      },
      async findOne(id) {
        this.id = id;
        const result = await findOne({id});
        this.source = result.data;
      }

    },
    mounted() {
      const {type, id} = this.$route.params;
      this.type = parseInt(type);
      parseInt(id) && this.findOne(id);
    },
    destroyed() {
      this.pause();
    }
  }
</script>

<style lang="scss" scoped>
  .addGuessWord {
    width: 800px;
  }

  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }

  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }

  .avatar-uploader-icon {
    background-color: #fff;
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }

  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }

</style>
