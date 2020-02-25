import callBuilder from '../apiConnection'

export const getGroups = () => {
  const route = '/groups/'
  const prefix = 'GET_GROUPS'
  return callBuilder(route, prefix, 'get')
}

export const addToGroup = (students, teachers, groupId) => {
  const route = `/groups/${groupId}`
  const payload = { students, teachers }
  const prefix = 'ADD_STUDENTS'
  return callBuilder(route, prefix, 'post', payload)
}

export const createGroup = (groupName, students, teachers) => {
  const route = '/groups/'
  const payload = {
    group_name: groupName,
    students,
    teachers,
  }
  const prefix = 'CREATE_GROUP'
  return callBuilder(route, prefix, 'post', payload)
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
        groups: action.response.groups.sort((a, b) => a.groupName.localeCompare(b.groupName)),
        pending: false,
        error: false,
      }
    case 'ADD_STUDENTS_ATTEMPT':
      return {
        ...state,
        pending: true,
        error: false,
      }
    case 'ADD_STUDENTS_FAILURE':
      return {
        ...state,
        pending: false,
        error: true,
      }
    case 'ADD_STUDENTS_SUCCESS':
      return {
        ...state,
        groups: state.groups
          .filter(g => g.group_id !== action.response.group.group_id)
          .concat(action.response.group)
          .sort((a, b) => a.groupName.localeCompare(b.groupName)),
        pending: false,
        error: false,
      }
    case 'CREATE_GROUP_ATTEMPT':
      return {
        ...state,
        pending: true,
        error: false,
      }
    case 'CREATE_GROUP_FAILURE':
      return {
        ...state,
        pending: false,
        error: true,
      }
    case 'CREATE_GROUP_SUCCESS':
      return {
        ...state,
        groups: state.groups
          .concat(action.response.group)
          .sort((a, b) => a.groupName.localeCompare(b.groupName)),
        created: action.response.group,
        pending: false,
        error: false,
      }
    default:
      return state
  }
}
