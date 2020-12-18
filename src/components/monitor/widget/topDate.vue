<template>
  <div id="topDateDiv">
    <img class="topImg" src="libs/img/topImg.png" />
    <img class="leftImg" src="libs/img/sideImg.png" />
    <img class="rightImg" src="libs/img/sideImg.png" />
    <ul>
      <li style="cursor: pointer;" @click="showList">
        <div>
          <p>
            做地地块
            <span>{{ country }}</span>
          </p>
          <table border="0" cellpadding="0" cellspacing="0">
            <tr>
              <td>计划目标</td>
              <td>累计完成</td>
            </tr>
            <tr class="last-tr">
              <td>
                <span>{{ crdk_jh }}</span>
                <span>宗</span>
              </td>
              <td>
                <span>{{ crdk_lj }}</span>
                <span>宗</span>
              </td>
            </tr>
          </table>
        </div>
      </li>
      <li>
        <div></div>
      </li>
      <li>
        <div>
          <p>
            地块面积
            <span>{{ country }}</span>
          </p>
          <table border="0" cellpadding="0" cellspacing="0">
            <tr>
              <td>计划目标</td>
              <td>累计完成</td>
            </tr>
            <tr class="last-tr">
              <td>
                <span>{{ crmj_jh }}</span>
                <span>亩</span>
              </td>

              <td>
                <span>{{ crmj_lj }}</span>
                <span>亩</span>
              </td>
            </tr>
          </table>
        </div>
      </li>
      <li>
        <div></div>
      </li>
      <li>
        <div>
          <p>
            出让金额
            <span>{{ country }}</span>
          </p>
          <table border="0" cellpadding="0" cellspacing="0">
            <tr>
              <td>累计出让</td>
              <td>累计金额</td>
            </tr>
            <tr class="last-tr">
              <td>
                <span>{{ wcdk_lj }}</span>
                <span>宗</span>
              </td>
              <td>
                <span>{{ crje_lj }}</span>
                <span>亿</span>
              </td>
            </tr>
          </table>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
/* eslint-disable */
import { mapState } from "vuex";
export default {
  data() {
    return {
      country: `(全市)`,
      crdk_lj: 0,
      crje_lj: 0,
      crmj_lj: 0,
      wcdk_lj: 0,
      crdk_jh: 0,
      crje_jh: 0,
      crmj_jh: 0,
      tmpData: null
    };
  },
  computed: {
    ...mapState({
      dkxxList: state => state.dkxxList
    })
  },
  methods: {
    fixdkxxList() {
      let crdk_lj = 0;
      let crje_lj = 0;
      let crmj_lj = 0;
      let wcdk_lj = 0;
      let crdk_jh = 0;
      let crje_jh = 0;
      let crmj_jh = 0;

      this.dkxxList.map(({ CRQK, CJJ, QSJ, TDMJ, SSJD, CRCJSJ }) => {
        if (CRQK != "做地中") {
          crdk_lj++;
          CJJ != "/" && (crje_lj = Number(crje_lj) + Number(CJJ));
          TDMJ != "/" && (crmj_lj = Number(crmj_lj) + Number(TDMJ));
        }

        CRQK == "已出让" && wcdk_lj++;

        crdk_jh++;
        QSJ != "/" && (crje_jh = Number(crje_jh) + Number(QSJ));
        TDMJ != "/" && (crmj_jh = Number(crmj_jh) + Number(TDMJ));
      });

      this.crdk_lj = crdk_lj;
      this.crje_lj = (crje_lj / 10000).toFixed(2);
      this.crmj_lj = crmj_lj.toFixed(2);
      this.crdk_jh = crdk_jh;
      this.wcdk_lj = wcdk_lj;
      this.crje_jh = (crje_jh / 10000).toFixed(2);
      this.crmj_jh = crmj_jh.toFixed(2);

      this.tmpData = {
        crdk_lj: crdk_lj,
        crje_lj: (crje_lj / 10000).toFixed(2),
        crmj_lj: crmj_lj.toFixed(2),
        wcdk_lj: wcdk_lj,
        crdk_jh: crdk_jh,
        crje_jh: (crje_jh / 10000).toFixed(2),
        crmj_jh: crmj_jh.toFixed(2)
      };
    },
    filterItem(country) {
      !this.dkxxList.length && this.fetchdkxxList();

      if (~[null, "全部"].indexOf(country)) {
        this.crdk_lj = this.tmpData["crdk_lj"];
        this.crje_lj = this.tmpData["crje_lj"];
        this.crmj_lj = this.tmpData["crmj_lj"];
        this.wcdk_lj = this.tmpData["wcdk_lj"];
        this.crdk_jh = this.tmpData["crdk_jh"];
        this.crje_jh = this.tmpData["crje_jh"];
        this.crmj_jh = this.tmpData["crmj_jh"];

        this.country = `(全市)`;
      } else {
        let crdk_lj = 0;
        let crje_lj = 0;
        let crmj_lj = 0;
        let wcdk_lj = 0;
        let crdk_jh = 0;
        let crje_jh = 0;
        let crmj_jh = 0;

        this.dkxxList.map(({ CRQK, CJJ, QSJ, TDMJ, SSJD, ZRDW }) => {
          if (ZRDW.split("/")[0] == country) {
            if (CRQK != "做地中") {
              crdk_lj++;
              CJJ != "/" && (crje_lj = Number(crje_lj) + Number(CJJ));
              TDMJ != "/" && (crmj_lj = Number(crmj_lj) + Number(TDMJ));
            }

            CRQK == "已出让" && wcdk_lj++;

            crdk_jh++;
            QSJ != "/" && (crje_jh = Number(crje_jh) + Number(QSJ));
            TDMJ != "/" && (crmj_jh = Number(crmj_jh) + Number(TDMJ));
          }
        });

        this.crdk_lj = crdk_lj;
        this.crje_lj = (crje_lj / 10000).toFixed(2);
        this.crmj_lj = crmj_lj.toFixed(2);
        this.wcdk_lj = wcdk_lj;
        this.crdk_jh = crdk_jh;
        this.crje_jh = (crje_jh / 10000).toFixed(2);
        this.crmj_jh = crmj_jh.toFixed(2);

        this.country = `(${country})`;
      }
    },
    // 地块列表
    showList() {
      this.$parent.listShow = true;
    }
  },
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
#topDateDiv {
  position: absolute;
  top: 30px;
  left: 50%;
  transform: translate(-50%, 0);
  z-index: 20;
  background: #1b45a7;
  border: 1px solid #09cadd;
  border-radius: 4px;

  .topImg {
    position: absolute;
    left: 50%;
    transform: translate(-50%, -10px);
  }

  .leftImg {
    position: absolute;
    top: 50%;
    left: 0%;
    transform: translate(-12px, -50%);
  }

  .rightImg {
    position: absolute;
    top: 50%;
    right: 0%;
    transform: translate(12px, -50%);
  }

  ul li {
    float: left;
    list-style: none;

    div {
      // width: 200px;
      position: relative;
      padding: 16px;

      p {
        text-align: center;
        font-size: 16px;
        font-family: Helvetica Neue;
        font-weight: 500;
        color: #fff;
      }

      table {
        width: 100%;
        margin-top: 15px;

        tr {
          td {
            text-align: left;

            span:first-child {
              font-size: 34px;
              font-family: DIN;
              font-weight: 500;
              margin: 3px 0;
            }

            span:last-child {
              font-size: 14px;
              font-family: Helvetica Neue;
              font-weight: 400;
              margin-left: 6px;
            }
          }

          td:last-child {
            padding-left: 12px;
          }
        }

        tr:first-child {
          color: #07dbe5;
          font-size: 14px;
        }

        .last-tr {
          td:first-child span {
            color: #ff3229;
          }

          td:last-child span {
            color: #6dff3d;
          }

          td:first-child span:last-child,
          td:last-child span:last-child {
            color: #07dbe5;
          }
        }
      }
    }
  }

  li:nth-child(2) div,
  li:nth-child(4) div {
    width: 0px;
    height: 72px;
    position: relative;
    top: 30px;
    border-left: 1px solid #07dbe5;
    border-right: 1px solid #07dbe5;
    box-sizing: border-box;
    padding: 0;
  }
}
</style>