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
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      },
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
      }
    ]
  },
  
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
    alias: {
      '@shared': path.resolve(__dirname, 'shared'),
      '@extension': path.resolve(__dirname, 'extension'),
      '@frontend': path.resolve(__dirname, 'frontend/src'),
      '@backend': path.resolve(__dirname, 'backend')
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
          from: 'extension/options/options.html',
          to: 'options.html'
        },
        {
          from: 'extension/assets',
          to: 'assets'
        },
        {
          from: 'shared',
          to: 'shared'
        }
      ]
    })
  ],
  
  devtool: 'source-map',
  
  optimization: {
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
