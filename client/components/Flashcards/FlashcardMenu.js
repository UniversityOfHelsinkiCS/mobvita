import React from 'react'
import { useSelector } from 'react-redux'
import { useParams, useNavigate } from 'react-router-dom'
import { FormattedMessage } from 'react-intl'
import TextFields from '@mui/icons-material/TextFields'
import AppTabs from 'Components/ui/AppTabs'
import AppIcon from 'Components/ui/AppIcon'
import { images } from 'Utilities/common'
import { TERMINOLOGY, TERMINOLOGY_EXCLUDED_MODES, flashcardModePath } from './terminology'

const tabIcon = src => <img src={src} alt="" style={{ width: 18, height: 18 }} />

// The desktop practice-mode bar: one tab per flashcard exercise; terminology drops translate cards.
const PracticeModeOptions = ({ handleOptionClick, mode, inTerminology }) => {
  const { flashcardArticles } = useSelector(({ metadata }) => metadata)
  const articleLabel = flashcardArticles && flashcardArticles.join(' / ')

  const tabs = [
    {
      value: 'fillin',
      label: <FormattedMessage id="fill-in" />,
      icon: tabIcon(images.translate01),
      tooltip: 'flashcards-translate-cards-EXPLANATION',
    },
    {
      value: 'learn',
      label: <FormattedMessage id="flashcard-reversed" />,
      icon: <AppIcon src={images.flip} size={18} />,
      tooltip: 'flashcards-reversed-cards-EXPLANATION',
    },
    {
      value: 'match',
      label: <FormattedMessage id="flashcard-matching" />,
      icon: <AppIcon src={images.inherit} size={18} />,
      tooltip: 'flashcards-match-cards-EXPLANATION',
    },
    ...(flashcardArticles
      ? [{ value: 'article', label: articleLabel, icon: <TextFields sx={{ fontSize: 18 }} /> }]
      : []),
    {
      value: 'quick',
      label: <FormattedMessage id="Quick cards" defaultMessage="Quick Cards" />,
      icon: tabIcon(images.quick),
      tooltip: 'flashcards-quick-cards-EXPLANATION',
    },
  ].filter(tab => !inTerminology || !TERMINOLOGY_EXCLUDED_MODES.includes(tab.value))

  // 1px green outline around the whole bar so it reads against the cream card.
  return <AppTabs tabs={tabs} value={mode} onChange={handleOptionClick} fullWidth bordered variant='inner' />
}

// Routes a mode pick to /flashcards/<mode>, keeping any story context in the path.
const FlashcardMenu = () => {
  const navigate = useNavigate()
  const { mode, type, storyId } = useParams()

  // Switching mode keeps a story or terminology deck, but leaves the blue-cards test entirely.
  const handleOptionClick = nextMode => navigate(flashcardModePath(nextMode, type, storyId))

  const isPracticePage = ['fillin', 'learn', 'match', 'quick', 'article'].includes(mode)

  return (
    <div className="flashcard-menu">
      {isPracticePage && (
        <PracticeModeOptions
          handleOptionClick={handleOptionClick}
          mode={mode}
          inTerminology={type === TERMINOLOGY}
        />
      )}
    </div>
  )
}

export default FlashcardMenu
