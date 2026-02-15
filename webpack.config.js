const moment = require('moment-timezone')

const buildtime = moment.tz(new Date(), 'Europe/Helsinki').format('ddd, DD MMM YYYY, HH:mm') // 'LLLL'
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const htmlTemplate = require('html-webpack-template')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')

const webpack = require('webpack')

module.exports = (env, argv) => {
  const { mode } = argv

  const additionalPlugins = mode === 'production'
    ? [new OptimizeCssAssetsPlugin()]
    : [new webpack.HotModuleReplacementPlugin()] // Enable hot module replacement

  const additionalEntries = mode === 'production' ? [] : ['webpack-hot-middleware/client?http://localhost:8000']

  const BASE_PATH = process.env.BASE_PATH || '/'

  const { ENVIRONMENT } = process.env

  const COMMIT_HASH = process.env.COMMIT_HASH || ''
  const VERSION_STRING = JSON.stringify(`${buildtime}`)

  const COMMIT_STRING = JSON.stringify(COMMIT_HASH.substring(0, 7))

  const headHtmlSnippet = (mode === 'production' && BASE_PATH === '/')
    ? `<meta name="viewport" content="width=device-width, initial-scale=1.0">
    <script src="https://code.responsivevoice.org/responsivevoice.js?key=IXPRWFMo"></script>
       <script async src="https://www.googletagmanager.com/gtag/js?id=UA-157268430-1"></script>
       <script>
         window.dataLayer = window.dataLayer || [];
         function gtag(){dataLayer.push(arguments);}
         gtag('js', new Date());
         gtag('config', 'UA-157268430-1');
       </script>`
    : `<meta name="viewport" content="width=device-width, initial-scale=1.0">
      <script src="https://code.responsivevoice.org/responsivevoice.js?key=IXPRWFMo"></script>`

  return {
    devtool: 'source-map',
    mode,
    output: {
      publicPath: BASE_PATH,
      filename: '[name].js',
      sourceMapFilename: '[file].map[query]',
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
      mainFields: ['browser', 'main', 'module'],
      extensions: ['.js', '.mjs', '.json'],
    },
    module: {
      rules: [
        {
          test: /\.m?js$/,
          include: [path.resolve(__dirname, 'node_modules/react-draggable')],
          use: { loader: 'babel-loader' },
        },
        {
          // Load JS files
          test: /\.js$/,
          exclude: /node_modules/,
          use: { loader: 'babel-loader' },
        },
        {
          // Load CSS files
          test: /\.css$/,
          use: [MiniCssExtractPlugin.loader, 'css-loader'],
        },
        {
          test: /\.s[ac]ss$/i,
          use: [
            // Creates `style` nodes from JS strings
            'style-loader',
            // Translates CSS into CommonJS
            'css-loader',
            // Compiles Sass to CSS
            {
              loader: 'sass-loader',
              options: {
                // Prefer `dart-sass`
                implementation: require('sass'),
              },
            },
          ],
        },
        {
          // Load other files
          test: /\.(png|jpg|gif|svg|eot|ttf|woff|woff2|webp)$/,
          use: ['file-loader'],
        },
        {
          include: /node_modules/,
          test: /\.mjs$/,
          type: 'javascript/auto'
        },
      ],
    },
    // optimization: {
    //   ...additionalOptimizations
    // },
    plugins: [
      new webpack.DefinePlugin({
        'process.env.BASE_PATH': JSON.stringify(BASE_PATH),
        'process.env.BUILT_AT': JSON.stringify(new Date().toISOString()),
        'process.env.NODE_ENV': JSON.stringify(mode),
        'process.env.ENVIRONMENT': JSON.stringify(ENVIRONMENT),
      }),
      // Skip the part where we would make a html template
      new HtmlWebpackPlugin({
        title: 'Revita',
        favicon: path.resolve(__dirname, 'client/assets/favicon.png'),
        inject: false,
        template: htmlTemplate,
        appMountId: 'root',
        headHtmlSnippet,
      }),

      // Extract css
      new MiniCssExtractPlugin({
        filename: '[name].css',
        chunkFilename: '[name]-[id].css',
      }),
      ...additionalPlugins,
      new webpack.DefinePlugin({ __VERSION__: VERSION_STRING, __COMMIT__: COMMIT_STRING }),
    ],
  }
}
