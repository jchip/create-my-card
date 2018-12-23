"use strict";

const Path = require("path");
const webpack = require("webpack");
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin;

const base = {
  mode: process.env.ANALYZE_BUNDLE ? "development" : "production",
  //devtool: "source-map",
  entry: {
    "card.js": Path.resolve("src/card.js")
  },
  plugins: [
    process.env.ANALYZE_BUNDLE && new BundleAnalyzerPlugin()
  ].filter(x => x),
  resolve: {
    symlinks: false, // don't resolve symlinks to their real path
    alias: {
      "term-size": Path.resolve("stubs/term-size.js")
    }
  },
  output: {
    filename: `[name]`,
    path: Path.resolve("dist"),
    libraryTarget: "commonjs2"
  },
  target: "node",
  node: {
    __filename: false,
    __dirname: false
  }
};

const node6 = Object.assign({}, base, {
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: x => x.indexOf("node_modules") > 0,
        use: "babel-loader"
      }
    ]
  },
  output: {
    filename: `node6-[name]`,
    path: Path.resolve("dist"),
    libraryTarget: "commonjs2"
  }
});

module.exports = [base, node6];
