const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: {
    background: './extension/background/background.js',
    content: './extension/content/content.js',
    popup: './extension/popup/popup.js',
    options: './extension/options/options.js'
  },
  
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
    clean: true
  },
  
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.(png|jpg|jpeg|gif|svg)$/,
        type: 'asset/resource'
      },
    ]
  },
  
  resolve: {
    extensions: ['.js'],
    alias: {
      '@shared': path.resolve(__dirname, 'shared'),
      '@extension': path.resolve(__dirname, 'extension')
    }
  },
  
  plugins: [
    new CopyPlugin({
      patterns: [
        {
          from: 'extension/manifest/manifest.json',
          to: 'manifest.json'
        },
        {
          from: 'extension/popup/popup.html',
          to: 'popup.html'
        },
        {
          from: 'extension/popup/popup.css',
          to: 'popup.css'
        },
        {
          from: 'extension/options/options.html',
          to: 'options.html'
        },
        {
          from: 'extension/options/options.css',
          to: 'options.css'
        },
        {
          from: 'extension/laundry-room.html',
          to: 'laundry-room.html'
        },
        {
          from: 'extension/assets',
          to: 'assets'
        },
        {
          from: 'shared',
          to: 'shared'
        },
        {
          from: 'extension/lib',
          to: 'lib'
        },
      ]
    })
  ],
  
  devtool: 'source-map',
  
  mode: 'development', // 强制使用开发模式，避免压缩
  optimization: {
    minimize: false, // 禁用压缩，保持Chrome API可读
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all'
        }
      }
    }
  }
};

