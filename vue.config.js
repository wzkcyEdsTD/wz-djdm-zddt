/**
 * vue.config
 * created by eds 2019/8/22
 */
module.exports = {
  //  打包静态文件访问相对路径设置
  publicPath: "./",
  assetsDir: "libs",
  devServer: {
    proxy: {
      //配置跨域
      "/api": {
        // target: "http://172.20.89.88:5001/api",
        target: "https://wzdjdm.wzcitybrain.com:8888/api",
        //target: "https://wzdjdm.wzcitybrain.com:8888/api",
        changOrigin: true,
        pathRewrite: {
          "^/api": ""
        }
      }
    }
  },
  chainWebpack: (config) => {
    /* 添加分析工具*/
    if (process.env.NODE_ENV === 'production') {
      if (process.env.npm_config_report) {
        config
          .plugin('webpack-bundle-analyzer')
          .use(require('webpack-bundle-analyzer').BundleAnalyzerPlugin)
          .end();
        config.plugins.delete('prefetch')
      }
    }
  }
};