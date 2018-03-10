const webpack = require('webpack');
const path = require('path');

const config = {
  entry: './src/melo.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'melo.js',
    library: 'melo',
    libraryTarget: 'umd'
  },
  node: {
    fs: 'empty'
  },
  module: {
    rules: [
      {
        test: /\.wasm$/,
        exclude: /node_modules/,
        use: 'wasm-loader'
      }
    ]
  }
};
module.exports = config;
