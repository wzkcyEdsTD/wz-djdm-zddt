<template>
  <div class="Map">
    <div :id="id" class="arcgisMap"></div>
  </div>
</template>

<script>
/* eslint-disable */
import { loadModules } from "esri-loader";
import { OPTION, spatialReference, IMAGELAYER } from "@/components/common/Tmap";
import { tipHash, Hash } from "./config/hash.js";
const server = "https://wzdjdm.wzcitybrain.com:8888/zddt-fgfc/s";

export default {
  name: "MonitorArcgis",
  data() {
    return {
      yjdkList: [],
      csdkList: [],
    };
  },
  components: {},
  props: {
    id: String,
  },

  created() {},
  async mounted() {
    const that = this;
    // init map
    await this.createMap();

    await this.addChanyePlate();

    // 添加图例标题
    $(".esri-mytitle").remove();
    $(".esri-legend").prepend(
      '<div class="esri-legend__message esri-mytitle">图例</div>'
    );

    // 图例偏移
    $("body .esri-ui-bottom-left").css({ left: "410px" });

    await this.addZDDKFeatures();

    this.yjdkList = this.$parent.$refs.warning.yjdkList;
    this.csdkList = this.$parent.$refs.warning.csdkList;

    // await this.yjdk(this.yjdkList, "yjdk");
    // await this.yjdk(this.csdkList, "csdk");

    this.jQueryBind();
  },
  watch: {
    yjdkList(oVal, nVal) {
      this.yjdk(this.yjdkList, "yjdk");
    },
    csdkList(oVal, nVal) {
      this.yjdk(this.csdkList, "csdk");
    },
  },
  methods: {
    /**
     * 数、组勾选触发图层寻找
     * @param {Object} item 单个元素
     */
    doFun(item) {
      const _id_ = item.id;
      if (item.check) {
        this.map && this.map.findLayerById(_id_)
          ? (this.map.findLayerById(_id_).visible = true)
          : this.addFeatures(item, _id_);
      } else {
        this.map && this.map.findLayerById(item.id)
          ? (this.map.findLayerById(item.id).visible = false)
          : null;
      }
    },
    /**
     * 初始化地图对象,带上底图
     * @param {Function} fn 回调函数
     */
    createMap(fn) {
      const that = this;
      return new Promise((resolve, reject) => {
        loadModules(
          [
            "esri/Map",
            "esri/views/MapView",
            "esri/widgets/Legend",
            "esri/layers/VectorTileLayer",
            "esri/layers/TileLayer",
          ],
          OPTION
        ).then(([Map, MapView, Legend, VectorTileLayer]) => {
          // map加载底图
          that.map = new Map({
            spatialReference,
          });
          //设置地图容器
          that.view = new MapView({
            container: that.$props.id,
            spatialReference,
            map: that.map,
            zoom: 12,
            center: [120.67819448808013, 27.99095289562555],
          });
          const layer = new VectorTileLayer({
            url: IMAGELAYER,
          });
          that.map.add(layer);
          that.legend = new Legend({
            label: "图例",
            view: that.view,
          });

          that.view.ui.add(that.legend, "bottom-left");
          that.view.on("click", function (evt) {});
          resolve(true);
        });
      });
    },
    // 绑定事件
    jQueryBind() {
      const context = this;
      // 地块详情
      $("body").on("click", ".dk_btn", function () {
        const glzd = $(this).attr("data-val");
        const imgName = $(this).attr("data-val2");
        const name = $(this).attr("data-val3");
        context.$parent.rightHidden();
        // 延时等待组件初始化
        setTimeout(() => {
          context.$parent.$refs.dkxqForm.getItem(glzd, imgName, name);
          context.$parent.dkxqShow = true;
        }, 20);
      });
      // 做地出让方案
      $("body").on("click", ".crfa_btn", function () {
        const glzd = $(this).attr("data-val");
        const name = $(this).attr("data-val2");

        // 延时等待组件初始化
        setTimeout(() => {
          context.$parent.$refs.crfaForm.getItem(glzd, name);
          context.$parent.crfaShow = true;
        }, 20);
      });
    },
    // 区划
    addChanyePlate() {
      if (!this.map) return;

      const that = this;
      return new Promise((resolve, reject) => {
        loadModules(["esri/layers/MapImageLayer"], OPTION).then(
          ([MapImageLayer]) => {
            const chanyePlate = new MapImageLayer({
              // url:
              //   "http://172.20.83.215:6080/arcgis/rest/services/WZZD/QHMB/MapServer",
              url:
                "https://wzdjdm.wzcitybrain.com:8888/erwei/arcgis/rest/services/WZZD/QHMB/MapServer",
              id: "chanyePlate",
              sublayers: [{ id: 3 }, { id: 2 }, { id: 1 }, { id: 0 }],
            });
            //  优先级置顶
            that.map.add(chanyePlate, 2);

            // 地块标注图层
            const dkImage = new MapImageLayer({
              // url:
              //   "http://172.20.83.215:6080/arcgis/rest/services/WZZD/WZZDDK/MapServer",
              url:
                "https://wzdjdm.wzcitybrain.com:8888/erwei/arcgis/rest/services/WZZD/WZZDDK/MapServer",
              sublayers: [{ id: 0 }],
              id: "dkImage",
              opacity: 1,
            });

            that.map.add(dkImage, 3);
            that.legend.layerInfos.push({
              title: "做地地块",
              layer: dkImage,
            });
            resolve(true);
          }
        );
      });
    },

    // 五色图切换
    changeChanyePlate() {
      if (!this.map) return;

      this.map.findLayerById("chanyePlate") &&
        (this.$parent.$refs.bottomBtn.xzqhTag = this.map.findLayerById(
          "chanyePlate"
        ).visible = !this.map.findLayerById("chanyePlate").visible);

      this.$parent.$refs.bottomBtn.xzqhTag;
    },

    // 预警地块
    yjdk(list, dkVal) {
      const item = {
        id: dkVal,
        url: "https://wzdjdm.wzcitybrain.com:8888/erwei/arcgis/rest/services/WZZD/WZZDDK/MapServer",
        // url:
        //   "http://172.20.83.215:6080/arcgis/rest/services/WZZD/WZZDDK/MapServer/1",
        // sublayers: "1"
      };

      const { url, id } = item;
      const that = this;
      return new Promise((resolve, reject) => {
        loadModules(
          ["esri/layers/FeatureLayer", "esri/layers/MapImageLayer"],
          OPTION
        ).then(([FeatureLayer, MapImageLayer]) => {
          const option = {
            url: url,
            id,
            definitionExpression: `GLZD in (${list})`,
            outFields: "*",
            opacity: 1,
            renderer: {
              type: "simple",
              symbol: {
                type: "picture-marker",
                url: `${server}/icon/wzzdtp/临时/${
                  dkVal == "yjdk" ? "预警" : "超时"
                }.png`,
                width: "22px",
                height: "22px",
              },
              label: dkVal == "yjdk" ? "预警" : "超时",
            },
          };

          const feature = new FeatureLayer(option);

          that.map.add(feature);

          that.legend.layerInfos.push({
            title: "",
            layer: feature,
          });

          resolve(true);
        });
      });
    },

    // 做地地块
    zddk() {
      if (!this.map) return;

      this.map.findLayerById("zddk") &&
        (this.$parent.$refs.bottomBtn.zddkTag = this.map.findLayerById(
          "zddk"
        ).visible = !this.map.findLayerById("zddk").visible);

      this.map.findLayerById("dkImage") &&
        (this.map.findLayerById("dkImage").visible = !this.map.findLayerById(
          "dkImage"
        ).visible);

      this.map.findLayerById("yjdk") &&
        (this.$parent.$refs.bottomBtn.zddkTag = this.map.findLayerById(
          "yjdk"
        ).visible = !this.map.findLayerById("yjdk").visible);

      this.map.findLayerById("csdk") &&
        (this.map.findLayerById("csdk").visible = !this.map.findLayerById(
          "csdk"
        ).visible);
    },

    // 拆改地块
    cgdk() {
      if (!this.map) return;

      const that = this;
      if (this.map.findLayerById("cgdk")) {
        this.$parent.$refs.bottomBtn.cgdkTag = this.map.findLayerById(
          "cgName"
        ).visible = this.map.findLayerById(
          "cgImage"
        ).visible = this.map.findLayerById(
          "cgdk"
        ).visible = !this.map.findLayerById("cgdk").visible;
      } else {
        const item = {
          id: "cgdk",
          url:
            "http://172.20.89.7:6082/arcgis/rest/services/lucheng/CZDK/MapServer",
          sublayers: "0",
        };

        const { url, id } = item;

        return new Promise((resolve, reject) => {
          loadModules(
            ["esri/layers/FeatureLayer", "esri/layers/MapImageLayer"],
            OPTION
          ).then(([FeatureLayer, MapImageLayer]) => {
            const option = {
              url: url + "/" + item.sublayers,
              id,
              outFields: "*",
              opacity: 0,
            };
            if (tipHash[id] && Hash[tipHash[id]]) {
              const _hash_ = Hash[tipHash[id]];
              option.popupTemplate = {
                content: `
                  <div class="dkTitle">地块基本信息</div>
                  <table class="esri-widget__table" summary="属性和值列表"><tbody>
                    ${_hash_
                      .map((k) => {
                        return `<tr>
                            <th class="esri-feature__field-header">${k.label}</th>
                            <td class="esri-feature__field-data">{${k.fieldName}}</td>
                          </tr>`;
                      })
                      .join("")}
                  </tbody></table>`,
              };
            }

            const feature = new FeatureLayer(option);
            that.map.add(feature, 4);

            const cgName = new MapImageLayer({
              url:
                "http://172.20.89.7:6082/arcgis/rest/services/lucheng/CZDK/MapServer",
              sublayers: [{ id: 1 }],
              id: "cgName",
              opacity: 1,
            });

            that.map.add(cgName, 3);

            const cgImage = new MapImageLayer({
              url:
                "http://172.20.89.7:6082/arcgis/rest/services/lucheng/CZDK/MapServer",
              sublayers: [{ id: 0 }],
              id: "cgImage",
              opacity: 1,
            });

            that.map.add(cgImage, 3);

            that.legend.layerInfos.push({
              title: "拆改地块",
              layer: cgImage,
            });

            that.$parent.$refs.bottomBtn.cgdkTag = true;
            resolve(true);
          });
        });
      }
    },

    // 影像图
    yxt() {
      if (!this.map) return;

      const that = this;
      if (this.map.findLayerById("img")) {
        this.$parent.$refs.bottomBtn.sltTag = this.map.findLayerById(
          "img"
        ).visible;
        this.$parent.$refs.bottomBtn.yxtTag = this.map.findLayerById(
          "img"
        ).visible = !this.map.findLayerById("img").visible;
      } else {
        return new Promise((resolve, reject) => {
          loadModules(["esri/layers/TileLayer"], OPTION).then(([TileLayer]) => {
            const imgLayer = new TileLayer({
              url:
                "https://services.wzmap.gov.cn/server/rest/services/TDT/YX_2019/MapServer",
              id: "img",
            });
            //  优先级置顶
            that.map.add(imgLayer, 1);
            that.legend.layerInfos.push({
              title: "2019年影像图",
              layer: imgLayer,
            });
            this.$parent.$refs.bottomBtn.yxtTag = true;
            this.$parent.$refs.bottomBtn.sltTag = false;
            resolve(true);
          });
        });
      }
    },

    // 矢量图
    slt() {
      if (!this.map) return;

      this.map.findLayerById("img") &&
        (this.map.findLayerById("img").visible = false);
      this.$parent.$refs.bottomBtn.sltTag = true;
      this.$parent.$refs.bottomBtn.yxtTag = false;
    },

    // 控规图
    kgt(option) {
      if (!this.map) return;

      const that = this;
      if (this.map.findLayerById("kg")) {
        this.$parent.$refs.bottomBtn.kgtTag = this.map.findLayerById(
          "kg"
        ).visible =
          option == null ? !this.map.findLayerById("kg").visible : true;
      } else {
        return new Promise((resolve, reject) => {
          loadModules(["esri/layers/MapImageLayer"], OPTION).then(
            ([MapImageLayer]) => {
              const mapImg = new MapImageLayer({
                // url:
                //   "http://172.20.83.215:6080/arcgis/rest/services/WZZD/KONGGUI/MapServer",
                // sublayers: [{ id: 0 }],
                url:
                  "https://wzdjdm.wzcitybrain.com:8888/erwei/arcgis/rest/services/WZZD/KONGGUI/MapServer",
                id: "kg",
              });
              //  优先级置顶
              that.map.add(mapImg, 2);
              that.$parent.$refs.bottomBtn.kgtTag = true;
              resolve(true);
            }
          );
        });
      }
    },

    // 添加做地地块
    addZDDKFeatures() {
      if (!this.map) return;

      const that = this;
      const item = {
        id: "zddk",
        // url:
        //   "http://172.20.83.215:6080/arcgis/rest/services/WZZD/WZZDDK/MapServer",
        url: "https://wzdjdm.wzcitybrain.com:8888/erwei/arcgis/rest/services/WZZD/WZZDDK/MapServer",
        sublayers: "0",
      };

      const { url, id } = item;

      return new Promise((resolve, reject) => {
        loadModules(["esri/layers/FeatureLayer"], OPTION).then(
          ([FeatureLayer]) => {
            const option = {
              url: url + "/" + item.sublayers,
              id,
              outFields: "*",
              opacity: 0,
              // capabilities: {
              //   query: {
              //     supportsGeometryProperties: true
              //   }
              // }
            };
            if (tipHash[id] && Hash[tipHash[id]]) {
              const _hash_ = Hash[tipHash[id]];
              option.popupTemplate = {
                content: `
                  <div class="dkTitle">地块基本信息</div>
                  <table class="esri-widget__table" summary="属性和值列表"><tbody>
                    ${_hash_
                      .map((k) => {
                        return `<tr>
                            <th class="esri-feature__field-header">${k.label}</th>
                            <td class="esri-feature__field-data">{${k.fieldName}}</td>
                          </tr>`;
                      })
                      .join("")}
                  </tbody></table>
                  <div class="bottomBtn2 dk_btn" data-val="{glzd}" data-val2="{zdxq}" data-val3="{dkmc}">查看详情</div>
                  <div class="bottomBtn3 crfa_btn" data-val="{glzd}" data-val2="{dkmc}">做地方案</div>`,
              };
            }

            const feature = new FeatureLayer(option);
            that.map.add(feature, 4);
            resolve(true);
          }
        );
      });
    },

    // 定位
    goloaction({ id, attributes, geometry, fieldAliases }) {
      const that = this;

      let x = geometry.centroid.x,
        y = geometry.centroid.y;

      that.view.goTo({
        center: [x, y + 0.0025],
        zoom: 17,
      });

      // 显示地块面
      if (
        that.$parent.$refs.leftOptions.dkType == 0 &&
        !that.$parent.$refs.bottomBtn.zddkTag
      ) {
        that.zddk();
      } else if (
        that.$parent.$refs.leftOptions.dkType == 1 &&
        !that.$parent.$refs.bottomBtn.cgdkTag
      ) {
        that.cgdk();
      }

      if (tipHash[id] && Hash[tipHash[id]]) {
        const _hash_ = Hash[tipHash[id]];
        that.view.popup = {
          title: "",
          content: `
            <div class="dkTitle">地块基本信息</div>
            <table class="esri-widget__table" summary="属性和值列表"><tbody>
              ${_hash_
                .map((k) => {
                  return `<tr>
                    <th class="esri-feature__field-header">${k.label}</th>
                    <td class="esri-feature__field-data">${
                      attributes[k.fieldName] || ""
                    }</td>
                  </tr>`;
                })
                .join("")}
            </tbody></table>
            ${
              id == "zddk"
                ? `<div class="bottomBtn2 dk_btn" data-val="${attributes.glzd}" data-val2="${attributes.zdxq}" data-val3="${attributes.dkmc}">查看详情</div>
                  <div class="bottomBtn3 crfa_btn" data-val="${attributes.glzd}" data-val2="${attributes.dkmc}">做地方案</div>`
                : ``
            }`,
          location: [x, y],
        };
      }
      that.view.popup.alignment = "top-center";
      that.view.popup.visible = true;
    },

    // 街道区划高亮
    addBlank(label) {
      if (!label) return;
      this.view.graphics.removeAll();
      const that = this;

      // 显示做地地块
      if (!that.$parent.$refs.bottomBtn.zddkTag) {
        that.zddk();
      }

      loadModules(
        ["esri/tasks/QueryTask", "esri/tasks/support/Query", "esri/Graphic"],
        OPTION
      ).then(([QueryTask, Query, Graphic]) => {
        const queryTask = new QueryTask({
          url:
            "http://172.20.89.7:6082/arcgis/rest/services/lucheng/xzjd_ws/MapServer/0",
        });
        const query = new Query();
        query.outFields = ["*"];
        query.where = `${label ? `名称 = '${label}'` : `名称 = ''`}`;
        query.returnGeometry = true;
        queryTask.execute(query).then((response) => {
          if (response.features.length) {
            const geometry = response.features[0].geometry;
            const fillSymbol = {
              type: "simple-fill",
              color: [21, 249, 253, 0],
              outline: {
                color: [21, 249, 253],
                width: 4,
              },
            };
            const polygonGraphic = new Graphic({
              geometry,
              symbol: fillSymbol,
            });
            that.view.graphics.add(polygonGraphic);
            that.kgt("show");
            let _x = geometry.centroid.x;
            let _y = geometry.centroid.y;
            that.view.goTo({
              center: ~["双屿街道"].indexOf(label)
                ? [_x + 0.012, _y + 0.005]
                : ~["五马街道"].indexOf(label)
                ? [_x + 0.009, _y - 0.005]
                : ~["南郊街道"].indexOf(label)
                ? [_x + 0.002, _y + 0.003]
                : ~["滨江街道"].indexOf(label)
                ? [_x + 0.004, _y]
                : ~["七都街道"].indexOf(label)
                ? [_x - 0.003, _y + 0.003]
                : ~["蒲鞋市街道"].indexOf(label)
                ? [_x - 0.012, _y]
                : ~["仰义街道"].indexOf(label)
                ? [_x - 0.012, _y - 0.004]
                : ~["藤桥镇"].indexOf(label)
                ? [_x + 0.053, _y + 0.013]
                : ~["南汇街道"].indexOf(label)
                ? [_x - 0.009, _y - 0.003]
                : [_x, _y],
              zoom: ~[
                "双屿街道",
                "仰义街道",
                "大南街道",
                "五马街道",
                "南郊街道",
                "滨江街道",
                "七都街道",
              ].indexOf(label)
                ? 16
                : ~["广化街道", "松台街道", "蒲鞋市街道"].indexOf(label)
                ? 17
                : ~["藤桥镇", "南汇街道"].indexOf(label)
                ? 18
                : 15,
            });
          }
        });
      });
    },

    // 筛选地块
    filterBlock(list) {
      this.map
        .findLayerById("dkImage")
        .findSublayerById(0).definitionExpression = `glzd in (${list})`;

      this.map.findLayerById("zddk").definitionExpression = `glzd in (${list})`;

      const yjList = this.$parent.$refs.warning.yjdkList.filter(
        (item) => ~list.indexOf(item)
      );

      const csList = this.$parent.$refs.warning.csdkList.filter(
        (item) => ~list.indexOf(item)
      );

      this.map.findLayerById("yjdk") &&
        (!yjList.length
          ? (this.map.findLayerById(
              "yjdk"
            ).definitionExpression = `GLZD in ('')`)
          : (this.map.findLayerById(
              "yjdk"
            ).definitionExpression = `GLZD in (${yjList})`));

      this.map.findLayerById("csdk") &&
        (!csList.length
          ? (this.map.findLayerById(
              "csdk"
            ).definitionExpression = `GLZD in ('')`)
          : (this.map.findLayerById(
              "csdk"
            ).definitionExpression = `GLZD in (${csList})`));
    },

    // 图层切换
    layerToggle(option) {
      if (this.map && this.map.findLayerById(option.id)) {
        this.map.findLayerById(option.id).visible = !this.map.findLayerById(
          option.id
        ).visible;

        option.tag &&
          (this.$parent.$refs.bottomBtn[option.tag] = this.map.findLayerById(
            option.id
          ).visible);
      } else {
        this.map && this.addMapImageLayer(option);
      }
    },

    // 新增mapImageLayer图层
    addMapImageLayer(option) {
      const that = this;

      return new Promise((resolve, reject) => {
        loadModules(["esri/layers/MapImageLayer"], OPTION).then(
          ([MapImageLayer]) => {
            const prop = { url: option.url };

            // id
            option.id && (prop.id = option.id);

            // 子图层
            option.sublayers &&
              option.sublayers
                .sort((a, b) => b - a)
                .map((id) => {
                  Array.isArray(prop.sublayers)
                    ? prop.sublayers.push({ id })
                    : (prop.sublayers = [{ id }]);
                });

            const layer = new MapImageLayer(prop);
            //  图层顺序
            option.order
              ? that.map.add(layer, option.order)
              : that.map.add(layer, 6);

            // 图例
            option.legend &&
              that.legend.layerInfos.push({
                title: option.legend,
                layer,
              });

            // 按钮控制
            option.tag && (that.$parent.$refs.bottomBtn[option.tag] = true);
            resolve(true);
          }
        );
      });
    },
  },
};
</script>
 <style scoped lang="less">
.Map {
  width: 100%;
  height: 100%;
  .arcgisMap {
    width: 100%;
    height: 100%;
  }
}
</style>