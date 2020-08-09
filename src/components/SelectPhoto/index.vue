<template>
  <div>
    <div class="searchPhoto">
      <el-checkbox-group @change="handlerCheckbox" class="searchPhotoContainer" v-model="checkList">
        <div class="searchImage" v-if="index !== 0" v-for="(item,index) in photos" :key="index">
          <el-checkbox class="searchPhotoCheckbox" :label="index"/>
          <el-image
            style="width: 90px; height: 90px"
            :src="item.url"
            fit="fill">
          </el-image>
        </div>
        <div class="searchPhotoButton">
          <el-upload
            class="avatar-uploader"
            :headers="headers"
            :action="uploadServerUrl"
            :show-file-list="false"
            :multiple="true"
            :on-success="handleAvatarSuccess"
            :before-upload="checkPhoneFileTypeAndFileSize">
            <img v-if="imageUrl" :src="imageUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </div>
      </el-checkbox-group>

    </div>
    <div>
      <el-button @click="save">确定</el-button>
      <el-button @click="close">取消</el-button>
    </div>
  </div>
</template>

<script>
  import { getToken } from "@/utils/auth";
  const BASE_URL = process.env.VUE_APP_BASE_API;

  export default {
    name: "selectPhoto",
    props: {
      close: Function,
      saveComponentData: Function
    },
    data() {
      return {
        checkList: [],

        headers: { Authorization: "Bearer " + getToken() },
        uploadServerUrl: `${BASE_URL}/common/upload`,
        uploadParams: {type: 'default'},
        uploadName: 'image',
        radio: 3,
        photoIndex: null, // 选中的下标
        imageUrl: '',
        photos: [
          {
            url: `${BASE_URL}/images/source/fortuneCat.gif`,
            id: 2,
            isSelect: false,
          }
          ,
          {
            url: `${BASE_URL}/images/source/handclap.gif`,
            id: 3,
            isSelect: true
          }, {
            url: `${BASE_URL}/images/source/ramsHorn.gif`,
            id: 4,
            isSelect: true
          }, {
            url: `${BASE_URL}/images/source/welcomeToThe Group.gif`,
            id: 5,
            isSelect: true
          }
        ]
      };
    },
    methods: {
      // 处理选中后的结果
      handlerCheckbox(value) {
        // 获取最后一个值
        this.checkList = [value[value.length - 1]]
      },
      /**
       * 保存数据
       */
      save() {
        if (!this.checkList || !this.checkList.length) {
          this.$message.error('请选择图片');
          return;
        }
        const photo = this.photos[this.checkList[0]];
        this.saveComponentData(photo.url, 2);
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
        const lastIndex = this.photos[this.photos.length - 1].id + 1;
        this.photos.push({url: res.url, id: lastIndex, isSelect: false});
      },
    },
  }
</script>

<style lang="scss" scoped>
  .searchImage {
    position: relative;
    margin: 5px;
    overflow: hidden;
  }

  .searchPhoto {
    display: flex;
    justify-content: flex-start;
    flex-flow: row wrap;
    width: 500px;

    .searchPhotoContainer {
      display: flex;
      margin: 5px;
      flex-flow: row wrap;

      .searchPhotoCheckbox {
        position: absolute;
        top: 0;
        right: -12px;
      }
    }

    .searchPhotoButton {
      margin: 5px;
      border: 1px dashed #d9d9d9;

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
        font-size: 28px;
        color: #8c939d;
        width: 90px;
        height: 90px;
        line-height: 90px;
        text-align: center;
      }

      .avatar {
        width: 178px;
        height: 178px;
        display: block;
      }
    }

  }

  .quanxian-option:after {
    content: "";
    height: 0;
    clear: both;
    overflow: hidden;
    display: block;
    visibility: hidden;
  }

  .quanxian-option .txt {
    cursor: pointer;
  }

  .quanxian-option .txt:before {
    display: inline-block;
    content: '';
    width: 14px;
    height: 14px;
    background: #fff;
    border: 1px solid #b4b4b4;
    position: absolute;
    margin-top: 2px;
    margin-left: 1px;
  }

  .quanxian-option .radio-btn {
    cursor: pointer;
    margin-right: 5px;
  }

  .quanxian-option .radio-btn:not(:first-child) {
    margin-left: 20px;
  }

  .quanxian-option .radio-btn:checked + label::before {
    background-color: #409eff;
    content: '✓';
    font-size: 14px;
    line-height: 14px;
    text-align: center;
    color: #fff;
  }
</style>
