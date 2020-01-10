const errorHandler = (error, req, res, next) => {
  if (error.name === 'ApplicationError') {
    return res.status(error.status).send({ error: error.story })
  }

  if (error.response.status === 401) {
    return res.status(401).send(error.response.data.message)
  }

  if (error) { res.status(500).send({ error: error.story }) }
  return next(error)
}

module.exports = errorHandler
