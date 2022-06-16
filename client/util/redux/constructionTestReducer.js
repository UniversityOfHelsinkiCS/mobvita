import callBuilder from '../apiConnection'

export const testConstruction = (language, sentence) => {
  const route = `/debug/${language}/pattern?sentence=${sentence}`
  const prefix = 'TEST_CONSTRUCTION'
  return callBuilder(route, prefix, 'get')
}

export const resetConstructionResults = () => ({ type: 'RESET_CONSTRUCTION_RESULTS' })

const initialState = {
  patternResults: null,
  pending: false,
  error: false,
}

export default (state = initialState, action) => {
  switch (action.type) {
    case 'TEST_CONSTRUCTION_ATTEMPT':
      return {
        pending: true,
        error: false,
      }

    case 'TEST_CONSTRUCTION_FAILURE':
      return {
        pending: false,
        error: true,
      }

    case 'TEST_CONSTRUCTION_SUCCESS':
      return {
        pending: false,
        error: false,
        patternResults: action.response.patterns_results,
      }

    case 'RESET_CONSTRUCTION_RESULTS':
      return {
        pending: false,
        error: false,
        patternResults: null,
      }

    default:
      return state
  }
}
