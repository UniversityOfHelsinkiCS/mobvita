import axios from 'axios'
import { basePath, timerExpired } from 'Utilities/common'
import * as Sentry from '@sentry/react'
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

const SERVER_UNRESPONSIVE_STATUSES = [502, 503, 504]
const SERVER_INTERNAL_ERROR_STATUS = 500

class EndpointError extends Error {
  constructor(message) {
    super(message)
    this.name = 'EndpointError'
  }
}

const sendSentryEvent = (message, fingerprint) => {
  Sentry.captureException(new EndpointError(message), { fingerprint })
}

const handleError = (store, error, prefix, query) => {
  console.log('handle error')
  if (error?.response?.status === SERVER_INTERNAL_ERROR_STATUS) {
    const sentryMessage = `500 @ ${prefix}`
    const sentryFingerprint = ['Type: 500', `Action: ${prefix}`]
    sendSentryEvent(sentryMessage, sentryFingerprint)
  }

  if (SERVER_UNRESPONSIVE_STATUSES.includes(error?.response?.status)) {
    const sentryMessage = 'Endpoint unresponsive'
    const sentryFingerprint = ['Type: 502/503/504']
    sendSentryEvent(sentryMessage, sentryFingerprint)
    store.dispatch({ type: 'SET_SERVER_ERROR' })
    store.dispatch({ type: `${prefix}_FAILURE`, query })
  } else {
    store.dispatch({ type: `${prefix}_FAILURE`, response: error.response?.data, query })
  }
}

const handleNewAchievement = (store, newAchievements) => {
  const cachedAchievements = JSON.parse(window.localStorage.getItem('newAchievements'))
  const filteredAchievements = cachedAchievements
    ? newAchievements.filter(
        achievement =>
          !cachedAchievements.some(
            cachedAchievement =>
              cachedAchievement.name === achievement.name &&
              cachedAchievement.level === achievement.level
          )
      )
    : newAchievements

  if (filteredAchievements.length > 0) {
    store.dispatch({
      type: 'SET_NEW_ACHIEVEMENTS',
      newAchievements: filteredAchievements,
    })
    window.localStorage.setItem(
      'newAchievements',
      JSON.stringify(
        cachedAchievements ? cachedAchievements.concat(filteredAchievements) : filteredAchievements
      )
    )
  }
}

/**
 * This is a redux middleware used for tracking api calls
 */

export const handleRequest = store => next => async action => {
  next(action)

  const userStorage = localStorage.getItem('user')
  const requestStorage = localStorage.getItem('last_request')
  if (JSON.parse(userStorage)?.timeStamp) {
    const timeStamp = userStorage ? JSON.parse(userStorage).timeStamp : ''
    const parsedDate = Date.parse(timeStamp)

    const isExpired = timerExpired(parsedDate, 24)
    if (isExpired) {
      store.dispatch({ type: 'LOGOUT_SUCCESS' })
    }
  } else {
    const parsedDate = Date.parse(requestStorage)

    const needsRefreshing = timerExpired(parsedDate, 10)
    if (needsRefreshing) {
      const requestSentAt = new Date()
      window.localStorage.setItem('last_request', requestSentAt)

      window.location.reload()
      return
    }
  }

  const { requestSettings } = action
  if (requestSettings) {
    const { route, method, data, prefix, query, cache } = requestSettings
    try {
      const res = await callApi(route, method, data, query)
      if (cache) {
        window.localStorage.setItem(cache, JSON.stringify(res.data))
      }
      if (res.data?.new_achievements?.length > 0) {
        handleNewAchievement(store, res.data.new_achievements)
      }
      const requestSentAt = new Date()
      window.localStorage.setItem('last_request', requestSentAt)

      store.dispatch({ type: `${prefix}_SUCCESS`, response: res.data, query })
    } catch (err) {
      handleError(store, err, prefix, query)
    }
  }
}
