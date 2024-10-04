import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import useWindowDimensions from 'Utilities/windowDimensions'
import { Segment } from 'semantic-ui-react'
import {
  setAnnotationsVisibility,
  setFocusedSpan,
  setHighlightRange,
  resetAnnotationCandidates,
} from 'Utilities/redux/annotationsReducer'
import ListView from './ListView'
import FocusedView from './FocusedView'
import AnnotationsHiddenView from './AnnotationsHiddenView'
import NoAnnotationsView from './NoAnnotationsView'

const AnnotationBox = () => {
  const dispatch = useDispatch()
  const { width } = useWindowDimensions()
  const { teacherView } = useSelector(({ user }) => user.data)
  const { focusedSpan, highlightRange, spanAnnotations, showAnnotations, annotationCandidates } =
    useSelector(({ annotations }) => annotations)

  const handleAnnotationBoxCollapse = () => {
    if (focusedSpan) dispatch(setFocusedSpan(null))
    if (annotationCandidates) dispatch(resetAnnotationCandidates())
    if (highlightRange) dispatch(setHighlightRange(null, null))

    dispatch(setAnnotationsVisibility(false))
  }

  const annotationView = () => {
    if (!showAnnotations) {
      return <AnnotationsHiddenView />
    }

    if (focusedSpan || annotationCandidates.length > 0) {
      return <FocusedView focusedSpan={focusedSpan} spanAnnotations={spanAnnotations} />
    }

    if (spanAnnotations?.length > 0) {
      return <ListView handleAnnotationBoxCollapse={handleAnnotationBoxCollapse} />
    }

    return <NoAnnotationsView handleAnnotationBoxCollapse={handleAnnotationBoxCollapse} />
  }

  if (width >= 1024) {
    return (
      <div className="annotations-box">
        <Segment>
          <div>{annotationView()}</div>
        </Segment>
      </div>
    )
  }

  return null
}

export default AnnotationBox
