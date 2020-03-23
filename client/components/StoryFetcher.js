import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { getAllStories } from 'Utilities/redux/storiesReducer'
import { getSelf } from 'Utilities/redux/userReducer'


export default function StoryFetcher() {
  const { data: user, refreshed } = useSelector(({ user }) => user)
  const learningLanguage = user ? user.user.last_used_language : null
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(getSelf())
  }, [])

  useEffect(() => {
    if (learningLanguage && refreshed) {
      dispatch(
        getAllStories(learningLanguage, {
          sort_by: 'date',
          order: -1,
        }),
      )
    }
  }, [learningLanguage, refreshed])

  return null
}
