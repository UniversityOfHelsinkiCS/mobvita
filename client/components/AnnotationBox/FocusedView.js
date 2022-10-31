import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Icon, Divider, Popup } from 'semantic-ui-react'
import useWindowDimensions from 'Utilities/windowDimensions'
import { FormattedMessage } from 'react-intl'
import { getMode } from 'Utilities/common'
import {
  setFocusedSpan,
  setAnnotationFormVisibility,
  setHighlightRange,
  resetAnnotationCandidates,
} from 'Utilities/redux/annotationsReducer'
import { useParams } from 'react-router-dom'
import { addEditStoryAnnotation, removeStoryAnnotation } from 'Utilities/redux/storiesReducer'
import ConfirmationWarning from 'Components/ConfirmationWarning'
import AnnotationForm from './AnnotationForm'
import AnnotationSelectionView from './AnnotationSelectionView'
import AnnotationTexts from './AnnotationTexts'

const BackToAllNotes = ({ resetAndGoToListView, annotationString }) => {
  return (
    <>
      <div className="flex" style={{ margin: '.5rem 0em', fontWeight: '500' }}>
        <Popup
          content={<FormattedMessage id="back-to-all-notes" />}
          trigger={
            <Icon
              name="arrow left"
              style={{ cursor: 'pointer', marginRight: '.5rem' }}
              onClick={resetAndGoToListView}
              onKeyDown={resetAndGoToListView}
              tabIndex={0}
            />
          }
        />
        <div>{annotationString}</div>
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
  const [category, setCategory] = useState('None')
  const [annotationName, setAnnotationName] = useState('')
  const [annotationText, setAnnotationText] = useState('')
  const [threadId, setThreadId] = useState(null)
  const [charactersLeft, setCharactersLeft] = useState(maxCharacters)
  const [openWarning, setOpenWarning] = useState(false)
  const { user } = useSelector(({ user }) => ({ user: user.data.user }))
  const { annotationCandidates, showAnnotationForm } = useSelector(({ annotations }) => annotations)
  const { id: storyId } = useParams()
  const { story } = useSelector(({ stories }) => ({
    story: stories.focused,
  }))
  const userHasLoggedIn = user.userName !== 'Anonymous User'
  const mode = getMode()
  const storyWords = story.paragraph.flat(1)
  const publicStory = story.public

  const handleEditButtonClick = (text, name, thread_id) => {
    dispatch(setAnnotationFormVisibility(true))
    setAnnotationText(text)
    setThreadId(thread_id)
    if (name.length > 0) {
      setAnnotationName(name)
    }
    setCharactersLeft(maxCharacters - text.length)
  }

  const resetAndGoToListView = () => {
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

  const handleAnnotationSave = async publicNote => {
    if (focusedSpan) {
      await dispatch(
        addEditStoryAnnotation(
          publicStory,
          publicNote,
          storyId,
          focusedSpan.startId,
          focusedSpan.endId,
          annotationText.trim(),
          mode,
          category,
          annotationName,
          threadId,
        )
      )
    } else {
      await dispatch(
        addEditStoryAnnotation(
          publicStory,
          publicNote,
          storyId,
          annotationCandidates[0].ID,
          annotationCandidates[annotationCandidates.length - 1].ID,
          annotationText.trim(),
          mode,
          category,
          annotationName,
        )
      )
    }
    resetAndGoToListView()
    setAnnotationText('')
  }

  const handleAnnotationDelete = async () => {
    await dispatch(removeStoryAnnotation(storyId, focusedSpan.startId, focusedSpan.endId, mode))
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
      <div>
        {bigScreen && (
          <BackToAllNotes
            resetAndGoToListView={resetAndGoToListView}
            annotationString={focusedSpan?.annotationString}
          />
        )}
      </div>
      {focusedSpan ? (
        <>
          <AnnotationTexts
            handleEditButtonClick={handleEditButtonClick}
            handleCreateAnnotationButtonClick={handleCreateAnnotationButtonClick}
            showAnnotationForm={showAnnotationForm}
            showCreateNoteButton={showCreateNoteButton}
            handleAnnotationDelete={handleAnnotationDelete}
            setOpenWarning={setOpenWarning}
          />
          <ConfirmationWarning
            open={openWarning}
            setOpen={setOpenWarning}
            action={handleAnnotationDelete}
          >
            <FormattedMessage id="annotation-remove-confirm" />
          </ConfirmationWarning>
        </>
      ) : (
        <AnnotationSelectionView
          storyWords={storyWords}
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
          category={category}
          setCategory={setCategory}
          annotationName={annotationName}
          setAnnotationName={setAnnotationName}
          publicStory={story?.public}
          sharedStory={story?.private_share}
        />
      )}
    </div>
  )
}

export default FocusedView
