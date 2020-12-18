<template>
  <div id="crtjDiv">
    <div>
      <span class="title">做地目标按区划统计图</span>
      <select id="select" @change="bqSelect($event)">
        <option value="crdk">按宗数统计</option>
        <option value="crje">按货值统计</option>
        <option value="crmj">按面积统计</option>
      </select>
    </div>
    <div id="crtjChart"></div>
  </div>
</template>

<script>
/* eslint-disable */
import { mapState } from "vuex";
import "echarts/lib/chart/bar";
export default {
  data() {
    return {
      chart: null,
      index: "crdk"
    };
  },
  computed: {
    ...mapState({
      dkxxList: state => state.dkxxList
    })
  },
  methods: {
    fixdkxxList() {
      // const countryHash = {
      //   滨江街道: { value: 0, name: "滨江街道" },
      //   山福镇: { value: 0, name: "山福镇" },
      //   藤桥镇: { value: 0, name: "藤桥镇" },
      //   仰义街道: { value: 0, name: "仰义街道" },
      //   南郊街道: { value: 0, name: "南郊街道" },
      //   丰门街道: { value: 0, name: "丰门街道" },
      //   南汇街道: { value: 0, name: "南汇街道" },
      //   双屿街道: { value: 0, name: "双屿街道" },
      //   五马街道: { value: 0, name: "五马街道" },
      //   松台街道: { value: 0, name: "松台街道" },
      //   七都街道: { value: 0, name: "七都街道" },
      //   蒲鞋市街道: { value: 0, name: "蒲鞋市街道" },
      //   广化街道: { value: 0, name: "广化街道" },
      //   大南街道: { value: 0, name: "大南街道" }
      // };

      const countryHash = {
        鹿城区: { value: 0, name: "鹿城" },
        瓯海区: { value: 0, name: "瓯海" },
        龙湾区: { value: 0, name: "龙湾" },
        瓯江口产业集聚区: { value: 0, name: "瓯江口" },
        浙南产业集聚区: { value: 0, name: "浙南" }
      };

      const crdkObj = JSON.parse(JSON.stringify(countryHash));
      const crjeObj = JSON.parse(JSON.stringify(countryHash));
      const crmjObj = JSON.parse(JSON.stringify(countryHash));

      const crdkData = [];
      const crjeData = [];
      const crmjData = [];

      this.dkxxList.map(({ QSJ, TDMJ, SSQY }) => {
        crdkObj.hasOwnProperty(SSQY) && crdkObj[SSQY].value++;
        QSJ != "/" &&
          crjeObj.hasOwnProperty(SSQY) &&
          (crjeObj[SSQY].value = Number(crjeObj[SSQY].value) + Number(QSJ));
        TDMJ != "/" &&
          crmjObj.hasOwnProperty(SSQY) &&
          (crmjObj[SSQY].value = Number(crmjObj[SSQY].value) + Number(TDMJ));
      });

      for (let k in crdkObj) {
        crdkData.push(crdkObj[k]);
      }

      Object.values(crjeObj).map(item => {
        item.value = (Number(item.value) / 10000).toFixed(2);
      });

      for (let k in crjeObj) {
        crjeData.push(crjeObj[k]);
      }

      Object.values(crmjObj).map(item => {
        item.value = Number(item.value).toFixed(2);
      });

      for (let k in crmjObj) {
        crmjData.push(crmjObj[k]);
      }

      this.dataAge = crdkData;

      this.dataHash = {
        crdk: crdkData,
        crje: crjeData,
        crmj: crmjData
      };

      this.doChart();
    },
    doChart() {
      const chart = this.$echarts.init(document.getElementById("crtjChart"));
      chart.setOption({
        grid: {
          left: "3%",
          right: "3%",
          top: "16%",
          bottom: "3%",
          containLabel: true
        },
        tooltip: {
          trigger: "axis"
        },
        xAxis: {
          type: "category",
          boundaryGap: true,
          show: true,
          axisTick: {
            show: false
          },
          axisLabel: {
            fontSize: 17,
            color: "#FFF",
            formatter: function(val) {
              return val.split("").join("\n");
            }
          },
          axisLine: {
            lineStyle: {
              color: "#FFF"
            }
          },
          data: this.dataAge
            .sort((a, b) => b.value - a.value)
            .map(item => item.name.replace("镇", "").replace("街道", ""))
        },
        yAxis: {
          type: "value",
          name:
            this.index == "crdk" ? "宗" : this.index == "crje" ? "亿元" : "亩",
          minInterval: 1,
          axisLine: {
            lineStyle: {
              color: "#FFF"
            }
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            show: true,
            textStyle: {
              color: "#fff",
              fontSize: 17
            }
          },
          nameTextStyle: {
            color: "#fff",
            fontSize: 17
          },
          splitLine: {
            show: false
          }
        },
        series: [
          {
            name:
              this.index == "crdk"
                ? "做地地块"
                : this.index == "crje"
                ? "地块货值"
                : "地块面积",
            type: "bar",
            barWidth: "20px",
            label: {
              normal: {
                show: true,
                position: "top",
                color: "#fff",
                fontSize: 12
              }
            },
            itemStyle: {
              color: "#f41e1e"
            },
            data: this.dataAge
          }
        ]
      });
    },
    bqSelect(event) {
      this.dataAge = this.dataHash[event.target.value];
      this.index = event.target.value;
      this.$echarts.init(document.getElementById("crtjChart")).clear();
      this.doChart();
    }
  },
  created() {},
  mounted() {
    this.fixdkxxList();
  },
  watch: {
    dkxxList(n) {
      this.fixdkxxList();
    }
  }
};
</script>

<style lang="less" scoped>
#crtjDiv {
  width: 100%;
  height: 34%;
  border: 1px solid #035acd;

  > div {
    text-align: left;
    height: 15%;
    .title {
      font-size: 20px;
      color: rgba(97, 235, 255, 1);
      position: relative;
      top: 12px;
      left: 20px;
      font-weight: 500;
      border-left: 5px solid;
      padding-left: 5px;
    }

    select {
      position: relative;
      float: right;
      top: 12px;
      right: 15px;
      padding: 4px 9px;
      background: rgba(15, 30, 44, 1);
      border: 1px solid #61ebff;
      border-radius: 4px;
      color: #fff;
    }
  }

  #crtjChart {
    width: 100%;
    height: 85%;
  }
}

#crtjDiv::before {
  height: 34%;
}
</style>