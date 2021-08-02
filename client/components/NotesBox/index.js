import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Segment, Icon, Form, TextArea, Popup, Divider } from 'semantic-ui-react'
import { Button } from 'react-bootstrap'
import { FormattedMessage, useIntl } from 'react-intl'
import {
  setFocusedWord,
  setHighlightedWord,
  annotateWord,
  saveAnnotation,
  setNoteVisibility,
  setFormVisibility,
} from 'Utilities/redux/notesReducer'

import { useParams } from 'react-router-dom'

const NotesBox = () => {
  const intl = useIntl()
  const dispatch = useDispatch()
  const { id: storyId } = useParams()
  const maxCharacters = 1000

  const [annotationText, setAnnotationText] = useState('')
  const [charactersLeft, setCharactersLeft] = useState(maxCharacters)
  const { focusedWord, highlightedWord, annotations, showNotes, showNoteForm } = useSelector(
    ({ notes }) => notes
  )
  const { user } = useSelector(({ user }) => ({ user: user.data.user }))

  const handleBackClick = () => {
    dispatch(setFocusedWord(null))
    dispatch(setHighlightedWord(null))
    dispatch(setFormVisibility(false))
  }

  const handleAnnotationItemClick = word => {
    dispatch(setFocusedWord(word))
  }

  const handleTextChange = e => {
    setCharactersLeft(maxCharacters - e.target.value.length)
    setAnnotationText(e.target.value)
  }

  const getNewAnnotations = () => {
    if (focusedWord?.annotation) {
      return focusedWord.annotation
        .filter(a => a.uid !== user.oid)
        .concat({ annotation: annotationText, username: user.userName, uid: user.oid })
    }
    return [{ annotation: annotationText, username: user.userName, uid: user.oid }]
  }

  const handleAnnotationSave = async saveType => {
    await dispatch(
      annotateWord(storyId, {
        op: 'edit',
        token_id: focusedWord.ID,
        annotation: saveType === 'new' ? annotationText : annotationText,
      })
    )

    dispatch(setFocusedWord(null))
    dispatch(setHighlightedWord(null))
    dispatch(setFormVisibility(false))

    dispatch(
      saveAnnotation(
        annotations
          .filter(w => w.ID !== focusedWord.ID)
          .concat({
            ...focusedWord,
            annotation: getNewAnnotations(),
          })
      )
    )
    setAnnotationText('')
  }

  const handleAnnotationDelete = async () => {
    await dispatch(
      annotateWord(storyId, {
        op: 'delete',
        token_id: focusedWord.ID,
      })
    )
    dispatch(setFocusedWord(null))
    dispatch(setHighlightedWord(null))

    const getNewAnnotations = () => {
      if (focusedWord?.annotation) {
        return focusedWord.annotation
          .filter(a => a.uid !== user.oid)
          .concat({ annotation: '<removed>', username: user.userName, uid: user.oid })
      }
      return [{ annotation: '<removed>', username: user.userName, uid: user.oid }]
    }

    dispatch(
      saveAnnotation(
        annotations
          .filter(w => w.ID !== focusedWord.ID)
          .concat({
            ...focusedWord,
            annotation: getNewAnnotations(),
          })
      )
    )
  }

  const handleHighlightCancelButtonClick = () => {
    dispatch(setHighlightedWord(null))
  }

  const handleNoteBoxCollapse = () => {
    dispatch(setNoteVisibility(false))

    if (highlightedWord) dispatch(setHighlightedWord(null))
    if (focusedWord) dispatch(setFocusedWord(null))
  }

  const handleEditButtonClick = text => {
    dispatch(setFormVisibility(true))
    setAnnotationText(text)
    setCharactersLeft(maxCharacters - text.length)
  }

  const handleCreateNoteButtonClick = () => {
    dispatch(setFormVisibility(true))
    setAnnotationText('')
  }

  const handleAnnotationItemMouseOver = word => dispatch(setHighlightedWord(word))

  const filterAllNotes = notes => {
    return notes.filter(
      w => w.annotation[0].annotation !== '<removed>' && w.annotation[0].length !== 1
    )
  }

  const filterRemovedNotes = word => {
    return word.annotation?.filter(a => a.annotation !== '<removed>')
  }

  const annotationResults = () => {
    if (!showNotes) {
      return (
        <div
          className="space-between"
          onClick={() => dispatch(setNoteVisibility(true))}
          onKeyDown={() => dispatch(setNoteVisibility(true))}
          role="button"
          tabIndex={0}
        >
          <div className="header-3">
            <FormattedMessage id="notes" />{' '}
            <Popup
              position="top center"
              content={intl.formatMessage({ id: 'notes-info-text' })}
              trigger={<Icon name="info circle" size="small" />}
            />
          </div>
          <Icon name="angle down" size="large" />
        </div>
      )
    }

    if (focusedWord) {
      const filteredNotes = filterRemovedNotes(focusedWord)

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
            {filteredNotes?.length > 0 ? (
              <div>
                {filteredNotes.map(a => (
                  <div
                    key={a.uid}
                    style={{
                      backgroundColor:
                        showNoteForm && a.username === user.userName ? '#fff' : '#f5f5f5',
                      margin: showNoteForm && a.username === user.userName ? '0rem' : '0.5rem 0rem',
                      borderRadius: '.2rem',
                      padding: '.3em',
                    }}
                  >
                    {a.username === user.userName && showNoteForm ? (
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

                {filterRemovedNotes(focusedWord).every(
                  a => a.username !== user.userName && !showNoteForm
                ) && (
                  <Button
                    style={{ marginTop: '.75em' }}
                    size="sm"
                    onClick={handleCreateNoteButtonClick}
                  >
                    <FormattedMessage id="create-a-note" />
                  </Button>
                )}
              </div>
            ) : (
              <div>
                {!showNoteForm && (
                  <>
                    <div style={{ color: 'slateGrey', fontStyle: 'italic', margin: '.5rem 0rem' }}>
                      This word has no notes yet
                    </div>
                    <Button
                      style={{ marginTop: '.75em' }}
                      size="sm"
                      onClick={handleCreateNoteButtonClick}
                    >
                      <FormattedMessage id="create-a-note" />
                    </Button>
                  </>
                )}
              </div>
            )}
          </div>
          {showNoteForm && (
            <div>
              <Form>
                <TextArea
                  value={annotationText}
                  onChange={handleTextChange}
                  placeholder={intl.formatMessage({ id: 'write-your-note-here' })}
                  maxLength={maxCharacters}
                  style={{ marginTop: '0rem', minHeight: '10em' }}
                  autoFocus
                />
              </Form>
              <div className="bold" style={{ margin: '.75rem 0rem', fontSize: '.85rem' }}>
                <FormattedMessage id="characters-left" />
                {` ${charactersLeft}`}
              </div>
              <Button
                variant="outline-secondary"
                size="sm"
                onClick={() => dispatch(setFormVisibility(false))}
              >
                <FormattedMessage id="Cancel" />
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => handleAnnotationSave('new')}
                style={{ marginLeft: '.5em' }}
                disabled={annotationText.length < 1}
              >
                <FormattedMessage id="Save" />
              </Button>
            </div>
          )}
        </div>
      )
    }

    if (annotations?.length > 0) {
      return (
        <div>
          <div
            className="space-between"
            onClick={handleNoteBoxCollapse}
            onKeyDown={handleNoteBoxCollapse}
            role="button"
            tabIndex={0}
          >
            <div>
              <div className="header-3">
                <FormattedMessage id="notes" />{' '}
                <Popup
                  position="top center"
                  content={intl.formatMessage({ id: 'notes-info-text' })}
                  trigger={<Icon name="info circle" size="small" />}
                />
              </div>
            </div>
            <Icon name="angle up" size="large" />
          </div>
          <div style={{ marginTop: '1em' }}>
            {filterAllNotes(annotations).map((word, index) => (
              <div>
                {index + 1} -{' '}
                <span
                  onClick={() => handleAnnotationItemClick(word)}
                  onMouseOver={() => handleAnnotationItemMouseOver(word)}
                  onFocus={() => handleAnnotationItemMouseOver(word)}
                  onKeyDown={() => handleAnnotationItemClick(word)}
                  role="button"
                  tabIndex={0}
                  className={word?.ID === highlightedWord?.ID ? 'notes-highlighted-word' : ''}
                >
                  {word.surface}
                </span>
              </div>
            ))}
          </div>
          {highlightedWord && (
            <Button
              size="sm"
              variant="outline-secondary"
              onClick={handleHighlightCancelButtonClick}
              style={{ marginTop: '1em' }}
            >
              <FormattedMessage id="cancel-highlighting" />
            </Button>
          )}
        </div>
      )
    }

    return (
      <div>
        <div
          className="space-between"
          onClick={handleNoteBoxCollapse}
          onKeyDown={handleNoteBoxCollapse}
          role="button"
          tabIndex={0}
        >
          <div>
            <div className="header-3">
              <FormattedMessage id="notes" />{' '}
              <Popup
                position="top center"
                content={intl.formatMessage({ id: 'notes-info-text' })}
                trigger={<Icon name="info circle" size="small" />}
              />
            </div>
          </div>
          <Icon name="angle up" size="large" />
        </div>
        <div style={{ marginTop: '1.5em', color: 'slateGrey', fontStyle: 'italic' }}>
          <FormattedMessage id="click-word-create-note" />
        </div>
      </div>
    )
  }

  return (
    <div className="notes-box">
      <Segment>
        <div>{annotationResults()}</div>
      </Segment>
    </div>
  )
}

export default NotesBox
