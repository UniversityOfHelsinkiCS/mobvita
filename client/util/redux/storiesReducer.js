import callBuilder from '../apiConnection'
/**
 * Actions and reducers are in the same file for readability
 */

export const getStoryAction = (language, storyId) => {
  const route = `/stories/${language}/${storyId}`
  const prefix = 'GET_STORY'
  return callBuilder(route, prefix)
}

export const getStoriesAction = (language) => {
  const route = `/stories/${language}`
  const prefix = 'GET_STORIES'
  return callBuilder(route, prefix)
}

export const postStory = (newStory) => {
  const route = `/stories`
  const prefix = 'POST_NEW_STORY'
  return callBuilder(route, prefix, 'post', newStory)
}

// Reducer
// You can include more app wide actions such as "selected: []" into the state
export default (state = { data: [] }, action) => {
  switch (action.type) {
    case 'GET_STORIES_ATTEMPT':
      return {
        ...state,
        pending: true,
        error: false
      }
    case 'GET_STORIES_FAILURE':
      return {
        ...state,
        pending: false,
        error: true
      }
    case 'GET_STORIES_SUCCESS':
      return {
        ...state,
        data: action.response,
        pending: false,
        error: false,
      }
    case 'GET_STORY_ATTEMPT':
      return {
        ...state,
        pending: true,
        error: false
      }
    case 'GET_STORY_FAILURE':
      return {
        ...state,
        pending: false,
        error: true
      }
    case 'GET_STORY_SUCCESS':
      return {
        ...state,
        focused: action.response,
        pending: false,
        error: false,
      }
    case 'POST_NEW_STORY_ATTEMPT':
      return {
        ...state,
        pending: true,
        error: false
      }
    case 'POST_NEW_STORY_FAILURE':
      return {
        ...state,
        pending: false,
        error: true
      }
    case 'POST_NEW_STORY_SUCCESS':
      return {
        ...state,
        pending: false,
        error: false
      }
    default:
      return state
  }
}
