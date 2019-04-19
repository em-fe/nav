var path = require('path');
var webpack = require('webpack');
var merge = require('webpack-merge');
var CopyWebpackPlugin = require('copy-webpack-plugin');

var utils = require('./utils');

var baseWebpackConfig = require('./webpack.water.base.conf');


var webpackConfig = merge(baseWebpackConfig, {
  devtool: '#source-map',
  output: {
    // filename: utils.outname() + '.js',
    filename: 'emnav.js',
    library: 'emnav',
  },
  plugins: [
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, '../emnav'),
        to: '',
        ignore: ['.*', '*.md', '.vuepress/**/*', '*.test.*']
      }
    ]),
  ]
})

module.exports = webpackConfig
