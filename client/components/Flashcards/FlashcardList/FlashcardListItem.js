import React, { useMemo } from 'react'
import { useDispatch } from 'react-redux'
import { ListGroup, Card, Accordion } from 'react-bootstrap'
import { Icon, Popup } from 'semantic-ui-react'
import { FormattedMessage, FormattedHTMLMessage } from 'react-intl'
import { sanitizeHtml, flashcardColors } from 'Utilities/common'
import { deleteFlashcard, recordFlashcardAnswer } from 'Utilities/redux/flashcardReducer'
import { changeFlashcardStage } from 'Utilities/redux/flashcardListReducer'

const FlashcardListItem = ({ card, handleEdit }) => {
  const { lemma, _id, stage, lan_in, lan_out } = card
  const { background } = flashcardColors

  const dispatch = useDispatch()

  const handleDelete = () => {
    dispatch(deleteFlashcard(_id))
  }

  const handleKnowFlashcard = () => {
    const answerDetails = {
      correct: true,
      answer: null,
      exercise: 'knowing',
      hints_shown: 0,
      mode: 'trans',
      lemma,
    }
    dispatch(recordFlashcardAnswer(lan_in, lan_out, answerDetails))
    dispatch(changeFlashcardStage(_id, 4))
  }

  const handleNotKnowFlashcard = () => {
    const answerDetails = {
      correct: false,
      answer: null,
      exercise: 'knowing',
      hints_shown: 0,
      mode: 'trans',
      lemma,
    }
    dispatch(recordFlashcardAnswer(lan_in, lan_out, answerDetails))
    dispatch(changeFlashcardStage(_id, 0))
  }

  const uniqueGlossListItems = useMemo(
    () => [...new Set(card.glosses)].map(gloss => <li key={gloss}>{gloss}</li>),
    [card]
  )

  const uniqueHintListItems = useMemo(
    () =>
      [...new Set(card.hint.map(hintObject => hintObject.hint))].map(hint => (
        <li key={hint} dangerouslySetInnerHTML={sanitizeHtml(hint)} />
      )),
    [card]
  )

  return (
    <Card style={{ backgroundColor: background[stage] }}>
      <ListGroup.Item
        style={{
          display: 'flex',
          border: 0,
          alignItems: 'center',
          backgroundColor: 'transparent',
        }}
      >
        <Accordion.Toggle
          eventKey={_id}
          style={{
            backgroundColor: 'transparent',
            border: 0,
            flex: 1,
            textAlign: 'left',
            outline: 0,
          }}
        >
          <Icon name="edit outline" onClick={() => handleEdit(card)} />
          {lemma}
        </Accordion.Toggle>
        <Popup
          position="top center"
          content={<FormattedHTMLMessage id="explain-i-know-word" />}
          trigger={
            <Icon
              name="check"
              onClick={handleKnowFlashcard}
              style={{ cursor: 'pointer', marginRight: '1em' }}
            />
          }
        />
        <Popup
          position="top center"
          content={<FormattedHTMLMessage id="explain-i-dont-know-word" />}
          trigger={
            <Icon
              name="question"
              onClick={handleNotKnowFlashcard}
              style={{ cursor: 'pointer', marginRight: '1em' }}
            />
          }
        />
        <Popup
          position="top center"
          content={<FormattedMessage id="remove-card-tooltip" />}
          trigger={
            <Icon name="trash alternate" onClick={handleDelete} style={{ cursor: 'pointer' }} />
          }
        />
      </ListGroup.Item>
      <Accordion.Collapse eventKey={_id}>
        <Card.Body>
          <span className="bold">
            <FormattedMessage id="Translations" />
          </span>
          <ul>{uniqueGlossListItems}</ul>
          {card.hint.length > 0 && (
            <div>
              <span className="bold">
                <FormattedMessage id="Hints" />
              </span>
              <ul>{uniqueHintListItems}</ul>
            </div>
          )}
        </Card.Body>
      </Accordion.Collapse>
    </Card>
  )
}

export default FlashcardListItem
