// const { ApplicationError } = require('@util/customErrors')
const { axios } = require('@util/common')

const create = async (req, res) => {
  const response = await axios.post('/session', req.body)
  res.send(response.data)
}

module.exports = {
  create,
}
