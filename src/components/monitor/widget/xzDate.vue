<template>
  <div id="xzDateDiv">
    <div id="xzDateTag" v-show="btnShow" v-on:click="btnclose">疫情须知</div>
    <div id="xzDateMain" v-show="isShow">
      <h3>
        - 疫情须知 -
        <a v-on:click="closeDiv">×</a>
      </h3>
      <ul>
        <li>
          <span>传染源：</span>野生动物，可能为中华菊头蝠
        </li>
        <li>
          <span>病毒：</span>新型冠状病毒2019-nCoV
        </li>
        <li>
          <span>传播途径：</span>经呼吸道飞沫传播，亦可通过接触传播
        </li>
        <li>
          <span>易感染人群：</span>人群普遍易感染。老年人及有基础疾病者易染后病情严重，儿童及婴幼儿也有发病
        </li>
        <li>
          <span>潜伏期：</span>一般为3~7天，最长不超过14天，潜伏期内存在传染性
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isShow: false, //详情框默认隐藏
      btnShow: true
    };
  },
  methods: {
    closeDiv() {
      this.isShow = false; //点击关闭按钮关闭
      this.btnShow = true; //点击关闭按钮关闭
    },
    btnclose() {
      this.isShow = true; //点击关闭按钮关闭
      this.btnShow = false; //点击关闭按钮关闭
    }
  },
  mounted() {
    //this.closeDiv(); //点击关闭按钮关闭
  }
};
</script>

<style lang="less" scoped>
#xzDateDiv {
  position: absolute;
  bottom: 2%;
  right: 28%;
  transition: all 1s;
  z-index: 21;

  #xzDateTag {
    background-color: #1d449f;
    border: 1px solid #04f2ff;
    padding: 0px 12px;
    cursor: pointer;
    height: 41px;
    line-height: 41px;
  }

  #xzDateMain {
    width: 400px;
    height: 200px;
    background-color: #1d449f;
    border: 1px solid #04f2ff;
    box-sizing: border-box;

    h3 {
      padding: 5px 0;
      border-bottom: 1px solid #0375f9;
      color: #00dfdb;

      a {
        float: right;
        font-size: 40px;
        padding: -3px;
        margin-top: -7px;
        margin-right: 5px;
        cursor: pointer;
      }
    }

    li {
      text-align: left;
      width: 95%;
      margin: auto;
      margin-left: 22px;
      margin-bottom: 3px;
      color: #44b9ff;

      span {
        color: #03fff4;
        font-weight: bold;
      }
    }
  }
}
</style>