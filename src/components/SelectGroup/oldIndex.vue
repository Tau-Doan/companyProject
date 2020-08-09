<template>
  <div class="selectGroup">
    <!--    <div class="selectGroupTabulation">-->
    <!--      <el-tree-->
    <!--        :data="deptList"-->
    <!--        :props="deptProps"-->
    <!--        node-key="deptId"-->
    <!--        :default-checked-keys="[-1]"-->
    <!--        @node-click="handleNodeClick"/>-->
    <!--    </div>-->
    <div class="selectGroupName">
      <div class="selectGroupContent">
        <span v-if="!groupList.length">暂无数据</span>
        <div class="selectGroupPhoto" :key="index" v-for="(item,index) in groupList">
          <el-checkbox :disabled="!isSelect" v-model="item.select" @change="handleGroupChange(item)"/>
          <el-image
            v-for="item.select"
            style="width: 60px;height: 60px;"
            :src="item.groupAvatar"
            fit="contain">
          </el-image>
          <span class="selectGroupPhotoName">{{ item.groupName}}</span>
        </div>
      </div>
      <div>
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
      }
    },
    data() {
      return {
        deptList: [],
        groupList: [], // 选中的群数据
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
       * 处理群组改变
       */
      handleGroupChange(group) {
        // 更新其他节点相同群组
        this.deptList.forEach(dept => {
          this.findGroupAndUpdateStatus(dept, group.groupId, group.select);
        });
        // 更改父组件选中状态
        this.updateParentSelectStatus();
        this.$forceUpdate();
      },
      /**
       * 查询所有的部门和群数据
       */
      async findDeptGroupTree() {
        const result = await findDeptGroupTree();
        this.deptList = result.data;
        // 获取全部机构中的群组数据
        this.getAllDeptGroups();
        // 初始化回显
        this.initHandlerGroupSelectStatus();
      },
      /**
       * @param id 群id
       */
      updateGroupSelectStatus(id) {
        this.deptList.forEach(item => {
          this.delGroup(item, id);
        });
        // 更新选中状态
        this.updateParentSelectStatus();
        this.$forceUpdate();
      },
      /**
       * 查询群组并改变状态
       */
      delGroup(dept, id) {
        // 获取dept中的群组
        const groupList = dept.groupList;
        // 遍历查询群组，并修改状态
        groupList.forEach(item => {
          if (item.groupId === id) {
            item.select = false;
            return false;
          }
        });
        // 获取子节点,开始递归
        const children = dept.children;
        if (children && children.length) {
          children.forEach(item => {
            this.delGroup(item, id);
          })
        }
      },
      /**
       * 更新节点显示状态
       */
      findGroupAndUpdateStatus(dept, id, status) {
        // 获取dept中的群组
        const groupList = dept.groupList;
        // 遍历查询群组，并修改状态
        groupList.forEach(item => {
          if (item.groupId === id) {
            item.select = status;
          }
        });
        // 获取子节点,开始递归
        const children = dept.children;
        if (children && children.length) {
          children.forEach(item => {
            this.findGroupAndUpdateStatus(item, id, status);
          })
        }
      },

      /**
       * 修改所有群选中状态
       */
      updateAllGroupSelectStatus(status) {
        this.groupList.forEach(item => {
          item.select = status;
          // 更新其他节点相同群组
          this.deptList.forEach(dept => {
            this.findGroupAndUpdateStatus(dept, item.groupId, status);
          });
        });
        this.$forceUpdate();
      },
      handleNodeClick(data) {
        // 保存当前部门数据
        this.groupList = data.groupList;
      },

      /**
       * 保存数据
       */
      save() {
        // 清空所有的群
        this.selectGroupList = [];
        // 获取选中的数据
        this.deptList.forEach(item => {
          this.getSelectGroups(item);
        });

        if (!this.selectGroupList || !this.selectGroupList.length) {
          this.$message.warning("请选择目标群");
          return;
        }
        // 过滤重复数据
      const selectGroupList = this.selectGroupList.reduce((prev, item) => {
        const index = prev.findIndex(group => item.groupId === group.groupId);
        index === -1 && prev.push(item);
        return prev;
      }, []);
  // 用户选择的群数据
  this.saveComponentData([...selectGroupList], 3);
  },
      /**
       * 获取所有选中的群组
       */
      getSelectGroups(dept) {
        // 获取dept中的群组
        const groupList = dept.groupList;
        // 获取dept中所有的选中的群组
        groupList.forEach(item => {
          item.select && this.selectGroupList.push(item);
        });
        // 获取子节点,开始递归
        const children = dept.children;
        if (children && children.length) {
          children.forEach(item => {
            this.getSelectGroups(item);
          })
        }
      },
      /**
       * 初始化选中状态
       */
      initHandlerGroupSelectStatus() {
        if (!this.initGroupList || !this.initGroupList.length) {
          this.deptList.forEach(dept => {
            this.findGroupAndUpdateStatus(dept, -1, true);
          });
        } else {
          this.initGroupList.forEach(item => {
            this.deptList.forEach(dept => {
              this.findGroupAndUpdateStatus(dept, item.groupId, true);
            });
          })
        }
      },
      getAllDeptGroups() {
        this.groupList = this.deptList[0].groupList
      },
    },
    mounted() {
      if (this.depts && this.depts.length) {
        this.deptList = this.depts
        // 获取全部机构中的群组数据
        this.getAllDeptGroups();
      } else {
        this.findDeptGroupTree();
      }
    }

  }
</script>

<style lang="scss">
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

      .selectGroupPhoto {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        margin-bottom: 10px;

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
</style>
