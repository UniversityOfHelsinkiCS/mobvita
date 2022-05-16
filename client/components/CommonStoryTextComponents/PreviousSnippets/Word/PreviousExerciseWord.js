/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useHistory, useParams } from 'react-router-dom'
import { FormattedMessage, useIntl } from 'react-intl'
import { Icon } from 'semantic-ui-react'
import { Button } from 'react-bootstrap'
import {
  getTextStyle,
  learningLanguageSelector,
  dictionaryLanguageSelector,
  speak,
  voiceLanguages,
  formatGreenFeedbackText,
  hiddenFeatures,
} from 'Utilities/common'
import { setReferences, setExplanation } from 'Utilities/redux/practiceReducer'
import { getTranslationAction, setWords } from 'Utilities/redux/translationReducer'
import { addExercise, removeExercise } from 'Utilities/redux/controlledPracticeReducer'
import {
  setFocusedSpan,
  setHighlightRange,
  addAnnotationCandidates,
  resetAnnotationCandidates,
} from 'Utilities/redux/annotationsReducer'
import Tooltip from 'Components/PracticeView/Tooltip'
import ExerciseCloze from 'Components/ControlledStoryEditView/CurrentSnippet/ControlExerciseWord/ExerciseCloze'
import SelectExerciseTypeModal from 'Components/ControlledStoryEditView/SelectExerciseTypeModal'

const PreviousExerciseWord = ({ word, tokenWord, answer, tiedAnswer }) => {
  const {
    surface,
    isWrong,
    tested,
    wrong,
    lemmas,
    ref,
    explanation,
    ID: wordId,
    inflection_ref: inflectionRef,
  } = word

  const [show, setShow] = useState(false)
  const [showEditorTooltip, setShowEditorTooltip] = useState(false)
  const [showExerciseOptions, setShowExerciseOptions] = useState(false)
  const [showExerciseOptionsModal, setShowExerciseOptionsModal] = useState(false)
  const [showCustomChoices, setShowCustomChoices] = useState(false)
  const [chosen, setChosen] = useState(false)
  const history = useHistory()
  const isPreviewMode =
    history.location.pathname.includes('preview') ||
    history.location.pathname.includes('controlled-story')
  const controlledStory = history.location.pathname.includes('controlled-story')
  const learningLanguage = useSelector(learningLanguageSelector)
  const controlledPractice = useSelector(({ controlledPractice }) => controlledPractice)
  const autoSpeak = useSelector(({ user }) => user.data.user.auto_speak)
  const dictionaryLanguage = useSelector(dictionaryLanguageSelector)
  const { spanAnnotations, highlightRange } = useSelector(({ annotations }) => annotations)
  const { id: storyId } = useParams()
  const { correctAnswerIDs } = useSelector(({ practice }) => practice)
  const [allowTranslating, setAllowTranslating] = useState(true)

  const intl = useIntl()
  const dispatch = useDispatch()

  // console.log('word: ', word.choices)

  useEffect(() => {
    if (!controlledPractice.inProgress) {
      setChosen(false)
    }
  }, [controlledPractice?.inProgress])

  const voice = voiceLanguages[learningLanguage]
  let color = ''
  if (tested || typeof wrong !== 'undefined') color = isWrong ? 'wrong-text' : 'right-text'
  if (correctAnswerIDs.includes(word.ID.toString())) color = 'right-text'
  if (isPreviewMode && (word.concepts || word.id)) color = 'preview-text'
  if (isPreviewMode && hiddenFeatures && word.concepts?.length === 0)
    color = 'preview-text-no-concepts'
  const wordClass = `word-interactive ${color}`

  const wordIsInSpan = word => {
    return spanAnnotations.some(span => word.ID >= span.startId && word.ID <= span.endId)
  }

  const getWordBase = word => {
    const splitBases = word.bases.split('|')
    const splitConcatenations = splitBases[0].split('+')
    return splitConcatenations[0]
  }

  const choicesMade = tokenizedWord => {
    if (!chosen) {
      setChosen(true)
      dispatch(addExercise(tokenizedWord))
    } else {
      setChosen(false)
      setShowExerciseOptionsModal(false)
      dispatch(removeExercise(tokenizedWord))
    }

    setShowEditorTooltip(false)
    setShowExerciseOptions(false)
    setShowCustomChoices(false)
  }

  const handleAddHearingExercise = () => {
    if (controlledStory && word?.concepts?.length > 0 && tokenWord) {
      const { choices: removedProperty, ...wordRest } = word

      const tokenizedWord = {
        ...wordRest,
        id: word.candidate_id,
        audio: word.surface,
        base: getWordBase(word),
        listen: true,
      }

      choicesMade(tokenizedWord)
    }
  }

  const handleAddMultichoiceExercise = choicesSet => {
    console.log('CHOICES ', choicesSet)
    if (choicesSet) {
      const tokenizedWord = {
        ...word,
        id: word.candidate_id,
        base: getWordBase(word),
        choices: choicesSet,
      }

      choicesMade(tokenizedWord)
    } else if (controlledStory && word?.concepts?.length > 0 && tokenWord) {
      const tokenizedWord = {
        ...word,
        id: word.candidate_id,
        base: getWordBase(word),
        choices: [word.surface, 'wrong', 'incorrect', 'could_be_wrong'],
      }

      choicesMade(tokenizedWord)
    }
  }

  const handleAddClozeExercise = () => {
    if (controlledStory && word?.concepts?.length > 0 && tokenWord) {
      const { choices: removedProperty, ...wordRest } = word

      const tokenizedWord = {
        ...wordRest,
        id: word.candidate_id,
        base: getWordBase(word),
      }

      choicesMade(tokenizedWord)
    }
  }

  const handleClick = () => {
    if (word.isWrong) setShow(true)
    if (isPreviewMode && word.concepts) setShow(true)
    if (autoSpeak === 'always' && voice) speak(surface, voice, 'dictionary')
    if (lemmas) {
      dispatch(setWords({ surface, lemmas }))

      if (allowTranslating) {
        dispatch(
          getTranslationAction({
            learningLanguage,
            wordLemmas: lemmas,
            dictionaryLanguage,
            storyId,
            wordId,
            inflectionRef,
          })
        )

        setAllowTranslating(false)
        setTimeout(() => {
          setAllowTranslating(true)
        }, 1000)
      }
    }

    if (wordIsInSpan(word)) {
      const span = spanAnnotations.find(a => word.ID >= a.startId && word.ID <= a.endId)
      dispatch(setFocusedSpan(span))
      dispatch(setHighlightRange(span.startId, span.endId))
    } else {
      dispatch(setFocusedSpan(null))
      dispatch(resetAnnotationCandidates())
      dispatch(setHighlightRange(null, null))
      dispatch(setHighlightRange(word.ID, word.ID))
      dispatch(addAnnotationCandidates(word))
    }
    setShowEditorTooltip(false)
  }

  const handleExerciseOptionsModal = () => {
    setShowExerciseOptionsModal(true)
    setShowEditorTooltip(false)
  }

  const handleActionClick = () => {
    if (controlledStory && word?.concepts?.length > 0 && tokenWord) {
      handleClick()
      setShowEditorTooltip(true)
    }
  }

  const getSuperscript = word => spanAnnotations.findIndex(a => a.startId === word.ID) + 1

  const handleTooltipClick = () => {
    if (ref) dispatch(setReferences(ref))
    if (explanation) dispatch(setExplanation(explanation))
  }

  const wordShouldBeHighlighted = word => {
    return word.ID >= highlightRange?.start && word.ID <= highlightRange?.end
  }

  const wordStartsSpan = word => !!word?.annotation

  const youAnsweredTooltip = answer || tiedAnswer

  const tooltip = (
    <div className="tooltip-green" style={{ cursor: 'pointer' }} onMouseDown={handleTooltipClick}>
      {word.message && !isPreviewMode && (
        <div className="flex">
          <span dangerouslySetInnerHTML={formatGreenFeedbackText(word?.message)} />{' '}
          {ref && (
            <Icon name="external" style={{ alignSelf: 'flex-start', marginLeft: '0.5rem' }} />
          )}
          {explanation && (
            <Icon name="info circle" style={{ alignSelf: 'flex-start', marginLeft: '0.5rem' }} />
          )}
        </div>
      )}
      {youAnsweredTooltip && (
        <div>
          {`${intl.formatMessage({ id: 'you-used' })}: `}
          <span style={getTextStyle(learningLanguage, 'tooltip')}>
            {youAnsweredTooltip.users_answer}
          </span>
        </div>
      )}
      {isPreviewMode && word.concepts?.length === 0 && hiddenFeatures && (
        <div style={{ textAlign: 'left' }}>
          <FormattedMessage id="no-topics-available" />
        </div>
      )}

      {isPreviewMode && word.concepts?.length > 0 && (
        <div style={{ textAlign: 'left' }}>
          <FormattedMessage id="topics" />:
          <ul className="mb-0">
            {word.concepts.map(concept => (
              <li>{concept}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
  /*
  const mapOptions = (
    <div>
      {Object.keys(word.choices).map(function (key, index) {
        <span>
          {key}
          {word.choices[key].map(choice => (
            <span>{choice}</span>
          ))}
        </span>
      })}
    </div>
  )
 

  const customMultiOptionsForm = (
    <div>
      { {word.choices?.map(options => options.map(choice => <span>{choice}</span>))} }
      { word.choices && mapOptions }
      <form onSubmit={handleAddMultichoiceExercise}>
        <input
          type="text"
          value={customMultiChoice1}
          onChange={({ target }) => setCustomMultiChoice1(target.value)}
        />
        <input
          type="text"
          value={customMultiChoice2}
          onChange={({ target }) => setCustomMultiChoice2(target.value)}
        />
        <input
          type="text"
          value={customMultiChoice3}
          onChange={({ target }) => setCustomMultiChoice3(target.value)}
        />
        <Button className="flashcard-button" block variant="outline-primary" type="submit">
          Submit
        </Button>
      </form>
    </div>
  )

  const exerciseOptionsToolTip = (
    <div onBlur={() => setShowExerciseOptions(false)}>
      <div>
        <FormattedMessage id="choose-exercise-type" />
      </div>
      <hr />
      <div onClick={handleAddClozeExercise} onKeyDown={handleAddClozeExercise}>
        <FormattedMessage id="choose-cloze-exercise" />
      </div>
      <div onClick={handleAddHearingExercise} onKeyDown={handleAddHearingExercise}>
        <FormattedMessage id="choose-listening-exercise" />
      </div>
      <Tooltip
        placement="top"
        tooltipShown={showCustomChoices}
        trigger="none"
        tooltip={customMultiOptionsForm}
      >
        <div
          onClick={() => setShowCustomChoices(true)}
          onKeyDown={() => setShowCustomChoices(true)}
        >
          <FormattedMessage id="choose-multichoice-exercise" />
        </div>
      </Tooltip>
    </div>
  )
  */

  const editorTooltip = (
    <div onBlur={() => setShowEditorTooltip(false)}>
      <div>{tooltip}</div>
      <div
        className="select-exercise"
        onClick={handleExerciseOptionsModal}
        onKeyDown={handleExerciseOptionsModal}
      >
        <FormattedMessage id="click-to-add-exercise" />
      </div>
    </div>
  )

  if (chosen && controlledPractice) {
    return (
      <span onClick={handleAddClozeExercise} onKeyDown={handleAddClozeExercise}>
        <ExerciseCloze tabIndex={word.ID} key={word.ID} word={word} />
      </span>
    )
  }

  if (controlledStory) {
    return (
      <span>
        <SelectExerciseTypeModal
          showExerciseOptionsModal={showExerciseOptionsModal}
          setShowExerciseOptionsModal={setShowExerciseOptionsModal}
          handleAddClozeExercise={handleAddClozeExercise}
          handleAddHearingExercise={handleAddHearingExercise}
          handleAddMultichoiceExercise={handleAddMultichoiceExercise}
          word={word}
        />
        <Tooltip
          placement="top"
          tooltipShown={showEditorTooltip}
          trigger="none"
          tooltip={editorTooltip}
        >
          <span
            className={`${wordClass} ${wordShouldBeHighlighted(word) && 'notes-highlighted-word'}`}
            role="button"
            onClick={handleActionClick}
            onKeyDown={handleActionClick}
            tabIndex={-1}
          >
            {surface}
          </span>
        </Tooltip>
      </span>
    )
  }

  return (
    <Tooltip placement="top" tooltipShown={show} trigger="none" tooltip={tooltip}>
      {wordStartsSpan(word) && <sup className="notes-superscript">{getSuperscript(word)}</sup>}
      <span
        className={`${wordClass} ${wordShouldBeHighlighted(word) && 'notes-highlighted-word'}`}
        role="button"
        onClick={handleClick}
        onKeyDown={handleClick}
        tabIndex={-1}
        onBlur={() => setShow(false)}
      >
        {surface}
      </span>
    </Tooltip>
  )
}

export default PreviousExerciseWord
