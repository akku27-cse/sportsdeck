const path = require('path');
const webpack = require('webpack');
const { ProvidePlugin } = require('webpack');

// Fix for Node.js 17+ OpenSSL 3.0 support
const crypto = require('crypto');
const cryptoOrigCreateHash = crypto.createHash;
crypto.createHash = (algorithm) => cryptoOrigCreateHash(algorithm === 'md4' ? 'sha256' : algorithm);

module.exports = {
  entry: {
    extension: './src/extension.ts',
    webview: './src/webview/panel.ts',
  },
  target: 'node',
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    
    extensions: ['.ts', '.js'],

    fallback: {
      process: require.resolve('process/browser'),
    },
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist'),
    libraryTarget: 'commonjs2',
    hashFunction: 'sha256',
    devtoolModuleFilenameTemplate: '../[resource-path]',
  },
  externals: {
    vscode: 'commonjs vscode',
    bufferutil: 'commonjs bufferutil',
    'utf-8-validate': 'commonjs utf-8-validate',
  },
  plugins: [
    new ProvidePlugin({
      process: 'process/browser',
    }),
  ],
  optimization: {
    minimize: false,
    splitChunks: {
      chunks: 'all',
    },
  },
  devtool: 'source-map',
};
