const unknown = (req, res) => {
  res.status(404).send({ error: 'Mobvita: no such endpoint ' })
}

module.exports = { unknown }
