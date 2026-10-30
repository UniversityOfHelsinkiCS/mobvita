import { useEffect, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { getAllStories, restoreCachedStories } from 'Utilities/redux/storiesReducer'
import { readStoryCache } from 'Utilities/storyCache'

// Headless loader: keeps the story list fresh on login and after answers are saved.
// The user itself is refreshed once on load by NavBar, so it is not fetched here too.
export default function StoryFetcher() {
  const { data: user, refreshed } = useSelector(({ user }) => user)
  const { joinPending } = useSelector(({ groups }) => groups)
  const staleStoryId = useSelector(({ stories }) => stories.staleStoryId)
  const learningLanguage = user ? user.user.last_used_language : null
  const userId = user?.user?.oid
  const dispatch = useDispatch()
  // Language whose cached list is on screen; its fresh fetch runs in the background (no spinner).
  const restoredLanguage = useRef(null)

  // Shows the last-known list at once; the fetch below always replaces it with the current one.
  useEffect(() => {
    const cached = readStoryCache(userId, learningLanguage)
    if (!cached) return
    dispatch(restoreCachedStories(learningLanguage, cached))
    restoredLanguage.current = learningLanguage
  }, [userId, learningLanguage])

  useEffect(() => {
    if (learningLanguage && refreshed && !joinPending) {
      const meta = restoredLanguage.current === learningLanguage ? { background: true } : undefined
      dispatch(
        getAllStories(
          learningLanguage,
          {
            sort_by: 'date',
            order: -1,
          },
          meta,
        ),
      )
    }
  }, [learningLanguage, refreshed, joinPending])

  // Answers normally patch their story's progress from the answer response (see the reducer); only
  // when that response lacks it is the story marked stale and the list refetched here.
  useEffect(() => {
    if (!staleStoryId || !learningLanguage) return
    dispatch(getAllStories(learningLanguage, { sort_by: 'date', order: -1 }, { background: true }))
  }, [staleStoryId])

  return null
}
