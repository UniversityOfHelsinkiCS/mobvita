import FormattedHTMLMessage from 'Components/FormattedHTMLMessage';
import React, { useState, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useIntl, FormattedMessage } from 'react-intl';
import { Button } from 'react-bootstrap'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import Accordion from '@mui/material/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'
import CustomTooltip from 'Components/CustomTooltip'
import IconButton from '@mui/material/IconButton'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'

const EMPTY_SITES = []
import { postStory } from 'Utilities/redux/uploadProgressReducer'
import { capitalize, learningLanguageSelector } from 'Utilities/common'
import { updateFavouriteSites } from 'Utilities/redux/userReducer'
import RecommendedSites from './RecommendedSites'
import Spinner from 'Components/Spinner'

const UploadFromWeb = ({ closeModal, setActiveComponent }) => {
  const intl = useIntl()
  const dispatch = useDispatch()
  const [storyUrl, setStoryUrl] = useState('')
  const learningLanguage = useSelector(learningLanguageSelector)
  const { pending, storyId } = useSelector(({ uploadProgress }) => uploadProgress)
  const favouriteSites = useSelector(({ user }) => user?.data?.user?.favourite_sites ?? EMPTY_SITES)
  const [accordionState, setAccordionState] = useState(-1)

  const storyUploading = pending || storyId

  const handleStorySubmit = event => {
    event.preventDefault()

    const newStory = {
      language: capitalize(learningLanguage),
      url: storyUrl,
    }

    if (storyUrl) {
      dispatch(postStory(newStory))
      setStoryUrl('')
      setActiveComponent()
      closeModal()
    }
  }

  const handleAccordionChange = useCallback((_, expanded) => {
    setAccordionState(expanded ? 0 : -1)
  }, [])

const AddToRecommendedSites = useCallback(
  event => {
    event.preventDefault()

    const raw = storyUrl.trim()
    let parsed

    try {
      parsed = new URL(raw)
    } catch {
      return
    }

    if (parsed.protocol !== 'https:') return
    if (!parsed.hostname) return
    if (!parsed.origin) return

    const normalizedUrl = parsed.origin.toLowerCase()

    if (favouriteSites.some(site => site.url.toLowerCase() === normalizedUrl)) return

    const nextSites = [...favouriteSites, { url: normalizedUrl, difficulty: 0 }]
    dispatch(updateFavouriteSites(nextSites))
    setStoryUrl('')
  },
  [storyUrl, favouriteSites, dispatch]
)

  return (
    <div>
      <CustomTooltip title={<FormattedHTMLMessage id="upload-from-web-instructions" />}>
        <IconButton size="small">
          <InfoOutlinedIcon fontSize="small" />
        </IconButton>
      </CustomTooltip>
      <div style={{ marginTop: '20px' }}>
        <Box component="form" id="url-upload" onSubmit={handleStorySubmit}>
          <TextField
            fullWidth
            size="small"
            placeholder={intl.formatMessage({ id: 'enter-web-address' })}
            value={storyUrl}
            onChange={event => setStoryUrl(event.target.value)}
            data-cy="new-story-input"
          />
        </Box>
      </div>

      <div style={{ display: 'flex', marginTop: '20px', justifyContent: 'space-between' }}>
        <Button form="url-upload" type="submit" onClick={handleStorySubmit} data-cy="submit-story">
          {storyUploading ? (
            <Spinner inline size={28} />
          ) : (
            <FormattedMessage id="upload-from-web-button" />
          )}
        </Button>

        <CustomTooltip title={<FormattedMessage id="explain-recommended-sites" />}>
          <Button
            type="button"
            form="url-upload"
            onClick={AddToRecommendedSites}
            data-cy="add-to-recommended-sites-button"
          >
            <FormattedMessage id="add-recommended-sites-button" />
          </Button>
        </CustomTooltip>
      </div>

      <div style={{ marginTop: '24px' }}>
        <Accordion expanded={accordionState === 0} onChange={handleAccordionChange}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <FormattedMessage id="recommended-sites" />
          </AccordionSummary>
          <AccordionDetails>
            <div style={{ maxHeight: 170, overflowY: 'auto' }}>
              <RecommendedSites />
            </div>
          </AccordionDetails>
        </Accordion>
      </div>
    </div>
  )
}

export default UploadFromWeb
