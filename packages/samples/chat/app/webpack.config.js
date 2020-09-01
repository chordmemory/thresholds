const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: path.join(__dirname, './src/app-index.tsx'),
  mode: 'development',
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
  plugins: [
      new HtmlWebpackPlugin({
          template: path.join(__dirname, 'index.html'),
          inject: 'body'
      })
  ],
  resolve: {
    extensions: [ '.tsx', '.ts', '.js' ],
    alias: {
        '@threshold-transports': path.resolve(__dirname, '../../../transports'),
        '@threshold-libs': path.resolve(__dirname, '../../../libs')
    }
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    compress: true,
    port: 9002
  }
};
