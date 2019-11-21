const { axios } = require('@util/common')

const getTranslation = async (req, res) => {
  const { wordLemmas, language, locale } = req.params
  const response = await axios
    .get(`/translate?w=${encodeURIComponent(wordLemmas)}&lang_learn=${language}&lang_target=${locale}`, { headers: req.headers })
  res.send(response.data)
}

module.exports = {
  getTranslation
}