// const { ApplicationError } = require('@util/customErrors')
const { axios } = require('@util/common')

const getCurrent = async (req, res) => {
  const { storyId } = req.params
  const response = await axios.get(`/stories/${storyId}/snippets/next`, { headers: req.headers })
  res.send(response.data)
}

const reset = async (req, res) => {
  const { storyId } = req.params
  const response = await axios.post(`/stories/${storyId}/snippets/reset`, {}, { headers: req.headers })
  res.send(response.data)
}

const getAnswers = async (req, res) => {
  const { storyId } = req.params
  const response = await axios.post(`/stories/${storyId}/snippets/answers`, {}, { headers: req.headers })
  res.send(response.data)
}

module.exports = {
  getCurrent,
  reset,
  getAnswers
}
