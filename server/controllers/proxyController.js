const { axios } = require('@util/common')

const proxyGet = async (req, res) => {
  const { url } = req
  const response = await axios.get(url, { headers: req.headers })
  res.send(response.data)
}

const proxyPost = async (req, res) => {
  const { url } = req
  const response = await axios.post(url, req.body, { headers: req.headers })
  res.send(response.data)
}

module.exports = { proxyGet, proxyPost }
