import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useIntl, FormattedMessage } from 'react-intl'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import AppButton from 'Components/AppButton'
import AppIcon from 'Components/ui/AppIcon'
import AppSelect from 'Components/ui/AppSelect'
import AppTextField from 'Components/ui/AppTextField'
import DifficultyLevel from 'Components/DifficultyLevel'
import Spinner from 'Components/Spinner'
import { postStory } from 'Utilities/redux/uploadProgressReducer'
import { capitalize, images, learningLanguageSelector } from 'Utilities/common'
import { updateFavouriteSites } from 'Utilities/redux/userReducer'
import { colors } from 'Assets/mui_theme/designTokens'
import { fieldLabelSx, pillButtonSx } from 'Components/ui/dialogSx'

const EMPTY_SITES = []

// Lower-cased https origin of the typed address (a missing scheme is taken as https), else null.
const toBookmarkUrl = raw => {
  const address = raw.trim()
  if (!address) return null
  try {
    const parsed = new URL(/^[a-z]+:\/\//i.test(address) ? address : `https://${address}`)
    return parsed.protocol === 'https:' && parsed.hostname ? parsed.origin.toLowerCase() : null
  } catch {
    return null
  }
}

// Figma "Get from Web": bookmark selector, URL field, then Upload To Library / Add To Bookmarks.
const UploadFromWeb = ({ closeModal, setActiveComponent }) => {
  const intl = useIntl()
  const dispatch = useDispatch()
  const [storyUrl, setStoryUrl] = useState('')
  const learningLanguage = useSelector(learningLanguageSelector)
  const { pending, storyId } = useSelector(({ uploadProgress }) => uploadProgress)
  const favouriteSites = useSelector(({ user }) => user?.data?.user?.favourite_sites ?? EMPTY_SITES)

  const storyUploading = pending || storyId
  // The selector mirrors the field: the bookmark whose URL is in the field, else the placeholder.
  const selectedBookmark = favouriteSites.find(site => site.url === storyUrl)
  const bookmarkUrl = toBookmarkUrl(storyUrl)
  const canBookmark =
    Boolean(bookmarkUrl) &&
    !selectedBookmark &&
    !favouriteSites.some(site => site.url.toLowerCase() === bookmarkUrl)

  const handleStorySubmit = event => {
    event.preventDefault()
    if (!storyUrl.trim() || storyUploading) return
    dispatch(postStory({ language: capitalize(learningLanguage), url: storyUrl }))
    setStoryUrl('')
    setActiveComponent()
    closeModal()
  }

  const addToBookmarks = () => {
    if (!canBookmark) return
    dispatch(updateFavouriteSites([...favouriteSites, { url: bookmarkUrl, difficulty: 0 }]))
    setStoryUrl('')
  }

  const removeBookmark = url => {
    dispatch(updateFavouriteSites(favouriteSites.filter(site => site.url !== url)))
  }

  // One dropdown row per bookmark: level icon, name, and a remove X that must not select the row.
  const bookmarkOptions = favouriteSites.map(site => ({
    value: site.url,
    label: site.name || site.url,
    icon: (
      <span style={{ display: 'inline-flex', width: 20, height: 20 }}>
        <DifficultyLevel difficulty={site.difficulty} size={20} />
      </span>
    ),
    endIcon: (
      <IconButton
        size="small"
        aria-label="remove bookmark"
        data-cy="recommended-site-delete-button"
        sx={{ p: '2px' }}
        onClick={event => {
          event.stopPropagation()
          removeBookmark(site.url)
        }}
      >
        <AppIcon src={images.xClose} size={18} color={colors.muted} />
      </IconButton>
    ),
  }))

  return (
    <div className="upload-from-web">
      <AppSelect
        variant="contrast-outline"
        value={selectedBookmark?.url ?? ''}
        onChange={setStoryUrl}
        options={bookmarkOptions}
        placeholder={intl.formatMessage({ id: 'bookmarks-recommended' })}
        matchTriggerWidth
        minWidth={0}
      />

      <Box component="form" id="url-upload" onSubmit={handleStorySubmit}>
        <AppTextField
          label={intl.formatMessage({ id: 'new-url' })}
          labelSx={fieldLabelSx}
          placeholder={intl.formatMessage({ id: 'enter-web-address' })}
          value={storyUrl}
          onChange={event => setStoryUrl(event.target.value)}
          inputProps={{ 'data-cy': 'new-story-input' }}
        />
      </Box>

      <div className="upload-from-web-actions">
        <AppButton
          type="submit"
          form="url-upload"
          sx={pillButtonSx()}
          disabled={!storyUrl.trim() || Boolean(storyUploading)}
          data-cy="submit-story"
        >
          {storyUploading ? (
            <Spinner inline size={20} />
          ) : (
            <FormattedMessage id="upload-from-web-button" />
          )}
        </AppButton>
        <AppButton
          type="button"
          sx={pillButtonSx()}
          disabled={!canBookmark}
          onClick={addToBookmarks}
          data-cy="add-to-recommended-sites-button"
        >
          <FormattedMessage id="add-recommended-sites-button" />
        </AppButton>
      </div>
    </div>
  )
}

export default UploadFromWeb
