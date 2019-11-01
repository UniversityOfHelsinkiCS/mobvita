/**
 * Insert application wide common items here
 */

const inProduction = process.env.NODE_ENV === 'production'

const basePath = process.env.BASE_PATH || '/'

module.exports = {
  inProduction,
  basePath,
}
