import React, { useMemo } from 'react'
import { useDispatch } from 'react-redux'
import { ListGroup, Card, Accordion } from 'react-bootstrap'
import { Icon } from 'semantic-ui-react'
import { FormattedMessage } from 'react-intl'
import { sanitizeHtml, flashcardColors } from 'Utilities/common'
import { deleteFlashcard } from 'Utilities/redux/flashcardReducer'

const FlashcardListItem = ({ card, handleEdit }) => {
  const { lemma, _id, stage } = card
  const { background } = flashcardColors

  const dispatch = useDispatch()

  const handleDelete = () => {
    dispatch(deleteFlashcard(_id))
  }

  const uniqueGlossListItems = useMemo(() => (
    [...new Set(card.glosses)].map(gloss => <li key={gloss}>{gloss}</li>)), [card])

  const uniqueHintListItems = useMemo(() => (
    [...new Set(card.hint.map(hintObject => hintObject.hint))].map(hint => (
      <li key={hint} dangerouslySetInnerHTML={sanitizeHtml(hint)} />))), [card])

  return (
    <Card style={{ backgroundColor: background[stage] }}>
      <ListGroup.Item
        style={{
          display: 'flex',
          border: 0,
          alignItems: 'center',
          backgroundColor: background[stage],
        }}
      >
        <Accordion.Toggle
          eventKey={_id}
          style={{
            backgroundColor: background[stage] || 'white',
            border: 0,
            flex: 1,
            textAlign: 'left',
            outline: 0,
          }}
        >
          <Icon name="edit outline" onClick={() => handleEdit(card)} />
          {lemma}
        </Accordion.Toggle>
        <Icon name="delete" onClick={handleDelete} style={{ cursor: 'pointer' }} />
      </ListGroup.Item>
      <Accordion.Collapse eventKey={_id}>
        <Card.Body>
          <span className="bold">
            <FormattedMessage id="Translations" />
          </span>
          <ul>
            {uniqueGlossListItems}
          </ul>
          {card.hint.length > 0
            && (
            <div>
              <span className="bold">
                <FormattedMessage id="Hints" />
              </span>
              <ul>
                {uniqueHintListItems}
              </ul>
            </div>
            )
          }
        </Card.Body>
      </Accordion.Collapse>
    </Card>
  )
}

export default FlashcardListItem
