<template>
  <div id="crfaForm">
    <div class="head">
      <span>[ {{ title }} ] 做地方案</span>
      <a @click="()=>{ this.$parent.crfaShow = false }">×</a>
    </div>

    <div class="content">
      <div class="wrapper">
        <div id="fish-bone" class="fish-bone"></div>
      </div>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
import { fishBone } from "../external/fishbone/fishBone2";
import { mapState } from "vuex";
export default {
  name: "crfaForm",
  data() {
    return {
      title: null
    };
  },
  created() {},
  mounted() {
    fishBone(window, jQuery);
  },
  computed: {
    ...mapState({
      zdfaList: state => state.zdfaList
    })
  },
  methods: {
    getItem(match_glzd, name) {
      const that = this;
      this.title = name;

      const list = this.zdfaList.filter(({ glzd }) => glzd == match_glzd);

      if (list.length) {
        const option = {
          data: [
            {
              label: `<span class="ks_label">责任科室：${list[0].zrks1}</span>
              <br />
              <span class="nr_label">工作内容：${list[0].gznr1}</span>`,
              date: `<div class='${
                list[0].wczt1 != "是"
                  ? this.fixDate(list[0].date1) == 0
                    ? "cs_label"
                    : this.fixDate(list[0].date1) == 1
                    ? "yj_label"
                    : null
                  : null
              }'>${
                list[0].wczt1 == "是"
                  ? "已完成"
                  : this.convertDate(list[0].date1)
              }</div>`
            },
            {
              label: `<span class="ks_label">责任科室：${list[0].zrks2}</span>
              <br />
              <span class="nr_label">工作内容：${list[0].gznr2}</span>`,
              date: `<div class='${
                list[0].wczt2 != "是"
                  ? this.fixDate(list[0].date2) == 0
                    ? "cs_label"
                    : this.fixDate(list[0].date2) == 1
                    ? "yj_label"
                    : null
                  : null
              }'>${
                list[0].wczt2 == "是"
                  ? "已完成"
                  : this.convertDate(list[0].date2)
              }</div>`
            },
            {
              label: `<span class="ks_label">责任科室：${list[0].zrks3}</span>
              <br />
              <span class="nr_label">工作内容：${list[0].gznr3}</span>`,
              date: `<div class='${
                list[0].wczt3 != "是"
                  ? this.fixDate(list[0].date3) == 0
                    ? "cs_label"
                    : this.fixDate(list[0].date3) == 1
                    ? "yj_label"
                    : null
                  : null
              }'>${
                list[0].wczt3 == "是"
                  ? "已完成"
                  : this.convertDate(list[0].date3)
              }</div>`
            },
            {
              label: `<span class="ks_label">责任科室：${list[0].zrks4}</span>
              <br />
              <span class="nr_label">工作内容：${list[0].gznr4}</span>`,
              date: `<div class='${
                list[0].wczt4 != "是"
                  ? this.fixDate(list[0].date4) == 0
                    ? "cs_label"
                    : this.fixDate(list[0].date4) == 1
                    ? "yj_label"
                    : null
                  : null
              }'>${
                list[0].wczt4 == "是"
                  ? "已完成"
                  : this.convertDate(list[0].date4)
              }</div>`
            },
            {
              label: `<span class="ks_label">责任科室：${list[0].zrks5}</span>
              <br />
              <span class="nr_label">工作内容：${list[0].gznr5}</span>`,
              date: `<div class='${
                list[0].wczt5 != "是"
                  ? this.fixDate(list[0].date5) == 0
                    ? "cs_label"
                    : this.fixDate(list[0].date5) == 1
                    ? "yj_label"
                    : null
                  : null
              }'>${
                list[0].wczt5 == "是"
                  ? "已完成"
                  : this.convertDate(list[0].date5)
              }</div>`
            }
          ]
        };

        window.fishBone.init(".fish-bone", option);
      } else {
        document.getElementById("fish-bone").innerHTML = "";
      }
    },

    // 时间状态
    fixDate(date) {
      // 30天时间戳
      const deadlineStamp = new Date(
        new Date().getTime() + 30 * 24 * 60 * 60 * 1000
      ).valueOf();

      // 当前时间戳
      const nowStamp = new Date().valueOf();

      let newDate;

      let newDateStamp;

      if (~date.indexOf("年") && ~date.indexOf("月") && ~date.indexOf("日")) {
        newDate = date
          .replace("年", "-")
          .replace("月", "-")
          .replace("日", "");

        newDateStamp = new Date(newDate).valueOf();

        if (newDateStamp < deadlineStamp) {
          return newDateStamp <= nowStamp ? 0 : 1;
        } else return 2;
      } else if (this.catStr(date) == 2) {
        newDate = date
          .split(" ")[0]
          .replace("/", "-")
          .replace("/", "-");

        newDateStamp = new Date(newDate).valueOf();

        if (newDateStamp < deadlineStamp) {
          return newDateStamp <= nowStamp ? 0 : 1;
        } else return 2;
      } else {
        return 2;
      }
    },

    // 转换时间
    convertDate(date) {
      if (~date.indexOf("年")) {
        return date.replace("年", "年<br />");
      } else if (this.catStr(date) == 2) {
        const [date_y, date_m, date_d] = date.split("/");
        return `${Number(date_y)}年<br />${Number(date_m)}月${Number(
          date_d
        )}日`;
      } else return date;
    },

    // 字符出现次数
    catStr(str) {
      let num = 0;
      for (var i = 0, len = str.length; i < len; i++) {
        if (str[i] == "/") {
          num++;
        }
      }
      return num;
    }
  }
};
</script>

<style lang="less" scoped>
@import url("../external/fishbone/fishBone2.css");
#crfaForm {
  position: absolute;
  top: 21%;
  left: 11%;
  width: 74%;
  height: 58%;
  padding: 1% 2%;
  z-index: 31;
  background: #24386a;
  border: 1px solid #04ecff;
  box-shadow: 0px 4px 16px 0px rgba(0, 0, 0, 0.4),
    0px 0px 44px 0px rgba(16, 146, 236, 0.3);

  .head {
    height: 10%;

    span {
      font-size: 30px;
    }

    a {
      position: absolute;
      top: 5px;
      right: 10px;
      font-size: 40px;
      cursor: pointer;
    }
  }

  .content {
    height: 88%;
    display: flex;
    justify-content: space-between;

    .wrapper {
      width: 100%;
      border: 1px solid #eee;
      position: relative;
      margin: 0 auto;
      overflow: auto;
      display: flex;
      align-items: center;
    }
  }
}
</style>