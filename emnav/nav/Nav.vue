<template>
  <div class="w-nav">
    <div class="w-nav-box">
      <div class="w-nav-box-eye">
        <img :src="imgLogo || logo" class="w-nav-box-eye-img">
      </div>
      <div class="w-nav-box-main">
        <a
          href="javascript:;"
          @mouseover="mouseover(true)"
          @mouseout="mouseout(true)"
          class="w-nav-box-main-new"
          :class="{
            ['w-nav-box-main-new-english']: !isChina
          }"
          @click="myOrder"
        >{{order}}
          <div v-show="isChina && orderFlag" class="w-nav-box-main-new-erweima">
            <img class="w-nav-box-main-new-erweima-img" src="https://static2.evente.cn/static/img/nav-icon-order1.jpg" alt="">
          </div>
        </a>
        <a
          v-if="isChina"
          @mouseover="mouseover(false)"
          @mouseout="mouseout(false)"
          href="javascript:;"
          class="w-nav-box-main-new"
          :class="{
            ['w-nav-box-main-new-english']: !isChina
          }"
          @click="organizer"
        >主办方管理
          <div v-show="erweimaFlag" class="w-nav-box-main-new-erweima" style="left:-20px;">
            <img class="w-nav-box-main-new-erweima-img" src="https://static2.evente.cn/static/img/nav-icon-qr2.png" alt="">
          </div>
        </a>
        <a
          v-if="loginFlg"
          href="javascript:;"
          class="w-nav-box-main-new"
          :class="{
            ['w-nav-box-main-new-english']: !isChina
          }"
          @click="logoutFun"
        >{{logout}}</a>
        <a
          v-if="!loginFlg"
          href="javascript:;"
          class="w-nav-box-main-new"
          :class="{
            ['w-nav-box-main-new-english']: !isChina
          }"
          @click="loginFun"
        >{{login}}</a>
        <a
          href="javascript:;"
          class="w-nav-box-main-new"
          :class="{
              ['w-nav-box-main-new-english']: !isChina
          }"
          v-if="englishEnter"
          @click="languageFun"
        >{{language}}</a>
        <div v-if="isChina" class="w-nav-box-main-btn" >
          <img @click="release" class="w-nav-box-main-btn-icon" src="https://static2.evente.cn/static/img/nav-icon-release1.png"/>
        </div>
      </div>
    </div>
    <div v-if="showMask" class="w-nav-mask"></div>
    <div v-if="showMask" class="w-nav-modal">
      <p class="w-nav-modal-close">
        <img @click="close" src="https://static2.evente.cn/static/img/login-icon-close2.png">
      </p>
      <p class="w-nav-modal-title">Ticket Buyer</p>
      <div class="w-nav-modal-box">
        <input
          v-model="email"
          class="w-nav-modal-box-input"
          type="text"
          placeholder="Email Address"
        >
      </div>
      <div
        @click="submit"
        class="w-nav-modal-btn"
        :class="email?'w-nav-modal-btn-active':'w-nav-modal-btn-disabled'"
      >Submit</div>
      <div v-if="error" class="w-nav-modal-tip">
        <img src="https://static2.evente.cn/static/img/login-icon-error1.png">
        Check your email
      </div>
    </div>
    <w-login
      :show="loginStatus"
      :close="closeLogin"
      :success="loginSucFn"
      :orgid="orgid"
      :countrycodeAction="countrycodeAction"
      :sendAction="sendAction"
      :loginAction="loginAction"
      :sendEnglishAction="sendEnglishAction"
      :loginEnglishAction="loginEnglishAction"
      :lang="lang"
      :domain="domain"
    ></w-login>
  </div>
</template>

<script>
import emCookie from 'em-cookie';
import login from 'emlogin';
import logoutpc from './logoutpc';
import ajax from './ajax';

export default {
  name: 'w-nav',
  data() {
    return {
      lang: 'zh_CN',
      language: '中文',
      isChina: false,
      orderFlag: false,
      erweimaFlag: false,
      email: '', // 邮箱
      error: false, // 错误提示
      showMask: false, // 弹窗展示
      logo: 'https://static2.evente.cn/static/img/logo_nav_201804081.png',
      // 登录相关 start
      loginStatus: false,
      loginFlg: false,
      // 登录相关 end
    };
  },
  props: {
    englishEnter: Boolean,
    login: { // 登录文案
      type: String,
      default: '登录',
    },
    logout: { // 退出文案
      type: String,
      default: '退出',
    },
    order: { // 我的订单文案
      type: String,
      default: '我的订单',
    },
    imgLogo: String, // 主板图案
    // 登录相关 start
    // 登录弹框 关闭
    loginClose: {
      type: Function,
      default: () => {},
    },
    // 登录成功
    loginSuccess: {
      type: Function,
      default: () => {},
    },
    domain: { // 是否cookie存储加 domain
      type: String,
      default: 'evente.cn',
    },
    orgid: [String, Number],
    countrycodeAction: String,
    sendAction: String,
    loginAction: String,
    sendEnglishAction: String,
    loginEnglishAction: String,
    // 登录相关 end
    logoutAction: String,
    langHandle: Function,
    sendEmailEnglishAction: String,
  },
  created() {
    this.lang = window.$cookie.get('locale') || 'zh_CN';
    this.isChina = this.lang === 'zh_CN';
    this.language = this.isChina ? 'English' : '中文';
    this.getLoginStatus(this.orgid);
  },
  methods: {
    getLoginStatus(orgId) {
      this.loginFlg = !!window.$cookie.get(`Authorization?org_id=${orgId}`);
    },
    // 语言
    languageFun() {
      const locale = this.isChina ? 'en_US' : 'zh_CN';
      this.setLocale(locale);
      setTimeout(() => {
        if (this.langHandle) {
          this.langHandle();
        } else {
          window.location.reload();
        }
      }, 100);
    },
    setLocale(locale) {
      window.$cookie.set('locale', locale, '1m', '/', this.domain || '');
    },
    // 我的订单
    myOrder() {
      if (!this.isChina) {
        this.showMask = true;
      }
      this.$emit('myOrder');
    },
    // 发布
    release() {
      this.$emit('release');
    },
    // 主办方
    organizer() {
      this.$emit('organizer');
    },
    mouseover(data) {
      if (data) {
        this.orderFlag = true;
      } else {
        this.erweimaFlag = true;
      }
    },
    mouseout(data) {
      if (data) {
        this.orderFlag = false;
      } else {
        this.erweimaFlag = false;
      }
    },
    // 登录相关 start
    loginFun() {
      this.$emit('login');
      this.loginStatus = true;
    },
    closeLogin() {
      this.loginStatus = false;
      this.loginClose();
    },
    loginSucFn() {
      this.getLoginStatus(this.orgid);
      this.loginSuccess();
    },
    // 登录相关 end
    // 退出
    logoutFun() {
      ajax({
        type: 'GET',
        action: `${this.logoutAction}?org_id=${this.orgid}`,
        onSuccess: (res) => {
          if (res.code === 10000) {
            logoutpc(res, this.orgid, this, () => {
              this.getLoginStatus(this.orgid);
              this.$emit('logout');
            });
          } else {
            this.handleAjaxError(res.message);
          }
        },
        onError: this.handleAjaxError,
      });
    },
    // 关闭弹窗
    close() {
      this.showMask = false;
    },
    // 提交
    submit() {
      if (!this.emailTest(this.email)) {
        this.error = true;
      } else {
        this.error = false;
        ajax({
          type: 'POST',
          action: `${this.sendEmailEnglishAction}?mail=${this.email}&org_id=${this.orgid}`,
          onSuccess: (res) => {
            if (res.code === 10000) {
              this.close();
              this.$emit('sendEmail');
            } else {
              this.handleAjaxError(res.message);
            }
          },
          onError: (res, message) => {
            this.handleAjaxError(message);
          },
        });
      }
    },
    handleAjaxError: (message) => {
      if (this && Object.prototype.hasOwnProperty.call(this, '$EmfeMessage')) {
        this.$EmfeMessage.error({
          content: message,
        });
      } else {
        /* eslint-disable no-alert */
        alert(message);
      }
    },
    emailTest(val) {
      /* eslint-disable */
      //Email
      const emailPattern = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
      /* eslint-disable */
      return emailPattern.test(val);
    },
  },
  watch: {
    orgid(val) {
      this.getLoginStatus(val);
    },
  },
  components: {
    WLogin: login.PcTem,
    emCookie,
  },
};
</script>
