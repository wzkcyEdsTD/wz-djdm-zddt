<template>
  <div id="dklist">
    <div class="head">
      <span>地块列表</span>
      <a @click="()=>{ this.$parent.listShow = false }">×</a>
    </div>
    <el-table :data="elList" height="90%" border @row-click="clickTr">
      <el-table-column prop="index" label="序号" sortable width="77"></el-table-column>
      <el-table-column prop="DKMC" label="地块名称" sortable></el-table-column>
      <el-table-column prop="SSQY" label="所属区域" sortable width="110"></el-table-column>
      <el-table-column prop="SSJD" label="所属街道" sortable width="110"></el-table-column>
      <el-table-column prop="TDYT" label="土地用途" sortable width="130"></el-table-column>
      <el-table-column prop="TDMJ" label="土地面积 (亩)" sortable width="143"></el-table-column>
      <el-table-column prop="JZMJ" label="建筑面积 (㎡)" sortable width="143"></el-table-column>
      <el-table-column prop="RJL" label="容积率" sortable width="100"></el-table-column>
      <el-table-column prop="JDDW" label="竞得单位" sortable width="110"></el-table-column>
      <el-table-column prop="QSJ" label="起始价 (万元)" sortable width="143"></el-table-column>
      <el-table-column prop="CJJ" label="成交价 (万元)" sortable width="143"></el-table-column>
      <el-table-column prop="YJL" label="溢价率" sortable width="97"></el-table-column>
      <el-table-column prop="CRQK" label="出让情况" sortable width="110"></el-table-column>
      <el-table-column prop="ZDWCSX" label="做地完成时限" sortable width="145"></el-table-column>
    </el-table>
  </div>
</template>

<script>
/* eslint-disable */
import { loadModules } from "esri-loader";
import { WRT_config, OPTION } from "@/components/common/Tmap";
import { countryHash } from "../config/hash";
export default {
  name: "dklist",
  data() {
    return {
      elList: [],
      countryHash
    };
  },
  created() {
    loadModules(
      ["esri/tasks/QueryTask", "esri/tasks/support/Query"],
      OPTION
    ).then(async ([QueryTask, Query]) => {
      const queryTask = new QueryTask({
        url: `https://wzdjdm.wzcitybrain.com:8888/erwei/arcgis/rest/services/WZZD/WZZDDK/MapServer/0`
      });
      const query = new Query();
      query.outFields = ["*"];
      query.returnGeometry = true;
      query.where = `1 = 1`;
      const { fields, features } = await queryTask.execute(query);
      const fieldAliases = {};
      fields.map(item => {
        fieldAliases[item.name] = item.alias;
      });
      const list = features.map(item => {
        item.fieldAliases = fieldAliases;
        return item;
      });

      const that = this;

      list
        .sort((a, b) => {
          return a.attributes.ssjd > b.attributes.ssjd ? 1 : -1;
        })
        .sort((a, b) => {
          return (
            that.countryHash[a.attributes.ssqy] -
            that.countryHash[b.attributes.ssqy]
          );
        })
        .map(({ attributes, geometry, fieldAliases }, index) => {
          let wcsx = null;
          if (attributes.zdwcsx != null) {
            wcsx = attributes.zdwcsx.split(" ")[0];
            wcsx = wcsx
              .replace("年", "-")
              .replace("月", "-")
              .replace("日", "");
          }

          const [wcsx_y, wcsx_m] =
            wcsx == null ? [null, null] : wcsx.split("-");

          const zdwcsx = !isNaN(Number(wcsx_m))
            ? `${Number(wcsx_y)}年${Number(wcsx_m)}月`
            : `/`;

          that.elList.push({
            id: "zddk",
            index: index + 1,
            DKMC: attributes.dkmc || attributes.GLZD,
            SSQY: attributes.ssqy,
            SSJD: attributes.ssjd,
            TDYT: attributes.tdyt,
            TDMJ: attributes.tdmj,
            JZMJ: attributes.jzmj,
            RJL: attributes.rjl,
            JDDW: attributes.jddwmgs,
            QSJ: attributes.qsj,
            CJJ: attributes.cjj,
            YJL: attributes.yjl,
            CRQK: attributes.crqk,
            ZDWCSX: zdwcsx,
            attributes,
            geometry,
            fieldAliases
          });
        });
    });
  },
  methods: {
    // 表格行点击事件
    clickTr(row, column, event) {
      this.$parent.$refs.monitorArcgis.goloaction(row);

      const glzd = row.attributes.glzd;
      const imgName = row.attributes.zdxq;
      const name = row.attributes.dkmc;

      this.$parent.rightHidden();
      this.$parent.$refs.dkxqForm.getItem(glzd, imgName, name);
      this.$parent.listShow = false;
      this.$parent.dkxqShow = true;
    }
  }
};
</script>

<style lang="less" scoped>
#dklist {
  position: absolute;
  top: 10%;
  left: 4%;
  width: 88%;
  height: 78%;
  padding: 1% 2%;
  background: #24386a;
  border: 1px solid #04ecff;
  z-index: 31;

  .head {
    height: 7%;

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

  // element-table
  .el-table {
    width: 100%;
    margin: auto;
    background-color: #24386a;
  }

  .el-button--text {
    font-size: 16px;
  }
}
</style>