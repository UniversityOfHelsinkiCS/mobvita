import callBuilder from '../apiConnection'

// Shares a batch of stories with groups and/or users via POST /stories/share; `path` (optional)
// is the folder they get on the receiving side (group folder / recipient's private folder).
export const shareStory = (storyIds, groups, users, message, hidden_story, path) => {
  const route = '/stories/share'
  const payload = {
    story_ids: storyIds,
    share_groups: groups,
    share_users: users,
    share_message: message,
    hidden_story,
    ...(path !== undefined && { path }),
  }
  const prefix = 'SHARE_STORY'
  return { ...callBuilder(route, prefix, 'post', payload), meta: { storyCount: storyIds.length } }
}

export default (state = { sharedToGroupSinceLastFetch: false }, action) => {
  switch (action.type) {
    case 'SHARE_STORY_ATTEMPT':
      return {
        ...state,
        pending: true,
      }
    case 'SHARE_STORY_FAILURE':
      return {
        ...state,
        pending: false,
      }
    case 'SHARE_STORY_SUCCESS':
      return {
        status: action.response,
        pending: true,
        sharedToGroupSinceLastFetch: true,
      }
    case 'GET_STORIES_SUCCESS':
      return {
        ...state,
        sharedToGroupSinceLastFetch: false,
      }
    default:
      return state
  }
}
