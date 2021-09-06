import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Segment, Icon, Popup } from 'semantic-ui-react'
import { FormattedMessage, useIntl } from 'react-intl'
import {
  setAnnotationsVisibility,
  setFocusedSpan,
  setHighlightRange,
  resetAnnotationCandidates,
} from 'Utilities/redux/annotationsReducer'
import AnnotationList from './AnnotationList'
import FocusedView from './FocusedView'
import NoAnnotationsView from './NoAnnotationsView'

const AnnotationBox = () => {
  const intl = useIntl()
  const dispatch = useDispatch()
  const { focusedSpan, highlightRange, spanAnnotations, showAnnotations, annotationCandidates } =
    useSelector(({ annotations }) => annotations)

  const handleAnnotationBoxCollapse = () => {
    if (focusedSpan) dispatch(setFocusedSpan(null))
    if (annotationCandidates) dispatch(resetAnnotationCandidates())
    if (highlightRange) dispatch(setHighlightRange(null, null))

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
      return <FocusedView focusedSpan={focusedSpan} spanAnnotations={spanAnnotations} />
    }

    if (spanAnnotations?.length > 0) {
      return <AnnotationList handleAnnotationBoxCollapse={handleAnnotationBoxCollapse} />
    }

    return <NoAnnotationsView handleAnnotationBoxCollapse={handleAnnotationBoxCollapse} />
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
