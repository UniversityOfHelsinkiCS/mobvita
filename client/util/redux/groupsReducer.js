import callBuilder from '../apiConnection'

export const getGroups = () => {
  const route = '/groups/'
  const prefix = 'GET_GROUPS'
  return callBuilder(route, prefix, 'get')
}

export const getGroup = id => {
  const route = `/groups/${id}`
  const prefix = 'GET_GROUP'
  return callBuilder(route, prefix, 'get')
}

export const addToGroup = (students, teachers, groupId) => {
  const route = `/groups/${groupId}`
  const payload = { students, teachers }
  const prefix = 'ADD_PEOPLE'
  return callBuilder(route, prefix, 'post', payload)
}

export const createGroup = (groupName, description, students, teachers) => {
  const route = '/groups/'
  const payload = {
    group_name: groupName,
    description,
    students,
    teachers,
  }
  const prefix = 'CREATE_GROUP'
  return callBuilder(route, prefix, 'post', payload)
}

export const removeFromGroup = (groupId, userId, role) => {
  const route = `/groups/${groupId}/remove/${userId}`
  const prefix = 'REMOVE_FROM_GROUP'
  const payload = {
    role,
  }
  return callBuilder(route, prefix, 'post', payload)
}

export const leaveFromGroup = (groupId, userId) => {
  const route = `/groups/${groupId}/remove/${userId}`
  const prefix = 'LEAVE_FROM_GROUP'
  return callBuilder(route, prefix, 'post')
}

export const deleteGroup = groupId => {
  const route = `/groups/${groupId}/remove`
  const prefix = 'DELETE_GROUP'
  return callBuilder(route, prefix, 'post')
}

export const setGroupTestDeadline = (deadlineDate, groupId) => {
  const route = `/groups/${groupId}`
  const prefix = 'SET_GROUP_TEST_DEADLINE'
  const payload = { test_deadline: deadlineDate }
  return callBuilder(route, prefix, 'post', payload)
}

export const getTestConcepts = (groupId, learningLanguage) => {
  const route = `test/${learningLanguage}/template?group_id=${groupId}`
  const prefix = 'GET_GROUP_TEST_CONCEPTS'
  return callBuilder(route, prefix, 'get')
}

export const updateTestConcepts = (groupId, updatedValues, learningLanguage) => {
  const route = `test/${learningLanguage}/template`
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

export const updateTempExerciseSettings = (conceptSetting) => (
  {type: 'SET_GROUP_EXERCISE_CONCEPTS_INTERMEDIATE', conceptSetting}
)

export const updateExerciseTemplate = (template, groupId) => {
  const route = `/groups/${groupId}`
  const prefix = 'SET_GROUP_EXERCISE_TEMPLATE'
  const payload = { exercise_setting_template: template }
  return callBuilder(route, prefix, 'post', payload)
}

export const updateGroupMaxPracticePercent = (value, groupId) => {
  const route = `/groups/${groupId}`
  const prefix = 'SET_GROUP_MAX_PRACTICE_PRCT'
  const payload = { max_practice_prct: value }
  return callBuilder(route, prefix, 'post', payload)
}

export const getGroupToken = groupId => {
  const route = `/groups/${groupId}/token`
  const prefix = 'GET_GROUP_TOKEN'
  return callBuilder(route, prefix, 'get')
}

export const joinGroup = token => {
  const route = '/groups/join'
  const prefix = 'JOIN_GROUP'
  const payload = { token }
  return callBuilder(route, prefix, 'post', payload)
}

export const resendGroupInvitation = (groupId, userId) => {
  const route = `/groups/${groupId}/re-invite/${userId}`
  const prefix = 'RESEND_GROUP_INVITATION'
  return callBuilder(route, prefix, 'get')
}

export const confirmGroupInvitation = token => {
  const route = '/groups/accept-invitation'
  const prefix = 'JOIN_GROUP'
  const payload = { token }
  return callBuilder(route, prefix, 'post', payload)
}

export const importStoriesFromGroup = (groupId, selectedGroups, message) => {
  const route = `/groups/${groupId}/import`
  const prefix = 'IMPORT_STORIES'
  const payload = { src_group_ids: selectedGroups, message }
  return callBuilder(route, prefix, 'post', payload)
}

export const emptyLastAddInfo = () => ({
  type: 'EMPTY_LAST_ADD_INFO',
})

export default (state = { groups: [], joinPending: false, deleteSuccessful: false, storyImported: -1 }, action) => {
  switch (action.type) {
    case 'GET_GROUPS_ATTEMPT':
      return {
        ...state,
        pending: true,
      }
    case 'GET_GROUPS_FAILURE':
      return {
        ...state,
        pending: false,
      }
    case 'GET_GROUPS_SUCCESS':
      return {
        ...state,
        groups: action.response.groups.sort((a, b) => a.groupName.localeCompare(b.groupName)),
        created: null,
        pending: false,
      }
    case 'GET_GROUP_ATTEMPT':
      return {
        ...state,
        pending: true,
      }
    case 'GET_GROUP_FAILURE':
      return {
        ...state,
        pending: false,
      }
    case 'GET_GROUP_SUCCESS':
      return {
        ...state,
        group: action.response,
        pending: false,
      }
    case 'ADD_PEOPLE_ATTEMPT':
      return {
        ...state,
        pending: true,
      }
    case 'ADD_PEOPLE_FAILURE':
      return {
        ...state,
        pending: false,
      }
    case 'ADD_PEOPLE_SUCCESS':
      return {
        ...state,
        lastAddInfo: [
          {
            studentsAdded: action.response.added_students,
            toBeConfirmedStudents: action.response.to_be_confirmed_students,
            addingFailedStudents: action.response.failed_students,
            teachersAdded: action.response.added_teachers,
            toBeConfirmedTeachers: action.response.to_be_confirmed_teachers,
            addingFailedTeachers: action.response.failed_teachers,
          },
        ],
        groups: state.groups
          .filter(g => g.group_id !== action.response.group.group_id)
          .concat({
            ...action.response.group,
            peopleInvited: true,
            addedPeople: action.response.added_students.concat(action.response.added_teachers),
            failedInvitations: action.response.failed_students.concat(
              action.response.failed_teachers
            ),
            pendingInvitations: action.response.to_be_confirmed_students.concat(
              action.response.to_be_confirmed_teachers
            ),
          })
          .sort((a, b) => a.groupName.localeCompare(b.groupName)),
        pending: false,
      }
    case 'CREATE_GROUP_ATTEMPT':
      return {
        ...state,
        pending: true,
      }
    case 'CREATE_GROUP_FAILURE':
      return {
        ...state,
        pending: false,
      }
    case 'CREATE_GROUP_SUCCESS':
      return {
        ...state,
        lastAddInfo: [
          {
            studentsAdded: action.response.added_students,
            toBeConfirmedStudents: action.response.to_be_confirmed_students,
            addingFailedStudents: action.response.failed_students,
            teachersAdded: action.response.added_teachers,
            toBeConfirmedTeachers: action.response.to_be_confirmed_teachers,
            addingFailedTeachers: action.response.failed_teachers,
          },
        ],
        groups: state.groups
          .concat(action.response.group)
          .sort((a, b) => a.groupName.localeCompare(b.groupName)),
        created: action.response.group,
        pending: false,
      }
    case 'REMOVE_FROM_GROUP_SUCCESS':
      return {
        ...state,
        groups: state.groups
          .filter(g => g.group_id !== action.response.group.group_id)
          .concat(action.response.group)
          .sort((a, b) => a.groupName.localeCompare(b.groupName)),
      }
    case 'DELETE_GROUP_ATTEMPT':
      return {
        ...state,
        pending: true,
        deleteSuccessful: false,
      }
    case 'DELETE_GROUP_FAILURE':
      return {
        ...state,
        pending: false,
      }
    case 'DELETE_GROUP_SUCCESS':
      return {
        ...state,
        groups: state.groups.filter(group => group.group_id !== action.response.removed),
        pending: false,
        deleteSuccessful: true,
      }
    case 'GET_GROUP_TEST_CONCEPTS_ATTEMPT':
      return {
        ...state,
        testConceptsPending: true,
      }
    case 'GET_GROUP_TEST_CONCEPTS_FAILURE':
      return {
        ...state,
        testConceptsPending: false,
      }
    case 'GET_GROUP_TEST_CONCEPTS_SUCCESS':
      return {
        ...state,
        testConcepts: action.response,
        testConceptsPending: false,
      }
    case 'SET_GROUP_TEST_CONCEPTS_ATTEMPT':
      return {
        ...state,
        testConceptsPending: true,
      }
    case 'SET_GROUP_TEST_CONCEPTS_FAILURE':
      return {
        ...state,
        testConceptsPending: false,
      }
    case 'SET_GROUP_TEST_CONCEPTS_SUCCESS':
      return {
        ...state,
        testConcepts: action.response,
        testConceptsPending: false,
      }
    case 'SET_GROUP_EXERCISE_CONCEPTS_ATTEMPT':
      return {
        ...state,
        pending: true,
      }
    case 'SET_GROUP_EXERCISE_CONCEPTS_FAILURE':
      return {
        ...state,
        pending: false,
      }
    case 'SET_GROUP_EXERCISE_CONCEPTS_INTERMEDIATE':
      return {
        ...state,
        group: { ...state.group, exercise_setting: action.conceptSetting },
        pending: false,
      }
    case 'SET_GROUP_EXERCISE_CONCEPTS_SUCCESS':
      return {
        ...state,
        group: { ...state.group, ...action.response },
        pending: false,
      }
    case 'SET_GROUP_EXERCISE_TEMPLATE_ATTEMPT':
      return {
        ...state,
        pending: true,
      }
    case 'SET_GROUP_EXERCISE_TEMPLATE_FAILURE':
      return {
        ...state,
        pending: false,
      }
    case 'SET_GROUP_EXERCISE_TEMPLATE_SUCCESS':
      return {
        ...state,
        groups: state.groups
          .filter(group => group.group_id !== action.response.group.group_id)
          .concat(action.response.group)
          .sort((a, b) => a.groupName.localeCompare(b.groupName)),
        pending: false,
      }

    case 'SET_GROUP_MAX_PRACTICE_PRCT_ATTEMPT':
      return {
        ...state,
        pending: true,
      }
    case 'SET_GROUP_MAX_PRACTICE_PRCT_FAILURE':
      return {
        ...state,
        pending: false,
      }
    case 'SET_GROUP_MAX_PRACTICE_PRCT_SUCCESS':
      return {
        ...state,
        groups: state.groups
          .filter(group => group.group_id !== action.response.group.group_id)
          .concat(action.response.group)
          .sort((a, b) => a.groupName.localeCompare(b.groupName)),
        pending: false,
      }
    case 'GET_GROUP_TOKEN_SUCCESS':
      return {
        ...state,
        token: action.response.token,
      }
    case 'JOIN_GROUP_ATTEMPT':
      return {
        ...state,
        joinPending: true,
      }
    case 'JOIN_GROUP_FAILURE':
      return {
        ...state,
        joinPending: false,
      }
    case 'JOIN_GROUP_SUCCESS':
      return {
        ...state,
        groups: state.groups
          .concat(action.response.group)
          .sort((a, b) => a.groupName.localeCompare(b.groupName)),
        joinPending: false,
      }
    case 'LEAVE_FROM_GROUP_ATTEMPT':
      return {
        ...state,
        pending: true,
      }
    case 'LEAVE_FROM_GROUP_FAILURE':
      return {
        ...state,
        pending: false,
      }
    case 'LEAVE_FROM_GROUP_SUCCESS':
      return {
        ...state,
        groups: action.response.groups.sort((a, b) => a.groupName.localeCompare(b.groupName)),
        pending: false,
      }
    case 'EMPTY_LAST_ADD_INFO':
      return {
        ...state,
        lastAddInfo: null,
      }
    case 'RESEND_GROUP_INVITATION_ATTEMPT':
      return {
        ...state,
        pending: true,
      }
    case 'RESEND_GROUP_INVITATION_FAILURE':
      return {
        ...state,
        pending: false,
      }
    case 'RESEND_GROUP_INVITATION_SUCCESS':
      return {
        ...state,
        pending: false,
      }

    case 'IMPORT_STORIES_ATTEMPT':
      return {
        ...state,
        pending: true,
      }
    case 'IMPORT_STORIES_FAILURE':
      return {
        ...state,
        pending: false,
      }
    case 'IMPORT_STORIES_SUCCESS':
      return {
        ...state,
        storyImported: action.response.num_story_imported,
        pending: false,
      }

    case 'CLEAN_STORY_IMPORT':
      return {
        ...state,
        storyImported: -1,
      }

    default:
      return state
  }
}
