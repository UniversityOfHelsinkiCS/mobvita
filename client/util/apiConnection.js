import axios from 'axios'
import { basePath, timerExpired } from 'Utilities/common'
import * as Sentry from '@sentry/react'
import {Howl, Howler} from 'howler';
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
  if (JSON.parse(userStorage)?.timeStamp) {
    const timeStamp = userStorage ? JSON.parse(userStorage).timeStamp : ''
    const parsedDate = Date.parse(timeStamp)

    const isExpired = timerExpired(parsedDate, 24)
    if (isExpired) {
      store.dispatch({ type: 'LOGOUT_SUCCESS' })
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

const recordSpeak = (text, voice_type, source, lang_code, is_success) => {
  console.log(voice_type, source, lang_code, is_success)
  callApi(`/listen?text=${encodeURIComponent(text)}&voice_type=${voice_type}&source=${source}&lang_code=${lang_code}&is_success=${is_success}`)
}

export const RVSpeak = (text, lang_code, tone, voice_type) => {
  const parameters = {
    onend: function(){
      recordSpeak(text, voice_type, 'ResponsiveVoice', lang_code, 1)
    },
    onerror: function(){
      recordSpeak(text, voice_type, 'ResponsiveVoice', lang_code, 0)
    }
  }
  window.responsiveVoice.speak(text, lang_code + ' ' + tone, parameters)
}

export const yandexSpeak = async (text, lang_code, tone, voice_type) => {
  const error_func = (sound_id, e) => {
    console.log(sound_id, e)
    recordSpeak(text, voice_type, 'Yandex', lang_code, 0)
  }
  new Howl({
    src: [`${basePath}api/yandex_tts?text=${encodeURIComponent(text)}&tone=${tone}&lang_code=${lang_code}`],
    format: ['opus'],
    autoplay: true,
    onend: function(){recordSpeak(text, voice_type, 'Yandex', lang_code, 1)},
    onloaderror: error_func,
    onplayerror: error_func
  })
}

