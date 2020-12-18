<template>
  <div class="leftMultiSelect">
    <div class="topic">
      <header>
        <span>地块清单</span>
        <input type="text" v-model="word" placeholder="请输入..." @keyup.enter="filterItem()" />
        <button @click="filterItem()">搜索</button>
      </header>
      <!-- 下拉菜单 -->
      <div v-if="dkType == 0" id="selClass">
        <el-select v-model="selectVal" filterable placeholder="请选择">
          <el-option
            v-for="item in selectOpt"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </div>
      <!-- 专题 -->
      <div class="switch">
        <template v-if="dkType == 0">
          <span :class="{active: tabIndex == 0}" @click="()=>{ tabIndex = 0 }">区划专题</span>
          <i>/</i>
          <span :class="{active: tabIndex == 1}" @click="()=>{ tabIndex = 1 }">权属专题</span>
          <i>/</i>
          <span :class="{active: tabIndex == 2}" @click="()=>{ tabIndex = 2 }">时限专题</span>
        </template>
        <template v-else-if="dkType == 1">
          <span class="active">街道专题</span>
        </template>
      </div>

      <!-- Frame -->
      <div v-if="tabIndex == 0 && dkType == 0" class="qhFrame">
        <div v-for="(item,index) in activeOpt" :key="index">
          <div @click="toggleTreeQH(item.label,index)">
            {{ item.label }} ({{ item.num }}宗)
            <div>
              <i :class="`iconfont ${item.show?`iconRectangleCopy7`:`iconRectangleCopy4`}`"></i>
            </div>
          </div>
          <div v-show="item.show" v-for="(oitem, oindex) in item.children" :key="oindex">
            <div class="jdName" @click="toggleTreeQH2(oitem.label,oindex,index)">
              {{ ++oindex }}. {{ oitem.label }} ({{ oitem.children.length }}宗)
              <div>
                <i :class="`iconfont ${oitem.show?`iconRectangleCopy7`:`iconRectangleCopy4`}`"></i>
              </div>
            </div>
            <ul>
              <li
                v-show="oitem.show"
                v-for="(xitem,xindex) in oitem.children"
                :key="xindex"
                @click="ShowResult(xitem,item)"
              >
                <p>{{ oindex }}-{{ ++xindex }}. {{ xitem.name }}</p>
                <div>
                  <span
                    :style="{ color: typeHash[xitem.yt].color }"
                  >{{ typeHash[xitem.yt].shortname }}</span>
                  <span :style="{ color: dkColorHash[xitem.type] }">{{ xitem.type }}</span>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div
        v-else
        class="selectFrame no_select"
        :style="{height: dkType == 0 ? 'calc(100% - 150px)' : 'calc(100% - 110px)'}"
      >
        <div v-for="(item,index) in activeOpt2" :key="index">
          <div @click="toggleTree(item.label,index)">
            {{ item.label }} ({{ item.children.length }}宗)
            <div>
              <i :class="`iconfont ${item.show?`iconRectangleCopy7`:`iconRectangleCopy4`}`"></i>
            </div>
          </div>
          <ul v-show="item.show">
            <li
              v-for="(oitem,oindex) in item.children"
              :key="oindex"
              @click="ShowResult(oitem,item)"
            >
              <p
                :style="{ width: dkType == 0 ? 67 + '%' : 100 + '%' }"
              >{{ ++oindex }}. {{ oitem.name }}</p>
              <div v-if="dkType == 0">
                <span
                  :style="{ color: typeHash[oitem.yt].color }"
                >{{ typeHash[oitem.yt].shortname }}</span>
                <span :style="{ color: dkColorHash[oitem.type] }">{{ oitem.type }}</span>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
import { loadModules } from "esri-loader";
import { WRT_config, OPTION } from "@/components/common/Tmap";
import {
  countryHash,
  typeHash,
  dkColorHash,
  fieldsHash,
  zrdwHash
} from "../config/hash";
export default {
  name: "leftMultiSelect",
  data() {
    return {
      countryHash,
      typeHash,
      dkColorHash,
      fieldsHash,
      zrdwHash,
      dkType: 0,
      tabIndex: 0,
      word: "",

      selectOpt: [],
      selectVal: "全部",

      qhOptions: [],
      qsOptions: [],
      sxOptions: [],
      cgOptions: [],

      activeOpt: [],
      activeOpt2: [],

      qhTmpOpt: [],
      qsTmpOpt: [],
      sxTmpOpt: []
    };
  },
  created() {
    this.listLoading();
  },
  methods: {
    // 清单加载
    listLoading() {
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

        // 区划
        const qhObj = {};
        const qhArr = [];

        // 权属、时限
        const qsObj = {};
        const sxObj = {};

        const qsArr = [];
        const sxArr = [];

        list.map(({ attributes, geometry, fieldAliases }) => {
          const {
            GLZD,
            dkmc,
            crqk,
            ssqy,
            ssjd,
            tdyt,
            zrdw,
            zdwcsx
          } = attributes;
          if (!ssqy && !ssjd) return false;
          if (!qhObj[ssqy]) {
            qhObj[ssqy] = {
              label: ssqy,
              children: {},
              show: false
            };
          }
          !qhObj[ssqy].children[ssjd] &&
            (qhObj[ssqy].children[ssjd] = {
              label: ssjd,
              children: [],
              show: false
            });

          qhObj[ssqy].children[ssjd].children.push({
            id: "zddk",
            name: dkmc,
            type: crqk,
            yt: tdyt && tdyt.replace("用地", ""),
            attributes,
            geometry,
            fieldAliases
          });

          if (!zrdw) return false;
          const fixzrdw = zrdw.split("/")[0];
          if (!qsObj[fixzrdw]) {
            qsObj[fixzrdw] = {
              label: fixzrdw,
              children: [],
              show: false
            };
          }

          qsObj[fixzrdw].children.push({
            id: "zddk",
            name: dkmc,
            type: crqk,
            yt: tdyt && tdyt.replace("用地", ""),
            attributes,
            geometry,
            fieldAliases
          });

          if (!zdwcsx) return false;
          let wcsx = null;
          if (zdwcsx != null) {
            wcsx = zdwcsx.split(" ")[0];
            wcsx = wcsx
              .replace("年", "-")
              .replace("月", "-")
              .replace("日", "");
          }

          const [wcsx_y, wcsx_m] =
            wcsx == null ? [null, null] : wcsx.split("-");

          const fixzdwcsx = !isNaN(Number(wcsx_m))
            ? `${Number(wcsx_y)}年${Number(wcsx_m)}月`
            : `/`;

          if (!sxObj[fixzdwcsx]) {
            sxObj[fixzdwcsx] = {
              label: fixzdwcsx,
              children: [],
              show: false
            };
          }

          sxObj[fixzdwcsx].children.push({
            id: "zddk",
            name: dkmc,
            type: crqk,
            yt: tdyt && tdyt.replace("用地", ""),
            attributes,
            geometry,
            fieldAliases
          });
        });

        for (let k in qhObj) {
          qhArr.push(qhObj[k]);
        }

        qhArr.map((item, index) => {
          const _children = [];
          for (let k in item.children) {
            _children.push(item.children[k]);
          }
          item.children = _children;
        });

        qhArr
          .sort((a, b) => this.countryHash[a.label] - this.countryHash[b.label])
          .map(item => {
            let qhSum = 0;
            if (item.children.length) {
              item.children.map((_item, _index) => {
                if (_item.children.length) {
                  _item.children.sort((a, b) => (a.name > b.name ? 1 : -1));
                  qhSum += _item.children.length;
                }
              });
            }
            item.num = qhSum;
          });

        this.activeOpt = qhArr;

        this.qhOptions = this.qhTmpOpt = qhArr;

        for (let k in qsObj) {
          qsArr.push(qsObj[k]);
        }

        qsArr
          .sort((a, b) => this.zrdwHash[a.label] - this.zrdwHash[b.label])
          .map(item => {
            if (item.children.length) {
              item.children.sort((a, b) => {
                return a.name > b.name ? 1 : -1;
              });
            }
          });

        for (let k in sxObj) {
          sxArr.push(sxObj[k]);
        }

        sxArr
          .sort((a, b) => {
            if (b.label == "/") return -1;
            if (a.label == "/") return 1;

            const date_y_a = a.label.slice(0, a.label.indexOf("年"));
            const date_m_a = a.label.slice(
              a.label.indexOf("年") + 1,
              a.label.indexOf("月")
            );

            const date_a = Number(
              date_y_a.concat(Number(date_m_a) < 10 ? `0${date_m_a}` : date_m_a)
            );

            const date_y_b = b.label.slice(0, b.label.indexOf("年"));
            const date_m_b = b.label.slice(
              b.label.indexOf("年") + 1,
              b.label.indexOf("月")
            );

            const date_b = Number(
              date_y_b.concat(Number(date_m_b) < 10 ? `0${date_m_b}` : date_m_b)
            );

            return date_a - date_b;
          })
          .map(item => {
            if (item.children.length) {
              item.children.sort((a, b) => {
                return a.name > b.name ? 1 : -1;
              });
            }
          });

        this.activeOpt2 = qsArr;

        this.qsOptions = this.qsTmpOpt = qsArr;

        this.selectOpt = [
          {
            value: "全部",
            label: "全部"
          }
        ];

        qsArr.map(({ label }) => {
          const name = label;

          this.selectOpt.push({
            value: name,
            label: name
          });
        });

        this.sxOptions = this.sxTmpOpt = sxArr;
      });
    },

    // 搜索
    filterItem() {
      const tag = this.word;

      if (this.dkType == 1 || this.tabIndex != 0) {
        const tagOptions =
          this.dkType == 1
            ? this.cgOptions
            : this.tabIndex == 1
            ? this.qsTmpOpt
            : this.sxTmpOpt;

        const fieldsList = this.fieldsHash[this.dkType];

        this.activeOpt2 = this.singleFilter(tagOptions, fieldsList, tag);
      } else {
        this.activeOpt = this.multFilter(
          this.qhTmpOpt,
          this.fieldsHash[this.dkType],
          tag
        );
      }
    },

    // 筛选
    filterList(label) {
      const tag = label;

      if (tag == "全部") {
        this.activeOpt = this.qhTmpOpt = this.qhOptions;

        this.qsTmpOpt = this.qsOptions;
        this.sxTmpOpt = this.sxOptions;

        this.activeOpt2 = this.tabIndex == 1 ? this.qsTmpOpt : this.sxTmpOpt;
      } else {
        this.activeOpt = this.qhTmpOpt = this.multFilter(
          this.qhOptions,
          "zrdw",
          tag
        );

        this.qsTmpOpt = this.singleFilter(this.qsOptions, "zrdw", tag);
        this.sxTmpOpt = this.singleFilter(this.sxOptions, "zrdw", tag);

        this.activeOpt2 = this.tabIndex == 1 ? this.qsTmpOpt : this.sxTmpOpt;
      }
    },

    // 多级列表筛选
    multFilter(opt, fields, tag) {
      const sObj = {};
      const sArr = [];

      opt.map(item => {
        const childList = {};

        item.children &&
          item.children.map(_item => {
            const _childList = [];

            _item.children.map(o => {
              if (!Array.isArray(fields)) {
                if (
                  o.attributes[fields] &&
                  ~o.attributes[fields].split("/")[0].indexOf(tag)
                ) {
                  _childList.push(o);
                }
              } else {
                for (let i in fields) {
                  const k = fields[i];
                  if (o.attributes[k] && ~o.attributes[k].indexOf(tag)) {
                    _childList.push(o);
                    break;
                  }
                }
              }
            });

            _childList.length &&
              (childList[_item.label] = {
                label: _item.label,
                children: _childList,
                show: false
              });
          });

        if (Object.keys(childList).length) {
          sObj[item.label] = {
            label: item.label,
            children: childList,
            show: false
          };
        }
      });

      for (let k in sObj) {
        sArr.push(sObj[k]);
      }

      sArr.map((item, index) => {
        const _children = [];
        for (let k in item.children) {
          _children.push(item.children[k]);
        }
        item.children = _children;
      });

      sArr
        .sort((a, b) => this.countryHash[a.label] - this.countryHash[b.label])
        .map(item => {
          let qhSum = 0;
          if (item.children.length) {
            item.children.map((_item, _index) => {
              if (_item.children.length) {
                _item.children.sort((a, b) => (a.name > b.name ? 1 : -1));

                qhSum += _item.children.length;
              }
            });
          }
          item.num = qhSum;
        });

      return sArr;
    },

    // 单级列表筛选
    singleFilter(opt, fields, tag) {
      const sObj = {};
      const sArr = [];

      opt.map(item => {
        const childList = [];

        item.children &&
          item.children.map(o => {
            if (!Array.isArray(fields)) {
              if (
                o.attributes[fields] &&
                ~o.attributes[fields].split("/")[0].indexOf(tag)
              ) {
                childList.push(o);
              }
            } else {
              for (let i in fields) {
                const k = fields[i];
                if (o.attributes[k] && ~o.attributes[k].indexOf(tag)) {
                  childList.push(o);
                  break;
                }
              }
            }
          });

        if (childList.length) {
          sObj[item.label] = {
            label: item.label,
            children: childList,
            tabIndex: 0,
            show: false
          };
        }
      });

      for (let k in sObj) {
        sArr.push(sObj[k]);
      }

      return sArr;
    },

    // 区划级联
    toggleTreeQH(label, index) {
      for (let v in this.activeOpt) {
        if (this.activeOpt[v].label == label) {
          this.activeOpt[v].show = !this.activeOpt[v].show;
          for (let s in this.activeOpt[v].children) {
            this.activeOpt[v].children[s].show = false;
          }
        }
      }
    },

    toggleTreeQH2(label, index, parent) {
      for (let s in this.activeOpt[parent].children) {
        if (this.activeOpt[parent].children[s].label == label) {
          this.activeOpt[parent].children[s].show = !this.activeOpt[parent]
            .children[s].show;
        }
      }
    },

    // 级联
    toggleTree(label, index) {
      for (let v in this.activeOpt2) {
        if (this.activeOpt2[v].label == label) {
          this.activeOpt2[v].show = !this.activeOpt2[v].show;
        }
      }
    },

    stop(e) {
      e.stopPropagation();
    },

    // 定位详情
    ShowResult(oitem, item) {
      this.$parent.$refs.monitorArcgis.goloaction(oitem);

      if (this.dkType == 0) {
        const glzd = oitem.attributes.glzd;
        const imgName = oitem.attributes.zdxq;
        const name = oitem.attributes.dkmc;

        this.$parent.rightHidden();
        this.$parent.$refs.dkxqForm.getItem(glzd, imgName, name);
        this.$parent.dkxqShow = true;
      }
    },

    // 街道做地分布图
    switchChar(label) {
      // console.log("label", label);
      // this.$parent.$refs.monitorArcgis.addBlank(name);
      this.$parent.$refs.topDate.filterItem(label);

      const list = [];

      this.qsTmpOpt.map(opt => {
        opt.children.map(item => {
          list.push(item.attributes.glzd);
        });
      });

      const fixList = list.map(item => `'${item}'`);
      this.$parent.$refs.monitorArcgis.filterBlock(fixList);
    },

    // 地块清单切换
    dkListChange(type) {
      this.dkType = type;
      this.$parent.$refs.bottomBtn.clean();
      this.word = "";

      this.$parent.rightHidden();
      this.$parent.toggle2();
      this.$parent.dkxqShow = false;

      // 视角重新定位
      type == 0
        ? this.$parent.$refs.monitorArcgis.view.goTo({
            center: [120.67819448808013, 27.99095289562555],
            zoom: 12
          })
        : this.$parent.$refs.monitorArcgis.view.goTo({
            center: [120.67819448808013, 28.039695289562555],
            zoom: 13
          });

      if (type == 0) {
        this.tabIndex = 0;
        this.selectVal = "全部";
        this.activeOpt = this.qhOptions;
        this.$parent.$refs.bottomBtn.zddk();
        this.$parent.$refs.bottomBtn.xzqh();
      } else if (type == 1) {
        this.$parent.$refs.bottomBtn.cgdk();

        if (this.cgOptions.length) {
          this.activeOpt2 = this.cgOptions;
        } else {
          loadModules(
            ["esri/tasks/QueryTask", "esri/tasks/support/Query"],
            OPTION
          ).then(async ([QueryTask, Query]) => {
            const queryTask = new QueryTask({
              url: `http://172.20.89.7:6082/arcgis/rest/services/lucheng/CZDK/MapServer/0`
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

            const cgObj = {};

            const cgArr = [];

            list.map(({ attributes, geometry, fieldAliases }) => {
              const { Expr1, jd } = attributes;

              if (!jd) return false;
              if (!cgObj[jd]) {
                cgObj[jd] = {
                  label: jd,
                  children: [],
                  show: false
                };
              }
              cgObj[jd].children.push({
                id: "cgdk",
                name: Expr1,
                attributes,
                geometry,
                fieldAliases
              });
            });

            for (let k in cgObj) {
              cgArr.push(cgObj[k]);
            }

            cgArr.map(item => {
              if (item.children.length) {
                item.children.sort((a, b) => {
                  return a.name > b.name ? 1 : -1;
                });
              }
            });

            this.activeOpt2 = this.cgOptions = cgArr;
          });
        }
      }
    }
  },
  watch: {
    selectVal(n, o) {
      this.filterList(n);

      this.filterItem();

      this.switchChar(n);
    },
    tabIndex() {
      const index = this.tabIndex;

      this.activeOpt = this.qhTmpOpt;
      this.activeOpt2 = index == 1 ? this.qsTmpOpt : this.sxTmpOpt;

      this.filterItem();
    }
  }
};
</script>
<style scoped lang="less">
@import url("../../common/_iconfont/iconfont.css");
@import url("./leftMultiSelect.less");
</style>