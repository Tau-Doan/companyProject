<template>
  <div class="app-container">
    <!--    <el-form label-width="100px" ref="payForm" :model="pay" :rules="payParamsRules">-->
    <!--      <el-form-item label="产品名称:" prop="productId">-->
    <!--        <el-select @change="handleProduct" v-model="pay.productId" clearable placeholder="请选择产品">-->
    <!--          <el-option-->
    <!--            v-for="product in products"-->
    <!--            :key="product.id"-->
    <!--            :label="product.productName"-->
    <!--            :value="product.id"-->
    <!--          />-->
    <!--        </el-select>-->
    <!--      </el-form-item>-->
    <!--      <el-form-item label="管理群数量:">-->
    <!--        <el-input v-model="product.groupNumber" readonly placeholder="请选择产品"/>-->
    <!--      </el-form-item>-->
    <!--      <el-form-item label="产品价格:">-->
    <!--        <el-input v-model="product.price" readonly placeholder="请选择产品"/>-->
    <!--      </el-form-item>-->
    <!--      <el-form-item label="有效期单位:">-->
    <!--        <el-input v-model="product.timeTypeAlias" readonly placeholder="请选择产品"/>-->
    <!--      </el-form-item>-->
    <!--      <el-form-item label="有效期:">-->
    <!--        <el-input v-model="product.timeType" readonly placeholder="请选择产品"/>-->
    <!--      </el-form-item>-->
    <!--      <el-form-item label="支付方式:" prop="type">-->
    <!--        <el-radio-group v-model="pay.type">-->
    <!--          <el-radio :key="pay.dictCode" v-for="pay in payOptions" :label="pay.dictValue">{{pay.dictLabel}}</el-radio>-->
    <!--        </el-radio-group>-->
    <!--      </el-form-item>-->
    <!--      <el-form-item>-->
    <!--        <el-button type="primary" @click="toPay">购买</el-button>-->
    <!--      </el-form-item>-->
    <!--    </el-form>-->


    <el-dialog
      title="请扫码支付"
      :visible.sync="showPay"
      width="30%"
      height="50%"
    >
      <!--支付组件-->
      <pay @close="close" v-if="showPay" :pay="pay"/>
    </el-dialog>
    <!--    更改界面-->

    <div class="card-wrap">
      <el-card class="box-card" v-for="product in products" :key="product.id">
        <div slot="header" class="clearfix">
          <span>{{product.productName}}</span>
          <!-- <el-button style="float: right; padding: 3px 0" type="text">会员详情</el-button> -->
        </div>
        <div class="text item">
          <el-form label-width="100px" :ref='`payForm${product.id}`' :model="pay" :rules="payParamsRules">
            <el-form-item label="管理群数量:">
              <el-input v-model="product.groupNumber" readonly placeholder="请选择产品" border="false" style="border: 0px"/>
            </el-form-item>
            <el-form-item label="产品价格:">
              <el-input v-model="product.price" readonly placeholder="请选择产品"/>
            </el-form-item>
            <el-form-item label="有效期:">
              <el-input :value="timeTypeFormat(product.timeType, product.activeTime)" readonly placeholder="请选择产品"/>
            </el-form-item>
            <!-- <el-form-item label="有效期:">
              <el-input v-model="product.activeTime" readonly placeholder="请选择产品" style="border:none "/>
            </el-form-item> -->
            <el-form-item label="支付方式:" prop="type">
              <el-radio-group v-model="product.type">-->
                <el-radio :key="pay.dictCode" v-for="pay in payOptions" :label="pay.dictValue">{{pay.dictLabel}}
                </el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="toPay(product.id)">立即开通</el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-card>
    </div>

  </div>
</template>

<script>

  import {
    findProducts
  } from '../../../api/product/product'
  import Pay from "./components/Pay";
  import Item from "../../../layout/components/Sidebar/Item";

  export default {
    name: "Vip",
    components: {Pay},
    data() {
      return {
        // 显示支付二维码页面
        showPay: false,
        // 单位选项
        unitOptions: [],
        // 支付选项
        payOptions: [],
        products: [],
        productId: null,
        product: {
          price: null,
          timeType: null,
          activeTime: null,
        },
        pay: {
          // 产品id
          productId: null,
          // 支付方式
          type: '1'
        },
        payParamsRules: {
          productId: [{required: true, message: '请选择支付方式', trigger: 'blur'}],
        },
        //显示隐藏卡
      }
    },
    methods: {
      close() {
        this.showPay = false;
      },
      /**
       * 去支付
       */
      toPay(productId) {
        this.$refs[`payForm${productId}`][0].validate((valid) => {
          if (!valid) {
            return false;
          }

          // 根据产品
          let index = this.products.findIndex(item => item.id === productId
          );
          const product = this.products[index];
          this.pay.productId = productId;
          this.pay.type = product.type;

          this.showPay = true;
        });
      },
      /**
       * 时间类型转换
       */
      timeTypeFormat(timeType, activeTime) {
        var unit = this.selectDictLabel(this.unitOptions, timeType);
        if("天" === unit) {
          return activeTime + "" + unit;
        } else {
          return activeTime + "个" + unit;
        }
      },
      async findProducts() {
        const response = await findProducts();
        response.data.forEach(item => item.type = '1');
        this.products = response.data;
      },
      /**
       * 加载产品状态字典
       */
      async loadProductTypeUnitDict() {
        const response = await this.getDicts("product_type_unit");
        this.unitOptions = response.data;
      },
      /**
       * 加载支付选项
       * @returns {Promise<void>}
       */
      async loadTypeDict() {
        const response = await this.getDicts("pay_type");
        this.payOptions = response.data;
      }

    },
    mounted() {
      this.findProducts();
      this.loadProductTypeUnitDict();
      this.loadTypeDict();
    }
  }
</script>

<style lang='scss' scoped>
  .card-wrap {
    display: flex;
    flex-wrap: wrap;
  }

  .box-card {
    margin-right: 30px;
    width: 30%;
    min-width: 500px;
    margin-bottom: 20px;

    .el-form {
      width: 80%;

      .el-form-item {
        margin-bottom: 5px;

        /deep/ .el-input {
          width: 90px;
        }
      }

    }
  }

  .el-input {
    outline: medium !important;
    border: 0px !important;
    outline: none;
  }

  /deep/ .el-input__inner {
    border: 0px none !important;
  }
</style>
