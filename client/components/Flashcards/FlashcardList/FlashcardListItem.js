import React from 'react'
import { useDispatch } from 'react-redux'
import { ListGroup } from 'react-bootstrap'
import { Icon } from 'semantic-ui-react'
import { deleteFlashcard } from 'Utilities/redux/flashcardReducer'

const FlashcardListItem = ({ card, handleEdit }) => {
  const { lemma, _id } = card

  const dispatch = useDispatch()

  const handleDelete = () => {
    dispatch(deleteFlashcard(_id))
  }

  return (
    <ListGroup.Item
      style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
    >
      <div>
        <Icon name="edit outline" onClick={() => handleEdit(card)} />
        {lemma}
      </div>
      <Icon name="close" onClick={handleDelete} />
    </ListGroup.Item>
  )
}

export default FlashcardListItem
