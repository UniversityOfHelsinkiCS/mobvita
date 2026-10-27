const { axios } = require('#util/common')

const STATUS_TIMEOUT_MS = 10000
const STATUS_CACHE_MS = 5000

let cached = { status: null, at: 0 }
let pending = null

// 'OK' only when the Revita backend says so; any other reply, error or timeout is 'NOT OK'.
const fetchRevitaStatus = async () => {
  try {
    const response = await axios.get('status', { timeout: STATUS_TIMEOUT_MS })
    return response.data.message === 'OK' ? 'OK' : 'NOT OK'
  } catch {
    return 'NOT OK'
  }
}

// Serves the backend status cached for 5 s and shares one in-flight call, so client polling
// reaches the Revita backend at most once per cache period however many tabs are open.
const checkRevitaStatus = async (req, res) => {
  if (Date.now() - cached.at >= STATUS_CACHE_MS) {
    pending ??= fetchRevitaStatus().then(status => {
      cached = { status, at: Date.now() }
      pending = null
      return status
    })
    await pending
  }
  res.send(cached.status)
}

module.exports = { checkRevitaStatus }
