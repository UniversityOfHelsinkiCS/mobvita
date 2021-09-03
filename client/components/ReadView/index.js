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
  resetAnnotations,
  setAnnotationFormVisibility,
  setAnnotations,
  setFocusedSpan,
  setHighlightRange,
  addAnnotationCandidates,
  resetAnnotationCandidates,
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

  const { story, pending } = useSelector(({ stories, locale }) => ({
    story: stories.focused,
    pending: stories.focusedPending,
    locale,
  }))

  const { spanAnnotations, highlightRange } = useSelector(({ annotations }) => annotations)
  const learningLanguage = useSelector(learningLanguageSelector)
  const dictionaryLanguage = useSelector(({ user }) => user.data.user.last_trans_language)
  const autoSpeak = useSelector(({ user }) => user.data.user.auto_speak)
  const { id } = match.params
  useEffect(() => {
    dispatch(getStoryAction(id))
    dispatch(clearTranslationAction())
    dispatch(resetAnnotations())
  }, [])

  useEffect(() => {
    if (story) {
      const storyWords = story.paragraph.flat(1)
      dispatch(setAnnotations(storyWords))
    }
  }, [story])

  if (!story || pending) return <Spinner fullHeight />

  const voice = respVoiceLanguages[learningLanguage]

  const wordShouldBeHighlighted = word => {
    return (
      word.ID >= highlightRange?.start &&
      word.ID <= highlightRange?.end &&
      highlightRange.start !== null
    )
  }

  const getSuperscript = word => spanAnnotations.findIndex(a => a.startId === word.ID) + 1

  const getSpanthatIncludesWord = word => {
    return spanAnnotations.find(span => word.ID >= span.startId && word.ID <= span.endId)
  }

  const handleWordClick = word => {
    if (autoSpeak === 'always' && voice) speak(word.surface, voice)
    if (word.lemmas) {
      dispatch(setWords(word))

      const spanThatIncludesWord = getSpanthatIncludesWord(word)
      if (spanThatIncludesWord) {
        dispatch(setFocusedSpan(spanThatIncludesWord))
        dispatch(setHighlightRange(spanThatIncludesWord.startId, spanThatIncludesWord.endId))
      } else {
        dispatch(setFocusedSpan(null))
        dispatch(setHighlightRange(null, null))
        dispatch(resetAnnotationCandidates())
        dispatch(setHighlightRange(word.ID, word.ID))
        dispatch(addAnnotationCandidates(word))
      }

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

  const wordStartsSpan = word => !!word?.annotation

  const handleNonRecognizedWordclick = word => {
    const spanThatIncludesWord = getSpanthatIncludesWord(word)
    if (spanThatIncludesWord) {
      dispatch(setFocusedSpan(spanThatIncludesWord))
      dispatch(setHighlightRange(spanThatIncludesWord.startId, spanThatIncludesWord.endId))
    } else {
      dispatch(setFocusedSpan(null))
      dispatch(setHighlightRange(null, null))
      dispatch(resetAnnotationCandidates())
      dispatch(setHighlightRange(word.ID, word.ID))
      dispatch(addAnnotationCandidates(word))
    }

    dispatch(setAnnotationFormVisibility(false))
  }

  const wordVoice = word => {
    if (word.bases && !word.name_token) {
      return (
        <span key={word.ID}>
          {wordStartsSpan(word) && <sup className="notes-superscript">{getSuperscript(word)}</sup>}
          <span
            className={`word-interactive ${
              wordShouldBeHighlighted(word) && 'notes-highlighted-word'
            }`}
            onClick={() => handleWordClick(word)}
            onKeyDown={() => handleWordClick(word)}
            role="button"
            tabIndex="-1"
          >
            {word.surface}
          </span>
        </span>
      )
    }
    if (word.surface === '\n\n') return <br key={word.ID} />
    if (word.surface === ' ')
      return (
        <span className={`${wordShouldBeHighlighted(word) && 'notes-highlighted-word'}`}>
          {word.surface}
        </span>
      )

    return (
      <span key={word.ID}>
        {wordStartsSpan(word) && <sup className="notes-superscript">{getSuperscript(word)}</sup>}
        <span
          onClick={() => handleNonRecognizedWordclick(word)}
          onKeyDown={() => handleNonRecognizedWordclick(word)}
          className={`${wordShouldBeHighlighted(word) && 'notes-highlighted-word'}`}
          role="button"
          tabIndex="-1"
        >
          {word.surface}
        </span>
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
