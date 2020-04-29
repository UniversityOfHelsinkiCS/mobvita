const headers = (req, res, next) => {
  const newHeaders = {}

  if (req.headers.authorization) {
    newHeaders.authorization = req.headers.authorization
  }

  // Required for multer to recognize files
  if (req.headers['content-type']) newHeaders['content-type'] = req.headers['content-type']
  if (req.headers['content-length']) newHeaders['content-length'] = req.headers['content-length']

  req.headers = newHeaders
  next()
}

module.exports = headers
