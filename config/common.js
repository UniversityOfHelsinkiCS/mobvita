/**
 * Insert application wide common items here
 */

const inProduction = process.env.NODE_ENV === 'production'

const basePath = process.env.BASE_PATH || '/'

const hiddenFeatures = !inProduction || basePath === '/staging'

module.exports = {
  inProduction,
  basePath,
  hiddenFeatures,
}
