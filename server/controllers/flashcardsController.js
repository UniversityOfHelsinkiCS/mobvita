const { axios } = require('@util/common')

const getFlashcards = async (req, res) => {
  const { inputLanguage, outputLanguage } = req.params
  const url = `/flashcards/${inputLanguage}/${outputLanguage}`
  const response = await axios.get(url, { headers: req.headers })
  res.send(response.data)
}

const getStoryFlashcards = async (req, res) => {
  const { inputLanguage, outputLanguage, storyId } = req.params
  const url = `/flashcards/${inputLanguage}/${outputLanguage}?story_id=${storyId}`
  const response = await axios.get(url, { headers: req.headers })
  res.send(response.data)
}

const recordFlashcardAnswer = async (req, res) => {
  const { inputLanguage, outputLanguage } = req.params
  const url = `/flashcards/${inputLanguage}/${outputLanguage}/answer`
  const response = await axios.post(url, req.body, { headers: req.headers })
  res.send(response.data)
}

const deleteFlashcard = async (req, res) => {
  const { id } = req.params
  const url = `/flashcards/${id}`
  const response = await axios.post(url, { op: 'delete' }, { headers: req.headers })
  res.send(response.data)
}

module.exports = { getFlashcards, getStoryFlashcards, recordFlashcardAnswer, deleteFlashcard }
