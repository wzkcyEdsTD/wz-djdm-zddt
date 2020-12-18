<template>
  <div id="reasonForm" v-if="options!=null">
    <div class="title">
      <div class="subtitle">{{ title }}</div>
      <a @click="()=>{ options=null }">×</a>
    </div>

    <div class="content">
      <table border="0" cellpadding="0" cellspacing="0">
        <tr>
          <td style="width: 30%;">责任人</td>
          <td>{{ zrr }}</td>
        </tr>
        <tr>
          <td>具体原因</td>
          <td>{{ jtyy }}</td>
        </tr>
        <tr>
          <td>时间节点</td>
          <td>{{ sjjd }}</td>
        </tr>
      </table>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
export default {
  name: "reasonForm",
  data() {
    return {
      title: null,
      options: null,
      zrr: "",
      jtyy: "",
      sjjd: ""
    };
  },
  created() {},
  methods: {
    showReason(options) {
      this.options = options;

      if (this.options != null) {
        this.title = this.options.text;

        this.zrr = this.isNotNull(this.options.zrr)
          ? this.options.zrr
          : "暂无数据";

        this.jtyy = this.isNotNull(this.options.jtyy)
          ? this.options.jtyy
          : "暂无数据";

        this.sjjd = this.isNotNull(this.options.sjjd)
          ? this.fixDate(this.options.sjjd)
          : "暂无数据";
      }
    },
    isNotNull(item) {
      return item != "/" && item != "" && item != " " && item != null;
    },
    fixDate(date) {
      const newDate = date.split(" ")[0];

      const [date_y, date_m, date_d] = newDate.split("-");

      return `${Number(date_y)}年${Number(date_m)}月${Number(date_d)}日`;
    }
  }
};
</script>

<style lang="less" scoped>
#reasonForm {
  width: 88%;
  height: 80%;
  position: absolute;
  left: 6%;
  bottom: 10%;
  z-index: 40;
  background: linear-gradient(
    180deg,
    rgba(0, 63, 189, 0.8) 0%,
    rgba(5, 53, 129, 0.8) 100%
  );

  box-shadow: 0px 4px 16px 0px rgba(0, 0, 0, 0.4),
    0px 0px 44px 0px rgba(16, 146, 236, 0.3);

  .title {
    .subtitle {
      font-size: 18px;
      font-weight: bolder;
      color: rgba(97, 235, 255, 1);
      text-align: center;
      padding: 5px 20px 0;
    }

    a {
      position: absolute;
      top: 0px;
      right: 10px;
      font-size: 30px;
      cursor: pointer;
    }
  }

  .content {
    height: 80%;
    padding: 0px 10px;
    margin: 0px 5px;
    overflow: auto;
    position: relative;
    top: 8%;

    table {
      border: 1px solid #ccc;
      width: 100%;

      td {
        border: 1px solid #ccc;
        padding: 10px 5px;
        text-align: justify;
      }
    }
  }

  .content::-webkit-scrollbar {
    display: block;
    width: 10px;
    background-color: #1a3561;
    border-radius: 10px;
  }
  .content::-webkit-scrollbar-thumb {
    width: 10px;
    background-color: #45cdff;
    border-radius: 10px;
  }
}
</style>