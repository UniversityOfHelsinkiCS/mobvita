// Loads .env when present; values already in the environment win, as with dotenv.
try {
  process.loadEnvFile()
} catch (error) {
  if (error.code !== 'ENOENT') throw error
}
const chokidar = require('chokidar')
const compression = require('compression')
const express = require('express')
const http = require('http')
const fs = require('fs')
const path = require('path')

const { PORT, inProduction } = require('#util/common')
const logger = require('#util/logger')

const app = express()

// API responses are made per request, so they are compressed on the fly (brotli/gzip, over 1 KB).
app.use('/api', compression())

// Require is here so we can delete it from cache when files change (*)
app.use('/api', (req, res, next) => require('./server')(req, res, next)) // eslint-disable-line
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

// Preferred first; the build writes them beside each asset (precompressPlugin in vite.config.mjs).
const PRECOMPRESSED = [
  { encoding: 'br', ext: '.br' },
  { encoding: 'gzip', ext: '.gz' },
]

// Serves an asset's pre-built .br/.gz copy when the browser accepts it; else falls through.
const servePrecompressed = (dir, cacheOptions) => {
  const available = new Set(fs.existsSync(dir) ? fs.readdirSync(dir) : [])

  return (req, res, next) => {
    const name = req.path.slice(1)
    const variants = PRECOMPRESSED.filter(({ ext }) => available.has(name + ext))
    if (!variants.length) return next()

    res.vary('Accept-Encoding')
    const match = variants.find(({ encoding }) => req.acceptsEncodings(encoding))
    if (!match) return next()

    res.type(path.extname(name))
    res.set('Content-Encoding', match.encoding)
    res.sendFile(name + match.ext, { root: dir, ...cacheOptions }, error => error && next(error))
  }
}

// Frontend: Vite middleware in development, otherwise the built dist/ (pre-compressed first).
const setupFrontend = async (httpServer) => {
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
    app.use('/{*path}', async (req, res, next) => {
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

  const ASSETS_PATH = path.resolve(DIST_PATH, 'assets')
  // Asset names are content hashes (a change gets a new name), so browsers may keep them a year.
  const ASSET_CACHE = { maxAge: '1y', immutable: true }

  app.use('/assets', servePrecompressed(ASSETS_PATH, ASSET_CACHE))
  app.use('/assets', express.static(ASSETS_PATH, ASSET_CACHE))
  app.use(express.static(DIST_PATH))
  // Missing hashed assets must 404, not fall through to index.html served as CSS/JS with a 200.
  app.use('/assets', (_, res) => res.set('Cache-Control', 'no-store').sendStatus(404))
  app.get('/{*path}', (req, res) => res.sendFile(INDEX_PATH))
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
