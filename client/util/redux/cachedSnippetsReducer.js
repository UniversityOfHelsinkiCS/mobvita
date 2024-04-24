import callBuilder from '../apiConnection'

export const getAndCacheNextSnippet = (storyId, currentSnippetId) => {
    const route = `/stories/${storyId}/snippets/next?previous=${currentSnippetId}`
    const prefix = 'GET_AND_CACHE_NEXT_SNIPPET'
    return callBuilder(route, prefix)
  }

  export const resetCachedSnippets = () => ({
    type: 'RESET_CACHED_SNIPPETS',
  })

  const processCachedSnippets = (cacheSnippets, newSnippet) => {
    const snippets = {
        ...cacheSnippets,
        [`${newSnippet.storyid}-${newSnippet.snippetid[0]}`]: newSnippet
    }
    const snippetIds = Object.values(snippets).map(snippet => snippet.snippetid).flat()
    const coveredConcepts = new Set(Object.values(snippets).map(
        snippet => snippet.practice_snippet.filter(token=>token.concept).map(
            token=>token.concept.replace('concept_id: ', ''))).flat())
    return {
        snippets: snippets,
        snippetIds: Array.from(snippetIds).sort(),
        coveredConcepts: Array.from(coveredConcepts).sort(),

    }
  }

  
  const initialState = { 
    snippets: {}, 
    snippetIds: [], 
    coveredConcepts: [],
    pending: false, 
    error: false
}


export default (state = initialState, action) => {
    switch(action.type) {

        case 'GET_AND_CACHE_NEXT_SNIPPET_ATTEMPT':
            return {
                ...state,
                pending: true,
                error: false,
            }
        case 'GET_AND_CACHE_NEXT_SNIPPET_FAILURE':
            return {
                ...state,
                pending: false,
                error: true,
            }

        case 'GET_AND_CACHE_NEXT_SNIPPET_SUCCESS':
            return {
                ...state,
                ...processCachedSnippets(state.snippets, action.response),
                pending: false,
                error: false,
            }


        case 'RESET_CACHED_SNIPPETS':
            return {
                ...state,
                snippets: {}, 
                snippetIds: [], 
                coveredConcepts: [],
                pending: false,
                error: false,
            }
        default:
            return state
    }
}