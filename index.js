require('dotenv').config()
require('module-alias/register')
const chokidar = require('chokidar')
const express = require('express')
require('express-async-errors')

const { PORT, inProduction } = require('@util/common')
const logger = require('@util/logger')

const app = express()

// Require is here so we can delete it from cache when files change (*)
app.use('/api', (req, res, next) => require('@root/server')(req, res, next)) // eslint-disable-line

/**
 *  Use "hot loading" in backend
 */
const watcher = chokidar.watch('server') // Watch server folder
watcher.on('ready', () => {
  watcher.on('all', () => {
    Object.keys(require.cache).forEach((id) => {
      if (id.includes('server')) delete require.cache[id] // Delete all require caches that point to server folder (*)
    })
  })
})

/**
 * For frontend use hot loading when in development, else serve the static content
 */
if (!inProduction) {
  /* eslint-disable */
  const webpack = require('webpack')
  const middleware = require('webpack-dev-middleware')
  const hotMiddleWare = require('webpack-hot-middleware')
  const webpackConf = require('@root/webpack.config')
  /* eslint-enable */
  const compiler = webpack(webpackConf('development', { mode: 'development' }))
  app.use(middleware(compiler))
  app.use(hotMiddleWare(compiler))
} else {
  app.use('/', express.static('dist/'))
}

app.listen(PORT, () => { logger.info(`Started on port ${PORT}`) })
