const { axios } = require('@util/common')

const sendEmail = async (req, res) => {
  const url = '/email'
  const response = await axios.post(url, req.body, { headers: req.headers })
  res.send(response.data)
}

module.exports = { sendEmail }
