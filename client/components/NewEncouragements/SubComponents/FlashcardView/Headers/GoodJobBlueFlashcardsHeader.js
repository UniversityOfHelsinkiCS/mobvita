import { FormattedHTMLMessage } from 'react-intl'
import { images } from 'Utilities/common'
import useWindowDimensions from 'Utilities/windowDimensions'
import React from 'react'
import { useSelector } from 'react-redux'

const GoodJobBlueFlashcardsHeader = () => {
  const bigScreen = useWindowDimensions().width > 700
  const { creditableWordsNum } = useSelector(({ flashcards }) => flashcards)
  return (
    <div>
      <div className="flex">
        <div
          style={{
            fontSize: '1.4rem',
            marginBottom: '1em',
            fontWeight: 500,
          }}
        >
          <FormattedHTMLMessage
            id="good-job-blue-flashcards"
            values={{ nWords: creditableWordsNum }}
          />
        </div>
        <img
          src={images.encTrophy}
          alt="encouraging trophy"
          className={bigScreen ? 'enc-picture' : 'enc-picture-mobile'}
        />
      </div>
    </div>
  )
}

export default GoodJobBlueFlashcardsHeader
