import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Icon, Divider } from 'semantic-ui-react'
import { Button } from 'react-bootstrap'
import useWindowDimensions from 'Utilities/windowDimensions'
import { FormattedMessage, useIntl } from 'react-intl'
import {
  setFocusedSpan,
  setAnnotationFormVisibility,
  setHighlightRange,
  addAnnotationCandidates,
  resetAnnotationCandidates,
  removeAnnotationCandidates,
} from 'Utilities/redux/annotationsReducer'
import { useParams } from 'react-router-dom'
import { addEditStoryAnnotation, removeStoryAnnotation } from 'Utilities/redux/storiesReducer'
import AnnotationForm from './AnnotationForm'

const AnnotationDetails = ({ focusedSpan, showAnnotationForm }) => {
  const dispatch = useDispatch()
  const maxCharacters = 1000
  const intl = useIntl()
  const { width } = useWindowDimensions()
  const bigScreen = width >= 1024

  const [annotationText, setAnnotationText] = useState('')
  const [charactersLeft, setCharactersLeft] = useState(maxCharacters)
  const { user } = useSelector(({ user }) => ({ user: user.data.user }))
  const { annotationCandidates } = useSelector(({ annotations }) => annotations)
  const { id: storyId } = useParams()
  const { story } = useSelector(({ stories }) => ({
    story: stories.focused,
  }))
  const userHasLoggedIn = user.userName !== 'Anonymous User'

  const handleEditButtonClick = text => {
    dispatch(setAnnotationFormVisibility(true))
    setAnnotationText(text)
    setCharactersLeft(maxCharacters - text.length)
  }

  const storyWords = story.paragraph.flat(1)

  const handleBackClick = () => {
    dispatch(setFocusedSpan(null))
    dispatch(setHighlightRange(null, null))
    dispatch(resetAnnotationCandidates(null))
    dispatch(setAnnotationFormVisibility(false))
  }

  const handleCreateAnnotationButtonClick = () => {
    dispatch(setAnnotationFormVisibility(true))
    setAnnotationText('')
    setCharactersLeft(maxCharacters)
  }

  const handleAnnotationSave = async () => {
    if (focusedSpan) {
      await dispatch(
        addEditStoryAnnotation(
          storyId,
          focusedSpan.startId,
          focusedSpan.endId,
          annotationText.trim()
        )
      )
    } else {
      await dispatch(
        addEditStoryAnnotation(
          storyId,
          annotationCandidates[0].ID,
          annotationCandidates[annotationCandidates.length - 1].ID,
          annotationText.trim()
        )
      )
    }
    dispatch(setHighlightRange(null, null))
    dispatch(setFocusedSpan(null))
    dispatch(resetAnnotationCandidates())
    dispatch(setAnnotationFormVisibility(false))

    setAnnotationText('')
  }

  const handleAnnotationDelete = async () => {
    await dispatch(removeStoryAnnotation(storyId, focusedSpan.startId, focusedSpan.endId))
    dispatch(setFocusedSpan(null))
    dispatch(setHighlightRange(null))
  }

  const handleExpand = word => {
    const nextWords = storyWords.filter(e => e.ID === word.ID + 1 || e.ID === word.ID + 2)
    const wordsInSameSentence = (w1, w2) => w1.sentence_id === w2.sentence_id

    if (nextWords.length === 0) return
    if (!nextWords[0].annotation && wordsInSameSentence(nextWords[0], word)) {
      dispatch(addAnnotationCandidates(nextWords[0]))
      dispatch(setHighlightRange(annotationCandidates[0].ID, nextWords[0].ID))
    }
    if (nextWords.length === 2) {
      if (
        !nextWords[0].annotation &&
        !nextWords[1].annotation &&
        wordsInSameSentence(nextWords[1], word)
      ) {
        dispatch(addAnnotationCandidates(nextWords[1]))
        dispatch(setHighlightRange(annotationCandidates[0].ID, nextWords[1].ID))
      }
    }
  }

  const handleShrink = () => {
    dispatch(
      setHighlightRange(
        annotationCandidates[0].ID,
        annotationCandidates[annotationCandidates.length - 3].ID
      )
    )
    dispatch(removeAnnotationCandidates())
  }

  const userHasNoAnnotationForFocusedSpan = () => {
    return !focusedSpan.annotationTexts.some(a => a.uid === user.oid)
  }

  return (
    <div>
      <div>
        {bigScreen && (
          <>
            <div role="button" onClick={handleBackClick} onKeyDown={handleBackClick} tabIndex={0}>
              <Icon name="arrow left" />
              <FormattedMessage id="all-notes" />
            </div>
            <Divider />
          </>
        )}
      </div>
      {focusedSpan ? (
        <>
          <div style={{ margin: '1.5em 0em', fontWeight: '500' }}>
            {focusedSpan.annotationString}
          </div>
          <Divider />

          <div>
            {focusedSpan.annotationTexts.map(a => (
              <div
                key={a.uid}
                className={`annotation-item ${
                  showAnnotationForm && a.uid === user.oid
                    ? 'annotation-item-editing'
                    : 'annotation-item-listed'
                }
                `}
              >
                {a.uid === user.oid && showAnnotationForm ? (
                  <div className="bold">
                    <FormattedMessage id="edit-your-note" />:
                  </div>
                ) : (
                  <>
                    <div className="space-between" style={{ marginBottom: '1em' }}>
                      <div>
                        {a.uid === user.oid ? (
                          <div>
                            <span style={{ fontWeight: '500' }}>
                              {intl.formatMessage({ id: 'you' })}
                            </span>{' '}
                            {intl.formatMessage({ id: '(you)wrote' })}:
                          </div>
                        ) : (
                          <div>
                            <span style={{ fontWeight: '500' }}>{a.username}</span>{' '}
                            {intl.formatMessage({ id: '(he/she)wrote' })}:
                          </div>
                        )}
                      </div>

                      {a.uid === user.oid && bigScreen && (
                        <div>
                          <Button
                            size="sm"
                            variant="outline-secondary"
                            onClick={() => handleEditButtonClick(a.text)}
                          >
                            <Icon name="pencil alternate" />
                            <FormattedMessage id="edit" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline-danger"
                            onClick={handleAnnotationDelete}
                            data-cy="delete-annotation-button"
                          >
                            <Icon name="trash alternate" />
                            <FormattedMessage id="Delete" />
                          </Button>
                        </div>
                      )}
                    </div>
                    <div className="annotation-text-content">{a.text}</div>
                  </>
                )}
              </div>
            ))}
            {userHasNoAnnotationForFocusedSpan() &&
              !showAnnotationForm &&
              userHasLoggedIn &&
              bigScreen && (
                <Button
                  style={{ marginTop: '.75em' }}
                  size="sm"
                  onClick={handleCreateAnnotationButtonClick}
                >
                  <FormattedMessage id="create-a-note" />
                </Button>
              )}
          </div>
        </>
      ) : (
        <>
          <div style={{ margin: '1.5em 0em', fontWeight: '500' }}>
            {annotationCandidates.map(c => c.surface).join('')}
          </div>
          <Divider />
          {!showAnnotationForm && userHasLoggedIn && (
            <>
              <div>
                <div className="space-between">
                  <div>
                    <Button
                      size="sm"
                      disabled={annotationCandidates.length <= 2}
                      onClick={handleShrink}
                    >
                      <Icon name="angle left" />
                    </Button>{' '}
                    <Button
                      size="sm"
                      onClick={() =>
                        handleExpand(annotationCandidates[annotationCandidates.length - 1])
                      }
                    >
                      <Icon name="angle right" />
                    </Button>
                  </div>
                  <Button
                    style={{ marginRight: '1em' }}
                    onClick={handleCreateAnnotationButtonClick}
                    size="sm"
                  >
                    <FormattedMessage id="create-a-note" />
                  </Button>
                </div>
              </div>
              <div className="notes-info-text" style={{ margin: '1.5em 0em 0em 0em' }}>
                <FormattedMessage id="word-not-in-note-yet" />
                <br />
                <br />
                <FormattedMessage id="click-arrow-buttons-to-expand-shrink" />
              </div>
            </>
          )}
        </>
      )}

      {!userHasLoggedIn && (
        <div className="italics" style={{ color: '#fc7474' }}>
          <FormattedMessage id="log-in-to-create-own-notes" />
        </div>
      )}
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
