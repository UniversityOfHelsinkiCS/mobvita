// const { ApplicationError } = require('@util/customErrors')
const { axios } = require('@util/common')

const getAll = async (req, res) => {
  const response = await axios.get('/stories?language=finnish', { headers: req.headers })
  res.send(response.data.stories)
}

const getOne = async (req, res) => {
  const { id } = req.params
  const response = await axios.get(`/stories/${id}`, { headers: req.headers })
  res.send(response.data)
}

module.exports = {
  getOne,
  getAll,
}
