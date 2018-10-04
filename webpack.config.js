const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = {
  entry: {
      app: './src/index.js',
    },
  output: {
      filename: '[name].bundle.js',
      path: path.resolve(__dirname, 'dist')
    },
  module: {
      rules: [
        {
          type: 'javascript/auto',
          test: /\.json$/,
          loader: 'json-loader'
        },
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader'
          }
        }
      ]
  },
  plugins: [
  	new CleanWebpackPlugin(['dist'])
  ]
};