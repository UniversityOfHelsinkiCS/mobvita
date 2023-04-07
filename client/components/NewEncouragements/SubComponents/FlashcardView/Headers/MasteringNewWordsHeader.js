import { FormattedHTMLMessage } from "react-intl"
import { images } from "Utilities/common"
import React from "react"
import useWindowDimensions from "Utilities/windowDimensions"
import { useSelector } from "react-redux"

const MasteringNewWordsHeader = () => {
  const bigScreen = useWindowDimensions().width > 700
  const flashcards = useSelector(({ flashcards }) => flashcards)

  return (
    <>
      <div>
        <div className="flex">
          <div
            style={{
              fontSize: "1.4rem",
              marginBottom: "1em",
              fontWeight: 500
            }}
          >
            <FormattedHTMLMessage
              id="mastering-new-words"
              values={{ nWords: flashcards.correctAnswers }}
            />
          </div>
          <img
            src={images.encTrophy}
            alt="encouraging trophy"
            className={bigScreen ? "enc-picture" : "enc-picture-mobile"}
          />
        </div>
      </div>
    </>
  )
}

export default MasteringNewWordsHeader
