const config = require('./webpack.config');

module.exports = {
  ...config,
  mode: 'development',
  devServer: {
    port: 9000,
    historyApiFallback: true
  }
};
