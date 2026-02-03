const common = require('@root/config/common')

const DB_URL = process.env.DB_URL || ''
const PORT = process.env.PORT || 8000

const Axios = require('axios')
const https = require('https')

let revitaUrl = "https://revita-test.cs.helsinki.fi/api"
// process.env.REVITA_URL
// https://revita-test.cs.helsinki.fi/api
// revitaUrl = 'http://127.0.0.1:5000/api/'
console.log('revitaUrl', revitaUrl)

if (!revitaUrl) {
  console.error('REVITA_URL missing') // eslint-disable-line no-console
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
