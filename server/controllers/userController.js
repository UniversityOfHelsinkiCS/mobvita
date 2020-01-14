const { axios } = require('@util/common')

const getSelf = async (req, res) => {
  const url = '/user'
  const response = await axios.get(url, { headers: req.headers })
  res.send(response.data)
}

const setSelf = async (req, res) => {
  const data = req.body
  const url = '/user'
  const response = await axios.post(url, data, { headers: req.headers })
  res.send(response.data)
}

module.exports = { getSelf, setSelf }
