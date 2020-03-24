import callBuilder from '../apiConnection'

export const getGroups = () => {
  const route = '/groups/'
  const prefix = 'GET_GROUPS'
  return callBuilder(route, prefix, 'get')
}

export const getGroup = (id) => {
  const route = `/groups/${id}`
  const prefix = 'GET_GROUP'
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

export const removeFromGroup = (groupId, userId) => {
  const route = `/groups/${groupId}/remove/${userId}`
  const prefix = 'REMOVE_FROM_GROUP'
  return callBuilder(route, prefix, 'post')
}

export const deleteGroup = (groupId) => {
  const route = `/groups/${groupId}/remove`
  const prefix = 'DELETE_GROUP'
  return callBuilder(route, prefix, 'post')
}

export const getTestConcepts = (groupId) => {
  const route = `/test/template?group_id=${groupId}`
  const prefix = 'GET_GROUP_TEST_CONCEPTS'
  return callBuilder(route, prefix, 'get')
}

export const updateTestConcepts = (groupId, updatedValues) => {
  const route = 'test/template'
  const prefix = 'SET_GROUP_TEST_CONCEPTS'
  const payload = { group_id: groupId, question_template: updatedValues }
  return callBuilder(route, prefix, 'post', payload)
}

export const updateExerciseSettings = (settings, groupId) => {
  const route = `/groups/${groupId}`
  const prefix = 'SET_GROUP_EXERCISE_CONCEPTS'
  const payload = { exercise_setting: settings }
  return callBuilder(route, prefix, 'post', payload)
}

export const getGroupToken = (groupId) => {
  const route = `/groups/${groupId}/token`
  const prefix = 'GET_GROUP_TOKEN'
  return callBuilder(route, prefix, 'get')
}

export default (state = { groups: [] }, action) => {
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
    case 'GET_GROUP_ATTEMPT':
      return {
        ...state,
        pending: true,
        error: false,
      }
    case 'GET_GROUP_FAILURE':
      return {
        ...state,
        pending: false,
        error: true,
      }
    case 'GET_GROUP_SUCCESS':
      return {
        ...state,
        group: action.response,
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
        pending: false,
        error: false,
      }
    case 'REMOVE_FROM_GROUP_ATTEMPT':
      return {
        ...state,
        pending: true,
        error: false,
      }
    case 'REMOVE_FROM_GROUP_FAILURE':
      return {
        ...state,
        pending: false,
        error: true,
      }
    case 'REMOVE_FROM_GROUP_SUCCESS':
      return {
        ...state,
        groups: state.groups
          .filter(g => g.group_id !== action.response.group.group_id)
          .concat(action.response.group)
          .sort((a, b) => a.groupName.localeCompare(b.groupName)),
        pending: false,
        error: false,
      }

    case 'DELETE_GROUP_ATTEMPT':
      return {
        ...state,
        pending: true,
        error: false,
      }
    case 'DELETE_GROUP_FAILURE':
      return {
        ...state,
        pending: false,
        error: true,
      }
    case 'DELETE_GROUP_SUCCESS':
      return {
        ...state,
        groups: state.groups
          .filter(group => group.group_id !== action.response.removed),
        pending: false,
        error: false,
      }
    case 'GET_GROUP_TEST_CONCEPTS_ATTEMPT':
      return {
        ...state,
        testConceptsPending: true,
        error: false,
      }
    case 'GET_GROUP_TEST_CONCEPTS_FAILURE':
      return {
        ...state,
        testConceptsPending: false,
        error: true,
      }
    case 'GET_GROUP_TEST_CONCEPTS_SUCCESS':
      return {
        ...state,
        testConcepts: action.response,
        testConceptsPending: false,
        error: false,
      }
    case 'SET_GROUP_TEST_CONCEPTS_ATTEMPT':
      return {
        ...state,
        testConceptsPending: true,
        error: false,
      }
    case 'SET_GROUP_TEST_CONCEPTS_FAILURE':
      return {
        ...state,
        testConceptsPending: false,
        error: true,
      }
    case 'SET_GROUP_TEST_CONCEPTS_SUCCESS':
      return {
        ...state,
        testConceptsPending: false,
        error: false,
      }
    case 'SET_GROUP_EXERCISE_CONCEPTS_ATTEMPT':
      return {
        ...state,
        pending: true,
        error: false,
      }
    case 'SET_GROUP_EXERCISE_CONCEPTS_FAILURE':
      return {
        ...state,
        pending: false,
        error: true,
      }
    case 'SET_GROUP_EXERCISE_CONCEPTS_SUCCESS':
      return {
        ...state,
        group: { ...state.group, ...action.response },
        pending: false,
        error: false,
      }
    case 'GET_GROUP_TOKEN_ATTEMPT':
      return {
        ...state,
        error: false,
      }
    case 'GET_GROUP_TOKEN_FAILURE':
      return {
        ...state,
        error: true,
      }
    case 'GET_GROUP_TOKEN_SUCCESS':
      return {
        ...state,
        token: action.response.token,
        error: false,
      }

    default:
      return state
  }
}
