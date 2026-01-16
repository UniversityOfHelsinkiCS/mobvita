import React, { useState, useLayoutEffect, useEffect, useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useParams } from 'react-router-dom'
import { debounce } from 'lodash'
import { FormattedMessage } from 'react-intl'
import { Accordion } from 'react-bootstrap'
import { Pagination } from 'semantic-ui-react'
import { useLearningLanguage, useDictionaryLanguage } from 'Utilities/common'
import { getFlashcardListPage, clearFlashcardList } from 'Utilities/redux/flashcardListReducer'
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

  const debouncedPageFetch = useCallback(
    debounce(page => {
      setScrollYPosition(0)
      dispatch(getFlashcardListPage(learningLanguage, dictionaryLanguage, page, storyId))
    }, 250),
    [dictionaryLanguage, storyId]
  )

  useLayoutEffect(() => {
    if (!editableCard) window.scrollTo(0, scrollYPosition)
  }, [editableCard, pending])

  useEffect(() => {
    dispatch(clearFlashcardList())
    dispatch(getFlashcardListPage(learningLanguage, dictionaryLanguage, 0, storyId))
    setActivePage(1)
  }, [dictionaryLanguage, storyId])

  const handleEdit = card => {
    setScrollYPosition(window.scrollY)
    setEditableCard(card)
  }

  const handlePageChange = (e, { activePage }) => {
    setActivePage(activePage)
    debouncedPageFetch(activePage - 1)
  }

  const handleEllipsisClick = (e, { value: ellipsisPosition }) => {
    const newPage =
      ellipsisPosition > activePage
        ? activePage + Math.ceil((numberOfPages - activePage) / 2)
        : activePage - Math.ceil(activePage / 2)
    setActivePage(newPage)
    debouncedPageFetch(newPage - 1)
  }

  const isSomePageLoaded = cardsInCurrentPage.length !== 0
  const nextPagePending = cardsInCurrentPage.length !== 0 && pending

  if (!isSomePageLoaded && pending) return <Spinner fullHeight />

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

  const pagination = (
    <Pagination
      activePage={activePage}
      totalPages={numberOfPages || 1}
      firstItem={null}
      lastItem={null}
      onPageChange={handlePageChange}
      ellipsisItem={{
        content: '...',
        onClick: handleEllipsisClick,
      }}
      size="mini"
      className="semantic-pagination"
    />
  )

  return (
    <div className="flashcard-list-view">
      <div className="flex-reverse space-between wrap pt-sm">
        <span className="additional-info pl-nm">
          <FormattedMessage id="cards total" values={{ numberOfCards }} />
        </span>
        {pagination}
      </div>
      {nextPagePending ? (
        <Spinner fullHeight />
      ) : (
        <div>
          <Accordion className="pt-sm">
            {cardsInCurrentPage.map(card => (
              <FlashcardListItem key={card._id} card={card} handleEdit={handleEdit} />
            ))}
          </Accordion>
          <div className="flex pt-sm">{pagination}</div>
        </div>
      )}
    </div>
  )
}

export default FlashcardList
