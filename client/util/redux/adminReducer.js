import callBuilder from 'Utilities/apiConnection'

// Admin actions that operate on OTHER users (search + manage). Kept separate from userReducer
// (which represents the *current* user) so these higher-risk, cross-user operations are isolated.
//
//   Search: GET  /api/user/search?query=<email|username>  ->  { users: [{ uid, email, username, high_access }] }
//   Manage: POST /api/user/manage  { uid, ...fields }

export const searchUsers = query =>
  callBuilder('/user/search', 'ADMIN_SEARCH_USERS', 'get', null, { query })

// Manage another user. `changes` are the same fields POST /api/user accepts (here: high_access).
export const setUserHighAccess = (uid, high_access) =>
  callBuilder('/user/manage', 'MANAGE_USER', 'post', { uid, high_access })

export const clearUserSearch = () => ({ type: 'ADMIN_CLEAR_USERS' })

const initialState = {
  users: [], // [{ uid, email, username, high_access }]
  searched: false,
  pending: false,
  error: false,
  savingUid: null, // _id of the user whose high_access is currently being saved
  savingPrev: undefined, // previous value, for revert on failure
}

export default (state = initialState, action) => {
  switch (action.type) {
    case 'ADMIN_SEARCH_USERS_ATTEMPT':
      return { ...state, pending: true, searched: true, error: false, users: [] }
    case 'ADMIN_SEARCH_USERS_SUCCESS':
      return { ...state, pending: false, error: false, users: action.response?.users || [] }
    case 'ADMIN_SEARCH_USERS_FAILURE':
      return { ...state, pending: false, error: true, users: [] }

    case 'MANAGE_USER_ATTEMPT': {
      // Optimistic update from the sent payload (available on ATTEMPT via requestSettings.data).
      const data = action.requestSettings?.data || {}
      const target = state.users.find(u => u.uid === data.uid)
      return {
        ...state,
        error: false,
        savingUid: data.uid,
        savingPrev: target ? target.high_access : undefined,
        users: state.users.map(u =>
          u.uid === data.uid ? { ...u, high_access: !!data.high_access } : u
        ),
      }
    }
    case 'MANAGE_USER_SUCCESS':
      // Keep the optimistic value; just clear the in-flight markers.
      return { ...state, savingUid: null, savingPrev: undefined, error: false }
    case 'MANAGE_USER_FAILURE':
      // Revert the optimistic toggle on the in-flight user.
      return {
        ...state,
        error: true,
        users:
          state.savingUid != null && state.savingPrev !== undefined
            ? state.users.map(u =>
                u.uid === state.savingUid ? { ...u, high_access: state.savingPrev } : u
              )
            : state.users,
        savingUid: null,
        savingPrev: undefined,
      }

    case 'ADMIN_CLEAR_USERS':
      return { ...state, users: [], searched: false, error: false, pending: false, savingUid: null }
    default:
      return state
  }
}
