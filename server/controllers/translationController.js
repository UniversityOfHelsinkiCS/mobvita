const { axios } = require('@util/common')

const getTranslation = async (req, res) => {
  const response = await axios.get(`/translate?w=${encodeURIComponent(req.params.wordLemmas)}&lang_learn=${req.params.language}&lang_target=English`, { headers: req.headers })
  res.send(response.data)
}

module.exports = {
  getTranslation
}