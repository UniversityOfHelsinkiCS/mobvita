import callBuilder from '../apiConnection'


const initialState = { 
    text: '',
    pending: false,
}

export const generateStory = (instance) => {
    const route = `/stories/generate`
    const prefix = 'GENERATE_STORY'
    
    return callBuilder(route, prefix, 'post', instance)
}


export default (state = initialState, action) => {
  switch (action.type) {
    case 'GENERATE_STORY_ATTEMPT':
      return {
        ...state,
        pending: true,
      }
    case 'GENERATE_STORY_FAILURE':
      return {
        initialState,
      }
    case 'GENERATE_STORY_SUCCESS':
        return {
            ...state,
            text: action.response.text,
            pending: false,
        }
    default:
      return state
  }
}
