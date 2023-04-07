import { FormattedHTMLMessage, FormattedMessage } from 'react-intl'
import { Link } from 'react-router-dom'
import { images } from 'Utilities/common'
import React from 'react'
import useWindowDimensions from 'Utilities/windowDimensions'

const SomeIncorrectBlueFlashcardsHeader = ({ handleNewDeck }) => {
  const bigScreen = useWindowDimensions().width > 700
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
          <FormattedHTMLMessage id="some-incorrect-flashcards" />
          &nbsp;
          <Link className="interactable" onClick={() => handleNewDeck()}>
            <FormattedMessage id="flashcards-try-again" />
          </Link>
          ?
        </div>
        <img
          src={images.fireworks}
          alt="encouraging fireworks"
          className={bigScreen ? 'enc-picture' : 'enc-picture-mobile'}
        />
      </div>
    </div>
  )
}

export default SomeIncorrectBlueFlashcardsHeader
