import callBuilder from 'Utilities/apiConnection'

// Partner domains: every account whose email is on one of these domains is granted the partner's
// access level by the backend. This replaces the `helsinki.fi` check the frontend used to do.
//
//   List: GET  /api/partner   ->  { partners: [{ partner_id, domain, name, high_access }] }
//   Save: POST /api/partner   { partner_id?, domain, name, high_access }
//         ->  { partner, num_users_updated }   (no partner_id = a new domain)

export const getPartners = () => callBuilder('/partner', 'GET_PARTNERS')

export const savePartner = partner => callBuilder('/partner', 'SAVE_PARTNER', 'post', partner)

export const clearPartnerSaveResult = () => ({ type: 'CLEAR_PARTNER_SAVE_RESULT' })

const initialState = {
  partners: [], // [{ partner_id, domain, name, high_access }]
  pending: false,
  error: false,
  saving: false,
  // The row being saved (null while a brand-new domain is being added), so only that row spins.
  savingPartnerId: null,
  saveError: false,
  // What the last save did, so the dashboard can say how many accounts it touched.
  lastSave: null, // { domain, numUsersUpdated }
}

// Replace the partner with the same id, or append it when the save created one.
const upsertPartner = (partners, partner) => {
  if (!partner) return partners
  const index = partners.findIndex(p => p.partner_id === partner.partner_id)

  if (index === -1) return [...partners, partner]
  return partners.map((p, i) => (i === index ? partner : p))
}

export default (state = initialState, action) => {
  switch (action.type) {
    case 'GET_PARTNERS_ATTEMPT':
      return { ...state, pending: true, error: false }
    case 'GET_PARTNERS_SUCCESS':
      return { ...state, pending: false, error: false, partners: action.response?.partners || [] }
    case 'GET_PARTNERS_FAILURE':
      return { ...state, pending: false, error: true }

    case 'SAVE_PARTNER_ATTEMPT':
      return {
        ...state,
        saving: true,
        // The payload is on the attempt action, which is how we know whose row is saving.
        savingPartnerId: action.requestSettings?.data?.partner_id ?? null,
        saveError: false,
        lastSave: null,
      }
    case 'SAVE_PARTNER_SUCCESS':
      return {
        ...state,
        saving: false,
        savingPartnerId: null,
        saveError: false,
        partners: upsertPartner(state.partners, action.response?.partner),
        lastSave: {
          domain: action.response?.partner?.domain,
          numUsersUpdated: action.response?.num_users_updated ?? 0,
        },
      }
    case 'SAVE_PARTNER_FAILURE':
      return { ...state, saving: false, savingPartnerId: null, saveError: true }

    case 'CLEAR_PARTNER_SAVE_RESULT':
      return { ...state, lastSave: null, saveError: false }

    default:
      return state
  }
}
