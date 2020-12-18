<template>
  <div id="dkxqForm">
    <a @click="close">×</a>
    <div class="subtitle">{{ title }}</div>
    <div class="block block1">
      <span class="title">做地详情</span>
      <div class="carousel">
        <el-carousel height="150px" autoplay>
          <el-carousel-item v-for="item in imgNum" :key="item"></el-carousel-item>
        </el-carousel>
      </div>
    </div>

    <div class="block block2">
      <span class="title">专班人员</span>
      <div class="innerTable">
        <table>
          <thead>
            <tr>
              <th>类别</th>
              <th>姓名</th>
              <th>职位</th>
              <th>联系方式</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>主要负责人</td>
              <td>{{ zy_xm }}</td>
              <td>{{ zy_zw }}</td>
              <td>{{ zy_lxfs }}</td>
            </tr>
            <tr>
              <td>分管负责人</td>
              <td>{{ fg_xm }}</td>
              <td>{{ fg_zw }}</td>
              <td>{{ fg_lxfs }}</td>
            </tr>
            <tr>
              <td>科室负责人</td>
              <td>{{ ks_xm }}</td>
              <td>{{ ks_zw }}</td>
              <td>{{ ks_lxfs }}</td>
            </tr>
            <tr>
              <td>地块负责人</td>
              <td>{{ dk_xm }}</td>
              <td>{{ dk_zw }}</td>
              <td>{{ dk_lxfs }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div class="block block3">
      <span class="title">问题清单</span>
      <div>
        <ul>
          <li v-for="k in parseInt(qtable.length / 3)" :key="k">
            <div
              v-for="(item,index) in qtable.slice((k - 1) * 3, (k - 1) * 3 + 3)"
              :key="index"
              @click="getReason(item)"
              :class="{ complete: item.tf == '是', uncomplete: item.tf != '是' }"
            >
              <span>{{item.text}}</span>
            </div>
          </li>
          <li>
            <div
              v-for="(item,index) in qtable.slice([qtable.length-1])"
              :key="index"
              @click="getReason(item)"
              :class="{ complete: item.tf == '是', uncomplete: item.tf != '是' }"
            >
              <span>{{item.text}}</span>
            </div>
          </li>
        </ul>
        <reasonForm ref="reasonForm" />
      </div>
    </div>

    <!-- <div class="block block4">
      <span class="title">区块优势</span>
      <div>
        <ul>
          <li v-for="(item,index) in qktable" :key="index">
            <span>{{item.text}}</span>
          </li>
        </ul>
      </div>
    </div>-->
  </div>
</template>

<script>
/* eslint-disable */
const server = "https://wzdjdm.wzcitybrain.com:8888/zddt-fgfc/s";
const server2 = "http://117.149.228.90:82";
import reasonForm from "./reasonForm";
import { mapState } from "vuex";

export default {
  name: "dkxqForm",
  data() {
    return {
      server,
      server2,
      imgNum: 4,
      title: "",
      qktable: [],
      qtable: [],
      elList: [],
      zy_xm: "暂无数据",
      zy_zw: "暂无数据",
      zy_lxfs: "暂无数据",
      fg_xm: "暂无数据",
      fg_zw: "暂无数据",
      fg_lxfs: "暂无数据",
      ks_xm: "暂无数据",
      ks_zw: "暂无数据",
      ks_lxfs: "暂无数据",
      dk_xm: "暂无数据",
      dk_zw: "暂无数据",
      dk_lxfs: "暂无数据"
    };
  },
  components: { reasonForm },
  computed: {
    ...mapState({
      zdjzList: state => state.zdjzList,
      dkxxList: state => state.dkxxList,
      zdzbList: state => state.zdzbList
    })
  },
  created() {},
  mounted() {},
  methods: {
    close() {
      this.$parent.dkxqShow = false;
    },
    getItem(match_glzd, imgName, name) {
      const that = this;

      this.title = name;

      const imgList =
        imgName == "/" || imgName == null || imgName == "null" || imgName == ""
          ? []
          : imgName.split(";");

      this.imgNum = imgList.length || 1;

      if (imgList.length) {
        imgList.map((item, index) => {
          const lowCase = item.toLowerCase();
          if (~lowCase.indexOf("upload")) {
            $(".el-carousel__item")
              .eq(index)
              .css({
                "background-image": `url("${server2}/${item}")`
              });
          } else {
            $(".el-carousel__item")
              .eq(index)
              .css({
                "background-image": `url("${server}/icon/wzzdtp/${item}")`
              });
          }
        });
      } else {
        $(".el-carousel__item")
          .eq(0)
          .css({
            "background-image": `url("${server}/icon/wzzdtp/临时/暂无图片.jpg")`
          });
      }

      $(".el-carousel__item").css({
        cursor: "pointer"
      });
      $(".el-carousel__item").bind("click", this.locateVR);

      const list = this.zdjzList.filter(({ GLZD }) => GLZD == match_glzd);

      const dkxxObj = this.dkxxList.filter(({ GLZD }) => GLZD == match_glzd);

      if (dkxxObj.length) {
        this.qktable = [
          {
            text: dkxxObj[0].QKYS == "/" ? "暂无数据" : dkxxObj[0].QKYS
          }
        ];
      }

      if (list.length) {
        const item = list[0];

        const colorHash = {
          是: "rgba(58,209,75,0.3)",
          否: "rgba(255,51,83,0.3)"
        };

        that.qtable = [
          {
            text: "征地是否到位",
            tf: item.TDZSZJS1,
            jtyy: item.JTYY1,
            zrr: item.ZRR1,
            sjjd: item.SJJD1,
            color: colorHash[item.TDZSZJS1]
          },
          {
            text: "土地使用权是否已收回",
            tf: item.TDSYQ2,
            jtyy: item.JTYY2,
            zrr: item.ZRR2,
            sjjd: item.SJJD2,
            color: colorHash[item.TDSYQ2]
          },
          {
            text: "建筑物是否已拆除",
            tf: item.JZW3,
            jtyy: item.JTYY3,
            zrr: item.ZRR3,
            sjjd: item.SJJD3,
            color: colorHash[item.JZW3]
          },
          {
            text: "土地证是否已注销",
            tf: item.TDZ4,
            jtyy: item.JTYY4,
            zrr: item.ZRR4,
            sjjd: item.SJJD4,
            color: colorHash[item.TDZ4]
          },
          {
            text: "管线是否已迁移",
            tf: item.GX5,
            jtyy: item.JTYY5,
            zrr: item.ZRR5,
            sjjd: item.SJJD5,
            color: colorHash[item.GX5]
          },
          {
            text: "地表附着物是否已清理",
            tf: item.DBFZW6,
            jtyy: item.JTYY6,
            zrr: item.ZRR6,
            sjjd: item.SJJD6,
            color: colorHash[item.DBFZW6]
          },
          {
            text: "土地污染是否已治理",
            tf: item.TDWR7,
            jtyy: item.JTYY7,
            zrr: item.ZRR7,
            sjjd: item.SJJD7,
            color: colorHash[item.TDWR7]
          },
          {
            text: "场地是否已平整",
            tf: item.CD8,
            jtyy: item.JTYY8,
            zrr: item.ZRR8,
            sjjd: item.SJJD8,
            color: colorHash[item.CD8]
          },
          {
            text: "水域占用是否已审批",
            tf: item.SY9,
            jtyy: item.JTYY9,
            zrr: item.ZRR9,
            sjjd: item.SJJD9,
            color: colorHash[item.SY9]
          },
          {
            text: "围墙放样地籍图是否完成",
            tf: item.WQFY10,
            jtyy: item.JTYY10,
            zrr: item.ZRR10,
            sjjd: item.SJJD10,
            color: colorHash[item.WQFY10]
          },
          {
            text: "土地是否收储",
            tf: item.TDSC11,
            jtyy: item.JTYY11,
            zrr: item.ZRR11,
            sjjd: item.SJJD11,
            color: colorHash[item.TDSC11]
          },
          {
            text: "其他问题是否处理",
            tf: item.QT,
            jtyy: item.JTYY13,
            zrr: item.ZRR13,
            sjjd: item.SJJD13,
            color: colorHash[item.QT]
          },
          {
            text: "是否挂牌",
            tf: item.GP12,
            jtyy: item.JTYY12,
            zrr: item.ZRR12,
            sjjd: item.SJJD12,
            color: colorHash[item.GP12]
          }
        ];

        // const id = list[0].GLZD;

        const zdzbObj = this.zdzbList.filter(({ glzd }) => glzd == match_glzd);

        if (zdzbObj.length) {
          const item = zdzbObj[0];
          that.zy_xm = item.zy_xm;
          that.zy_zw = item.zy_zw;
          that.zy_lxfs = item.zy_lxfs;

          that.fg_xm = item.fg_xm;
          that.fg_zw = item.fg_zw;
          that.fg_lxfs = item.fg_lxfs;

          that.ks_xm = item.ks_xm;
          that.ks_zw = item.ks_zw;
          that.ks_lxfs = item.ks_lxfs;

          that.dk_xm = item.dk_xm;
          that.dk_zw = item.dk_zw;
          that.dk_lxfs = item.dk_lxfs;
        }
      }
    },
    getReason(item) {
      this.$refs.reasonForm.showReason(item);
    },
    locateVR(e) {
      if (~this.title.indexOf("滨江")) {
        window.open("https://720yun.com/t/aevkuy1q07l?scene_id=39682863");
      } else if (~this.title.indexOf("广化")) {
        window.open("https://720yun.com/t/0b0jvzeykn7?scene_id=20053605");
      } else {
        const src = e.target.style.backgroundImage;
        if (src != "") {
          const imgSrc = src.slice(5, src.length - 2);
          this.$parent.imgSrc = imgSrc;
          this.$parent.bigShow = true;
        }
      }
    }
  }
};
</script>

<style lang="less" scoped>
#dkxqForm {
  position: absolute;
  width: 490px;
  height: 90%;
  background: rgba(4, 30, 117, 0.5);
  border-left: 1px solid #04ecff;
  border-right: 1px solid #04ecff;
  border-radius: 6px;
  z-index: 30;
  top: 8%;
  margin: auto;
  box-sizing: border-box;
  transition: all 1s;
  display: flex;
  flex-flow: column;
  justify-content: space-between;

  > a {
    position: absolute;
    z-index: 32;
    top: 0px;
    right: 10px;
    font-size: 30px;
    cursor: pointer;
  }

  > header {
    font-size: 20px;
    font-weight: bolder;
    color: rgba(97, 235, 255, 1);
    position: relative;
    top: 5px;
  }

  .block {
    text-align: left;
    width: 100%;
    background: rgba(4, 30, 117, 0.5);
    border-bottom: 1px solid #4594ff;
    border-top: 1px solid #4594ff;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    .title {
      font-size: 20px;
      font-weight: bolder;
      color: rgba(97, 235, 255, 1);
      position: relative;
      width: 50%;
      top: 5px;
      left: 20px;
      border-left: 5px solid;
      padding-left: 5px;
    }
    > div {
      width: 100%;
      height: calc(100% - 33px);
      box-sizing: border-box;
    }
  }

  .subtitle {
    font-size: 18px;
    font-weight: bolder;
    color: rgba(97, 235, 255, 1);
    text-align: center;
    padding: 0 20px;
  }

  .block1 {
    height: 24%;

    .name {
      position: absolute;
      font-size: 18px;
      font-weight: bolder;
      color: rgba(97, 235, 255, 1);
      top: 5px;
      left: 50%;
      transform: translate(-50%, 0);
    }

    .carousel {
      padding: 10px 20px;

      .el-carousel__item:nth-child(2n) {
        background-image: url("../../common/image/暂无图片.jpg");
        background-repeat: no-repeat;
        background-size: 100% 100%;
      }

      .el-carousel__item:nth-child(2n + 1) {
        background-image: url("../../common/image/暂无图片.jpg");
        background-repeat: no-repeat;
        background-size: 100% 100%;
      }
    }
  }

  .block2 {
    height: 28%;
    padding-bottom: 6px;

    .innerTable {
      width: 100%;
      padding: 7px;
      overflow: auto;

      table {
        width: 100%;
        margin: 5px 0px;

        th,
        td {
          text-align: center;
          padding: 3px 0px;
        }
      }
    }
  }

  .block3 {
    height: 38%;
    > div {
      padding: 7px 0px;
      text-align: center;
      position: relative;
      ul {
        width: 100%;
        height: 100%;
        list-style: none;
        display: flex;
        flex-direction: column;
        justify-content: space-between;

        li {
          width: 100%;
          height: 18%;
          display: flex;
          justify-content: space-between;
          box-sizing: border-box;
          padding: 0px 5px;
          div {
            width: 32%;
            height: 100%;
            display: table;
            cursor: pointer;
            box-sizing: border-box;
            padding: 0px 23px;

            span {
              display: table-cell;
              vertical-align: middle;
              font-size: 15px;
              font-weight: bolder;
              color: #fff;
            }
          }

          .complete {
            background-image: url("../../common/image/已完成.png");
            background-repeat: no-repeat;
            background-size: 100% 100%;
          }

          .uncomplete {
            background-image: url("../../common/image/未完成.png");
            background-repeat: no-repeat;
            background-size: 100% 100%;
          }
        }

        li:last-child {
          div {
            width: 100%;
          }
          .complete {
            background-image: url("../../common/image/已完成2.png");
          }

          .uncomplete {
            background-image: url("../../common/image/未完成2.png");
          }
        }
      }
    }
  }

  .block4 {
    height: 14%;
    > div {
      padding: 10px 8px;
      ul {
        width: 100%;
        height: 100%;
        overflow-y: auto;
        background: rgba(31, 54, 92, 0.5);
        li {
          display: inline-block;
          width: 100%;
          box-sizing: border-box;
          padding: 8px 15px 0px;
          p {
            font-size: 18px;
            color: rgba(211, 154, 69, 1);
            line-height: 22px;
          }
          span {
            font-size: 17px;
          }
        }

        li:last-child {
          padding-bottom: 8px;
        }
      }
    }
  }

  .block2 .innerTable::-webkit-scrollbar,
  .block4 ul::-webkit-scrollbar {
    display: block;
    width: 10px;
    background-color: #1a3561;
    border-radius: 10px;
  }
  .block2 .innerTable::-webkit-scrollbar-thumb,
  .block4 ul::-webkit-scrollbar-thumb {
    width: 10px;
    background-color: #45cdff;
    border-radius: 10px;
  }
}
</style>