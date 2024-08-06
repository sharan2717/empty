const path = require("path");
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");
const {CleanWebpackPlugin} = require('clean-webpack-plugin');

module.exports = {
  mode: "development",
  entry: "./src/index.ts",
  resolve: {
    extensions: [".js", ".ts", ".tsx"],
  },
  output: {
    libraryTarget: "commonjs",
    path: path.join(__dirname, "dist"),
    filename: "index.js",
  },
  target: "node",
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: "ts-loader"}
        ],
      },
  plugins: [new ForkTsCheckerWebpackPlugin(), new CleanWebpackPlugin()],
  externals: {
      '/opt/nodejs' : '/opt/nodejs',
  }
};