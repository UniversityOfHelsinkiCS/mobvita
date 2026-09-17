// eslint-disable-next-line no-unused-vars
import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { useIntl } from 'react-intl'
import AppButton, { roundIconButtonSx } from 'Components/AppButton'
import AppTooltip from 'Components/ui/AppTooltip'
import AppIcon from 'Components/ui/AppIcon'
import StoryInfoDialog from 'Components/LibraryView/StoryInfoDialog'
import { images } from 'Utilities/common'

/**
 * StoryInfoButton — the "i" that opens StoryInfoDialog, for the story views (preview, review,
 * practice). A round 36px `tan-outline` AppButton, so it pairs with the settings gear beside it:
 * the 2px green ring and the green hover fill both come from that variant.
 *
 * The library's story card keeps its own copy of this trigger — that one is absolutely positioned
 * in the card's corner and sized to the card, not to a toolbar row.
 *
 * The dialog's metadata — author, category, date, source URL, difficulty, coverage and correctness
 * — comes from the story LIST payload (`stories.data`). The single-story fetch that drives these
 * views returns a different shape (`difficulty_value` rather than `difficulty`, no percentages), so
 * the list entry for this id is layered over it when one is in the store. Without it the dialog
 * still opens; the rows it cannot fill drop out.
 *
 * Renders nothing without a story, so a caller can mount it before the fetch resolves.
 */
const StoryInfoButton = ({ story, storyId, iconSize = 24, dataCy = 'story-info-button' }) => {
  const intl = useIntl()
  const [open, setOpen] = useState(false)
  const id = storyId ?? story?._id
  const listEntry = useSelector(({ stories }) =>
    id ? stories.data?.find(entry => String(entry._id) === String(id)) : undefined,
  )

  if (!story) return null

  const fullStory = listEntry ? { ...story, ...listEntry } : story

  return (
    <>
      <AppTooltip keyId="story-info-button" placement="top">
        <AppButton
          type="button"
          variant="tan-outline"
          size="sm"
          // The ripple fills a button this small and round, reading as a grey wash over it.
          disableRipple
          aria-label={intl.formatMessage({ id: 'story-info-button' })}
          data-cy={dataCy}
          onClick={() => setOpen(true)}
          sx={roundIconButtonSx}
        >
          <AppIcon src={images.infoIcon} size={iconSize} color="currentColor" />
        </AppButton>
      </AppTooltip>
      <StoryInfoDialog story={fullStory} open={open} onClose={() => setOpen(false)} />
    </>
  )
}

export default StoryInfoButton
