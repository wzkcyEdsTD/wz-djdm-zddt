<template>
  <div class="Com_content Monitor">
    <div class="Com_map">
      <commonArcgis id="monitorArcgis" ref="monitorArcgis" />
    </div>
    <div class="Com_container">
      <div :class="`leftside animated ${icon_show_left?`slideOutLeft`:`slideInLeft`}`">
        <span class="left_tab">
          <ul>
            <li :class="{li_top_active: left_tab_index == 0 }" @click="dkTypeChange(0)">
              <span>做地地块</span>
            </li>
            <li :class="{li_bottom_active: left_tab_index == 1 }" @click="dkTypeChange(1)">
              <span>拆改地块</span>
            </li>
          </ul>
        </span>
        <leftMultiSelect ref="leftOptions" />
        <span @click="toggle(), legend()" class="hidden_button"></span>
      </div>
      <div :class="`rightside animated ${icon_show_right?`slideOutRight`:`slideInRight`}`">
        <div id="rightFrame">
          <crtj ref="crtj" />
          <crjz ref="crjz" />
          <tdyt ref="tdyt" />
        </div>
        <span @click="toggle2" class="hidden_right_button"></span>
      </div>
    </div>
    <topDate ref="topDate" />
    <bottomBtn ref="bottomBtn" />
    <dkxqForm ref="dkxqForm" v-show="dkxqShow" :style="{right:moveRight + 'px'}" />
    <dkList v-show="listShow" />
    <crfaForm ref="crfaForm" v-show="crfaShow" />
    <warning ref="warning" v-show="warnShow" />
    <bigImg ref="bigImg" :imgSrc="imgSrc" v-show="bigShow" />
  </div>
</template>

<script>
/* eslint-disable */
/**
 * 为避免传值紊乱,建议用ref直接传值或调用触发更新
 * [例] this.$parent.ref.macroArcgis.goLocation(item) 可以直接在<RightDiv>跨模块调用(从列表模块到父模块,再到地图模块)
 * 使用场景:
 * 1.点击勾选左侧,右侧列表Object[]的替换
 * 2.点击列表<RightDiv>,地图<commonArcgis>定位并显示内容
 */
import commonArcgis from "./Arcgis";
import leftMultiSelect from "./widget/leftMultiSelect";

import topDate from "./widget/topDate";
import bottomBtn from "./widget/bottomBtn";

// chartTable
import crtj from "./rightDiv/crtj";
import crjz from "./rightDiv/crjz";
import tdyt from "./rightDiv/tdyt";

// 地块详情
import dkxqForm from "./frame/dkxqForm";
// 地块列表
import dkList from "./frame/dkList";
// 出让方案
import crfaForm from "./frame/crfaForm";
// 放大图片
import bigImg from "./frame/bigImg";

// 首屏预警
import warning from "./frame/warning";

import { mapState, mapActions } from "vuex";
import {creditAuth} from "@/api/beans/population.js"

export default {
  name: "monitor",
  data() {
    return {
      icon_show_left: false,
      icon_show_right: false,
      moveLeft: "410",
      moveRight: "500",
      dkxqShow: false,
      listShow: false,
      crfaShow: false,
      warnShow: false,
      bigShow: false,
      left_tab_index: 0,
      imgSrc: ""
    };
  },
  components: {
    commonArcgis,
    leftMultiSelect,

    // 顶部数据
    topDate,
    // 底部按钮
    bottomBtn,

    // 出让统计
    crtj,
    // 出让价值
    crjz,
    // 土地用途
    tdyt,
    // 地块详情
    dkxqForm,
    // 地块列表
    dkList,
    // 出让方案
    crfaForm,
    // 首屏预警
    warning,
    // 放大图片
    bigImg
  },
  created() {
    creditAuth();
  },
  mounted() {
    !this.zdjzList.length && this.fetchzdjzList();
    !this.dkxxList.length && this.fetchdkxxList();
    !this.zdzbList.length && this.fetchzdzbList();
    !this.zdfaList.length && this.fetchzdfaList();
  },
  computed: {
    ...mapState({
      zdjzList: state => state.zdjzList,
      dkxxList: state => state.dkxxList,
      zdzbList: state => state.zdzbList,
      zdfaList: state => state.zdfaList
    })
  },
  methods: {
    ...mapActions([
      "fetchzdjzList",
      "fetchdkxxList",
      "fetchzdzbList",
      "fetchzdfaList"
    ]),
    toggle() {
      this.icon_show_left = !this.icon_show_left;
      this.moveLeft = !this.icon_show_left ? "410" : "20";
    },
    toggle2() {
      this.icon_show_right = !this.icon_show_right;
      this.moveRight = !this.icon_show_right ? "500" : "20";
    },
    leftHidden() {
      this.icon_show_left = true;
      this.moveLeft = "20";
    },
    rightHidden() {
      this.icon_show_right = true;
      this.moveRight = "20";
    },
    dkTypeChange(type) {
      this.left_tab_index = type;
      this.$refs.leftOptions.dkListChange(type);
    },
    legend() {
      if (!this.icon_show_left) {
        $("body .esri-ui-bottom-left").css({ left: "410px" });
      } else {
        $("body .esri-ui-bottom-left").css({ left: "20px" });
      }
    }
  }
};
</script>
<style scoped lang="less">
@import url("./Monitor.less");
</style>