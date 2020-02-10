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

const register = async (req, res) => {
  const data = req.body
  const url = '/register'
  const response = await axios.post(url, data, { headers: req.headers })
  res.send(response.data)
}

const confirm = async (req, res) => {
  const { token } = req.body
  const url = `/confirm?token=${token}`
  const response = await axios.get(url)
  res.send(response.data)
}

const testConfirm = async (req, res) => {
  const data = req.body
  const url = '/confirm/test'
  const response = await axios.post(url, data)
  res.send(response.data)
}

const remove = async (req, res) => {
  const data = req.body
  const url = '/user/remove'
  const response = await axios.post(url, data, { headers: req.headers })
  res.send(response.data)
}

module.exports = { getSelf, setSelf, register, confirm, testConfirm, remove }
