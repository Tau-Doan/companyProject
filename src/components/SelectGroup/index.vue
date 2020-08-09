<template>
  <div class="selectGroup">
<!--        <div class="selectGroupTabulation">-->
<!--          <el-tree-->
<!--            :data="deptList"-->
<!--            :props="deptProps"-->
<!--            node-key="deptId"-->
<!--            :default-checked-keys="[-1]"-->
<!--            @node-click="handleNodeClick"/>-->
<!--        </div>-->
    <div class="selectGroupName">
      <div class="selectGroupContent" style=" height: 360px;">
        <span v-if="!groupList.length">暂无数据</span>
        <el-scrollbar style="height:100%">
          <div class="selectGroupPhoto" :key="index" v-for="(item,index) in groupList" v-if="!depts" >
            <el-checkbox :disabled="!isSelect" v-model="item.select" @change="handleGroupChange(item)"  />
            <el-image
              style="width: 60px;height: 60px;"
              :src="item.groupAvatar"
              fit="contain">
            </el-image>
            <span class="selectGroupPhotoName">{{ item.name}}</span>
          </div>
<!--          只能显示查看的-->
          <div class="selectGroupPhoto" :key="index" v-for="(item,index) in depts" v-if="depts">
            <el-checkbox :disabled="!isSelect" v-model="item.select" @change="handleGroupChange(item)"   />
            <el-image

              style="width: 60px;height: 60px;"
              :src="item.groupAvatar"
              fit="contain">
            </el-image>
            <span class="selectGroupPhotoName"  >{{ item.name}}</span>
          </div>
        </el-scrollbar>
      </div>
      <div class="select-btn">
        <el-button type="primary" v-if="isSelect" class="saveBut" @click="save">确定</el-button>
        <el-button v-if="isSelect" class="cancelBut" @click="close">取消</el-button>
      </div>
    </div>

  </div>
</template>

<script>

  import {findDeptGroupTree} from '../../api/group'

  export default {
    name: "selectGroup",
    props: {
      close: {
        type: Function,
        require: false
      }, // 关闭
      isSelectAll: {
        type: Boolean,
        require: false
      }, // 是否选中所有
      depts: {
        type: Array,
        require: false
      },
      isSelect: {
        type: Boolean,
        require: true
      }, // 是否可以选择
      updateSelectAllStatus: {
        type: Function,
        require: false
      }, // 修改父组件选中状态
      saveComponentData: {
        type: Function,
        require: false
      },
      initGroupList: {
        type: Array,
        require: false
      },
    dialogView:{
        type:Boolean
    }

  },
    data() {
      return {
        deptList: [],
        groupList: [], // 群数据
        group: {}, // 临时保存群
        selectGroupList: [], // 选中的group
        deptProps: {
          children: 'children',
          label: 'deptName'
        },
      };
    },
    methods: {
      /**
       * 更改父组件选中状态
       */
      updateParentSelectStatus() {
        if (!this.groupList.length || !this.isSelect) {
          return;
        }
        const selectNumber = this.groupList.filter(item => item.select).length;
        // 是否选中全部
        const status = selectNumber === this.groupList.length;
        // 修改父组件状态
        this.updateSelectAllStatus(status);
      },
      /**
       * 查询所有的部门和群数据
       */
      async findDeptGroupTree() {
        const result = await findDeptGroupTree();
        this.groupList = result.data;
      },
      /**
       * 保存数据
       */
      save() {
        // 清空所有的群
        this.selectGroupList = [];
        // 获取选中的数据
        this.groupList.forEach(item => {
          if (item.select) {
            this.selectGroupList.push(item)
          }
        });
        if (!this.selectGroupList || !this.selectGroupList.length) {
          this.$message.warning("请选择目标群");
          return;
        }
        this.$emit('handleGroupList',this.selectGroupList)
        this.close()
      },
      /**
       * 修改所有群选中状态
       */
      updateAllGroupSelectStatus(status) {
        this.groupList.forEach(item => {
          item.select = status;
        });
        this.$forceUpdate();
      },
      /**
       * 处理群组改变
       */
      handleGroupChange(group) {
        this.updateParentSelectStatus();
        this.$forceUpdate();
      },
      /**
       * 初始化选中状态
       */
      initHandlerGroupSelectStatus() {
        this.deptList=this.depts
        if (!this.initGroupList || !this.initGroupList.length) {
          this.findGroupAndUpdateStatus(this.deptList);
        }
      },
      /**
       * 更新节点显示状态
       */
      findGroupAndUpdateStatus(dept) {
        // 获取dept中的群组
        const groupList = [];
        // 遍历查询群组，并修改状态
        dept.forEach(item => {
          if( item.select){
            item.select=true
              // groupList.push(item)
          }else {
            item.select=false
          }
        });
        // this.depts=[...groupList]

      },
    },
    mounted() {
      this.findDeptGroupTree()
      this.initHandlerGroupSelectStatus()
    }
  }
</script>

<style lang="scss" scoped>
  .selectGroup {
    display: flex;
    justify-content: flex-start;
    margin-top: 5px;
    height: 400px;

    .selectGroupTabulation {
      width: 250px;
      border: 1px #E4E7ED solid;
    }

    .selectGroupName {
      width: 400px;
      display: flex;
      justify-content: space-between;
      flex-flow: column nowrap;
      margin-left: 10px;
      margin-right: 10px;
      height: 100%;

      .selectGroupContent {
        overflow: auto;
      }
      .select-btn{
        display: flex;
        justify-content: flex-end;
       .el-button{
         text-align: center;
       }
      }

      .selectGroupPhoto {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        margin-bottom: 20px;

        .el-image {
          width: 60px;
          height: 60px;
          box-sizing: border-box;
          margin: 0 15px;
          border-radius: 50%;
        }

        .selectGroupPhotoName {
          display: block;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      }
    }
  }
  //隐藏el-scrollbar的X滚动条
  .el-scrollbar{
    box-sizing: border-box;
    overflow-x: hidden;
    overflow-y:hidden;

  }
  /deep/.el-scrollbar__wrap {
    overflow-x: hidden;
  }

  /deep/ .el-scrollbar__bar.is-horizontal{
    width: 0;
    display: none;
  }
  .is-horizontal {    display: none;
  }
</style>
