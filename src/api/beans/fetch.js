import {
  getDefaultAxios
} from "@/api/index.js";
const RES = "sql_djdmzd";

/**
 * [lc_zdjzxx]做地进展信息
 */
export const lc_zdjzxx = async () => {
  const axios = getDefaultAxios();
  const params = [
    "Id",
    "DKMC",
    "TDZSZJS1",
    "JTYY1",
    "ZRR1",
    "SJJD1",
    "TDSYQ2",
    "JTYY2",
    "ZRR2",
    "SJJD2",
    "JZW3",
    "JTYY3",
    "ZRR3",
    "SJJD3",
    "TDZ4",
    "JTYY4",
    "ZRR4",
    "SJJD4",
    "GX5",
    "JTYY5",
    "ZRR5",
    "SJJD5",
    'DBFZW6',
    "JTYY6",
    "ZRR6",
    "SJJD6",
    "TDWR7",
    "JTYY7",
    "ZRR7",
    "SJJD7",
    "CD8",
    "JTYY8",
    "ZRR8",
    "SJJD8",
    "SY9",
    "JTYY9",
    "ZRR9",
    "SJJD9",
    "WQFY10",
    "JTYY10",
    "ZRR10",
    "SJJD10",
    "TDSC11",
    "JTYY11",
    "ZRR11",
    "SJJD11",
    "GP12",
    "JTYY12",
    "ZRR12",
    "SJJD12",
    "QT",
    "JTYY13",
    "ZRR13",
    "SJJD13",
    "SFZDWC",
    "ZDWCSJ",
    "ZYCZWT",
    "SSJD",
    "JDJBR",
    "JDFZR",
    "GLZD",
    "ZDWCSX"
  ]
  const name = "lc_zdjzb";
  return await axios.post("/dw/ds", option_concat(name, params));
}

/**
 * [lc_dkjbxx]地块基本信息
 */
export const lc_dkjbxx = async () => {
  const axios = getDefaultAxios();
  const params = [
    "Id",
    "SSJD",
    "DKDJ",
    "DKLX",
    "QKMC",
    "DKBH",
    "DKMC",
    "TDYT",
    "TDMJ",
    "JZMJ",
    "JZYT",
    "RJL",
    "QSJ",
    "QSLMJ",
    "CJJ",
    "PTYFMJ",
    "CJLMJ",
    "YJL",
    "JDDWMGS",
    "ZDWCSJ",
    "JHCRJE",
    "SHJCJE",
    "WTXX",
    "WTXKQD",
    "ZDXQ",
    "QKYS",
    "ZRDW",
    "ZRR",
    "ZRRLXFS",
    "CRQK",
    "GLZD",
    "ZDWCSX",
    "CRCJSJ",
    "SSQY"
  ]
  const name = "lc_dkjbxxb";
  return await axios.post("/dw/ds", option_concat(name, params));
}

/**
 * [lc_zdzbsj]做地专班数据
 */
export const lc_zdzbsj = async () => {
  const axios = getDefaultAxios();
  const params = ["id", "dkmc", "zy_xm", "zy_zw", "zy_lxfs", "fg_xm", "fg_zw", "fg_lxfs", "ks_xm", "ks_zw", "ks_lxfs", "dk_xm", "dk_zw", "dk_lxfs", "glzd"]
  const name = "lc_zdzbsjb";
  return await axios.post("/dw/ds", option_concat(name, params));
}

/**
 * [lc_zdfasj]做地方案数据
 */
export const lc_zdfasj = async () => {
  const axios = getDefaultAxios();
  const params = ["id", "dkmc", "gznr1", "zrks1", "date1", "gznr2", "zrks2", "date2", "gznr3", "zrks3", "date3", "gznr4", "zrks4", "date4", "gznr5", "zrks5", "date5", "wczt1", "sjwcsj1", "wczt2", "sjwcsj2", "wczt3", "sjwcsj3", "wczt4", "sjwcsj4", "wczt5", "sjwcsj5", "glzd"]
  const name = "lc_zdfasjb";
  return await axios.post("/dw/ds", option_concat(name, params));
}

/**
 * 配置
 * @param {*} name 
 * @param {*} cols 
 * @param {*} where 
 * @param {*} count 
 */
const option_concat = (name, cols, where = "", count) => {
  const option = {
    module: "dwbean",
    action: "001",
    res: RES,
    ds: {
      buffers: [],
      tables: [{
        alias: "f",
        orm: "",
        name,
        updateflag: 1
      }],
      cols: cols.map(item => {
        return {
          name: item,
          raw: `f.${item}`
        }
      }),
      module: RES,
      where,
    }
  };
  count && (option.count = count);
  return option;
}