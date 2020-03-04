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

const createOne = async (req, res) => {
  const response = await axios.post('/stories', req.body, { headers: req.headers })
  res.send(response.data)
}

const getUploadProgress = async (req, res) => {
  const { storyId } = req.params
  const response = await axios.get(`/stories/${storyId}/loading`, { headers: req.headers })
  res.send(response.data)
}

const share = async (req, res) => {
  const { storyId } = req.params
  const url = `/stories/${storyId}/share`
  const response = await axios.post(url, req.body, { headers: req.headers })
  res.send(response.data)
}

const acceptShare = async (req, res) => {
  const { storyId } = req.params
  const { token } = req.body
  const url = `/stories/${storyId}/accept?token=${token}`
  const response = await axios.get(url, { headers: req.headers })
  res.send(response)
}

module.exports = {
  getOne,
  getAll,
  createOne,
  getUploadProgress,
  share,
  acceptShare,
}
