const { axios } = require('@util/common')

const getTranslation = async (req, res) => {
  const { language, locale } = req.params
  const { wordLemmas, storyId, wordId } = req.body
  const story = storyId ? `&story_id=${storyId}&word_id=${wordId}` : ''
  const response = await axios
    .get(`/translate?w=${encodeURIComponent(wordLemmas)}&lang_learn=${language}&lang_target=${locale}${story}`, { headers: req.headers })
  res.send(response.data)
}

module.exports = {
  getTranslation,
}