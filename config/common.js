/**
 * Insert application wide common items here
 */

const isDeployed = process.env.NODE_ENV === 'production'

const basePath = process.env.BASE_PATH || '/'

const hiddenFeatures = !isDeployed || basePath === '/staging'

module.exports = {
  isDeployed,
  basePath,
  hiddenFeatures,
}
