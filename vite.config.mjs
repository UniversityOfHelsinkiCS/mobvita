import path from 'path'
import { fileURLToPath } from 'url'
import moment from 'moment-timezone'
import { defineConfig, transformWithOxc } from 'vite'
import react from '@vitejs/plugin-react'
import { execSync } from 'child_process'

const rootDir = path.dirname(fileURLToPath(import.meta.url))
const buildtime = moment.tz(new Date(), 'Europe/Helsinki').format('ddd, DD MMM YYYY, HH:mm')

const jsxInJsPlugin = {
  name: 'mobvita-jsx-in-js',
  enforce: 'pre',
  async transform(code, id) {
    if (!/\/client\/.*\.js$/.test(id)) return null

    return transformWithOxc(code, id, {
      lang: 'jsx',
      jsx: { runtime: 'classic' },
    })
  },
}

const getPackageChunkName = (id) => {
  const afterNodeModules = id.split('node_modules/')[1]
  if (!afterNodeModules) return undefined

  const segments = afterNodeModules.split('/')
  const packageName = segments[0].startsWith('@') ? `${segments[0]}-${segments[1]}` : segments[0]

  if (packageName === 'tiny-warning' || packageName === 'invariant') return undefined

  return `vendor-${packageName.replace('@', '').replace(/[^a-zA-Z0-9_-]/g, '-')}`
}

const getCommitHash = () => {
  if (process.env.COMMIT_HASH) return process.env.COMMIT_HASH.substring(0, 7)

  try {
    return execSync('git rev-parse --short HEAD', { stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim()
  } catch (error) {
    console.warn('Could not read git commit hash; using "unknown" for __COMMIT__.', error.message)
    return 'unknown'
  }
}

export default defineConfig(({ mode }) => {
  const BASE_PATH = process.env.BASE_PATH || '/'
  const ENVIRONMENT = process.env.ENVIRONMENT || ''
  const COMMIT_HASH = getCommitHash()

  return {
    base: BASE_PATH,
    plugins: [jsxInJsPlugin, react({ include: /\.[jt]sx?$/ })],
    optimizeDeps: {
      include: [
        'react-router-dom',
        'swiper',
      ],
      // Vite's Rolldown-based dep scanner does not run main `transform`
      // pipeline, so JSX inside `client/**/*.js` confuses it. Provide the
      // scanner with its own JSX transform plugin so it can parse those
      // files when walking the import graph from index.html.
      rolldownOptions: {
        plugins: [
          {
            name: 'mobvita-scan-jsx-in-js',
            async transform(code, id) {
              if (!/\/client\/.*\.js$/.test(id)) return null
              return transformWithOxc(code, id, {
                lang: 'jsx',
                jsx: { runtime: 'classic' },
              })
            },
          },
        ],
      },
    },
    resolve: {
      alias: {
        Utilities: path.resolve(rootDir, 'client/util/'),
        Components: path.resolve(rootDir, 'client/components/'),
        Assets: path.resolve(rootDir, 'client/assets/'),
        '@root': path.resolve(rootDir),
      },
    },
    define: {
      __VERSION__: JSON.stringify(buildtime),
      __COMMIT__: JSON.stringify(COMMIT_HASH.substring(0, 7)),
      'process.env': JSON.stringify({
        BASE_PATH,
        BUILT_AT: new Date().toISOString(),
        NODE_ENV: mode,
        ENVIRONMENT,
      }),
    },
    build: {
      outDir: 'dist',
      sourcemap: mode !== 'production',
      cssMinify: false,
      cssCodeSplit: false,
      chunkSizeWarningLimit: 2000,
      rollupOptions: {
        output: {
          entryFileNames: 'assets/[hash].js',
          chunkFileNames: 'assets/[hash].js',
          assetFileNames: 'assets/[hash][extname]',
          manualChunks(id) {
            if (!id.includes('node_modules')) return undefined
            return getPackageChunkName(id)
          },
        },
      },
    },
  }
})
