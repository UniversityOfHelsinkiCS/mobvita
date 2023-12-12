const { axios } = require('@util/common')
const FormData = require('form-data')

const TIMEOUT = 90000

const proxyGet = async (req, res) => {
  const { url } = req
  const response = await axios.get(url, { headers: req.headers, timeout: TIMEOUT })
  res.send(response.data)
}

const proxyPost = async (req, res) => {
  const { url } = req
  const response = await axios.post(url, req.body, { headers: req.headers, timeout: TIMEOUT })
  res.send(response.data)
}

const proxyFilePost = async (req, res) => {
  const url = req.url.slice(5)

  const data = new FormData()
  data.append('file', req.file.buffer, {
    filename: req.file.originalname,
    knownLength: req.file.buffer.size,
  })
  Object.entries(req.body).forEach(entry => data.append(entry[0], entry[1]))

  const response = await axios.post(url, data, {
    headers: {
      authorization: req.headers.authorization,
      'Content-Length': data.getLengthSync(),
      'Content-Type': `multipart/form-data; boundary=${data._boundary}`,
      timeout: TIMEOUT,
    },
  })
  res.send(response.data)
}

const mtProxyPost = async (req, res) => {
  url = (process.env.MT_URL || 'http://svm-58.cs.helsinki.fi:8888') + '/api/translate'
  const response = await axios.post(url, req.body, { headers: req.headers, timeout: TIMEOUT })
  res.send({
    ...response.data,
    ...req.body,
  })    
}


module.exports = { proxyGet, proxyPost, proxyFilePost, mtProxyPost }
