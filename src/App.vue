<template>
  <div id="app">
    <header :class="`app_header `" v-if="showHeader">
      <!-- <div class="app_toptab_position app_toptab_normal">
        <div class="tip">
          <p>温州设计集团勘测院</p>
          <p>{{ time }}</p>
        </div>

        <el-popover placement="bottom-end" width="70" trigger="hover">
          <ul class="user_list">
            <li>{{ au_username }}</li>
            <li>
              <a @click="updatePassport">修改密码</a>
            </li>
            <li>
              <a @click="Exit">安全退出</a>
            </li>
          </ul>
          <div class="userBtn" slot="reference">
            <el-avatar size="small" src="libs/img/userAvatar.png"></el-avatar>
          </div>
        </el-popover>
      </div>-->
    </header>
    <div class="app_container">
      <Monitor />
    </div>
    <Passport v-if="showPassport" />
  </div>
</template>

<script>
/* eslint-disable */
import { OPTION, GET_ARCGIS_TOKEN, WRT_config } from "./components/common/Tmap";
import { fixMenuList } from "./components/common/user/menuHash";
import Passport from "./components/common/user/Passport";
import Monitor from "./components/monitor/Monitor";

export default {
  name: "app",
  data() {
    return {
      time: " ",
      showHeader: true, // 显示头部
      au_username: window.user.au_username,
      showPassport: false
    };
  },
  components: { Passport, Monitor },
  mounted() {
    setInterval(() => {
      this.getTime();
    }, 1000);
  },
  methods: {
    shallLogin() {
      const that = this;
      return new Promise(async (resolve, reject) => {
        that.tabs = window.user.au_username ? fixMenuList(that.toptab) : [];
        resolve(true);
      });
    },
    //获取当前时间
    getTime() {
      var date = new Date();
      var seperator1 = "-";
      var seperator2 = ":";
      //以下代码依次是获取当前时间的年月日时分秒
      var year = date.getFullYear();
      var month = date.getMonth() + 1;
      var strDate = date.getDate();
      var minute = date.getMinutes();
      var hour = date.getHours();
      var second = date.getSeconds();
      //固定时间格式
      if (month >= 1 && month <= 9) {
        month = "0" + month;
      }
      if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
      }
      if (hour >= 0 && hour <= 9) {
        hour = "0" + hour;
      }
      if (minute >= 0 && minute <= 9) {
        minute = "0" + minute;
      }
      if (second >= 0 && second <= 9) {
        second = "0" + second;
      }
      var currentdate =
        year +
        seperator1 +
        month +
        seperator1 +
        strDate +
        " " +
        hour +
        seperator2 +
        minute +
        seperator2 +
        second;
      this.time = currentdate;
      //return currentdate;
    },
    userOpt() {
      console.log("用户操作");
    },
    updatePassport() {
      this.showPassport = true;
    },

    Exit() {
      this.$util.removeStorage("access_token");
      // window.location.href = `http://localhost:8081/index.html#/`;
      window.location.href = `http://10.36.133.182:1433/wz-zddt-login/index.html#/`;
    }
  }
};
</script>

<style lang="less">
@import url("components/common/css/common.less");
// @import url("components/common/css/style.less");
@import url("components/common/css/animate.css");
@import url("components/common/css/frame.less");
@import url("components/common/css/arcgis.css");

// .loading{
//   background-image: url("components/common/image/loading.gif");
//   background-size: 100% 100%;
//   background-repeat: no-repeat;
// }
</style>
