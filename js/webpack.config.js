const webpack = require('webpack');
const path = require('path');

module.exports = env => {
  const targetPlatform = env.TARGETPLATFORM || 'node';

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
    },
    plugins: [
      new webpack.NormalModuleReplacementPlugin(/(.*)_PLATFORM/, function(resource) {
        resource.request = resource.request.replace(/_PLATFORM/, `_${targetPlatform}`);
      })
    ]
  };

  return config;
}
