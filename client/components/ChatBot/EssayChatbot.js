import React from 'react'
import { useSelector } from 'react-redux'
import { FormattedMessage } from 'react-intl'

import CorrectionSuggestionPopper from 'Components/EssayWritingView/CorrectionSuggestionPopper'
import RobotIcon from 'Components/PracticeView/RobotIcon'

import './Chatbot.scss'

const EssayChatbot = ({ onSentenceSelect }) => {
  const {
    correctionSuggestionSentenceIds,
    correctionSuggestionsBySentenceId,
    correctionsByKey,
  } = useSelector(({ writingCorrection }) => writingCorrection)
  const correctionSuggestions = correctionSuggestionSentenceIds
    .map(sentenceId => correctionSuggestionsBySentenceId[sentenceId])
    .filter(Boolean)

  return (
    <div className="chatbot">
      <div className="ai-assistant-header">
        <RobotIcon className="ai-header-icon" size={24} />
        <h3 className="ai-header-title">
          <FormattedMessage id="chatbot-toggle-label" />
        </h3>
      </div>

      <div className="chatbot-messages">
        {correctionSuggestions.map(({ key, sentence, sentenceId }) => (
          <CorrectionSuggestionPopper
            key={sentenceId}
            correctionEntry={correctionsByKey[key]}
            sentence={sentence}
            onSentenceSelect={
              onSentenceSelect
                ? correctionRange => onSentenceSelect({ sentenceId, ...(correctionRange || {}) })
                : undefined
            }
          />
        ))}
      </div>
    </div>
  )
}

export default EssayChatbot
