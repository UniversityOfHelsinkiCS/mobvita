import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { ListGroup } from 'react-bootstrap'
import { Icon } from 'semantic-ui-react'
import { deleteFlashcard } from 'Utilities/redux/flashcardReducer'

const ListItem = ({ lemma, id }) => {
  const dispatch = useDispatch()

  const handleDelete = () => {
    dispatch(deleteFlashcard(id))
  }

  return (
    <ListGroup.Item
      style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
    >
      {lemma}
      <Icon name="close" onClick={handleDelete} />
    </ListGroup.Item>
  )
}

const FlashcardList = () => {
  const cards = useSelector(state => state.flashcards.cards)
  console.log(cards)

  return (
    <ListGroup>
      {cards.map(card => <ListItem key={card._id} id={card._id} lemma={card.lemma} />)}
    </ListGroup>
  )
}

export default FlashcardList
