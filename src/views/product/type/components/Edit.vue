<template>
  <div>
    <el-form ref="productTypeForm" :model="productType" :rules="productTypeRules" label-width="100px">
      <el-form-item label="产品名称" prop="name">
        <el-input v-model="productType.name" placeholder="请输入产品名称"/>
      </el-form-item>
      <el-form-item label="单位类型" prop="type">
        <el-select v-model="productType.type" placeholder="请选择单位类型">
          <el-option
            v-for="dict in unitOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-radio-group v-model="productType.status">
          <el-radio
            v-for="status in statusOptions"
            :key="status.dictValue"
            :label="status.dictValue">
            {{status.dictLabel}}
          </el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="有效期" prop="value">
        <el-input-number v-model="productType.value" :min="1" label="请输入产品有效期"/>
      </el-form-item>
      <el-form-item class="right">
        <el-button type="primary" @click="save">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </el-form-item>
    </el-form>

  </div>
</template>

<script>
  import {
    findOne,
    save
  } from '../../../../api/product/productType'

  export default {
    name: "productTypeEdit",
    props: {
      cancel: Function,
      statusOptions: Array,
      unitOptions: Array,
      id: Number
    },
    data(){
      return {
        productType: {
          id: null,
          name: null,
          type: null,
          value: null,
          status: '0',
        },
        productTypeRules: {
          name: [{ required: true, message: '请输入产品类型名称', trigger: 'blur' }],
          type: [{ required: true, message: '请选择单位类型', trigger: 'blur' }],
          value: [{ required: true, message: '请输入开通有效期', trigger: 'blur' }],
          status: [{ required: true, message: '请选择产品类型状态', trigger: 'blur' }],
        }
      }
    },
    methods: {
      /**
       * 保存数据
       */
      save() {
        this.$refs["productTypeForm"].validate( async valid => {
          if(!valid){
            return false;
          }

          await save(this.productType);
          this.msgSuccess("保存成功");
          this.$emit('pageQuery');
          this.cancel();
        });
      },
      /**
       * 根据id查询
       * @returns {Promise<void>}
       */
      async findOne(){
        const response = await findOne(this.id);
        this.productType = response.data;
        this.productType.type = this.productType.type + '';
        this.productType.status = this.productType.status + '';
      }
    },
    mounted() {
      this.id && this.findOne();
    }
  }
</script>

<style scoped lang="scss">

</style>
