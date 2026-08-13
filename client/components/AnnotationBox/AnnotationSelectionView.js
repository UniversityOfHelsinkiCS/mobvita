import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Divider } from '@mui/material'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft'
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight'
import AppButton from 'Components/AppButton'
import CustomTooltip from 'Components/CustomTooltip'
import { FormattedMessage } from 'react-intl'
import {
  setHighlightRange,
  addAnnotationCandidates,
  removeAnnotationCandidates,
} from 'Utilities/redux/annotationsReducer'

const AnnotationSelectionView = ({
  storyWords,
  showAnnotationForm,
  userHasLoggedIn,
  handleCreateAnnotationButtonClick,
}) => {
  const dispatch = useDispatch()

  const { annotationCandidates } = useSelector(({ annotations }) => annotations)

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
      <div
        style={{ margin: '1.5em 0em', fontWeight: '500' }}
        data-cy="annotation-selection-text"
      >
        {annotationCandidates.map(c => c.surface).join('')}
      </div>
      <Divider sx={{ my: '1em' }} />
      {!showAnnotationForm && userHasLoggedIn && (
        <>
          <div>
            <div className="space-between">
              <div>
                <AppButton
                  size="sm"
                  disabled={annotationCandidates.length <= 2}
                  onClick={handleShrink}
                  data-cy="annotation-shrink-btn"
                >
                  <KeyboardDoubleArrowLeftIcon fontSize="small" />
                </AppButton>{' '}
                <AppButton
                  size="sm"
                  onClick={() =>
                    handleExpand(annotationCandidates[annotationCandidates.length - 1])
                  }
                  data-cy="annotation-expand-btn"
                >
                  <KeyboardDoubleArrowRightIcon fontSize="small" />
                </AppButton>
              </div>
              <div>
                <AppButton
                  style={{ marginRight: '1em' }}
                  onClick={handleCreateAnnotationButtonClick}
                  size="sm"
                  data-cy="create-annotation-button"
                >
                  <FormattedMessage id="create-a-note" />
                </AppButton>
                <CustomTooltip
                  permanent
                  placement="bottom-end"
                  title={
                    <>
                      {annotationCandidates.length > 1 ? (
                        <FormattedMessage id="words-not-in-note-yet" />
                      ) : (
                        <FormattedMessage id="word-not-in-note-yet" />
                      )}
                      <br />
                      <br />
                      <FormattedMessage id="click-arrow-buttons-to-expand-shrink" />
                    </>
                  }
                >
                  <InfoOutlinedIcon
                    fontSize="large"
                    sx={{ color: 'grey' }}
                    data-cy="annotation-selection-info-icon"
                  />
                </CustomTooltip>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  )
}

export default AnnotationSelectionView
