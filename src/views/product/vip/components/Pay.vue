<template>
  <div class="pay-container">
    <div class="qrCode" ref="qrCodeUrl"></div>
  </div>
</template>

<script>

  import QRCode from 'qrcodejs2';

  import {
    weChatQrCode,
    queryWeChatPayStatus,
    aliQrCode,
    queryAliPayStatus
  } from '../../../../api/product/pay'

  export default {
    name: "Pay",
    props: {
      pay: {
        require: true,
        type: Object
      }
    },
    data() {
      return {
        codeUrl: null,
        orderId: null,
      }
    },
    mounted() {
      this.getPayQRCode();
    },
    methods: {
      /**
       * 获取支付二维码
       */
      async getPayQRCode() {
        const response = this.pay.type === '1' ? await weChatQrCode(this.pay.productId) :
          await aliQrCode(this.pay.productId);

        const {codeUrl, orderId} = response.data;

        this.codeUrl = codeUrl;
        this.orderId = orderId;

        this.creatQrCode(codeUrl);

        // 查询订单支付状态
        this.interval = setInterval(() => {
          this.queryOrderStatus();
        }, 2000)

      },
      /**
       * 查询订单状态
       */
      async queryOrderStatus() {
        const response = this.pay.type === '1' ? await queryWeChatPayStatus(this.orderId) :
          await queryAliPayStatus(this.orderId);
        const {isPay, productId, expireTime} = response.data;
        if (isPay) {
          this.$message.success("支付成功");
          clearInterval(this.interval);
          await this.$store.dispatch('UpdateUserInfo', {productId, expireTime})
          // 更新用户数据
          this.$emit('close');
        }
      },
      /**
       * 创建二维码
       * @param text
       */
      creatQrCode(text) {
        new QRCode(this.$refs.qrCodeUrl, {
          text, // 需要转换为二维码的内容
          width: 200,
          height: 100,
          colorDark: '#000000',
          colorLight: '#ffffff',
          correctLevel: QRCode.CorrectLevel.H
        })
      },
    },
    destroyed() {
      clearInterval(this.interval);
    }
  }
</script>

<style scoped lang="scss">

  .pay-container {
    width: 100%;
    height: 200px;
    display: flex;
    justify-content: center;

    .qrCode {
      display: flex;
      justify-content: center;
  
    }
  }



</style>
