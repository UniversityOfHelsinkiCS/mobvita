const { ApplicationError } = require('@util/customErrors')
const axios = require('axios')
const https = require('https')

const axiosInstance = axios.create({
  httpsAgent: new https.Agent({
    rejectUnauthorized: false,
  }),
})

const getAll = async (req, res) => {
  const response = await axiosInstance.get('https://revita-test.cs.helsinki.fi/api/stories?language=finnish')
  res.send(response.data.stories)
}

const getOne = async (req, res) => {
  const { id } = req.params
  const response = await axiosInstance.get(`https://revita-test.cs.helsinki.fi/api/stories/${id}`)
  res.send(response.data)
}

module.exports = {
  getOne,
  getAll,
}
