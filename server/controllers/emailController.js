const { axios } = require('@util/common')

const sendEmail = async (req, res) => {
  const url = '/contact'
  const response = await axios.post(url, req.body, { headers: req.headers })
  res.send(response.data)
}

module.exports = { sendEmail }
