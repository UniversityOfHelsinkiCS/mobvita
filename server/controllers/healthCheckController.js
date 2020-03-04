const { axios } = require('@util/common')


const checkRevitaStatus = async (req, res) => {
  try {
    const response = await axios.get('status')
    if (response.data.message === 'OK') {
      res.send('OK')
    }
  } catch (e) {
    res.send('NOT OK')
  }
}

module.exports = { checkRevitaStatus }
