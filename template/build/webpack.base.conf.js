var path = require('path')
var utils = require('./utils')
var config = require('../config')
var vueLoaderConfig = require('./vue-loader.conf')

function resolve(dir) {
  return path.join(__dirname, '..', dir)
}

module.exports = {
  entry: {
    app: './src/main.js'
  },
  output: {
    path: config.build.assetsRoot,
    filename: '[name].js',
    publicPath: process.env.NODE_ENV === 'production'
      ? config.build.assetsPublicPath
      : config.dev.assetsPublicPath
  },
  resolve: {
    extensions: ['.js', '.vue', '.json'],
    alias: {
      'vue$': 'vue/dist/vue.esm.js',
      src: resolve('src'),
      config: resolve('src/app.config.js'),
      api: resolve('src/api'),
      components: resolve('src/components'),
      pages: resolve('src/pages'),
      utils: resolve('src/common/utils'),
      mixins: resolve('src/common/mixins'),
      images: resolve('src/assets/images'),
      styles: resolve('src/assets/styles'),
      fonts: resolve('src/assets/fonts')
    }
  },
  module: {
    rules: [
      {
        enforce: 'pre',
        test: /(\.vue$)|(\.js?$)/,
        loader: 'eslint-loader',
        include: resolve('src'),
        exclude: [/node_modules/]
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: vueLoaderConfig
      },
      {
        test: /\.js$/,
        loader: 'babel-loader?cacheDirectory',
        include: [resolve('src'), resolve('test')]
      },
      {
        test: /\.(p?css|postcss)$/,
        use: [
          'style-loader',
          'css-loader',
          'postcss-loader'
        ],
        include: [resolve('src')],
        exclude: /node_modules/
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('img/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
        }
      }
    ]
  }
}
