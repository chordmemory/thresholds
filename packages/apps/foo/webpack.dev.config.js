const base = require('./webpack.config');
const path = require('path');

module.exports = {
  ...base,
  mode: 'development',
  devServer: {
    contentBase: path.resolve(__dirname, 'dist'),
    port: 9000,
    hot: false,
    liveReload: false
  }
}