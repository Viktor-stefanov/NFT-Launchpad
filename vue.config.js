const webpack = require("webpack");

module.exports = {
  //transpileDependencies: true,
  configureWebpack: {
    plugins: [
      new webpack.ProvidePlugin({
        Buffer: ["buffer", "Buffer"],
      }),
    ],
    resolve: {
      fallback: {
        stream: require.resolve("stream-browserify"),
        buffer: require.resolve("buffer"),
        //fs: Path2D.resolve(__dirname, "node_modules/"),
        //crypto: require.resolve("crypto-browserify"),
        //assert: require.resolve("assert"),
        //http: require.resolve("stream-http"),
        //https: require.resolve("https-browserify"),
        //os: require.resolve("os-browserify"),
        //url: require.resolve("url"),
        //util: require.resolve("util/"),
      },
    },
  },
};
