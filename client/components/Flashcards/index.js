import React, { useState, useEffect } from 'react'
import { useParams, useHistory } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import useWindowDimensions from 'Utilities/windowDimensions'
import { getStoriesBlueFlashcards } from 'Utilities/redux/flashcardReducer'
import { learningLanguageSelector, dictionaryLanguageSelector } from 'Utilities/common'
import ReportButton from 'Components/ReportButton'
import FlashcardsPracticeEncouragement from 'Components/Encouragements/FlashcardsPracticeEncouragement'
import FlashcardMenu from './FlashcardMenu'
import FlashcardCreation from './FlashcardCreation'
import FloatMenu from './FloatMenu'
import Practice from './Practice'
import FlashcardList from './FlashcardList'
import EncouragementButton from 'Components/Encouragements/EncouragementButton'

const Flashcards = () => {
  const [openModal, setOpenModal] = useState(true)
  const [openPracModal, setOpenPracModal] = useState(true)
  const { storyBlueCards } = useSelector(({ flashcards }) => flashcards)
  const history = useHistory()
  const learningLanguage = useSelector(learningLanguageSelector)
  const dictionaryLanguage = useSelector(dictionaryLanguageSelector)
  const { width } = useWindowDimensions()
  const { mode } = useParams()
  const dispatch = useDispatch()

  const blueCardsTest = history.location.pathname.includes('test')

  useEffect(() => {
    dispatch(getStoriesBlueFlashcards(learningLanguage, dictionaryLanguage))
  }, [])

  const content = () => {
    switch (mode) {
      case 'new':
        return <FlashcardCreation />
      case 'list':
        return <FlashcardList />
      case 'article':
        return <Practice mode="article" open={openPracModal} setOpen={setOpenPracModal} />
      case 'quick':
        return <Practice mode="quick" open={openPracModal} setOpen={setOpenPracModal} />
      default:
        return <Practice mode="fillin" open={openPracModal} setOpen={setOpenPracModal} />
    }
  }

  return (
    <div className="cont-tall cont pb-nm flex-col auto pt-xl space-between">
      <div className="flex">
        {!blueCardsTest && (
          <FlashcardsPracticeEncouragement
            open={openModal}
            setOpen={setOpenModal}
            prevBlueCards={storyBlueCards}
          />
        )}
        {width < 940 ? <FloatMenu /> : <FlashcardMenu />}
        {content()}
      </div>
      <div className="flex-reverse">
        <ReportButton extraClass="align-self-end mr-sm" />
        {!openPracModal && (
          <span style={{ marginRight: '.25em' }}>
            <EncouragementButton handleShowEncouragement={() => setOpenPracModal(true)} />
          </span>
        )}
        {!openModal && !blueCardsTest && (
          <span style={{ marginRight: '.25em' }}>
            <EncouragementButton handleShowEncouragement={() => setOpenModal(true)} />
          </span>
        )}
      </div>
    </div>
  )
}

export default Flashcards
