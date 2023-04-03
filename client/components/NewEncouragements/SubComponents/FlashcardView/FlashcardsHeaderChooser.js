import React from 'react'
import MasteringNewWordsHeader from 'Components/NewEncouragements/SubComponents/FlashcardView/MasteringNewWordsHeader'
import WellDoneFlashcardsHeader from 'Components/NewEncouragements/SubComponents/FlashcardView/WellDoneFlashcardsHeader'
import { useSelector } from 'react-redux'

const FlashcardsHeaderChooser = () => {
  const flashcards = useSelector(({ flashcards }) => flashcards)
  const someCorrectAnswers = flashcards.correctAnswers > 0

  return (
    <div>{someCorrectAnswers ? <MasteringNewWordsHeader /> : <WellDoneFlashcardsHeader />}</div>
  )
}
export default FlashcardsHeaderChooser
