const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const htmlTemplate = require('html-webpack-template')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const webpack = require('webpack')

module.exports = (env, argv) => {
  const { mode } = argv
  const additionalPlugins = mode === 'production'
    ? []
    : [new webpack.HotModuleReplacementPlugin()] // Enable hot module replacement

  const additionalOptimizations = mode === 'production'
    ? {
      minimizer: [
        // Make CSS smaller
        new OptimizeCssAssetsPlugin(),
      ],
    }
    : {}

  const additionalEntries = mode === 'production' ? [] : ['webpack-hot-middleware/client?http://localhost:8000']

  const BASE_PATH = process.env.BASE_PATH || '/'

  return {
    mode,
    output: {
      publicPath: BASE_PATH,
    },
    entry: [
      '@babel/polyfill', // so we don't need to import it anywhere
      './client',
      ...additionalEntries,
    ],
    resolve: {
      alias: {
        Utilities: path.resolve(__dirname, 'client/util/'),
        Components: path.resolve(__dirname, 'client/components/'),
        Assets: path.resolve(__dirname, 'client/assets/'),
        '@root': path.resolve(__dirname),
      },
    },
    module: {
      rules: [
        {
          // Load JS files
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
          },
        },
        {
          // Load CSS files
          test: /\.css$/,
          use: [MiniCssExtractPlugin.loader, 'css-loader'],
        },
        {
          // Load other files
          test: /\.(png|jpg|gif|svg|eot|ttf|woff|woff2)$/,
          use: ['file-loader'],
        },
      ],
    },
    optimization: {
      ...additionalOptimizations,
    },
    plugins: [
      new webpack.DefinePlugin({
        'process.env.BASE_PATH': JSON.stringify(BASE_PATH),
        'process.env.BUILT_AT': JSON.stringify(new Date().toISOString()),
        'process.env.NODE_ENV': JSON.stringify(mode),
      }),
      // Skip the part where we would make a html template
      new HtmlWebpackPlugin({
        title: 'Toska Boilerplate',
        favicon: path.resolve(__dirname, 'client/assets/favicon-32x32.png'),
        inject: false,
        template: htmlTemplate,
        appMountId: 'root',
      }),
      // Extract css
      new MiniCssExtractPlugin({
        filename: '[name].css',
        chunkFilename: '[name]-[id].css',
      }),
      ...additionalPlugins,
    ],
  }
}
