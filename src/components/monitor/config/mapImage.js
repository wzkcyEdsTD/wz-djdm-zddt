export const mapImageLayerList = {
    gdjt: {
        url: "https://wzdjdm.wzcitybrain.com:8888/erwei/arcgis/rest/services/WZZD/GDJT/MapServer",
        sublayers: [0],
        order: 2,
        id: "gdjt",
        legend: "轨道交通",
        tag: "gdjtTag"
    },
    ylzy: {
        url: "https://wzdjdm.wzcitybrain.com:8888/erwei/arcgis/rest/services/WZZD/POI/MapServer",
        sublayers: [0],
        order: 2,
        id: "ylzy",
        legend: "医疗资源",
        tag: "ylzyTag"
    },
    jyzy: {
        url: "https://wzdjdm.wzcitybrain.com:8888/erwei/arcgis/rest/services/WZZD/POI/MapServer",
        sublayers: [1],
        order: 2,
        id: "jyzy",
        legend: "教育资源",
        tag: "jyzyTag"
    }
}