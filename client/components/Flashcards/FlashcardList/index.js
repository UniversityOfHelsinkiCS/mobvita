import React, { useState, useLayoutEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useParams } from 'react-router-dom'
import { FormattedMessage } from 'react-intl'
import { Accordion } from 'react-bootstrap'
import { Pagination } from 'semantic-ui-react'
import { useLearningLanguage, useDictionaryLanguage } from 'Utilities/common'
import { getFlashcardListPage } from 'Utilities/redux/flashcardListReducer'
import Spinner from 'Components/Spinner'
import FlashcardListEdit from './FlashcardListEdit'
import FlashcardListItem from './FlashcardListItem'

const FlashcardList = () => {
  const [editableCard, setEditableCard] = useState(null)
  const [scrollYPosition, setScrollYPosition] = useState(0)
  const [activePage, setActivePage] = useState(1)

  const { cardsInCurrentPage, numberOfCards, numberOfPages, pending } = useSelector(
    ({ flashcardList }) => flashcardList
  )
  const learningLanguage = useLearningLanguage()
  const dictionaryLanguage = useDictionaryLanguage()

  const dispatch = useDispatch()
  const { storyId } = useParams()

  useLayoutEffect(() => {
    if (!editableCard) window.scrollTo(0, scrollYPosition)
  }, [editableCard])

  const handleEdit = card => {
    setScrollYPosition(window.scrollY)
    setEditableCard(card)
  }

  const handlePageChange = (e, { activePage }) => {
    setActivePage(activePage)
    dispatch(getFlashcardListPage(learningLanguage, dictionaryLanguage, activePage - 1, storyId))
  }

  const isSomePageLoaded = cardsInCurrentPage.length !== 0
  const nextPagePending = isSomePageLoaded && pending

  if (!isSomePageLoaded) return <Spinner fullHeight />

  if (editableCard) {
    return (
      <FlashcardListEdit
        id={editableCard._id}
        originalWord={editableCard.lemma}
        originalHints={editableCard.hint}
        originalTranslations={editableCard.glosses}
        setEditableCard={setEditableCard}
      />
    )
  }

  return (
    <div style={{ marginTop: '-1em', flex: 1 }}>
      <div className="flex-reverse space-between wrap padding-top-1">
        <span className="additional-info padding-left-2">
          <FormattedMessage id="cards total" values={{ numberOfCards }} />
        </span>
        <Pagination
          activePage={activePage}
          totalPages={numberOfPages}
          firstItem={null}
          lastItem={null}
          onPageChange={handlePageChange}
          size="mini"
          className="semantic-pagination"
        />
      </div>
      {nextPagePending ? (
        <Spinner fullHeight />
      ) : (
        <Accordion className="padding-top-1">
          {cardsInCurrentPage.map(card => (
            <FlashcardListItem key={card._id} card={card} handleEdit={handleEdit} />
          ))}
        </Accordion>
      )}
    </div>
  )
}

export default FlashcardList
