import { useDispatch, useSelector } from 'react-redux'
import { FormattedMessage, useIntl } from 'react-intl'
// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from 'react'
import { Box } from '@mui/material'
import ScrollArrow from 'Components/ScrollArrow'
// eslint-disable-next-line max-len
import LessonPracticeTopicsHelp from 'Components/Lessons/LessonPracticeView/LessonPracticeTopicsHelp'
import Topics from 'Components/Topics'
import VocabDiffSlider from 'Components/Sliders/VocabDiffSlider'
import CountSlider from 'Components/Sliders/CountSlider'
import AppButton from 'Components/AppButton'
import AppTextField from 'Components/ui/AppTextField'
import AppStepper from 'Components/ui/AppStepper'
import { useNavigate } from 'react-router-dom'
import { useLearningLanguage, capitalize, ACCESS, useHasAccess } from 'Utilities/common'
import { colors } from 'Assets/mui_theme/designTokens'
import { getLessonTopics } from 'Utilities/redux/lessonsReducer'
import { getMetadata } from 'Utilities/redux/metadataReducer'
import { updateLibrarySelect } from 'Utilities/redux/userReducer'
import { generateStory } from 'Utilities/redux/storyGenerationReducer'
import { postStory, setCustomUpload } from 'Utilities/redux/uploadProgressReducer'
import Spinner from 'Components/Spinner'

const StoryGeneration = () => {
  const MAX_GRAMMAR_TOPICS = 5
  const intl = useIntl()
  const learningLanguage = useLearningLanguage()
  const navigate = useNavigate()
  // Grammar-topics step is high-access only; access <= 1 skips it (step 0 -> step 2).
  const canSelectGrammar = useHasAccess(ACCESS.HIGH)
  const { data: userData } = useSelector(({ user }) => user)
  const { user } = userData
  const { vocabulary_score } = user
  const { pending: metaPending, lesson_topics } = useSelector(({ metadata }) => metadata)
  const {
    pending: generationPending,
    text,
    error,
  } = useSelector(({ storyGeneration }) => storyGeneration)

  const [goStep, setGoStep] = useState(0)

  const [lessonInstance, setLessonInstance] = useState({
    topic_ids: [],
    cefr_diff: vocabulary_score,
    learner_ideas: '',
    num_sentences: 10,
    instancePending: false,
  })
  const [generatedStory, setGeneratedStory] = useState('')
  const [sliderValue, setSliderValue] = useState(vocabulary_score)
  const [numSentences, setNumSentences] = useState(10)

  const dispatch = useDispatch()

  useEffect(() => {
    if (!metaPending) {
      dispatch(getMetadata(learningLanguage))
    }
  }, [learningLanguage])

  useEffect(() => {
    dispatch(getLessonTopics())
  }, [])

  useEffect(() => {
    if (generationPending) {
      setGeneratedStory('')
    } else if (!generationPending && text) {
      setGeneratedStory(text)
    }
  }, [generationPending])

  const handleSlider = value => {
    setSliderValue(value)
    setLessonInstance(currentLessonInstance => ({
      ...currentLessonInstance,
      cefr_diff: value,
    }))
  }

  const getStoryGenerationPayload = () => ({
    ...lessonInstance,
    num_sentences: numSentences,
  })

  const noResults = !metaPending && lesson_topics && lesson_topics.length === 0

  // Step section heading — inherits the UI font, left-aligned, smaller than the page title.
  const stepHeadingStyle = {
    fontSize: 18,
    fontWeight: 600,
    color: colors.ink,
    textAlign: 'left',
    margin: '0 0 10px',
  }

  const generationComment = (
    <div className="flex-col">
      <h5 style={stepHeadingStyle}>
        <FormattedMessage id="input-story-generation-comment" />:
      </h5>
      <div style={{ width: '100%' }}>
        <AppTextField
          multiline
          minRows={4}
          value={lessonInstance.learner_ideas}
          onChange={e =>
            setLessonInstance(currentLessonInstance => ({
              ...currentLessonInstance,
              learner_ideas: e.target.value,
            }))
          }
          inputProps={{ maxLength: 240, 'data-cy': 'story-generation-ideas-input' }}
        />
        <div style={{ marginTop: 6, textAlign: 'right', color: colors.muted, fontSize: 13 }}>
          {lessonInstance.learner_ideas.length}/240
        </div>
      </div>
    </div>
  )

  const lessonVocabularyControls = (
    <div className="flex-col">
      <h5 style={stepHeadingStyle}>
        <FormattedMessage id="select-story-vocab-diff" />:
      </h5>
      <VocabDiffSlider
        value={sliderValue}
        onChange={handleSlider}
        recommendedValue={vocabulary_score}
        skillLevels={['A2', 'A2/B1', 'B1', 'B1/B2', 'B2', 'B2/C1', 'C1']}
        min={30}
        max={79}
        style={{ width: '100%', marginTop: '20px' }}
      />
    </div>
  )

  const lessonCountControls = (
    <div className="flex-col">
      <h5 style={stepHeadingStyle}>
        <FormattedMessage id="select-story-length" />:
      </h5>
      <CountSlider
        value={numSentences}
        onChange={value => {
          setNumSentences(value)
          setLessonInstance(currentLessonInstance => ({
            ...currentLessonInstance,
            num_sentences: value,
          }))
        }}
        minValue={10}
        maxValue={25}
        step={1}
        sliderMarks={['10', '15', '20', '25']}
        style={{ width: '100%', marginTop: '20px' }}
      />
    </div>
  )

  const lessonStartControls = (
    <div style={{ maxWidth: 900, margin: '0 auto' }}>
      <div style={{ marginBottom: '1.5em', textAlign: 'center' }}>
        <h5 style={{ ...stepHeadingStyle, textAlign: 'center' }}>
          <FormattedMessage id="story-ready-for-generation" />
        </h5>
        {canSelectGrammar && lessonInstance.topic_ids.length === 0 && (
          <div style={{ color: colors.error, marginTop: 4 }}>
            <FormattedMessage id="note-no-lessons-topic" />
          </div>
        )}
      </div>
      {canSelectGrammar && (
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1em' }}>
          <div style={{ width: '100%', maxWidth: 420 }}>
            <LessonPracticeTopicsHelp selectedTopics={lessonInstance.topic_ids} always_show />
          </div>
        </div>
      )}
      {lessonInstance.learner_ideas && (
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '2em' }}>
          <Box
            sx={{
              width: '100%',
              maxWidth: 600,
              backgroundColor: colors.card,
              border: `1px solid ${colors.border}`,
              borderRadius: '16px',
              padding: '1em',
            }}
          >
            <div
              style={{
                fontWeight: 700,
                fontSize: 18,
                color: colors.ink,
                marginBottom: 12,
              }}
            >
              <FormattedMessage id="additional-comment" />
            </div>
            <div style={{ color: colors.ink, whiteSpace: 'pre-wrap', overflowWrap: 'anywhere' }}>
              {lessonInstance.learner_ideas}
            </div>
          </Box>
        </div>
      )}
    </div>
  )

  const uploadStory = async () => {
    const newStory = {
      language: capitalize(learningLanguage),
      text: generatedStory,
      topics: lessonInstance.topic_ids,
    }

    dispatch(updateLibrarySelect('private'))
    dispatch(setCustomUpload(true))
    const action = await dispatch(postStory(newStory))
    const createdStoryId = action?.response?.story_ids?.[action.response.story_ids.length - 1]

    if (createdStoryId) {
      navigate(`/stories/${createdStoryId}/preview`)
    }
  }

  const generatedStoryControl = (
    <div className="flex-col align-center">
      <div style={{ width: '100%', maxWidth: '800px', margin: 'auto' }}>
        {generationPending ? (
          <Spinner
            fullHeight
            size={60}
            text={<FormattedMessage id="story-generating" />}
            delayedMessage={[
              <FormattedMessage id="spinner-text-long-generation" />,
              <FormattedMessage id="spinner-text-long-task" />,
            ]}
          />
        ) : (
          <>
            {!error && text?.length && (
              <>
                <AppTextField
                  multiline
                  minRows={18}
                  value={generatedStory}
                  onChange={e => setGeneratedStory(e.target.value)}
                  inputProps={{ 'data-cy': 'story-generation-story-input' }}
                />
                <div className="justify-center align-center wrap" style={{ marginTop: '1em' }}>
                  <AppButton
                    variant="primary"
                    size="lg"
                    data-cy="story-generation-upload-button"
                    disabled={noResults}
                    sx={{ width: '100%' }}
                    onClick={() => uploadStory()}
                  >
                    <FormattedMessage id="upload-generated-story" />
                  </AppButton>
                </div>
              </>
            )}
            <div className="justify-center align-center wrap" style={{ marginTop: '0.75em' }}>
              {(error || !text?.length) && (
                <span
                  data-cy="story-generation-error-message"
                  style={{
                    color: colors.error,
                    textAlign: 'center',
                    fontWeight: 500,
                    margin: '18px',
                    fontSize: 'large',
                  }}
                >
                  <FormattedMessage id="story-generation-error" />
                </span>
              )}
              <AppButton
                variant="secondary"
                size="lg"
                data-cy="story-generation-regenerate-button"
                sx={{ width: '100%' }}
                onClick={() => dispatch(generateStory(getStoryGenerationPayload()))}
              >
                <FormattedMessage id="regenerate-story" />
              </AppButton>
            </div>
          </>
        )}
      </div>
    </div>
  )

  const setSelectedTopics = topic_ids => {
    const limitedTopics = topic_ids.slice(0, MAX_GRAMMAR_TOPICS)

    setLessonInstance(currentLessonInstance => ({
      ...currentLessonInstance,
      topic_ids: limitedTopics,
      num_sentences: numSentences,
    }))
  }

  // AppStepper is display-only and keys by label, so labels are plain strings. When the grammar
  // step is hidden (low access), the array skips it and activeIndex is shifted to match goStep.
  const stepItems = [
    { label: intl.formatMessage({ id: 'select-story-themes-and-vocabulary' }) },
    ...(canSelectGrammar ? [{ label: intl.formatMessage({ id: 'select-lesson-grammar' }) }] : []),
    { label: intl.formatMessage({ id: 'story-generation-summary' }) },
    { label: intl.formatMessage({ id: 'story-generated' }) },
  ]
  const activeStepIndex = canSelectGrammar ? goStep : Math.max(0, goStep - 1)

  return (
    <div className="cont-tall cont flex-col auto">
      {metaPending ? (
        <Spinner fullHeight size={60} />
      ) : noResults ? (
        <div
          className="justify-center"
          data-cy="story-generation-no-lessons-found"
          style={{ color: 'rgb(112, 114, 120)', marginTop: '2rem' }}
        >
          <FormattedMessage id="no-lessons-found" />
        </div>
      ) : (
        <>
          <Box
            sx={{
              backgroundColor: colors.card,
              color: colors.ink,
              border: `1px solid ${colors.border}`,
              borderRadius: '20px',
              width: '100%',
              maxWidth: 1024,
              mx: 'auto',
              my: '2rem',
              p: { xs: '16px', sm: '24px' },
            }}
          >
            {/* Space kept below the stepper (the "Story generation" title used to sit here). */}
            <div style={{ marginBottom: '3em' }}>
              <AppStepper
                orientation="horizontal"
                steps={stepItems}
                activeIndex={activeStepIndex}
              />
            </div>
            {goStep === -1 && <Spinner fullHeight size={60} />}
            {(goStep === 0 || goStep === -1) && (
              <div
                className="story-generation-controls"
                style={{ maxWidth: 560, margin: '0 auto' }}
              >
                {lessonVocabularyControls}
                <div style={{ marginTop: '40px' }}>{lessonCountControls}</div>
                <div style={{ marginTop: '40px' }}>{generationComment}</div>
              </div>
            )}
            {goStep === 1 && canSelectGrammar && (
              <div>
                <Topics
                  topicInstance={lessonInstance}
                  editable
                  setSelectedTopics={setSelectedTopics}
                  showPerf
                  note={
                    lessonInstance.topic_ids.length === 0 ? (
                      <FormattedMessage id="note-no-lessons-topic" />
                    ) : lessonInstance.topic_ids.length === 5 ? (
                      <FormattedMessage
                        id="note-max-lessons-topic"
                        values={{ count: lessonInstance.topic_ids.length }}
                      />
                    ) : (
                      <FormattedMessage
                        id="note-lessons-topic-count"
                        values={{ count: lessonInstance.topic_ids.length }}
                      />
                    )
                  }
                />
              </div>
            )}
            {goStep === 2 && <div>{lessonStartControls}</div>}
            {goStep === 3 && <div>{generatedStoryControl}</div>}

            {/* Hidden on the last step (Result) — there's nothing to advance to. */}
            {goStep < 3 && (
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '2.5em' }}>
                <AppButton
                  variant="primary"
                  data-cy="story-generation-next-step-button"
                  disabled={
                    lessonInstance.topic_ids &&
                    lessonInstance.topic_ids.length === 0 &&
                    goStep == 1 &&
                    lessonInstance.learner_ideas === ''
                  }
                  onClick={() => {
                    // Low-access users have no grammar step (1), so jump 0 -> 2.
                    const nextStep = !canSelectGrammar && goStep === 0 ? 2 : goStep + 1
                    setGoStep(nextStep)
                    if (goStep === 2 && generatedStory === '') {
                      dispatch(generateStory(lessonInstance))
                    }
                  }}
                >
                  <FormattedMessage id="next-step" />
                </AppButton>
              </div>
            )}
          </Box>
          <ScrollArrow />
        </>
      )}
    </div>
  )
}

export default StoryGeneration
