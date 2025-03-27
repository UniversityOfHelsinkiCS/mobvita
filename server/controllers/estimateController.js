const getEstimate = async (req, res) => {
  const { text } = req.body

  if (!text) {
    res.status(400).json({ error: 'Text is required' })
    return
  }

  const { ip } = req

  res.json({ difficulty: 10 })
}

module.exports = { getEstimate }
