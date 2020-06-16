import React, { useMemo, useState, useLayoutEffect } from 'react'
import { useSelector } from 'react-redux'
import { ListGroup } from 'react-bootstrap'
import Spinner from 'Components/Spinner'
import FlashcardListEdit from './FlashcardListEdit'
import CardListItem from './CardListItem'

const FlashcardList = () => {
  const [editableCard, setEditableCard] = useState(null)
  const [scrollYPosition, setScrollYPosition] = useState(0)

  const { cards, pending } = useSelector(({ flashcards }) => flashcards)

  useLayoutEffect(() => {
    if (!editableCard) window.scrollTo(0, scrollYPosition)
  }, [editableCard])

  const handleEdit = (card) => {
    setScrollYPosition(window.scrollY)
    setEditableCard(card)
  }

  const cardListItems = useMemo(() => cards
    .sort((a, b) => a.lemma.localeCompare(b.lemma))
    .map(card => (<CardListItem key={card._id} card={card} handleEdit={handleEdit} />)), [cards])

  if (pending) return <Spinner />

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
    <ListGroup style={{ flex: 1 }}>
      {cardListItems}
    </ListGroup>
  )
}

export default FlashcardList
