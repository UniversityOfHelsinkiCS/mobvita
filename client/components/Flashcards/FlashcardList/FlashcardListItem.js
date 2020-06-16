import React from 'react'
import { useDispatch } from 'react-redux'
import { ListGroup, Card, Accordion } from 'react-bootstrap'
import { Icon } from 'semantic-ui-react'
import { FormattedMessage } from 'react-intl'
import { sanitizeHtml } from 'Utilities/common'
import { deleteFlashcard } from 'Utilities/redux/flashcardReducer'

const FlashcardListItem = ({ card, handleEdit }) => {
  const { lemma, _id } = card

  const dispatch = useDispatch()

  const handleDelete = () => {
    dispatch(deleteFlashcard(_id))
  }

  return (
    <Card>
      <ListGroup.Item style={{ display: 'flex', border: 0, alignItems: 'center' }}>
        <Accordion.Toggle
          eventKey={_id}
          style={{
            backgroundColor: 'white',
            border: 0,
            flex: 1,
            textAlign: 'left',
            outline: 0,
          }}
        >
          <Icon name="edit outline" onClick={() => handleEdit(card)} />
          {lemma}
        </Accordion.Toggle>
        <Icon name="close" onClick={handleDelete} style={{ cursor: 'pointer' }} />
      </ListGroup.Item>
      <Accordion.Collapse eventKey={_id}>
        <Card.Body>
          <span className="bold">
            <FormattedMessage id="Translations" />
          </span>
          <ul>
            {card.glosses.map(gloss => <li key={gloss}>{gloss}</li>)}
          </ul>
          {card.hint.length > 0
            && (
            <div>
              <span className="bold">
                <FormattedMessage id="Hints" />
              </span>
              <ul>
                {card.hint.map(hint => (
                  <li key={hint.hint} dangerouslySetInnerHTML={sanitizeHtml(hint.hint)} />))}
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
