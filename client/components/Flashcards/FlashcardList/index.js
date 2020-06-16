import React from 'react'
import { useSelector } from 'react-redux'
import { ListGroup } from 'react-bootstrap'

const ListItem = ({ lemma }) => (
  <ListGroup.Item>{lemma}</ListGroup.Item>
)

const FlashcardList = () => {
  const cards = useSelector(state => state.flashcards.cards)
  console.log(cards)

  return (
    <ListGroup>
      {cards.map(card => <ListItem key={card._id} lemma={card.lemma} />)}
    </ListGroup>
  )
}

export default FlashcardList
