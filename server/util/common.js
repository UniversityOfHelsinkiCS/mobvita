const common = require('@root/config/common')

const DB_URL = process.env.DB_URL || ''
const PORT = process.env.PORT || 8000

const Axios = require('axios')
const https = require('https')

const revitaUrl = process.env.REVITA_URL // Please set ENV instead of changing here !!!!
if (!revitaUrl) {
  console.error('Missing required environment variable REVITA_URL.') // eslint-disable-line no-console
  console.error('Copy .env.example to .env and set REVITA_URL before starting the app.') // eslint-disable-line no-console
  console.error('Example: REVITA_URL=https://revita-test.cs.helsinki.fi/api') // eslint-disable-line no-console
  process.exit(1)
}

const axios = Axios.create({
  httpsAgent: new https.Agent({ rejectUnauthorized: false }),
  baseURL: revitaUrl,
})
if (process.env.DEBUG === 'true') {
  axios.interceptors.request.use((request) => {
    console.log('Starting Request', request)
    return request
  })
}

// Revita doesn't like trailing slashes, remove them
axios.interceptors.request.use((request) => {
  if (request.url[request.url.length - 1] === '/') {
    request.url = request.url.slice(0, -1)
  }

  return request
})

module.exports = {
  ...common,
  axios,
  DB_URL,
  PORT,
}
