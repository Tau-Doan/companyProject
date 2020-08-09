<template>
  <div class="login">
    <el-form ref="loginForm" v-show="loginType === 1" :model="loginForm" :rules="loginRules" class="login-form">
      <h3 class="title">小微助手后台管理系统</h3>
      <el-form-item prop="username">
        <el-input v-model="loginForm.username" type="text" auto-complete="off" placeholder="账号">
          <svg-icon slot="prefix" icon-class="user" class="el-input__icon input-icon"/>
        </el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input
          v-model="loginForm.password"
          type="password"
          auto-complete="off"
          placeholder="密码"
          @keyup.enter.native="handleLogin">
          <svg-icon slot="prefix" icon-class="password" class="el-input__icon input-icon"/>
        </el-input>
      </el-form-item>
      <el-form-item prop="code">
        <el-input
          v-model="loginForm.code"
          auto-complete="off"
          placeholder="验证码"
          style="width: 63%"
          @keyup.enter.native="handleLogin"
        >
          <svg-icon slot="prefix" icon-class="validCode" class="el-input__icon input-icon"/>
        </el-input>
        <div class="login-code">
          <img :src="codeUrl" @click="getCode"/>
        </div>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          icon="el-icon-phone-outline"
          size="mini"
          plain
          @click="loginType = 2"
        >手机登录
        </el-button>
        <el-button
          type="primary"
          icon="el-icon-s-platform"
          size="mini"
          plain
          @click="scanCodeLogin"
        >扫码登陆
        </el-button>
        <el-checkbox style="float: right" v-model="loginForm.rememberMe">记住密码</el-checkbox>
      </el-form-item>
      <el-form-item style="width:100%;">
        <el-button
          :loading="loading"
          size="medium"
          type="primary"
          style="width:100%;"
          @click.native.prevent="handleLogin">
          <span v-if="!loading">登 录</span>
          <span v-else>登 录 中...</span>
        </el-button>
      </el-form-item>
    </el-form>

    <el-form v-show="loginType === 2" ref="phoneLoginForm" :model="phoneLoginForm" :rules="phoneLoginRules"
             class="login-form">
      <h3 class="title">
        小微助手后台管理系统</h3>
      <el-form-item prop="mobile">
        <el-input v-model="phoneLoginForm.mobile" type="text" auto-complete="off" placeholder="手机号码">
          <svg-icon slot="prefix" icon-class="user" class="el-input__icon input-icon"/>
        </el-input>
      </el-form-item>
      <el-form-item prop="phoneCode">
        <el-input
          v-model="phoneLoginForm.phoneCode"
          auto-complete="off"
          placeholder="验证码"
          style="width: 60%"
          @keyup.enter.native="handleLogin">
          <svg-icon slot="prefix" icon-class="validCode" class="el-input__icon input-icon"/>
        </el-input>
        <div class="phone-login-code">
          <el-button
            style="background:rgb(83, 168, 255);border-color:rgb(140, 197, 255)"
            size="medium"
            type="primary"
            :loading="loadingCode"
            @click="getPhoneCode">
            <span>{{loadingCode ? `已发送${computeTime}秒`:`发送验证码`}}</span>
          </el-button>
        </div>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          icon="el-icon-s-platform"
          size="mini"
          plain
          @click="loginType = 1"
        >账号密码登录
        </el-button>
        <el-button
          type="primary"
          icon="el-icon-s-platform"
          size="mini"
          plain
          @click="scanCodeLogin"
        >扫码登陆
        </el-button>
        <el-checkbox style="float: right" v-model="loginForm.rememberMe">记住手机号</el-checkbox>
      </el-form-item>
      <el-form-item style="width:100%;">
        <el-button
          :loading="loadingLogin"
          size="medium"
          type="primary"
          style="width:100%;"
          @click.native.prevent="handlePhoneLogin">
          <span v-if="!loadingLogin">登 录</span>
          <span v-else>登 录 中...</span>
        </el-button>
      </el-form-item>
    </el-form>

    <!--  底部  -->
    <div class="el-login-footer">
      <span>Copyright © 2020 道圣科技 All Rights Reserved.</span>
    </div>
  </div>
</template>

<script>
  import store from '@/store'
  import {getCodeImg, getCodePhone} from "@/api/login";
  import Cookies from "js-cookie";
  import {encrypt, decrypt} from '@/utils/jsencrypt';
  import {isPhone} from "../utils/validate";


  export default {
    name: "Login",
    data() {
      return {

        // 登陆类型 1账号密码登陆，2手机号码登陆，3，扫码登陆
        loginType: 1,
        loadingLogin: false,
        loginMethod: false,
        computeTime: 0, // 计时的时间
        loadingCode: false,
        dialogVisible: true,
        codeUrl: "",
        cookiePassword: "",
        loginForm: {
          username: "",
          password: "",
          rememberMe: false,
          code: "",
          uuid: "",
        },
        phoneLoginForm: {
          mobile: "",
          phoneCode: "",
        },
        phoneLoginRules: {
          mobile: [
            {required: true, trigger: "blur", message: "手机号码不能为空"},
            {validator: this.validatePhone, trigger: 'change'}
          ],
          phoneCode: [{required: true, trigger: "change", message: "验证码不能为空"}],
        },
        loginRules: {
          username: [
            {required: true, trigger: "blur", message: "用户名不能为空"}
          ],
          password: [
            {required: true, trigger: "blur", message: "密码不能为空"}
          ],
          code: [{required: true, trigger: "change", message: "验证码不能为空"}],
        },
        loading: false,
        redirect: undefined
      };
    },
    watch: {
      $route: {
        handler: function (route) {
          this.redirect = route.query && route.query.redirect;
        },
        immediate: true
      }
    },
    created() {
      this.handleWeChatCodeLogin();
      this.getCode();
      this.getCookie();
    },
    methods: {
      /**
       * 处理微信扫码登陆
       */
      async handleWeChatCodeLogin() {
        const code = this.getUrlParam('code');

        if(!code) {
          return false;
        }

        await this.$store.dispatch("WeChatCodeLogin", code);
        this.$router.push({path: this.redirect || "/index"});
      },
      /**
       * 扫码登陆
       */
      scanCodeLogin() {
        window.location.href = 'https://open.weixin.qq.com/connect/qrconnect?appid=wxa3a247e86999503e&redirect_uri=http://wetool.oydym.com/login&response_type=code&scope=snsapi_login&state=%s#wechat_redirect';
      },
      // 校验手机号码
      validatePhone(rule, value, callback) {
        if (!isPhone(this.phoneLoginForm.mobile)) {
          callback(new Error('请输入正确的手机号码'));
          return;
        }
        callback();
      },
      //手机验证码
      async getPhoneCode() {
        if (!this.computeTime) {
          this.loadingCode = true;
          this.computeTime = 60;
          this.intervalId = setInterval(() => {
            this.computeTime--;
            if (this.computeTime <= 0) {
              clearInterval(this.intervalId);
              this.loadingCode = false;
            }
          }, 1000);
          await getCodePhone({mobile: this.phoneLoginForm.mobile});
        }
      },
      async getCode() {
        const res = await getCodeImg();
        this.codeUrl = "data:image/gif;base64," + res.img;
        this.loginForm.uuid = res.uuid;
      },
      getCookie() {
        const username = Cookies.get("username");
        const password = Cookies.get("password");
        const rememberMe = Cookies.get('rememberMe');
        this.loginForm = {
          username: username ? username : this.loginForm.username,
          password: password ? decrypt(password) : this.loginForm.password,
          rememberMe: rememberMe ? Boolean(rememberMe) : false
        };
        const phone = Cookies.get("mobile");
        this.phoneLoginForm.mobile = phone || '';
      },
      handlePhoneLogin() {
        this.$refs.phoneLoginForm.validate(valid => {
          if (!valid) {
            return false;
          }
          if (this.loginForm.rememberMe) {
            Cookies.set("mobile", this.phoneLoginForm.mobile, {expires: 30});
          }
          this.loadingLogin = true;
          this.$store.dispatch("PhoneLogin", this.phoneLoginForm)
            .then(() => {
              this.$router.push({path: this.redirect || "/index"});
            })
            .catch(() => {
              this.loadingLogin = false;
            });

        })
      },

      handleLogin() {
        this.$refs.loginForm.validate(valid => {
          if (valid) {
            this.loading = true;
            if (this.loginForm.rememberMe) {
              Cookies.set("username", this.loginForm.username, {expires: 30});
              Cookies.set("password", encrypt(this.loginForm.password), {expires: 30});
              Cookies.set('rememberMe', this.loginForm.rememberMe, {expires: 30});
            } else {
              Cookies.remove("username");
              Cookies.remove("password");
              Cookies.remove('rememberMe');
            }
            this.$store
              .dispatch("Login", this.loginForm)
              .then(() => {
                this.$router.push({path: this.redirect || "/"});
              })
              .catch(() => {
                this.loading = false;
                this.getCode();
              });
          }
        });
      }
    }
  };
</script>
<style rel="stylesheet/scss" lang="scss">
  .login {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    background-image: url("../assets/image/login-background.jpg");
    background-size: cover;
  }

  .title {
    margin: 0px auto 30px auto;
    text-align: center;
    color: #707070;
  }

  .login-form {
    border-radius: 6px;
    background: #ffffff;
    width: 400px;
    padding: 25px 25px 5px 25px;

    .el-input {
      height: 38px;

      input {
        height: 38px;
      }
    }

    .input-icon {
      height: 39px;
      width: 14px;
      margin-left: 2px;
    }


  }

  .login-tip {
    font-size: 13px;
    text-align: center;
    color: #bfbfbf;
  }

  .phone-login-code {
    height: 38px;
    float: right;
  }

  .login-code {
    width: 33%;
    height: 38px;
    float: right;

    img {
      cursor: pointer;
      vertical-align: middle;
    }
  }

  .el-login-footer {
    height: 40px;
    line-height: 40px;
    position: fixed;
    bottom: 0;
    width: 80%;
    text-align: center;
    color: #fff;
    font-family: Arial;
    font-size: 12px;
    letter-spacing: 1px;
  }

  .qrCodeContainer {
    width: 400px;
    height: 400px;
    background-color: #fff;
  }


</style>
