import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Segment, Icon, Popup } from 'semantic-ui-react'
import { FormattedMessage, useIntl } from 'react-intl'
import {
  setFocusedWord,
  setHighlightedWord,
  setAnnotationsVisibility,
} from 'Utilities/redux/annotationsReducer'
import AnnotationList from './AnnotationList'
import AnnotationDetails from './AnnotationDetails'

const AnnotationBox = ({ mode }) => {
  const intl = useIntl()
  const dispatch = useDispatch()
  const { focusedWord, highlightedWord, annotations, showAnnotations, showAnnotationForm } =
    useSelector(({ annotations }) => annotations)

  const handleAnnotationBoxCollapse = () => {
    if (highlightedWord) dispatch(setHighlightedWord(null))
    if (focusedWord) dispatch(setFocusedWord(null))

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

    if (focusedWord) {
      return (
        <AnnotationDetails
          focusedWord={focusedWord}
          annotations={annotations}
          showAnnotationForm={showAnnotationForm}
        />
      )
    }

    if (annotations?.length > 0) {
      return (
        <AnnotationList
          handleAnnotationBoxCollapse={handleAnnotationBoxCollapse}
          annotations={annotations}
          highlightedWord={highlightedWord}
        />
      )
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
            id={mode === 'read' ? 'this-story-has-no-notes' : 'notes-added-to-history-appear-here'}
          />
          <br /> <br />
          <FormattedMessage
            id={
              mode === 'read'
                ? 'click-any-word-to-create-one'
                : 'click-any-word-in-history-to-add-new'
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
