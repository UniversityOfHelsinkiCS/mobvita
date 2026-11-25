import callBuilder from '../apiConnection'

// Shares stories via POST /stories/share; `pathDict` (optional) maps story id → folder on
// the receiving side (group folder / recipient's private folder); ids not in it land in the root.
export const shareStory = (storyIds, groups, users, message, hidden_story, pathDict) => {
  const route = '/stories/share'
  const payload = {
    story_ids: storyIds,
    share_groups: groups,
    share_users: users,
    share_message: message,
    hidden_story,
    ...(pathDict !== undefined && { path_dict: pathDict }),
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
