<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true">
      <el-form-item label="名称" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入类型名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="单位类型" prop="type">
        <el-select v-model="queryParams.type" placeholder="请选择单位类型" clearable size="small">
          <el-option
            v-for="unit in unitOptions"
            :key="unit.dictValue"
            :label="unit.dictLabel"
            :value="unit.dictValue"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="请选择状态" clearable size="small">
          <el-option
            v-for="dict in statusOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="openEdit(null)"
          v-hasPermi="['manager:productType:add']"
        >新增
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handlerUpdate"
          v-hasPermi="['manager:productType:edit']"
        >修改
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['manager:product:remove']"
        >删除
        </el-button>
      </el-col>
    </el-row>

    <el-table v-loading="loading" :data="productList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column label="编号" align="center" prop="id"/>
      <el-table-column label="名称"  align="center" prop="name"/>
      <el-table-column label="单位类型" :formatter="unitFormat" align="center" prop="type"/>
      <el-table-column label="有效期" align="center" prop="value"/>
      <el-table-column label="状态" :formatter="statusFormat" align="center" prop="status"/>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="openEdit(scope.row.id)"
            v-hasPermi="['manager:product:edit']"
          >修改
          </el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['manager:product:remove']"
          >删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageindex"
      :limit.sync="queryParams.pagesize"
      @pagination="pageQuery"
    />

    <!-- 添加或修改产品对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="700px">
      <Edit
        v-if="open"
        :cancel="cancel"
        :unitOptions="unitOptions"
        :statusOptions="statusOptions"
        @pageQuery="pageQuery"
        :id="id"
      />
    </el-dialog>
  </div>
</template>

<script>

  import {
    dels,
    pageQuery,
  } from '../../../api/product/productType'

  import Edit from "./components/Edit";

  export default {
    name: "Product",
    components: {
      Edit
    },
    data() {
      return {
        // 产品id
        id: '',
        // 状态选项
        statusOptions: [],
        // 遮罩层
        loading: true,
        // 选中数组
        ids: [],
        // 非单个禁用
        single: true,
        // 非多个禁用
        multiple: true,
        // 总条数
        total: 0,
        // 产品表格数据
        productList: [],
        // 弹出层标题
        title: "",
        // 是否显示弹出层
        open: false,
        // 单位选项
        unitOptions: [],
        // 查询参数
        queryParams: {
          pageindex: 1,
          pagesize: 10,
          name: null,
          type: null,
          status: undefined,
        },
      };
    },
    created() {
      this.loadProductTypeUnitDict()
      this.loadStatusDict()
      this.pageQuery();
    },
    methods: {
      unitFormat(row) {
        return this.selectDictLabel(this.unitOptions, row.type);
      },
      statusFormat(row) {
        return this.selectDictLabel(this.statusOptions, row.status);
      },
      /**
       * 打开编辑页面
       */
      openEdit(id) {
        this.title = this.id ? '修改产品' : '添加产品';
        this.id = id;
        this.open = true;
      },
      /**
       * 处理修改
       */
      handlerUpdate(){
        const id = this.ids[0];
        this.openEdit(id);
      },
      /**
       * 加载产品状态字典
       */
      async loadStatusDict() {
        const response = await this.getDicts("product_type_status");
        this.statusOptions = response.data;
      },
      /**
       * 加载产品状态字典
       */
      async loadProductTypeUnitDict() {
        const response = await this.getDicts("product_type_unit");
        this.unitOptions = response.data;
      },
      /** 查询产品列表 */
      async pageQuery() {
        this.loading = true;
        const result = await pageQuery(this.queryParams)

        const {total, records, size, current} = result.data;
        this.total = total;
        this.queryParams.pageindex = current;
        this.queryParams.pagesize = size;
        this.productList = records;

        this.loading = false;
      },
      // 取消按钮
      cancel() {
        this.open = false;
      },
      /** 搜索按钮操作 */
      handleQuery() {
        this.queryParams.pageNum = 1;
        this.pageQuery();
      },
      /** 重置按钮操作 */
      resetQuery() {
        this.resetForm("queryForm");
        this.handleQuery();
      },
      // 多选框选中数据
      handleSelectionChange(selection) {
        this.ids = selection.map(item => item.id)
        this.single = selection.length !== 1
        this.multiple = !selection.length
      },
      /** 删除按钮操作 */
      async handleDelete(row) {
        try {
          const ids = row.id ? [row.id] : this.ids;

          await this.$confirm('是否确认删除产品类型编号为"' + ids + '"的数据项?', "警告", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          })
          await dels(ids);
          this.msgSuccess("删除成功");
          await this.pageQuery();
        } catch (e) {
        }
      },
    }
  };
</script>
