import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import { Divider, Segment, Header } from 'semantic-ui-react'
import { Button } from 'react-bootstrap'
import { FormattedMessage } from 'react-intl'
import useWindowDimensions from 'Utilities/windowDimensions'
import { getStoryAction } from 'Utilities/redux/storiesReducer'
import {
  getTranslationAction,
  clearTranslationAction,
  setWords,
} from 'Utilities/redux/translationReducer'
import {
  setFocusedWord,
  setHighlightedWord,
  initializeAnnotations,
  setAnnotationsVisibility,
  setAnnotationFormVisibility,
} from 'Utilities/redux/annotationsReducer'
import { learningLanguageSelector, getTextStyle, speak, respVoiceLanguages } from 'Utilities/common'
import DictionaryHelp from 'Components/DictionaryHelp'
import AnnotationBox from 'Components/AnnotationBox'
import Spinner from 'Components/Spinner'
import Footer from '../Footer'
import ScrollArrow from '../ScrollArrow'

const ReadView = ({ match }) => {
  const dispatch = useDispatch()
  const { width } = useWindowDimensions()
  let currentAnnotationIndex = 0

  const { story, pending } = useSelector(({ stories, locale }) => ({
    story: stories.focused,
    pending: stories.focusedPending,
    locale,
  }))

  const { highlightedWord, annotations } = useSelector(({ annotations }) => annotations)
  const learningLanguage = useSelector(learningLanguageSelector)
  const dictionaryLanguage = useSelector(({ user }) => user.data.user.last_trans_language)
  const autoSpeak = useSelector(({ user }) => user.data.user.auto_speak)
  const { id } = match.params
  useEffect(() => {
    dispatch(getStoryAction(id))
    dispatch(setAnnotationsVisibility(false))
    dispatch(setAnnotationFormVisibility(false))
    dispatch(clearTranslationAction())
    dispatch(setFocusedWord(null))
    dispatch(setHighlightedWord(null))
  }, [])

  useEffect(() => {
    if (story) {
      const allWordsWithAnnotations = story.paragraph.flat(1).filter(word => word.annotation)
      dispatch(initializeAnnotations(allWordsWithAnnotations))
    }
  }, [story])

  if (!story || pending) return <Spinner fullHeight />

  const voice = respVoiceLanguages[learningLanguage]

  const wordHasAnnotations = word => {
    const annotationIDs = annotations?.map(w => w.ID)
    const matchingAnnotationInStore = annotations.find(w => w.ID === word.ID)
    if (matchingAnnotationInStore) {
      if (
        matchingAnnotationInStore.annotation.length === 1 &&
        matchingAnnotationInStore.annotation[0].annotation === '<removed>'
      ) {
        return false
      }
    }

    if (
      !annotationIDs.includes(word.ID) ||
      (annotationIDs.filter(id => id === word.ID)?.annotation?.length === 1 &&
        annotationIDs.filter(id => id === word.ID).annotation[0].annotation === '<removed>')
    ) {
      return false
    }
    return true
  }

  const handleWordClick = word => {
    if (autoSpeak === 'always' && voice) speak(word.surface, voice)
    if (word.lemmas) {
      dispatch(setWords(word))
      const annotationInStore = annotations.find(w => w.ID === word.ID)

      if (annotationInStore) dispatch(setFocusedWord(annotationInStore))
      else dispatch(setFocusedWord(word))

      dispatch(setHighlightedWord(word))
      dispatch(setAnnotationFormVisibility(false))
      dispatch(
        getTranslationAction({
          learningLanguage,
          wordLemmas: word.lemmas,
          dictionaryLanguage,
          storyId: id,
          wordId: word.ID,
          inflectionRef: word.inflection_ref,
        })
      )
    }
  }

  const handleNonRecognizedWordclick = word => {
    const wordAnnotationInStore = annotations.find(w => w.ID === word.ID)
    if (wordAnnotationInStore) dispatch(setFocusedWord(wordAnnotationInStore))
    else dispatch(setFocusedWord(word))

    dispatch(setHighlightedWord(word))
    dispatch(setAnnotationFormVisibility(false))
  }

  const wordVoice = word => {
    if (wordHasAnnotations(word)) currentAnnotationIndex += 1

    if (word.bases && !word.name_token) {
      return (
        <>
          <span
            className={`word-interactive ${
              word.ID === highlightedWord?.ID && 'notes-highlighted-word'
            }`}
            key={word.ID}
            onClick={() => handleWordClick(word)}
            onKeyDown={() => handleWordClick(word)}
            role="button"
            tabIndex="-1"
          >
            {word.surface}
          </span>
          {wordHasAnnotations(word) && (
            <sup className="notes-superscript">{currentAnnotationIndex}</sup>
          )}
        </>
      )
    }
    if (word.surface === '\n\n') return <br key={word.ID} />
    if (word.surface === ' ') return word.surface

    return (
      <span
        onClick={() => handleNonRecognizedWordclick(word)}
        onKeyDown={() => handleNonRecognizedWordclick(word)}
        className={`non-recognized-word ${
          word.ID === highlightedWord?.ID && 'notes-highlighted-word'
        }`}
        role="button"
        tabIndex="-1"
      >
        {word.surface}
        {wordHasAnnotations(word) && (
          <sup className="notes-superscript">{currentAnnotationIndex}</sup>
        )}
      </span>
    )
  }

  const showFooter = width > 640
  const showAnnotationBox = width >= 1024

  return (
    <div className="cont-tall flex-col space-between align-center pt-sm">
      <div className="flex mb-nm">
        <Segment data-cy="readmode-text" className="cont" style={getTextStyle(learningLanguage)}>
          <Header style={getTextStyle(learningLanguage, 'title')}>
            <span className="pr-sm">{story.title}</span>
          </Header>
          <div className="flex-reverse space-between align-end">
            <Link to={`/stories/${id}/practice`}>
              <Button variant="primary">
                <FormattedMessage id="practice-now" />
              </Button>
            </Link>
            {story.url && (
              <a href={story.url}>
                <FormattedMessage id="Source" />
              </a>
            )}
          </div>
          <Divider />
          {story.paragraph.map(paragraph => (
            <p key={paragraph[0].ID}>{paragraph.map(word => wordVoice(word))}</p>
          ))}
          <ScrollArrow />
        </Segment>
        <div className="dictionary-and-annotations-cont">
          <DictionaryHelp />
          {showAnnotationBox && <AnnotationBox />}
        </div>
      </div>
      {showFooter && <Footer />}
    </div>
  )
}

export default ReadView
