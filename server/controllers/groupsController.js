const { axios } = require('@util/common')

const getGroups = async (req, res) => {
  const url = '/groups'
  const response = await axios.get(url, { headers: req.headers })
  res.send(response.data)
}

const addToGroup = async (req, res) => {
  const { groupId } = req.params
  const url = `/groups/${groupId}`
  const response = await axios.post(url, req.body, { headers: req.headers })
  res.send(response.data)
}

const createGroup = async (req, res) => {
  const url = '/groups'
  const response = await axios.post(url, req.body, { headers: req.headers })
  res.send(response.data)
}

module.exports = { getGroups, addToGroup, createGroup }
