const errorHandler = (error, req, res, next) => {
  console.error(error.story, error.name, error.extra)

  if (error.name === 'ApplicationError') {
    return res.status(error.status).send({ error: error.story })
  }

  res.status(500).send({ error: error.story })
  return next(error)
}

module.exports = errorHandler
