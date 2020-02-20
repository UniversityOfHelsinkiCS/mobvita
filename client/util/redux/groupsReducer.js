import callBuilder from '../apiConnection'

export const getGroups = () => {
  const route = '/groups/'
  const prefix = 'GET_GROUPS'
  return callBuilder(route, prefix, 'get')
}

export default (state = {}, action) => {
  switch (action.type) {
    case 'GET_GROUPS_ATTEMPT':
      return {
        ...state,
        pending: true,
        error: false,
      }
    case 'GET_GROUPS_FAILURE':
      return {
        ...state,
        pending: false,
        error: true,
      }
    case 'GET_GROUPS_SUCCESS':
      return {
        ...state,
        groups: action.response.groups,
        pending: false,
        error: false,
      }
    default:
      return state
  }
}
