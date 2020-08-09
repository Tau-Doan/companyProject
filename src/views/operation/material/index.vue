<template>
  <div class="app-container">
    <div class="titleHeader">
      <span>素材管理</span>
      <span class="desc">用于互动游戏题目的上传和管理</span>
      <el-divider></el-divider>
    </div>
    <div class="gameNameButton">
      <el-row>
        <el-button :key="i" :disabled="i === pageParams.type-1" :type="i === pageParams.type-1?'primary':''"
                   @click="changeType(i+1)" v-for="(item,i) in gameName">{{item}}
        </el-button>
      </el-row>
    </div>
    <div id="conditionFrom">
      <el-form :inline="true">
        <el-form-item label="">
          <el-input v-model="pageParams.keyword" placeholder="快速查询"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="searchQuery">查询</el-button>
          <el-button @click="uploading({type: pageParams.type})">上传素材</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div id="table">
      <component :toEdit="toEdit" :del="del" :gameSources="gameSources" :loading="loading"
                 :is="contentNames[pageParams.type-1]"></component>

      <div class="paginationV">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="pageParams.pageindex"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="pageParams.pagesize"
          layout="total, sizes, prev, pager, next"
          background
          :total="total">
        </el-pagination>
      </div>
    </div>

  </div>
</template>

<script>
  import AllegoricalSayingContent from "./components/AllegoricalSayingContent";
  import BrainTwisterContent from "./components/BrainTwisterContent";
  import GuessSongContent from "./components/GuessSongContent";
  import GuessWordContent from "./components/GuessWordContent";

  import {pageQuery,deleteGame} from "../../../api/operation/material"
  export default {
    name: "Material",
    components: {
      AllegoricalSayingContent,
      BrainTwisterContent,
      GuessSongContent,
      GuessWordContent
    },
    props: {
      params: Object
    },
    data() {
      return {
        gameSources: [],
        contentNames: ['guessWordContent', 'guessSongContent', 'brainTwisterContent', 'allegoricalSayingContent'],
        gameName: ['看图猜字', '猜歌名', '脑筋急转弯', '歇后语'],
        loading: false,
        pageParams: {
          pageindex: 1, // 当前页
          pagesize: 10, // 每页记录数
          keyword: '', // 过滤关键字
          type: 1 // 默认为看图猜字
        },
        total: 0
      }
    },
    methods: {
      uploading(type){
        this.$router.push(`/operation/addSource/${type.type}`);
      },
      //搜索查询
      searchQuery(){
        this.pageParams.pageindex = 1;
        this.pageQuery()
      },
      //删除
      del(id) {
        this.$confirm('此操作将永久删除该游戏, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
            await deleteGame({id});
            this.$message.success("删除成功");
            this.pageQuery();
        })
      },

      // 更改类型
      changeType(type) {
        this.pageParams.type = type;
        this.pageParams.pageindex = 1;
        this.$forceUpdate();
        this.pageQuery();
      },
      handleSizeChange(val) {
        this.pageParams.pagesize = val;
        this.pageQuery();
      },
      handleCurrentChange(val) {
        this.pageParams.pageindex = val;
        this.pageQuery();
      },
      // 分页查询
      async pageQuery() {
        this.loading = true;
        const result = await pageQuery(this.pageParams);
        const {total, records, size, current} = result.data;
        this.total = parseInt(total);
        this.pageParams.pageindex = parseInt(current);
        this.pageParams.pagesize = parseInt(size);
        this.gameSources = records;
        this.loading = false;
      },
      /**
       * 更改页面
       * @param id
       */
      toEdit(id) {
        this.$router.push(`/operation/addSource/${id}`);
      }
    },
    mounted() {
      this.pageQuery();
    }
  }
</script>

<style lang="scss" scoped>

  .desc {
    font-size: 14px;
    margin-left: 50px;
    font-weight: 300;
  }

  .gameNameButton {
    margin-bottom: 20px;

    .el-row {
      .el-button {
        width: 130px;
      }
    }
  }

  .operate {
    .el-button {
      i {
        font-size: 20px;
      }

      &:nth-child(2) {
        margin-left: 15px;
      }

    }

  }

  /*.avatar:hover{*/
  /*  cursor: pointer;*/
  /*  transform: scale(1.6);*/
  /*  -ms-transform:scale(1.6);     !* IE 9 *!*/
  /*  -moz-transform:scale(1.6);     !* Firefox *!*/
  /*  -webkit-transform:scale(1.6); !* Safari 和 Chrome *!*/
  /*  -o-transform:scale(1.6);*/
  /*}*/


</style>
