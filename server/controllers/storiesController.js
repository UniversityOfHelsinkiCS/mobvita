// const { ApplicationError } = require('@util/customErrors')
const { axios } = require('@util/common')

const getAll = async (req, res) => {
  const { language } = req.params
  const query = req.query || {}
  const queryString = Object.keys(query).map(key => `${key}=${query[key]}`).join('&')
  const response = await axios.get(`/stories?language=${language}&${queryString}`, { headers: req.headers })
  res.send(response.data)
}

const getOne = async (req, res) => {
  const { id } = req.params
  const response = await axios.get(`/stories/${id}`, { headers: req.headers })
  res.send(response.data)
}

const createOne = async (req,res) => {
  const response = await axios.post('/stories', req.body, { headers: req.headers })
  res.send(response.data)
}

module.exports = {
  getOne,
  getAll,
  createOne
}
