import axios from 'axios'
import { basePath } from 'Utilities/common'
/**
 * ApiConnection simplifies redux usage
 */

const getAxios = axios.create({ baseURL: `${basePath}api` })

export const callApi = async (url, method = 'get', data, query) => {
  const user = localStorage.getItem('user')
  const token = user ? JSON.parse(user).access_token : ''
  const headers = token ? { Authorization: `Bearer ${token}` } : {}

  return getAxios({
    method,
    url,
    data,
    headers,
    params: query,
  })
}

export default (route, prefix, method = 'get', data, query, cache) => ({
  type: `${prefix}_ATTEMPT`,
  requestSettings: {
    route,
    method,
    data,
    prefix,
    query,
    cache,
  },
})

const SERVER_ERROR_STATUSES = [502, 503, 504]

const handleError = (store, error, prefix, query) => {
  if (SERVER_ERROR_STATUSES.includes(error.response.status)) {
    store.dispatch({ type: 'SET_SERVER_ERROR' })
    store.dispatch({ type: `${prefix}_FAILURE`, query })
  } else {
    store.dispatch({ type: `${prefix}_FAILURE`, response: error.response.data, query })
  }
}

/**
 * This is a redux middleware used for tracking api calls
 */

export const handleRequest = store => next => async action => {
  next(action)
  const { requestSettings } = action
  if (requestSettings) {
    const { route, method, data, prefix, query, cache } = requestSettings
    try {
      const res = await callApi(route, method, data, query)
      if (cache) {
        window.localStorage.setItem(cache, JSON.stringify(res.data))
      }
      store.dispatch({ type: `${prefix}_SUCCESS`, response: res.data, query })
    } catch (err) {
      handleError(store, err, prefix, query)
    }
  }
}
