import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { getAllStories } from 'Utilities/redux/storiesReducer'
import { getSelf } from 'Utilities/redux/userReducer'
import { disableFetcher, enableFetcher } from 'Utilities/redux/disableStoryFetcherReducer'
import { useHistory } from 'react-router'

export default function StoryFetcher() {
  const { data: user, refreshed } = useSelector(({ user }) => user)
  const { joinPending } = useSelector(({ groups }) => groups)
  const learningLanguage = user ? user.user.last_used_language : null
  const disabled = useSelector(({ disabled }) => disabled.disabled)
  const dispatch = useDispatch()
  const history = useHistory()

  useEffect(() => {
    const welcomePage =
      history.location.pathname.endsWith('/welcome') && user?.user.email !== 'anonymous_email'

    if (user) dispatch(getSelf())
    if (user?.user.email === 'anonymous_email') {
      dispatch(enableFetcher())
    } else if (welcomePage) {
      dispatch(disableFetcher())
    }
  }, [])

  useEffect(() => {
    if (learningLanguage && refreshed && !joinPending && !disabled) {
      dispatch(
        getAllStories(learningLanguage, {
          sort_by: 'date',
          order: -1,
        })
      )
      dispatch(enableFetcher())
    }
  }, [learningLanguage, refreshed, joinPending])

  return null
}
