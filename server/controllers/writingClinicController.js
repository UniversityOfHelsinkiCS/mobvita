const Axios = require('axios')

const TIMEOUT = 180000
const MAX_TEXT_LENGTH = 20000
const DEFAULT_WRITING_CLINIC_URL = 'http://svm-58.cs.helsinki.fi:1234'

const getClient = () => {
  const baseURL = (process.env.WRITING_CLINIC_URL || DEFAULT_WRITING_CLINIC_URL).replace(/\/$/, '')

  return Axios.create({ baseURL, timeout: TIMEOUT })
}

const getWritingClinicMeta = async (_req, res) => {
  const client = getClient()

  const response = await client.get('/api/meta')
  return res.send(response.data)
}

const analyzeWritingClinicText = async (req, res) => {
  const client = getClient()

  const text = typeof req.body?.text === 'string' ? req.body.text.trim() : ''
  if (!text) return res.status(400).send({ detail: 'Text is required.' })
  if (text.length > MAX_TEXT_LENGTH) {
    return res.status(413).send({ detail: `Text must not exceed ${MAX_TEXT_LENGTH} characters.` })
  }

  const response = await client.post('/api/analyze', { text })
  return res.send(response.data)
}

module.exports = { getWritingClinicMeta, analyzeWritingClinicText, MAX_TEXT_LENGTH }
