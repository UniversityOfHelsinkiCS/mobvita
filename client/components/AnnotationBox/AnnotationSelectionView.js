import React from 'react'
import { useDispatch } from 'react-redux'
import { Icon, Divider } from 'semantic-ui-react'
import { Button } from 'react-bootstrap'
import { FormattedMessage } from 'react-intl'
import {
  setHighlightRange,
  addAnnotationCandidates,
  removeAnnotationCandidates,
} from 'Utilities/redux/annotationsReducer'

const AnnotationSelectionView = ({
  storyWords,
  annotationCandidates,
  showAnnotationForm,
  userHasLoggedIn,
  handleCreateAnnotationButtonClick,
}) => {
  const dispatch = useDispatch()

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

  return (
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
                  data-cy="annotation-shrink-btn"
                >
                  <Icon name="angle left" />
                </Button>{' '}
                <Button
                  size="sm"
                  onClick={() =>
                    handleExpand(annotationCandidates[annotationCandidates.length - 1])
                  }
                  data-cy="annotation-expand-btn"
                >
                  <Icon name="angle right" />
                </Button>
              </div>
              <Button
                style={{ marginRight: '1em' }}
                onClick={handleCreateAnnotationButtonClick}
                size="sm"
                data-cy="create-annotation-button"
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
  )
}

export default AnnotationSelectionView
