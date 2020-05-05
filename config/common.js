/**
 * Insert application wide common items here
 */

const inProduction = process.env.NODE_ENV === 'production'

const basePath = process.env.BASE_PATH || '/'

const isStaging = process.env.ENVIRONMENT === 'staging'

const hiddenFeatures = isStaging || process.env.ENVIRONMENT === 'development'

module.exports = {
  inProduction,
  basePath,
  hiddenFeatures,
  isStaging,
}
