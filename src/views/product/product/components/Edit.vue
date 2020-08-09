<template>
  <div>
    <el-form ref="productForm" :model="product" :rules="productRules" label-width="100px">
      <el-row>
        <el-col :span="12">
          <el-form-item label="产品名称" prop="productName">
            <el-input v-model="product.productName" placeholder="请输入产品名称"/>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="群产品类型" prop="productGroupType">
            <el-select v-model="product.productGroupType" placeholder="请选择群产品类型">
              <el-option
                v-for="type in productGroupTypes"
                :key="type.id"
                :label="type.name"
                :value="type.id"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="产品类型" prop="productType">
            <el-select v-model="product.productType" placeholder="请选择产品类型">
              <el-option
                v-for="type in productTypes"
                :key="type.id"
                :label="type.name"
                :value="type.id"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="产品价格" prop="price">
            <el-input-number v-model="product.price" :min="0" label="请输入产品价格"/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="产品等级" prop="level">
            <el-select v-model="product.level" placeholder="请选择产品对应的vip等级">
              <el-option
                v-for="dict in levelOptions"
                :key="dict.dictValue"
                :label="dict.dictLabel"
                :value="dict.dictValue"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="状态" prop="status">
            <el-radio-group v-model="product.status">
              <el-radio :key="status.dictCode" v-for="status in statusOptions" :label="status.dictValue">{{status.dictLabel}}</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="备注" prop="remark">
            <el-input
              type="textarea"
              maxlength="30"
              show-word-limit
              v-model="product.remark"
              placeholder="请输入备注"
            />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <div class="right">
            <el-button type="primary" @click="save">确 定</el-button>
            <el-button @click="cancel">取 消</el-button>
          </div>
        </el-col>
      </el-row>
    </el-form>

  </div>
</template>

<script lang="ts">
  import {
    save,
    findOne
  } from '../../../../api/product/product'

  export default {
    name: "productEdit",
    props: {
      cancel: Function,
      productGroupTypes: Array,
      productTypes: Array,
      levelOptions: Array,
      statusOptions: Array,
      id: Number
    },
    data(){
      return {
        product: {
          id: null,
          productName: null,
          productGroupType: null,
          productType: null,
          price: null,
          level: null,
          status: "0",
          remark: null,
        },
        productRules: {
          productName: [{ required: true, message: '请输入产品名称', trigger: 'blur' }],
          productGroupType: [{ required: true, message: '请选择群产品类型', trigger: 'blur' }],
          productType: [{ required: true, message: '请选择产品类型', trigger: 'blur' }],
          price: [{ required: true, message: '请输入价格', trigger: 'blur' }],
          level: [{ required: true, message: '请选择会员等级', trigger: 'blur' }],
          status: [{ required: true, message: '请选择产品状态', trigger: 'blur' }],
        }
      }
    },
    methods: {
      /**
       * 保存数据
       */
      save() {
        this.$refs["productForm"].validate( async valid => {
          if(!valid){
            return false;
          }

          await save(this.product);
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
        this.product = response.data;
        this.product.status = this.product.status + '';
        this.product.level = this.product.level + '';
      }
    },
    mounted() {
      this.id && this.findOne();
    }
  }
</script>

<style scoped lang="scss">

</style>
