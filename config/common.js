/**
 * Insert application wide common items here
 */

const inProduction = process.env.NODE_ENV === 'production'

const basePath = process.env.BASE_PATH || '/'

const isStaging = process.env.REVITA_URL === 'https://svm-53.cs.helsinki.fi/api'

const hiddenFeatures = !inProduction || isStaging

module.exports = {
  inProduction,
  basePath,
  hiddenFeatures,
  isStaging,
}
