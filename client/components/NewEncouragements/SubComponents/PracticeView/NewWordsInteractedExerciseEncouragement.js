import React from 'react'
import { FormattedMessage, FormattedHTMLMessage } from 'react-intl'
import { Link } from 'react-router-dom'
import { images, backgroundColors, showAllEncouragements } from "Utilities/common"
import { useSelector } from 'react-redux'

const NewWordsInteractedExerciseEncouragement = () => {
  const { newVocabulary } = useSelector(({ newVocabulary }) => newVocabulary)
  const userData = useSelector(state => state.user.data.user)
  const { enable_recmd } = userData

  return (
    <div>
      {(newVocabulary > 0 && enable_recmd) || showAllEncouragements ? (
        <div className="pt-md">
          <div
            className="flex enc-message-body"
            style={{ alignItems: 'center', backgroundColor: backgroundColors[1] }}
          >
            <img
              src={images.barChart}
              alt="bar chart"
              style={{ maxWidth: '8%', maxHeight: '8%', marginRight: '1em' }}
            />
            <div>
              <FormattedHTMLMessage
                id="words-interacted-encouragement"
                values={{ nWords: newVocabulary }}
              />
              &nbsp;
              <Link className="interactable" to="/profile/progress">
                <FormattedMessage id="review-progress" />
              </Link>
              ?
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}

export default NewWordsInteractedExerciseEncouragement