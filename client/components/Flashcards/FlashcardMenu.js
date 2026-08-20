import React from 'react'
import { useSelector } from 'react-redux'
import { useParams, useNavigate } from 'react-router-dom'
import { FormattedMessage } from 'react-intl'
import TextFields from '@mui/icons-material/TextFields'
import AppTabs from 'Components/ui/AppTabs'
import { images } from 'Utilities/common'

const tabIcon = src => <img src={src} alt="" style={{ width: 18, height: 18 }} />

const PracticeModeOptions = ({ handleOptionClick, mode }) => {
  const { flashcardArticles } = useSelector(({ metadata }) => metadata)
  const articleLabel = flashcardArticles && flashcardArticles.join(' / ')

  const tabs = [
    {
      value: 'fillin',
      label: <FormattedMessage id="fill-in" />,
      icon: tabIcon(images.translate01),
      tooltip: 'flashcards-translate-cards-EXPLANATION',
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
  ]

  // 1px green outline around the whole bar so it reads against the cream card.
  return <AppTabs tabs={tabs} value={mode} onChange={handleOptionClick} fullWidth bordered />
}

const FlashcardMenu = () => {
  const navigate = useNavigate()
  const { mode, storyId } = useParams()

  const storyUrl = storyId ? `/${storyId}` : ''

  const handleOptionClick = nextMode => {
    const path = storyUrl ? `/flashcards/${nextMode}/story${storyUrl}` : `/flashcards/${nextMode}`

    navigate(path)
  }

  const isPracticePage = ['fillin', 'quick', 'article'].includes(mode)

  return (
    <div className="flashcard-menu">
      {isPracticePage && <PracticeModeOptions handleOptionClick={handleOptionClick} mode={mode} />}
    </div>
  )
}

export default FlashcardMenu
