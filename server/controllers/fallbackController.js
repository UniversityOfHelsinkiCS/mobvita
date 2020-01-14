const unknown = (req, res) => {
  res.status(404).send({ error: 'no such endpoint ' })
}

module.exports = { unknown }
