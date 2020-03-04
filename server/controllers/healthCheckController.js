const { axios } = require('@util/common')

const checkRevitaStatus = async (req, res) => {
  await axios.get('/revitaStatus')
    .catch((error) => { // Revita returns error 404: no such endpoint, but it responds so its fine. TODO: Replace with healcheck api.
      if (error.response.status === 404) res.status(200).send('Backend is fine.')
    })

  res.status(200).send('Problems with backend')
}

module.exports = { checkRevitaStatus }
