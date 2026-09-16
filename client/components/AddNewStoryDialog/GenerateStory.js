import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { FormattedMessage, useIntl } from 'react-intl'
import { useNavigate } from 'react-router-dom'
import useMediaQuery from '@mui/material/useMediaQuery'
// eslint-disable-next-line max-len
import LessonPracticeTopicsHelp from 'Components/Lessons/LessonPracticeView/LessonPracticeTopicsHelp'
import Topics from 'Components/Topics'
import VocabDiffSlider from 'Components/Sliders/VocabDiffSlider'
import CountSlider from 'Components/Sliders/CountSlider'
import AppButton from 'Components/AppButton'
import AppStepper from 'Components/ui/AppStepper'
import AppTextField from 'Components/ui/AppTextField'
import Spinner from 'Components/Spinner'
import { useLearningLanguage, capitalize, ACCESS, useHasAccess } from 'Utilities/common'
import { getLessonTopics } from 'Utilities/redux/lessonsReducer'
import { getMetadata } from 'Utilities/redux/metadataReducer'
import { updateLibrarySelect } from 'Utilities/redux/userReducer'
import { generateStory } from 'Utilities/redux/storyGenerationReducer'
import { postStory, setCustomUpload } from 'Utilities/redux/uploadProgressReducer'
import { colors } from 'Assets/mui_theme/designTokens'
import { pillButtonSx, pillOutlineSx } from './styles'

const MAX_GRAMMAR_TOPICS = 5
const MAX_IDEAS_LENGTH = 240
// Step numbers stay fixed; low-access users skip GRAMMAR (SETTINGS -> SUMMARY).
const SETTINGS = 0
const GRAMMAR = 1
const SUMMARY = 2
const RESULT = 3

// Figma "Generate Story with AI": settings, (grammar topics), summary, result, with a side stepper.
const GenerateStory = ({ closeModal }) => {
  const intl = useIntl()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const learningLanguage = useLearningLanguage()
  const canSelectGrammar = useHasAccess(ACCESS.HIGH)
  const vocabularyScore = useSelector(({ user }) => user.data.user.vocabulary_score)
  const { pending: metaPending, lesson_topics } = useSelector(({ metadata }) => metadata)
  const { pending: generating, text, error } = useSelector(({ storyGeneration }) => storyGeneration)
  const narrow = useMediaQuery('(max-width: 899px)')

  const [step, setStep] = useState(SETTINGS)
  const [instance, setInstance] = useState({
    topic_ids: [],
    cefr_diff: vocabularyScore,
    learner_ideas: '',
    num_sentences: 10,
  })
  const [generatedStory, setGeneratedStory] = useState('')

  useEffect(() => {
    if (!metaPending) dispatch(getMetadata(learningLanguage))
  }, [learningLanguage])

  useEffect(() => {
    dispatch(getLessonTopics())
  }, [])

  // Show the store's text only once a generation started from this dialog has finished.
  useEffect(() => {
    if (!generating && text && step === RESULT) setGeneratedStory(text)
  }, [generating, text])

  const update = patch => setInstance(current => ({ ...current, ...patch }))
  const setSelectedTopics = topicIds => update({ topic_ids: topicIds.slice(0, MAX_GRAMMAR_TOPICS) })

  const noLessons = !metaPending && lesson_topics && lesson_topics.length === 0
  const hasIdeas = instance.learner_ideas.trim() !== ''
  const hasTopics = instance.topic_ids.length > 0

  const nextStep = () =>
    setStep(current => (!canSelectGrammar && current === SETTINGS ? SUMMARY : current + 1))
  const previousStep = () =>
    setStep(current => (!canSelectGrammar && current === SUMMARY ? SETTINGS : current - 1))

  const generate = () => {
    setGeneratedStory('')
    dispatch(generateStory(instance))
    setStep(RESULT)
  }

  const saveToLibrary = async () => {
    dispatch(updateLibrarySelect('private'))
    dispatch(setCustomUpload(true))
    const action = await dispatch(
      postStory({
        language: capitalize(learningLanguage),
        text: generatedStory,
        topics: instance.topic_ids,
      }),
    )
    const storyIds = action?.response?.story_ids
    const createdStoryId = storyIds?.[storyIds.length - 1]
    closeModal()
    if (createdStoryId) navigate(`/stories/${createdStoryId}/preview`)
  }

  const stepItems = [
    { label: intl.formatMessage({ id: 'step-themes-and-level' }) },
    ...(canSelectGrammar ? [{ label: intl.formatMessage({ id: 'grammar-topics' }) }] : []),
    { label: intl.formatMessage({ id: 'story-generation-summary' }) },
    { label: intl.formatMessage({ id: 'story-generated' }) },
  ]
  const activeStepIndex = canSelectGrammar ? step : Math.max(0, step - 1)

  const backButton = (
    <AppButton
      variant="tan-outline"
      sx={pillOutlineSx()}
      onClick={previousStep}
      data-cy="story-generation-back-button"
    >
      <FormattedMessage id="Back" />
    </AppButton>
  )

  // The topics note shown under the grammar picker: none / count / maximum reached.
  const topicsNote =
    instance.topic_ids.length === 0 ? (
      <FormattedMessage id="note-no-lessons-topic" />
    ) : (
      <FormattedMessage
        id={
          instance.topic_ids.length === MAX_GRAMMAR_TOPICS
            ? 'note-max-lessons-topic'
            : 'note-lessons-topic-count'
        }
        values={{ count: instance.topic_ids.length }}
      />
    )

  const renderStep = () => {
    if (step === SETTINGS) {
      return (
        <>
          <div>
            <p className="generate-story-label">
              <FormattedMessage id="select-story-vocab-diff" />:
            </p>
            <VocabDiffSlider
              value={instance.cefr_diff}
              onChange={value => update({ cefr_diff: value })}
              recommendedValue={vocabularyScore}
              skillLevels={['A2', 'A2/B1', 'B1', 'B1/B2', 'B2', 'B2/C1', 'C1']}
              min={30}
              max={79}
              style={{ width: '100%', marginTop: 20 }}
            />
          </div>
          <div>
            <p className="generate-story-label">
              <FormattedMessage id="select-story-length" />:
            </p>
            <CountSlider
              value={instance.num_sentences}
              onChange={value => update({ num_sentences: value })}
              minValue={10}
              maxValue={25}
              step={1}
              sliderMarks={['10', '15', '20', '25']}
              style={{ width: '100%', marginTop: 20 }}
            />
          </div>
          <div>
            <p className="generate-story-label">
              <FormattedMessage id="input-story-generation-comment" />:
            </p>
            <AppTextField
              multiline
              minRows={6}
              placeholder={intl.formatMessage({ id: 'generate-story-description' })}
              value={instance.learner_ideas}
              onChange={event => update({ learner_ideas: event.target.value })}
              inputProps={{
                maxLength: MAX_IDEAS_LENGTH,
                'data-cy': 'story-generation-ideas-input',
              }}
            />
            <div className="add-story-dialog-counter">
              {instance.learner_ideas.length}/{MAX_IDEAS_LENGTH}
            </div>
          </div>
          <div className="generate-story-actions">
            <AppButton
              variant="tan-outline"
              sx={pillOutlineSx()}
              onClick={closeModal}
              data-cy="story-generation-cancel-button"
            >
              <FormattedMessage id="Cancel" />
            </AppButton>
            <AppButton
              sx={pillButtonSx()}
              disabled={!hasIdeas && !canSelectGrammar}
              onClick={nextStep}
              data-cy="story-generation-next-step-button"
            >
              <FormattedMessage id="next-step" />
            </AppButton>
          </div>
        </>
      )
    }

    if (step === GRAMMAR) {
      return (
        <>
          <Topics
            topicInstance={instance}
            editable
            setSelectedTopics={setSelectedTopics}
            showPerf
            note={topicsNote}
          />
          <div className="generate-story-actions">
            {backButton}
            <AppButton
              sx={pillButtonSx()}
              disabled={!hasTopics && !hasIdeas}
              onClick={nextStep}
              data-cy="story-generation-next-step-button"
            >
              <FormattedMessage id="next-step" />
            </AppButton>
          </div>
        </>
      )
    }

    if (step === SUMMARY) {
      return (
        <>
          <p className="generate-story-lead">
            <FormattedMessage id="story-ready-for-generation" />
          </p>
          {canSelectGrammar &&
            (hasTopics ? (
              <LessonPracticeTopicsHelp selectedTopics={instance.topic_ids} always_show />
            ) : (
              <div className="generate-story-note">
                <FormattedMessage id="note-no-lessons-topic" />
              </div>
            ))}
          {hasIdeas && (
            <div className="generate-story-comment">
              <span className="generate-story-comment-label">
                <FormattedMessage id="additional-comment" />:
              </span>
              {instance.learner_ideas}
            </div>
          )}
          <div className="generate-story-actions">
            {backButton}
            <AppButton
              sx={pillButtonSx()}
              onClick={generate}
              data-cy="story-generation-generate-button"
            >
              <FormattedMessage id="generate" />
            </AppButton>
          </div>
        </>
      )
    }

    if (generating) {
      return (
        <div className="generate-story-spinner">
          <Spinner
            spinnerColor={colors.green}
            textColor={colors.green}
            size={60}
            text={<FormattedMessage id="story-generating" />}
            delayedMessage={[
              <FormattedMessage id="spinner-text-long-generation" />,
              <FormattedMessage id="spinner-text-long-task" />,
            ]}
          />
        </div>
      )
    }

    const failed = error || !text
    return (
      <>
        <p className="generate-story-lead">
          <FormattedMessage id="story-ready-for-generation" />
        </p>
        {failed ? (
          <div className="generate-story-note" data-cy="story-generation-error-message">
            <FormattedMessage id="story-generation-error" />
          </div>
        ) : (
          <AppTextField
            multiline
            minRows={14}
            value={generatedStory}
            onChange={event => setGeneratedStory(event.target.value)}
            inputProps={{ 'data-cy': 'story-generation-story-input' }}
          />
        )}
        <div className="generate-story-actions-stack">
          {!failed && (
            <AppButton
              block
              sx={pillButtonSx()}
              disabled={!generatedStory.trim()}
              onClick={saveToLibrary}
              data-cy="story-generation-upload-button"
            >
              <FormattedMessage id="upload-generated-story" />
            </AppButton>
          )}
          <AppButton
            block
            variant="contrast"
            sx={{ ...pillButtonSx(colors.ink), color: colors.card }}
            onClick={generate}
            data-cy="story-generation-regenerate-button"
          >
            <FormattedMessage id="regenerate-story" />
          </AppButton>
        </div>
      </>
    )
  }

  if (metaPending) {
    return (
      <div className="generate-story-spinner">
        <Spinner spinnerColor={colors.green} size={60} />
      </div>
    )
  }

  if (noLessons) {
    return (
      <p className="generate-story-lead" data-cy="story-generation-no-lessons-found">
        <FormattedMessage id="no-lessons-found" />
      </p>
    )
  }

  return (
    <div className="generate-story">
      <aside className="generate-story-aside">
        <AppStepper
          steps={stepItems}
          activeIndex={activeStepIndex}
          orientation={narrow ? 'horizontal' : 'vertical'}
        />
      </aside>
      {renderStep()}
    </div>
  )
}

export default GenerateStory
