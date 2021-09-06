import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Icon, Divider } from 'semantic-ui-react'
import useWindowDimensions from 'Utilities/windowDimensions'
import { FormattedMessage } from 'react-intl'
import {
  setFocusedSpan,
  setAnnotationFormVisibility,
  setHighlightRange,
  resetAnnotationCandidates,
} from 'Utilities/redux/annotationsReducer'
import { useParams } from 'react-router-dom'
import { addEditStoryAnnotation, removeStoryAnnotation } from 'Utilities/redux/storiesReducer'
import AnnotationForm from './AnnotationForm'
import AnnotationSelectionView from './AnnotationSelectionView'
import AnnotationTexts from './AnnotationTexts'

const BackToAllNotes = ({ handleBackClick }) => {
  return (
    <>
      <div role="button" onClick={handleBackClick} onKeyDown={handleBackClick} tabIndex={0}>
        <Icon name="arrow left" />
        <FormattedMessage id="all-notes" />
      </div>
      <Divider />
    </>
  )
}

const FocusedView = ({ focusedSpan }) => {
  const dispatch = useDispatch()
  const maxCharacters = 1000
  const { width } = useWindowDimensions()
  const bigScreen = width >= 1024

  const [annotationText, setAnnotationText] = useState('')
  const [charactersLeft, setCharactersLeft] = useState(maxCharacters)
  const { user } = useSelector(({ user }) => ({ user: user.data.user }))
  const { annotationCandidates, showAnnotationForm } = useSelector(({ annotations }) => annotations)
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
    dispatch(resetAnnotationCandidates())
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

  const userHasNoAnnotationForFocusedSpan = () => {
    return !focusedSpan?.annotationTexts.some(a => a.uid === user.oid)
  }

  const showCreateNoteButton =
    userHasNoAnnotationForFocusedSpan() && !showAnnotationForm && userHasLoggedIn && bigScreen

  return (
    <div>
      <div>{bigScreen && <BackToAllNotes handleBackClick={handleBackClick} />}</div>
      {focusedSpan ? (
        <>
          <div style={{ margin: '1.5em 0em', fontWeight: '500' }}>
            {focusedSpan.annotationString}
          </div>
          <Divider />
          <AnnotationTexts
            focusedSpan={focusedSpan}
            handleEditButtonClick={handleEditButtonClick}
            handleCreateAnnotationButtonClick={handleCreateAnnotationButtonClick}
            showAnnotationForm={showAnnotationForm}
            showCreateNoteButton={showCreateNoteButton}
            handleAnnotationDelete={handleAnnotationDelete}
          />
        </>
      ) : (
        <AnnotationSelectionView
          storyWords={storyWords}
          annotationCandidates={annotationCandidates}
          showAnnotationForm={showAnnotationForm}
          userHasLoggedIn={userHasLoggedIn}
          handleCreateAnnotationButtonClick={handleCreateAnnotationButtonClick}
        />
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

export default FocusedView
