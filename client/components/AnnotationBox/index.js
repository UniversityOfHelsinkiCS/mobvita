import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Segment, Icon, Popup } from 'semantic-ui-react'
import { useHistory } from 'react-router-dom'
import { FormattedMessage, useIntl } from 'react-intl'
import {
  setAnnotationsVisibility,
  setFocusedSpan,
  resetAnnotationCandidates,
} from 'Utilities/redux/annotationsReducer'
import AnnotationList from './AnnotationList'
import AnnotationDetails from './AnnotationDetails'

const AnnotationBox = () => {
  const intl = useIntl()
  const dispatch = useDispatch()
  const history = useHistory()
  const {
    focusedSpan,
    spanAnnotations,
    showAnnotations,
    showAnnotationForm,
    annotationCandidates,
  } = useSelector(({ annotations }) => annotations)

  const isPracticeMode = history.location.pathname.includes('practice')

  const handleAnnotationBoxCollapse = () => {
    if (focusedSpan) dispatch(setFocusedSpan(null))
    if (annotationCandidates) dispatch(resetAnnotationCandidates())

    dispatch(setAnnotationsVisibility(false))
  }

  const annotationResults = () => {
    if (!showAnnotations) {
      return (
        <div
          className="space-between"
          onClick={() => dispatch(setAnnotationsVisibility(true))}
          onKeyDown={() => dispatch(setAnnotationsVisibility(true))}
          role="button"
          tabIndex={0}
          data-cy="annotations-visibility-button"
        >
          <div className="header-3">
            <FormattedMessage id="notes" />{' '}
            <Popup
              position="top center"
              content={intl.formatMessage({ id: 'annotations-popup-info-text' })}
              trigger={<Icon name="info circle" size="small" />}
            />
          </div>
          <Icon name="angle down" size="large" />
        </div>
      )
    }

    if (focusedSpan || annotationCandidates.length > 0) {
      return (
        <AnnotationDetails
          focusedSpan={focusedSpan}
          spanAnnotations={spanAnnotations}
          showAnnotationForm={showAnnotationForm}
        />
      )
    }

    if (spanAnnotations?.length > 0) {
      return <AnnotationList handleAnnotationBoxCollapse={handleAnnotationBoxCollapse} />
    }

    return (
      <div>
        <div
          className="space-between"
          onClick={handleAnnotationBoxCollapse}
          onKeyDown={handleAnnotationBoxCollapse}
          role="button"
          tabIndex={0}
        >
          <div>
            <div className="header-3">
              <FormattedMessage id="notes" />{' '}
              <Popup
                position="top center"
                content={intl.formatMessage({ id: 'annotations-popup-info-text' })}
                trigger={<Icon name="info circle" size="small" />}
              />
            </div>
          </div>
          <Icon name="angle up" size="large" />
        </div>
        <div className="notes-info-text" style={{ marginTop: '1.5em' }}>
          <FormattedMessage
            id={isPracticeMode ? 'notes-added-to-history-appear-here' : 'this-story-has-no-notes'}
          />
          <br /> <br />
          <FormattedMessage
            id={
              isPracticeMode
                ? 'click-any-word-in-history-to-add-new'
                : 'click-any-word-to-create-one'
            }
          />
        </div>
      </div>
    )
  }

  return (
    <div className="annotations-box">
      <Segment>
        <div>{annotationResults()}</div>
      </Segment>
    </div>
  )
}

export default AnnotationBox
