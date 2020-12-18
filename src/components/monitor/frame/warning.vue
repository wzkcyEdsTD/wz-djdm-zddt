<template>
  <transition name="fade">
    <div id="warning" @click="close">
      <span class="title">项目预警</span>
      <span class="time">{{ time }}</span>
      <div id="table" @click="stop">
        <el-table
          :data="tableData"
          height="100%"
          @row-click="clickTr"
          :cell-class-name="tableRowClassName"
        >
          <el-table-column prop="index" label="序号" sortable width="120" align="center"></el-table-column>
          <el-table-column prop="DKMC" label="地块名称" sortable></el-table-column>
          <el-table-column prop="SSJD" label="所属街道" sortable></el-table-column>
          <el-table-column prop="GZNR" label="工作内容" sortable></el-table-column>
          <el-table-column prop="SJJD" label="时间节点" sortable></el-table-column>
          <el-table-column prop="ZRKS" label="责任科室" sortable></el-table-column>
          <el-table-column prop="ZT" label="状态" sortable width="230"></el-table-column>
        </el-table>
      </div>
      <span id="tip">点击空白处关闭</span>
    </div>
  </transition>
</template>

<script>
/* eslint-disable */
import { loadModules } from "esri-loader";
import { WRT_config, OPTION } from "@/components/common/Tmap";
import { mapState } from "vuex";
export default {
  name: "warning",
  data() {
    return {
      time: "",
      tableData: []
    };
  },
  computed: {
    ...mapState({
      zdfaList: state => state.zdfaList
    })
  },
  watch: {
    zdfaList(n) {
      this.fixPlanData();
    }
  },
  mounted() {
    const that = this;
    this.fixPlanData();

    setInterval(() => {
      that.getTime();
    }, 1000);
  },
  methods: {
    // 做地方案数据
    fixPlanData() {
      const that = this;

      if (this.zdfaList.length) {
        this.plan_Data = {};

        this.zdfaList.map(item => {
          that.plan_Data[item.dkmc] = [
            {
              zrks: item.zrks1,
              gznr: item.gznr1,
              date: item.date1,
              wczt: item.wczt1,
              sjwcsj: item.sjwcsj1,
              glzd: item.glzd
            },
            {
              zrks: item.zrks2,
              gznr: item.gznr2,
              date: item.date2,
              wczt: item.wczt2,
              sjwcsj: item.sjwcsj2,
              glzd: item.glzd
            },
            {
              zrks: item.zrks3,
              gznr: item.gznr3,
              date: item.date3,
              wczt: item.wczt3,
              sjwcsj: item.sjwcsj3,
              glzd: item.glzd
            },
            {
              zrks: item.zrks4,
              gznr: item.gznr4,
              date: item.date4,
              wczt: item.wczt4,
              sjwcsj: item.sjwcsj4,
              glzd: item.glzd
            },
            {
              zrks: item.zrks5,
              gznr: item.gznr5,
              date: item.date5,
              wczt: item.wczt5,
              sjwcsj: item.sjwcsj5,
              glzd: item.glzd
            }
          ];
        });

        // 30天时间戳
        const deadlineStamp = new Date(
          new Date().getTime() + 30 * 24 * 60 * 60 * 1000
        ).valueOf();

        // 当前时间戳
        const nowStamp = new Date().valueOf();

        // 正则匹配
        const reg = new RegExp("[年]{1}.*[月]{1}.*[日]{1}");

        const list = Object.keys(that.plan_Data).map(k => {
          that.plan_Data[k].map(v => {
            if (
              v.wczt != "是" &&
              ~v.date.indexOf("年") &&
              ~v.date.indexOf("月") &&
              ~v.date.indexOf("日")
            ) {
              const newDate = v.date
                .replace("年", "-")
                .replace("月", "-")
                .replace("日", "");

              const newDateStamp = new Date(newDate).valueOf();

              if (newDateStamp < deadlineStamp) {
                that.tableData.push({
                  DKMC: k,
                  SSJD: v.glzd.slice(
                    0,
                    v.glzd.indexOf("街道")
                      ? v.glzd.indexOf("街道") + 2
                      : v.glzd.indexOf("镇") + 2
                  ),
                  GZNR: v.gznr,
                  SJJD: this.fixDate(v.date),
                  ZRKS: v.zrks,
                  ZT:
                    newDateStamp <= nowStamp
                      ? "已过时间节点"
                      : "即将到达时间节点",
                  GLZD: v.glzd
                });
              }
            } else if (v.wczt != "是" && this.catStr(v.date) == 2) {
              const newDate = v.date
                .split(" ")[0]
                .replace("/", "-")
                .replace("/", "-");

              const newDateStamp = new Date(newDate).valueOf();

              if (newDateStamp < deadlineStamp) {
                that.tableData.push({
                  DKMC: k,
                  SSJD: v.glzd.slice(
                    0,
                    v.glzd.indexOf("街道")
                      ? v.glzd.indexOf("街道") + 2
                      : v.glzd.indexOf("镇") + 2
                  ),
                  GZNR: v.gznr,
                  SJJD: this.fixDate(v.date),
                  ZRKS: v.zrks,
                  ZT:
                    newDateStamp <= nowStamp
                      ? "已过时间节点"
                      : "即将到达时间节点",
                  GLZD: v.glzd
                });
              }
            }
          });
        });

        this.tableData
          .sort((a, b) => {
            const tmp_a = this.convertDate(a.SJJD);
            const tmp_b = this.convertDate(b.SJJD);

            const date_a = new Date(tmp_a).valueOf();

            const date_b = new Date(tmp_b).valueOf();

            return date_a - date_b;
          })
          .map((item, index) => {
            item.index = index + 1;
          });

        this.queryList();
      }
    },
    close() {
      this.$parent.warnShow = false;
    },
    stop(e) {
      e.stopPropagation();
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
    },

    fixDate(date) {
      if (this.catStr(date) == 2) {
        const [date_y, date_m, date_d] = date.split("/");
        return `${Number(date_y)}年${Number(date_m)}月${Number(date_d)}日`;
      } else return date;
    },

    convertDate(date) {
      if (~date.indexOf("年")) {
        return date
          .replace("年", "-")
          .replace("月", "-")
          .replace("日", "");
      } else if (this.catStr(date) == 2) {
        const [date_y, date_m, date_d] = date.split("/");
        return `${Number(date_y)}-${Number(date_m)}-${Number(date_d)}`;
      }
    },

    // 预警地块
    queryList() {
      const that = this;
      const csdkSet = [
        ...new Set(
          that.tableData
            .map(({ DKMC, ZT }) => {
              if (ZT == "已过时间节点") return DKMC;
            })
            .filter(item => item != undefined)
        )
      ];

      const yjdkSet = [
        ...new Set(
          that.tableData
            .map(({ DKMC, ZT }) => {
              if (ZT == "即将到达时间节点") return DKMC;
            })
            .filter(item => item != undefined)
        )
      ];

      this.yjdkList = yjdkSet.map(item => `'${item}'`);
      this.csdkList = csdkSet.map(item => `'${item}'`);
    },

    // 表格行点击事件
    clickTr(row, column, event) {
      const that = this;

      loadModules(
        [
          "esri/tasks/QueryTask",
          "esri/tasks/support/Query",
          "esri/layers/FeatureLayer",
          "esri/layers/MapImageLayer"
        ],
        OPTION
      ).then(async ([QueryTask, Query, FeatureLayer, MapImageLayer]) => {
        const queryTask = new QueryTask({
          url: `https://wzdjdm.wzcitybrain.com:8888/erwei/arcgis/rest/services/WZZD/WZZDDK/MapServer/0`
        });
        const query = new Query();
        query.outFields = ["*"];
        query.returnGeometry = true;
        query.where = `glzd = '${row.GLZD}'`;

        const { fields, features } = await queryTask.execute(query);

        const fieldAliases = {};
        fields.map(item => {
          fieldAliases[item.name] = item.alias;
        });
        const list = features.map(item => {
          item.id = "zddk";
          item.fieldAliases = fieldAliases;
          return item;
        });

        if (list[0]) {
          that.$parent.$refs.monitorArcgis.goloaction(list[0]);

          const glzd = list[0].attributes.glzd;
          const imgName = list[0].attributes.zdxq;
          const name = list[0].attributes.dkmc;

          that.$parent.rightHidden();
          that.$parent.$refs.dkxqForm.getItem(glzd, imgName, name);
          that.$parent.dkxqShow = true;
          that.$parent.warnShow = false;
        }
      });
    },
    tableRowClassName({ row, column, rowIndex, columnIndex }) {
      if (columnIndex == 6) {
        if (row.ZT === "即将到达时间节点") {
          return "warning-row";
        } else if (row.ZT === "已过时间节点") {
          return "timeout-row";
        }
        return "";
      }
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
    }
  }
};
</script>

<style lang="less" scoped>
#warning {
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.6);
  margin: auto;
  z-index: 50;

  .title {
    position: absolute;
    width: 160px;
    height: 50px;
    line-height: 50px;
    left: 10%;
    bottom: 85%;
    font-size: 20px;
    font-weight: bolder;
    color: #0bfcfe;
    background-image: url("../../common/image/title_bg.png");
    background-repeat: no-repeat;
    background-size: 100% 100%;
  }

  .time {
    position: absolute;
    text-align: left;
    width: calc(80% - 202px);
    height: 50px;
    line-height: 50px;
    right: 10%;
    bottom: 85%;
    padding: 0px 22px;
    font-size: 20px;
    font-weight: bolder;
    background-image: url("../../common/image/time_bg.png");
    background-repeat: no-repeat;
    background-size: 100% 100%;
  }

  #table {
    width: 80%;
    height: 70%;
    position: absolute;
    top: 15%;
    left: 10%;

    // element-table
    .el-table {
      background-color: #264c97;
    }
  }
  #tip {
    position: absolute;
    bottom: 10%;
    right: 10%;
    font-size: 22px;
    text-align: right;
    padding-right: 20px;
    box-sizing: border-box;
    letter-spacing: 3px;
  }
}
</style>