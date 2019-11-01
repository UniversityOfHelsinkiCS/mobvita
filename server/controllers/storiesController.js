const { ApplicationError } = require('@util/customErrors')
const axios = require('axios')
const https = require('https')

const axiosInstance = axios.create({
  httpsAgent: new https.Agent({
    rejectUnauthorized: false,
  }),
})

/**
 * Simple example for backend
 */
const getAll = async (req, res) => {
  const response = await axiosInstance.get('https://revita-test.cs.helsinki.fi/api/stories?language=finnish')
  res.send(response.data.stories)
}

module.exports = {
  getAll,
}
