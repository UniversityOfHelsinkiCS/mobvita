import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'node:fs/promises'
import moment from 'moment-timezone'
import { defineConfig, transformWithEsbuild } from 'vite'
import react from '@vitejs/plugin-react'

const rootDir = path.dirname(fileURLToPath(import.meta.url))
const buildtime = moment.tz(new Date(), 'Europe/Helsinki').format('ddd, DD MMM YYYY, HH:mm')

const jsxInJsPlugin = {
  name: 'mobvita-jsx-in-js',
  enforce: 'pre',
  async transform(code, id) {
    if (!/\/client\/.*\.js$/.test(id)) return null

    return transformWithEsbuild(code, id, {
      loader: 'jsx',
      jsx: 'transform',
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

export default defineConfig(({ mode }) => {
  const BASE_PATH = process.env.BASE_PATH || '/'
  const ENVIRONMENT = process.env.ENVIRONMENT || ''
  const COMMIT_HASH = process.env.COMMIT_HASH || ''
  const clientDir = path.resolve(rootDir, 'client')

  const optimizeDepsJsxPlugin = {
    name: 'mobvita-optimize-deps-jsx-in-js',
    setup(build) {
      build.onLoad({ filter: /\.js$/ }, async (args) => {
        if (!args.path.startsWith(clientDir)) return null

        const source = await fs.readFile(args.path, 'utf8')
        return {
          contents: source,
          loader: 'jsx',
        }
      })
    },
  }

  return {
    base: BASE_PATH,
    plugins: [jsxInJsPlugin, react({ include: /\.[jt]sx?$/ })],
    optimizeDeps: {
      include: [
        'react-router-dom',
        'react-swipeable-views',
        '@babel/runtime/helpers/createSuper',
      ],
      esbuildOptions: {
        plugins: [optimizeDepsJsxPlugin],
      },
    },
    resolve: {
      alias: {
        '@babel/runtime/helpers/createSuper': path.resolve(rootDir, 'node_modules/@babel/runtime/helpers/esm/createSuper.js'),
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
      sourcemap: true,
      cssCodeSplit: false,
      chunkSizeWarningLimit: 2000,
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (!id.includes('node_modules')) return undefined
            return getPackageChunkName(id)
          },
        },
      },
    },
  }
})
