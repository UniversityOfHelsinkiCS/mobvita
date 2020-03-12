const errorHandler = (error, req, res, next) => {
  if (error.name === 'ApplicationError') {
    return res.status(error.status).send({ error: error.story })
  }

  if (error) {
    return res.status(error.response.status).send(error.response.data.message)
  }
  return next(error)
}

module.exports = errorHandler
