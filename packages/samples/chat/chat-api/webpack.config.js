/* eslint-env node */
/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');
const nodeExternals = require('webpack-node-externals');

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
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: ['.ts', '.js']
  },
  output: {
    filename: 'chat-server.js',
    path: path.resolve(__dirname, 'dist')
  },
  externals: [nodeExternals()],
  node: {
    fs: 'empty',
    http: 'empty'
  }
};
