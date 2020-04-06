import callBuilder from '../apiConnection'

export const shareStory = (storyId, groups, users, message) => {
  const route = `/stories/${storyId}/share`
  const payload = {
    share_groups: groups,
    share_users: users,
    share_message: message,
  }
  const prefix = 'SHARE_STORY'
  return callBuilder(route, prefix, 'post', payload)
}

export const unshareStory = (groupId, storyId) => {
  const route = `/groups/${groupId}/unshare/${storyId}`
  const prefix = 'UNSHARE_STORY'
  return callBuilder(route, prefix, 'post', {})
}

export default (state = {}, action) => {
  switch (action.type) {
    case 'SHARE_STORY_ATTEMPT':
      return {
        ...state,
        pending: true,
        error: false,
      }
    case 'SHARE_STORY_FAILURE':
      return {
        ...state,
        pending: false,
        error: true,
      }
    case 'SHARE_STORY_SUCCESS':
      return {
        status: action.response,
        pending: true,
        error: false,
      }
    case 'UNSHARE_STORY_ATTEMPT':
      return {
        ...state,
        pending: true,
        error: false,
      }
    case 'UNSHARE_STORY_FAILURE':
      return {
        ...state,
        pending: false,
        error: true,
      }
    case 'UNSHARE_STORY_SUCCESS':
      return {
        status: action.response,
        pending: false,
        error: false,
      }
    default:
      return state
  }
}
