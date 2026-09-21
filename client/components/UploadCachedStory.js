// eslint-disable-next-line no-unused-vars
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation, useNavigate } from 'react-router-dom'
import { useIntl } from 'react-intl'
import { uploadCachedStory } from 'Utilities/redux/storiesReducer'
import { setNotification } from 'Utilities/redux/notificationReducer'
import Spinner from 'Components/Spinner'
import { colors } from 'Assets/mui_theme/designTokens'

/**
 * UploadCachedStory — the landing page for a backend-composed link:
 *
 *     {FRONTEND_URL}/stories/cached?cached_id=<id>
 *
 * It adds that cached story to the user's library and opens it, the same shape as the other links
 * the backend hands out (/accept_story, /block_user, …): a route whose component fires one request
 * and then sends the user somewhere real. Nothing is rendered but a spinner.
 *
 * The API returns the id of the story it created, so the user lands on that story's preview. If the
 * response carries no id, the private library is the fallback — the story is there either way.
 */
const LIBRARY_FALLBACK = '/library/private'

const UploadCachedStory = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const intl = useIntl()
  const { search } = useLocation()

  const cachedId = new URLSearchParams(search).get('cached_id')
  const { uploaded, uploadedStoryId, uploadCachedError } = useSelector(({ stories }) => stories)

  useEffect(() => {
    if (!cachedId) {
      navigate(LIBRARY_FALLBACK, { replace: true })
      return
    }
    dispatch(uploadCachedStory(cachedId))
  }, [cachedId])

  useEffect(() => {
    if (!uploaded) return
    // `replace`, so Back does not re-run the upload.
    navigate(uploadedStoryId ? `/stories/${uploadedStoryId}/preview` : LIBRARY_FALLBACK, {
      replace: true,
    })
  }, [uploaded, uploadedStoryId])

  useEffect(() => {
    if (!uploadCachedError) return
    dispatch(setNotification('story-upload-failed', 'error'))
    navigate(LIBRARY_FALLBACK, { replace: true })
  }, [uploadCachedError])

  return (
    <Spinner
      fullHeight
      size={60}
      spinnerColor={colors.ink}
      textColor={colors.ink}
      text={intl.formatMessage({ id: 'processing-story' })}
    />
  )
}

export default UploadCachedStory
