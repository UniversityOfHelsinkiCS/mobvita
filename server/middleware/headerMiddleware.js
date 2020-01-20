const headers = (req, res, next) => {
  const newHeaders = {}

  if (req.headers.authorization) {
    newHeaders.authorization = req.headers.authorization
  }

  req.headers = newHeaders
  next()
}

module.exports = headers
