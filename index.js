require('dotenv').config()
require('module-alias/register')
const chokidar = require('chokidar')
const express = require('express')
const http = require('http')
const fs = require('fs')
const path = require('path')
require('express-async-errors')

const { PORT, inProduction } = require('@util/common')
const logger = require('@util/logger')

const app = express()

// Require is here so we can delete it from cache when files change (*)
app.use('/api', (req, res, next) => require('@root/server')(req, res, next)) // eslint-disable-line
app.use('/api', (_, res) => res.sendStatus(404))

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

const setupFrontend = async (httpServer) => {
  /**
   * For frontend use Vite middleware when in development, else serve static content.
   */
  if (!inProduction) {
    const { createServer: createViteServer } = require('vite')
    const hmrHost = process.env.VITE_HMR_HOST || 'localhost'
    const hmrClientPort = Number(process.env.VITE_HMR_CLIENT_PORT || PORT)

    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        host: true,
        hmr: {
          server: httpServer,
          host: hmrHost,
          clientPort: hmrClientPort,
        },
      },
      appType: 'custom',
    })

    app.use(vite.middlewares)
    app.use('*', async (req, res, next) => {
      try {
        const url = req.originalUrl
        const templatePath = path.resolve(__dirname, 'index.html')
        const template = await fs.promises.readFile(templatePath, 'utf-8')
        const html = await vite.transformIndexHtml(url, template)

        res.status(200).set({ 'Content-Type': 'text/html' }).end(html)
      } catch (error) {
        vite.ssrFixStacktrace(error)
        next(error)
      }
    })

    return
  }

  const DIST_PATH = path.resolve(__dirname, './dist')
  const INDEX_PATH = path.resolve(DIST_PATH, 'index.html')

  app.use(express.static(DIST_PATH))
  app.get('*', (req, res) => res.sendFile(INDEX_PATH))
}

const start = async () => {
  const httpServer = http.createServer(app)
  await setupFrontend(httpServer)
  httpServer.listen(PORT, () => { logger.info(`Started on port ${PORT}`) })
}

start().catch(error => {
  logger.error('Failed to start server', error)
  process.exit(1)
})
