const common = require('@root/config/common')

const DB_URL = process.env.DB_URL || ''
const PORT = process.env.PORT || 8000

const Axios = require('axios')
const https = require('https')

const revitaUrl = process.env.REVITA_URL

if (!revitaUrl) {
  process.exit(1)
}

const axios = Axios.create({
  httpsAgent: new https.Agent({ rejectUnauthorized: false }),
  baseURL: revitaUrl,
})

module.exports = {
  ...common,
  axios,
  DB_URL,
  PORT,
}
