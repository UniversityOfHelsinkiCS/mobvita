const { ApplicationError } = require('@util/customErrors')
const axios = require('axios')

/**
 * Simple example for backend
 */
const getAll = async (req, res) => {
  res.send([{ id: 1, body: 'Story1' }, { id: 2, body: 'Story 2' }])
}

module.exports = {
  getAll,
}
