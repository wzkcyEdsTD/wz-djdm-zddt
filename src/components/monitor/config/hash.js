export const tipHash = {
    gh1: "dkHash",
    zddk: "zddkHash",
    cgdk: "cgdkHash"

}


// 做地地块
const zddkHash = [{
    fieldName: "dkmc",
    label: "地块名称"
}, {
    fieldName: "qkmc",
    label: "区块名称"
}, {
    fieldName: "ssjd",
    label: "所属街道"
}, {
    fieldName: "crqk",
    label: "地块状态"
}, {
    fieldName: "zdwcsx",
    label: "做地完成时限"
}, {
    fieldName: "tdyt",
    label: "土地用途"
}, {
    fieldName: "tdmj",
    label: "土地面积_亩"
}, {
    fieldName: "jzmj",
    label: "建筑面积_平方米"
}, {
    fieldName: "jzyt",
    label: "建筑用途"
}, {
    fieldName: "rjl",
    label: "容积率"
}, {
    fieldName: "zrdw",
    label: "责任单位"
}, {
    fieldName: "jddwmgs",
    label: "竞得单位母公司"
}, {
    fieldName: "qsj",
    label: "起始价_万元"
}, {
    fieldName: "qslmj",
    label: "起始楼面价_元每平米"
}, {
    fieldName: "cjj",
    label: "成交价_万元"
}, {
    fieldName: "cjlmj",
    label: "成交楼面价_元每平方米"
}, {
    fieldName: "ptyfmj",
    label: "配套用房面积_平方米"
}, {
    fieldName: "yjl",
    label: "溢价率"
}]


// 拆改地块
const cgdkHash = [{
    fieldName: "Expr1",
    label: "项目名称"
}, {
    fieldName: "xmdz",
    label: "项目地址"
}, {
    fieldName: "jd",
    label: "街道"
}, {
    fieldName: "szxq",
    label: "涉及小区"
}, {
    fieldName: "zdmj",
    label: "占地面积"
}, {
    fieldName: "hs",
    label: "户数"
}, {
    fieldName: "jfmj",
    label: "旧房面积"
}, {
    fieldName: "jhmb",
    label: "2020计划目标"
}, {
    fieldName: "qj_zdwcsx",
    label: "区级做地完成时限"
}, {
    fieldName: "zcdate",
    label: "征迁计划完成时间"
}, {
    fieldName: "xmdj",
    label: "项目等级"
}, {
    fieldName: "jjxy",
    label: "经济效益"
}, {
    fieldName: "rzyx",
    label: "日照影响"
}, {
    fieldName: "bdql",
    label: "拔钉清零"
}, {
    fieldName: "lsyl",
    label: "历史遗留"
}, {
    fieldName: "wfzl",
    label: "危房治理"
}, {
    fieldName: "bz",
    label: "备注"
}]

// 区域排序
export const countryHash = {
    鹿城区: 0,
    龙湾区: 1,
    瓯海区: 2,
    瓯江口产业集聚区: 3,
    浙南产业集聚区: 4
}

// 土地用途
export const typeHash = {
    住宅: {
        color: '#ffff00',
        shortname: '住宅'
    },
    商服: {
        color: '#ff0000',
        shortname: '商服'
    },
    商住: {
        color: '#ff7f00',
        shortname: '商住'
    },
    医疗卫生: {
        color: '#ffbf00',
        shortname: '医疗'
    },
    教育: {
        color: '#ff9f7f',
        shortname: '教育'
    },
    公园绿地: {
        color: '#009900',
        shortname: '公园'
    },
    社会福利: {
        color: '#ff7f9f',
        shortname: '社会'
    },
    体育: {
        color: '#cc66cc',
        shortname: '体育'
    }
}

// 做地状态颜色
export const dkColorHash = {
    做地中: '#D3382B',
    已出让: '#4AB73D',
    待出让: '#FFC221'
}


// 搜索字段
export const fieldsHash = {
    0: [
        "dkmc",
        "qkmc",
        "ssjd",
        "crqk",
        "zdwcsx",
        "tdyt",
        "tdmj",
        "jzmj",
        "jzyt",
        "rjl",
        "zrdw",
        "jddwmgs",
        "qsj",
        "qslmj",
        "cjj",
        "cjlmj",
        "ptyfmj",
        "yjl"
    ],
    1: [
        "Expr1",
        "xmdz",
        "jd",
        "szxq",
        "zdmj",
        "jhmb",
        "qj_zdwcsx",
        "zcdate",
        "xmdj",
        "bz",
        "jjxy",
        "rzyx",
        "bdql",
        "lsyl",
        "wfzl",
        "jfmj"
    ]
}


// 责任单位排序
export const zrdwHash = {
    鹿城区政府: 0,
    龙湾区政府: 1,
    瓯海区政府: 2,
    浙南产业集聚区管委会: 3,
    瓯江口产业集聚区管委会: 4,
    生态园管委会: 5,
    浙南科技城管委会: 6,
    市城发集团: 7,
    市铁投集团: 8,
    市工业与能源集团: 9,
    市现代集团: 10
}


export const Hash = {
    zddkHash,
    cgdkHash
}