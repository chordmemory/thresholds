const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
var nodeExternals = require('webpack-node-externals');

module.exports = {
  entry: path.join(__dirname, './main.ts'),
  mode: 'development',
  optimization: {
      minimize: false
  },
  target: 'node',
  context: __dirname,
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      }
    ],
  },
  resolve: {
    extensions: [ '.ts', '.js' ],
    alias: {
        '@threshold-transports': path.resolve(__dirname, '../../../transports'),
        '@threshold-libs': path.resolve(__dirname, '../../../libs'),
        '@threshold-types': path.resolve(__dirname, '../../../types'),
    }
  },
  output: {
    filename: 'chat-server.js',
    path: path.resolve(__dirname, 'dist'),
  },
  externals: [
      nodeExternals()
  ],
  node: {
      fs: "empty",
      http: "empty"
  }
};
