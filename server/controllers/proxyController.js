const { axios } = require('@util/common')

const TIMEOUT = 180000
const useMockContextTranslation = process.env.MOCK_CTX_TRANSLATE === 'true'

const escapeHtml = value => String(value || '')
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&#039;')

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

// Re-sends an uploaded file and its form fields to the backend; axios sets the multipart headers.
const proxyFilePost = async (req, res) => {
  const url = req.url.slice(5)

  const data = new FormData()
  const file = new Blob([req.file.buffer], { type: req.file.mimetype })
  data.append('file', file, req.file.originalname)
  Object.entries(req.body).forEach(entry => data.append(entry[0], entry[1]))

  const response = await axios.post(url, data, {
    headers: { authorization: req.headers.authorization },
    timeout: TIMEOUT,
  })
  res.send(response.data)
}

const mtProxyPost = async (req, res) => {
  if (useMockContextTranslation) {
    return res.send({
      ...req.body,
      translation: `<strong>Mock context translation</strong><br />${escapeHtml(req.body.source)}`,
    })
  }

  const url = (process.env.MT_URL || 'http://svm-58.cs.helsinki.fi:8888') + '/api/translate'
  const response = await axios.post(url, req.body, { headers: req.headers, timeout: TIMEOUT })
  res.send({
    ...response.data,
    ...req.body,
  })    
}

const mtStatus = async (req, res) => {
  if (useMockContextTranslation) {
    return res.send({
      languages: {
        en: ['fi', 'de', 'ru', 'es', 'fr', 'it', 'sv'],
        fi: ['en'],
        de: ['en'],
        ru: ['en'],
        es: ['en'],
        fr: ['en'],
        it: ['en'],
        sv: ['en'],
      },
    })
  }

  const url = (process.env.MT_URL || 'http://svm-58.cs.helsinki.fi:8888') + '/api/languages'
  const response = await axios.get(url, { headers: req.headers, timeout: TIMEOUT })
  res.send(response.data)    
}


module.exports = { proxyGet, proxyPost, proxyFilePost, mtProxyPost, mtStatus }
