const base = require('./webpack.config.js');
const path = require('path');

module.exports = {
  ...base,
  mode: "development",
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    compress: true,
    port: 9002
  }
}