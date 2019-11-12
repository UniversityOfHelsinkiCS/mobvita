const common = require('@root/config/common')

const DB_URL = process.env.DB_URL || ''
const PORT = process.env.PORT || 8000

const Axios = require('axios')
const https = require('https')

const axios = Axios.create({
  httpsAgent: new https.Agent({
    rejectUnauthorized: false,
  }),
  baseURL: 'https://revita-test.cs.helsinki.fi/api',
})

module.exports = {
  ...common,
  axios,
  DB_URL,
  PORT,
}
