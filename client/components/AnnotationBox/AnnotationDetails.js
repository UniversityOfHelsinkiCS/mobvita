import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Icon, Divider } from 'semantic-ui-react'
import { Button } from 'react-bootstrap'
import { FormattedMessage, useIntl } from 'react-intl'
import {
  setFocusedWord,
  setHighlightedWord,
  saveAnnotation,
  removeAnnotation,
  updateAnnotationStore,
  setAnnotationFormVisibility,
} from 'Utilities/redux/annotationsReducer'
import { useParams } from 'react-router-dom'
import AnnotationForm from './AnnotationForm'

const AnnotationDetails = ({ focusedWord, annotations, showAnnotationForm }) => {
  const dispatch = useDispatch()
  const maxCharacters = 1000
  const intl = useIntl()

  const [annotationText, setAnnotationText] = useState('')
  const [charactersLeft, setCharactersLeft] = useState(maxCharacters)
  const { user } = useSelector(({ user }) => ({ user: user.data.user }))
  const { id: storyId } = useParams()

  const addEditAnnotationInStore = () => {
    if (focusedWord?.annotation) {
      return focusedWord.annotation
        .filter(a => a.uid !== user.oid)
        .concat({ annotation: annotationText, username: user.userName, uid: user.oid })
    }
    return [{ annotation: annotationText, username: user.userName, uid: user.oid }]
  }

  const handleEditButtonClick = text => {
    dispatch(setAnnotationFormVisibility(true))
    setAnnotationText(text)
    setCharactersLeft(maxCharacters - text.length)
  }

  const handleBackClick = () => {
    dispatch(setFocusedWord(null))
    dispatch(setHighlightedWord(null))
    dispatch(setAnnotationFormVisibility(false))
  }

  const handleCreateAnnotationButtonClick = () => {
    dispatch(setAnnotationFormVisibility(true))
    setAnnotationText('')
    setCharactersLeft(maxCharacters)
  }

  const filterRemovedAnnotations = word => {
    return word.annotation?.filter(a => a.annotation !== '<removed>')
  }

  const handleAnnotationSave = async () => {
    await dispatch(saveAnnotation(storyId, 'edit', focusedWord.ID, annotationText))
    dispatch(setFocusedWord(null))
    dispatch(setHighlightedWord(null))
    dispatch(setAnnotationFormVisibility(false))

    dispatch(
      updateAnnotationStore(
        annotations
          .filter(w => w.ID !== focusedWord.ID)
          .concat({
            ...focusedWord,
            annotation: addEditAnnotationInStore(),
          })
      )
    )
    setAnnotationText('')
  }

  const handleAnnotationDelete = async () => {
    await dispatch(removeAnnotation(storyId, 'delete', focusedWord.ID))
    dispatch(setFocusedWord(null))
    dispatch(setHighlightedWord(null))

    const updateFocusedWordAnnotations = () => {
      return focusedWord.annotation
        .filter(a => a.uid !== user.oid)
        .concat({ annotation: '<removed>', username: user.userName, uid: user.oid })
    }

    dispatch(
      updateAnnotationStore(
        annotations
          .filter(w => w.ID !== focusedWord.ID)
          .concat({
            ...focusedWord,
            annotation: updateFocusedWordAnnotations(),
          })
      )
    )
  }

  const userHasNoAnnotationForWord = word => {
    return filterRemovedAnnotations(word).every(a => a.username !== user.userName)
  }

  const filteredAnnotations = filterRemovedAnnotations(focusedWord)

  return (
    <div>
      <div role="button" onClick={handleBackClick} onKeyDown={handleBackClick} tabIndex={0}>
        <Icon name="arrow left" />
        <FormattedMessage id="all-notes" />
      </div>
      <Divider />
      <div>
        <div style={{ margin: '1.5em 0em' }}>
          <b>{focusedWord.surface}</b>
        </div>
        <Divider />
        {filteredAnnotations?.length > 0 ? (
          <div>
            {filteredAnnotations.map(a => (
              <div
                key={a.uid}
                className={`annotation-item ${
                  showAnnotationForm && a.username === user.userName
                    ? 'annotation-item-editing'
                    : 'annotation-item-listed'
                }
                `}
              >
                {a.username === user.userName && showAnnotationForm ? (
                  <div className="bold">
                    <FormattedMessage id="edit-your-note" />:
                  </div>
                ) : (
                  <>
                    <div className="space-between" style={{ marginBottom: '1em' }}>
                      <div>
                        {a.username === user.userName ? (
                          <div>
                            <b>{intl.formatMessage({ id: 'you' })}</b>{' '}
                            {intl.formatMessage({ id: '(you)wrote' })}:
                          </div>
                        ) : (
                          <div>
                            <b>{a.username}</b> {intl.formatMessage({ id: '(he/she)wrote' })}:
                          </div>
                        )}
                      </div>

                      {a.username === user.userName && (
                        <div>
                          <Button
                            size="sm"
                            variant="outline-secondary"
                            onClick={() => handleEditButtonClick(a.annotation)}
                          >
                            <Icon name="pencil alternate" />
                            <FormattedMessage id="edit" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline-danger"
                            onClick={handleAnnotationDelete}
                          >
                            <Icon name="trash alternate" />
                            <FormattedMessage id="Delete" />
                          </Button>
                        </div>
                      )}
                    </div>

                    <div>
                      <i>{a.annotation}</i>
                    </div>
                  </>
                )}
              </div>
            ))}

            {userHasNoAnnotationForWord(focusedWord) && !showAnnotationForm && (
              <Button
                style={{ marginTop: '.75em' }}
                size="sm"
                onClick={handleCreateAnnotationButtonClick}
              >
                <FormattedMessage id="create-a-note" />
              </Button>
            )}
          </div>
        ) : (
          <div>
            {!showAnnotationForm && (
              <>
                <div className="notes-info-text" style={{ margin: '.5rem 0rem' }}>
                  <FormattedMessage id="this-word-has-no-notes-yet" />
                </div>
                <Button
                  style={{ marginTop: '.75em' }}
                  size="sm"
                  onClick={handleCreateAnnotationButtonClick}
                >
                  <FormattedMessage id="create-a-note" />
                </Button>
              </>
            )}
          </div>
        )}
      </div>
      {showAnnotationForm && (
        <AnnotationForm
          annotationText={annotationText}
          setAnnotationText={setAnnotationText}
          handleAnnotationSave={handleAnnotationSave}
          maxCharacters={maxCharacters}
          charactersLeft={charactersLeft}
          setCharactersLeft={setCharactersLeft}
        />
      )}
    </div>
  )
}

export default AnnotationDetails
