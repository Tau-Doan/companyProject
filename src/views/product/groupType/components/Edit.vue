<template>
  <div>
    <el-form ref="productGroupTypeForm" :model="productGroupType" :rules="productGroupTypeRules" label-width="120px">
      <el-form-item label="产品等级名称" prop="name">
        <el-input v-model="productGroupType.name" placeholder="请输入产品名称"/>
      </el-form-item>
      <el-form-item label="VIP等级类型" prop="level">
        <el-select v-model="productGroupType.level" placeholder="请选择VIP等级">
          <el-option
            v-for="dict in levelOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-radio-group v-model="productGroupType.status">
          <el-radio :key="status.dictCode" v-for="status in statusOptions" :label="status.dictValue">{{status.dictLabel}}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="群数量" prop="value">
        <el-input-number v-model="productGroupType.value" :min="1" :max="10" label="请输入群数量"/>
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
  } from '../../../../api/product/productGroupType'

  export default {
    name: "productGroupTypeEdit",
    props: {
      cancel: Function,
      statusOptions: Array,
      levelOptions: Array,
      id: Number
    },
    data(){
      return {
        productGroupType: {
          id: null,
          name: null,
          type: null,
          value: null,
          status: '0',
        },
        productGroupTypeRules: {
          name: [{ required: true, message: '请输入产品类型名称', trigger: 'blur' }],
          level: [{ required: true, message: '请选择VIP等级', trigger: 'blur' }],
          value: [{ required: true, message: '请输入群数量', trigger: 'blur' }],
          status: [{ required: true, message: '请选择群产品类型状态', trigger: 'blur' }],
        }
      }
    },
    methods: {
      /**
       * 保存数据
       */
      save() {
        this.$refs["productGroupTypeForm"].validate( async valid => {
          if(!valid){
            return false;
          }

          await save(this.productGroupType);
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
        this.productGroupType = response.data;
        this.productGroupType.status = this.productGroupType.status + '';
        this.productGroupType.level = this.productGroupType.level + '';
      }
    },
    mounted() {
      this.id && this.findOne();
    }
  }
</script>

<style scoped lang="scss">

</style>
