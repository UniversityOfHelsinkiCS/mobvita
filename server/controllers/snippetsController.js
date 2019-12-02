// const { ApplicationError } = require('@util/customErrors')
const { axios } = require('@util/common')

const getCurrent = async (req, res) => {
  const { storyId } = req.params
  const response = await axios.get(`/stories/${storyId}/snippets/next`, { headers: req.headers })
  res.send(response.data)
}

const getNext = async (req, res) => {
  const { storyId } = req.params
  const { previous } = req.query
  const response = await axios.get(`/stories/${storyId}/snippets/next?previous=${previous}`, { headers: req.headers })
  res.send(response.data)
}

const reset = async (req, res) => {
  const { storyId } = req.params
  const response = await axios.post(`/stories/${storyId}/snippets/reset`, {}, { headers: req.headers })
  res.send(response.data)
}

const postAnswers = async (req, res) => {
  const { storyId } = req.params
  const url = `/stories/${storyId}/snippets/answer`
  const response = await axios.post(url, req.body, { headers: req.headers })
  res.send(response.data)
}

module.exports = {
  getCurrent,
  reset,
  postAnswers,
  getNext
}
