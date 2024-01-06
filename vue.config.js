const { defineConfig } = require('@vue/cli-service');
const path = require('path');

const resolve = (dir) => {
  console.log(dir);
  return path.join(__dirname, dir);
};

module.exports = defineConfig({
  transpileDependencies: true,
  pluginOptions: {
    'style-resources-loader': {
      preProcessor: 'less',
      patterns: [
        // 这里是你自己放公共样式的路径
        // __dirname 是当前文件的路径
        path.resolve(__dirname, './src/assets/styles/base.less'),
      ],
    },
  },
  // outputDir: "bigScreen",
  // publicPath: "/bigScreen",
  // devServer: {
  //   proxy: {
  //     "/api-frame": {
  //       target: "http://192.168.5.95:8088", // 5.95服务器
  //       ws: true,
  //       changeOrigin: true,
  //     },
  //   },
  // },

  chainWebpack: (config) => {
    config.plugin("html").tap((args) => {
      args[0].title = "G6";
      return args;
    });

    config.module
      .rule("less")
      .oneOf("vue")
      .use("px2rem-loader")
      .loader("px2rem-loader")
      .before("postcss-loader") // this makes it work.
      .options({
        remUnit: 14,
        remPrecision: 6, // 精确小数点位数
      })
      .end();

    config.resolve.alias.set("@", resolve("src"));
  }
});