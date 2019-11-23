const { axios } = require('@util/common')

const getOpponent = async (req, res) => {
  const { story_id: storyId } = req.query
  const url = `/opponent?story_id=${storyId}`
  const response = await axios.get(url, { headers: req.headers })
  res.send(response.data)
}

module.exports = {
  getOpponent,
}
