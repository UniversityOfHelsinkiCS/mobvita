import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { getAllStories } from 'Utilities/redux/storiesReducer'
import { getSelf } from 'Utilities/redux/userReducer'

export default function StoryFetcher() {
  const { data: user, refreshed } = useSelector(({ user }) => user)
  const { joinPending } = useSelector(({ groups }) => groups)
  const staleStoryId = useSelector(({ stories }) => stories.staleStoryId)
  const learningLanguage = user ? user.user.last_used_language : null
  const dispatch = useDispatch()

  useEffect(() => {
    if (user) dispatch(getSelf())
  }, [])

  useEffect(() => {
    if (learningLanguage && refreshed && !joinPending) {
      dispatch(
        getAllStories(learningLanguage, {
          sort_by: 'date',
          order: -1,
        }),
      )
    }
  }, [learningLanguage, refreshed, joinPending])

  // Answering exercises marks the story stale. Refetch here, in the background, while the user is
  // still practising — by the time they reach the library the progress bar is already current, so
  // the library never fetches (or spins) on open.
  //
  // The whole list, not the single story: `getAllStories` is the only response known to carry
  // `percent_cov` — the field is read in five places in this app and written in none, so the
  // single-story payload's shape is unverified. Running mid-practice means nobody waits on it.
  useEffect(() => {
    if (!staleStoryId || !learningLanguage) return
    dispatch(getAllStories(learningLanguage, { sort_by: 'date', order: -1 }))
  }, [staleStoryId])

  return null
}
