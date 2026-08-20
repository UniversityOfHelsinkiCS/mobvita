import path from 'path'
import { fileURLToPath } from 'url'
import moment from 'moment-timezone'
import { defineConfig, transformWithOxc } from 'vite'
import react from '@vitejs/plugin-react'
import { execSync } from 'child_process'
import { bundledTypography, font, typography } from './client/assets/mui_theme/designTokens.js'

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

/**
 * Builds the webfont stylesheet URL from `typography` in designTokens.js, so the tokens decide both
 * the families and the fetch. Families are de-duplicated, and a face with no weights omits the
 * `:wght@` axis because an empty one 400s the whole stylesheet.
 */
const buildFontHref = () => {
  const byFamily = new Map()
  for (const face of Object.values(typography)) {
    const weights = byFamily.get(face.name) || new Set()
    face.weights.forEach(w => weights.add(w))
    byFamily.set(face.name, weights)
  }

  const families = [...byFamily.entries()].map(([name, weights]) => {
    const family = `family=${name.replace(/ /g, '+')}`
    if (!weights.size) return family
    return `${family}:wght@${[...weights].sort((a, b) => a - b).join(';')}`
  })

  return `https://fonts.googleapis.com/css2?${families.join('&')}&display=swap`
}

const FONT_LINK_PLACEHOLDER = '<!--FONT_LINK-->'

/**
 * Replaces the index.html placeholder with the generated font <link>. Throws when the placeholder
 * is missing, because a silent no-op would ship the app with no webfont at all.
 */
const fontLinkPlugin = {
  name: 'mobvita-font-link',
  transformIndexHtml: {
    order: 'pre',
    handler: html => {
      if (!html.includes(FONT_LINK_PLACEHOLDER)) {
        throw new Error(
          `index.html is missing the ${FONT_LINK_PLACEHOLDER} placeholder, so no webfont <link> ` +
            'can be injected. Put it back in <head> (see the comment beside it).',
        )
      }

      return html.replace(
        FONT_LINK_PLACEHOLDER,
        `<link href="${buildFontHref()}" rel="stylesheet" />`,
      )
    },
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
    plugins: [jsxInJsPlugin, react({ include: /\.[jt]sx?$/ }), fontLinkPlugin],
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
    css: {
      preprocessorOptions: {
        scss: {
          // Publish the design token font families so any stylesheet can use `$font-ui` /
          // `$font-content` without importing; `$font-syriac` is the bundled face's @font-face alias.
          additionalData:
            `$font-ui: ${font.family};\n` +
            `$font-content: ${font.content};\n` +
            `$font-syriac: '${bundledTypography.syriac.name}';\n`,
        },
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
