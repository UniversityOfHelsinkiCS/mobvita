const unknown = (req, res) => {
  res.status(404).send({ error: 'Revita: no such endpoint ' })
}

module.exports = { unknown }
