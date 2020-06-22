import React, { useMemo, useState, useLayoutEffect } from 'react'
import { useSelector } from 'react-redux'
import { Accordion } from 'react-bootstrap'
import Spinner from 'Components/Spinner'
import FlashcardListEdit from './FlashcardListEdit'
import FlashcardListItem from './FlashcardListItem'
import FlashcardListSorter from './FlashcardListSorter'

const FlashcardList = () => {
  const [editableCard, setEditableCard] = useState(null)
  const [scrollYPosition, setScrollYPosition] = useState(0)
  const [sortBy, setSortBy] = useState('Title')
  const [directionMultiplier, setDirectionMultiplier] = useState(1)

  const { cards, pending } = useSelector(({ flashcards }) => flashcards)

  useLayoutEffect(() => {
    if (!editableCard) window.scrollTo(0, scrollYPosition)
  }, [editableCard])

  const comparator = (a, b) => {
    switch (sortBy) {
      case 'Difficulty':
        return directionMultiplier * (b.stage - a.stage)
      default:
        return directionMultiplier * (a.lemma.localeCompare(b.lemma))
    }
  }

  const handleEdit = (card) => {
    setScrollYPosition(window.scrollY)
    setEditableCard(card)
  }

  const cardListItems = useMemo(() => cards
    .sort((a, b) => comparator(a, b))
    .map(card => (
      <FlashcardListItem
        key={card._id}
        card={card}
        handleEdit={handleEdit}
      />
    )), [cards, sortBy, directionMultiplier])

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
    <div style={{ marginTop: '-1em', flex: 1 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <FlashcardListSorter
          sortBy={sortBy}
          directionMultiplier={directionMultiplier}
          setSortBy={setSortBy}
          setDirectionMultiplier={setDirectionMultiplier}
        />
        <span style={{ fontSize: '18px', paddingRight: '0.5em', fontWeight: 550, color: '#777' }}>
          {cards.length}
        </span>
      </div>
      <Accordion className="padding-top-1">
        {cardListItems}
      </Accordion>
    </div>
  )
}

export default FlashcardList
