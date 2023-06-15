import produce from 'immer'
import callBuilder from '../apiConnection'

export const getMetadata = language => {
  const route = `/metadata/${language}`
  const prefix = 'GET_METADATA'
  return callBuilder(route, prefix, 'get')
}

export const filterOutCachedStory = story_id => ({ type: 'FILTER_CACHE_STORY', story_id })

export const closeBanner = message => ({ type: 'CLOSE_BANNER', message })

const initialState = {
  pending: false,
  error: false,
  banners: [],
}

export default (state = initialState, action) => {
  const { response } = action
  switch (action.type) {
    case 'GET_METADATA_ATTEMPT':
      return {
        ...state,
        pending: true,
        error: false,
      }
    case 'GET_METADATA_FAILURE':
      return {
        ...state,
        pending: false,
        error: true,
      }
    case 'GET_METADATA_SUCCESS':
      let lang_lessons = response.lessons
      if (response & response.lessons & response.lessons.length){
        for (let idx; idx < lang_lessons.length; idx++){
          lang_lessons[idx]['topics'] = response.lesson_topics.filter(
            lessons => lessons.includes(lang_lessons[idx].ID)
          )
          console.log(lang_lessons[idx])
        }
      }
      
      return {
        ...state,
        concepts: response.concept_list,
        flashcardArticles: response.flashcard_articles,
        suggestedSites: response.suggested_sites,
        banners: response.banner_messages.map(b => ({ message: b, open: true })),
        hasTests: response.has_tests,
        hasAdaptiveTests: response.has_adaptive_test,
        numUnreadNews: response.num_unread_news,
        root_hex_coord: response.root_hex_coord,
        cachedStories: response.available_cached_stories,
        lessons: lang_lessons,
        lesson_semantics: response.lesson_semantics,
        lesson_topics: response.lesson_topics,
        pending: false,
        error: false,
      }
    case 'FILTER_CACHE_STORY':
      return {
        ...state,
        cachedStories: state.cachedStories.filter(story => story._id != action.story_id),
      }
    case 'CLOSE_BANNER':
      return produce(state, draft => {
        const banner = draft.banners.find(b => b.message === action.message)
        banner.open = false
      })
    default:
      return state
  }
}
