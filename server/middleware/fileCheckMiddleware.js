const fileCheck = (req, res, next) => {
  if (req.headers['content-type'] && req.headers['content-type'].includes('multipart/form-data')) {
    req.url = `/file${req.url}`
  }
  next()
}

module.exports = fileCheck
