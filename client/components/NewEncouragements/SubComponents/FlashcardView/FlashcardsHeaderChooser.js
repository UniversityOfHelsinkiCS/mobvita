import React from 'react'
import MasteringNewWordsHeader from 'Components/NewEncouragements/SubComponents/FlashcardView/Headers/MasteringNewWordsHeader'
import WellDoneFlashcardsHeader from 'Components/NewEncouragements/SubComponents/FlashcardView/Headers/WellDoneFlashcardsHeader'
import SomeIncorrectBlueFlashcardsHeader from 'Components/NewEncouragements/SubComponents/FlashcardView/Headers/SomeIncorrectBlueFlashcardsHeader'
import GoodJobBlueFlashcardsHeader from 'Components/NewEncouragements/SubComponents/FlashcardView/Headers/GoodJobBlueFlashcardsHeader'
import { useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'

const FlashcardsHeaderChooser = ({ handleNewDeck }) => {
  const flashcards = useSelector(({ flashcards }) => flashcards)
  const someCorrectAnswers = flashcards.correctAnswers > 0
  const history = useHistory()
  const inBlueCardsTest = history.location.pathname.includes('test')

  return (
    <div>
      {inBlueCardsTest ? (
        <div>
          {flashcards.correctAnswers === flashcards.cards.length ? (
            <GoodJobBlueFlashcardsHeader />
          ) : (
            <SomeIncorrectBlueFlashcardsHeader handleNewDeck={handleNewDeck} />
          )}
        </div>
      ) : (
        <div>{someCorrectAnswers ? <MasteringNewWordsHeader /> : <WellDoneFlashcardsHeader />}</div>
      )}
    </div>
  )
}
export default FlashcardsHeaderChooser
