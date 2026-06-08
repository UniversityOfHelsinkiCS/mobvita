import { useDispatch, useSelector } from 'react-redux'
import { useIntl, FormattedMessage } from 'react-intl'
import { List, WindowScroller } from 'react-virtualized'
import React, { useEffect, useState } from 'react'
import {
  Placeholder,
  Segment,
  Popup,
  Icon,
  Select,
  Container,
  Accordion,
  AccordionTitle,
  AccordionContent } from 'semantic-ui-react'
import ScrollArrow from 'Components/ScrollArrow'
import LibraryTabs from 'Components/LibraryTabs'
import LessonPracticeTopicsHelp from 'Components/Lessons/LessonPracticeView/LessonPracticeTopicsHelp'
import LessonPracticeThemeHelp from 'Components/Lessons/LessonPracticeView/LessonPracticeThemeHelp'
import Topics from 'Components/Topics'

import VocabDiffSlider from 'Components/Sliders/VocabDiffSlider'
import { Button } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import { Stepper, Step } from 'react-form-stepper'
import { useLearningLanguage, getTextStyle, capitalize } from 'Utilities/common'
import { getLessonTopics } from 'Utilities/redux/lessonsReducer'
import { getMetadata } from 'Utilities/redux/metadataReducer'
import { startLessonsTour } from 'Utilities/redux/tourReducer'
import {
  lessonsTourViewed,
  updateGroupSelect,
  updateLibrarySelect } from 'Utilities/redux/userReducer'
import { generateStory } from 'Utilities/redux/storyGenerationReducer'
import { postStory, setCustomUpload } from 'Utilities/redux/uploadProgressReducer'
import { setNotification } from 'Utilities/redux/notificationReducer'
import styled from 'styled-components'
import useWindowDimensions from 'Utilities/windowDimensions'
import Spinner from 'Components/Spinner'
// import AddStoryModal from 'Components/AddStoryModal'
// import LessonLibrarySearch from './LessonLibrarySearch'

import './LessonLibraryStyles.css'

const StoryGeneration = () => {
  const MAX_GRAMMAR_TOPICS = 5
  const intl = useIntl()
  const { width } = useWindowDimensions()
  const bigScreen = width >= 700
  const learningLanguage = useLearningLanguage()
  const navigate = useNavigate()
  const { pending: userPending, data: userData } = useSelector(({ user }) => user)
  const { teacherView, user } = userData
  const { oid: userId, has_seen_lesson_tour, vocabulary_score } = user
  const {
    pending: metaPending,
    lesson_semantics,
    lesson_topics,
    lessons } = useSelector(({ metadata }) => metadata)
  const { pending: topicPending, topics } = useSelector(({ lessons }) => lessons)
  const {
    pending: generationPending,
    text,
    error } = useSelector(({ storyGeneration }) => storyGeneration)

  const _lesson_sort_criterion = { direction: 'asc', sort_by: 'index' }
  // const smallWindow = useWindowDimensions().width < 520

  const [sorter, setSorter] = useState(_lesson_sort_criterion.sort_by)
  const [sortDirection, setSortDirection] = useState(_lesson_sort_criterion.direction)
  const [goStep, setGoStep] = useState(0)

  const [lessonInstance, setLessonInstance] = useState({
    topic_ids: [],
    cefr_diff: vocabulary_score,
    learner_ideas: '',
    instancePending: false })
  const [generatedStory, setGeneratedStory] = useState('')
  const [sliderValue, setSliderValue] = useState(vocabulary_score)
  const [filteredLessons, setFilteredLessons] = useState(lessons)
  const [accordionState, setAccordionState] = useState(0)

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

  // useEffect(() => {
  //   if (!metaPending && !has_seen_lesson_tour ) {
  //     dispatch(setLessonStep(0))
  //     dispatch(lessonsTourViewed())
  //     dispatch(startLessonsTour())
  //   }

  // }, [metaPending])

  const handleSlider = value => {
    setSliderValue(value)
    setLessonInstance({
      ...lessonInstance,
      cefr_diff: value })
  }

  const noResults = !metaPending && lesson_topics && lesson_topics.length === 0

  const generationComment = (
    <div className="align-center">
      <h5>
        <FormattedMessage id="input-story-generation-comment" />:
      </h5>
      <div className="group-buttons sm">
        <div style={{ width: '100%', maxWidth: '500px', margin: 'auto' }}>
          <textarea
            style={{
              width: '100%',
              height: '100px',
              padding: '10px',
              borderRadius: '5px',
              border: '1px solid #ccc',
              outline: 'none',
              fontSize: '16px' }}
            maxLength={240}
            value={lessonInstance.learner_ideas}
            onChange={e => setLessonInstance({ ...lessonInstance, learner_ideas: e.target.value })}
          />
          <div
            style={{
              marginTop: '6px',
              textAlign: 'right',
              color: '#6c757d',
              fontSize: '13px',
            }}
          >
            {lessonInstance.learner_ideas.length}/240
          </div>
        </div>
      </div>
    </div>
  )

  const lessonVocabularyControls = (
    <div className="align-center">
      <h5>
        <FormattedMessage id="select-story-vocab-diff" />:
      </h5>
      <VocabDiffSlider
        value={sliderValue}
        onChange={handleSlider}
        recommendedValue={vocabulary_score}
        skillLevels={["A2", "A2/B1", "B1", "B1/B2", "B2", "B2/C1", "C1" ]}
        min={30}
        max={79}
        style={{ width: bigScreen ? '80%' : '90%', marginTop: '30px', marginLeft: 'auto', marginRight: 'auto' }}
      />
    </div>
  )
  const lessonGroups =
    (filteredLessons &&
      filteredLessons.reduce((x, y) => {
        ;(x[y.group] = x[y.group] || []).push(y)
        return x
      }, {})) ||
    {} // Object.groupBy(filteredLessons, ({group})=> group)
  const handleClick = (e, props) => {
    const { index } = props
    const newIndex = accordionState === index ? -1 : index
    setAccordionState(newIndex)
  }

  let lessonStartControls = (
    <Container>
      <div
        className="row justify-center align-center"
        style={{
          color: '#0088CB',
          textAlign: 'center',
          fontWeight: 500,
          margin: '18px',
          fontSize: 'large' }}
      >
        <div className="col col-12">
          <FormattedMessage id="story-ready-for-generation" />
        </div>
        {lessonInstance.topic_ids.length === 0 && (
        <div className="col col-12" style={{ color: '#ff0c0c' }}>
          <FormattedMessage id="note-no-lessons-topic" />
        </div>
        )}
      </div>
      <div className="row justify-center align-center space-between" style={{ display: 'flex' }}>
        <div className="col col-md-5 offset-md-1" style={{ padding: 0 }}>
          <LessonPracticeTopicsHelp selectedTopics={lessonInstance.topic_ids} always_show={true} />
        </div>
      </div>
      {lessonInstance.learner_ideas && (
        <div
          className="row justify-center align-center space-between"
          style={{ display: 'flex', marginTop: '40px' }}
        >
          <div className="col col-md-8">
            <div className="lesson-topic-box" style={{ width: '100%' }}>
              <Segment style={{ backgroundColor: 'azure' }}>
                <div
                  className="lesson-title"
                  style={{
                    ...getTextStyle(learningLanguage, 'title'),
                    width: `${'100%'}`,
                    fontWeight: 'bold',
                    fontSize: 'large',
                    marginBottom: '15px' }}
                >
                  <FormattedMessage id={'additional-comment'} />
                </div>
                <span style={{ overflow: 'hidden', width: '100%' }}>
                  {lessonInstance.learner_ideas}
                </span>
              </Segment>
            </div>
          </div>
        </div>
      )}
    </Container>
  )

  const uploadStory = async () => {
    const newStory = {
      language: capitalize(learningLanguage),
      text: generatedStory,
      topics: lessonInstance.topic_ids }

    dispatch(updateLibrarySelect('private'))
    dispatch(setCustomUpload(true))
    const action = await dispatch(postStory(newStory))
    const createdStoryId = action?.response?.story_ids?.[action.response.story_ids.length - 1]

    if (createdStoryId) {
      navigate(`/stories/${createdStoryId}/preview`)
    }
  }

  const generatedStoryControl = (
    <div className="align-center">
      <div className="group-buttons sm">
        <div style={{ width: '100%', maxWidth: '800px', margin: 'auto' }}>
          {generationPending ? (
              <Spinner fullHeight size={60} text={<FormattedMessage id="story-generating" />} />
          ) : (
            <>
              {!error && text?.length && (
                <>
                  <textarea
                    style={{
                      width: '100%',
                      height: '600px',
                      padding: '10px',
                      borderRadius: '5px',
                      border: '1px solid #ccc',
                      outline: 'none',
                      fontSize: '16px' }}
                    value={generatedStory}
                    onChange={e => setGeneratedStory(e.target.value)}
                  />
                  <div className="row justify-center align-center">
                    <Button
                      size="big"
                      className="lesson-practice"
                      disabled={noResults}
                      style={{
                        fontSize: '1.3em',
                        fontWeight: 500,
                        margin: '0.5em 0',
                        padding: '1rem 0',
                        width: '100%',
                        border: '2px solid #000' }}
                      onClick={() => uploadStory()}
                    >
                      <FormattedMessage id="upload-generated-story" />
                    </Button>
                  </div>
                </>
              )}
              <div className="row justify-center align-center">
                {(error || !text?.length) && (
                  <span
                    style={{
                      color: 'red',
                      textAlign: 'center',
                      fontWeight: 500,
                      margin: '18px',
                      fontSize: 'large' }}
                  >
                    <FormattedMessage id="story-generation-error" />
                  </span>
                )}
                <Button
                  size="big"
                  className="lesson-practice"
                  style={{
                    fontSize: '1.3em',
                    fontWeight: 500,
                    margin: '0.5em 0',
                    padding: '1rem 0',
                    width: '100%',
                    border: '2px solid #000' }}
                  onClick={() => dispatch(generateStory(lessonInstance))}
                >
                  <FormattedMessage id="regenerate-story" />
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )

  const setSelectedTopics = topic_ids => {
    const limitedTopics = topic_ids.slice(0, MAX_GRAMMAR_TOPICS)

    if (topic_ids.length > MAX_GRAMMAR_TOPICS) {
      dispatch(setNotification('Maximum selected grammar topics: 5', 'warn'))
    }

    setLessonInstance({
      ...lessonInstance,
      topic_ids: limitedTopics })
  }

  return (
    <div className="cont-tall pt-lg cont flex-col auto gap-row-sm ">
      {metaPending ? (
        <Spinner fullHeight size={60} />
      ) : noResults ? (
        <div className="justify-center mt-lg" style={{ color: 'rgb(112, 114, 120)' }}>
          <FormattedMessage id="no-lessons-found" />
        </div>
      ) : (
        <>
          <div>
            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                alignSelf: 'center' }}
            >
              <Stepper
                styleConfig={{
                  completedBgColor: '#c6e2ff',
                  activeBgColor: '#003366',
                  inactiveBgColor: '#d2d3d6' }}
              >
                <Step
                  label={<FormattedMessage id="select-story-themes-and-vocabulary" />}
                  active={goStep == 0}
                  completed={goStep > 0}
                  onClick={() => {
                    setGoStep(0)
                  }}
                />
                <Step
                  label={<FormattedMessage id="select-lesson-grammar" />}
                  active={goStep == 1}
                  completed={goStep > 1}
                  onClick={() => {
                    setGoStep(1)
                  }}
                />
                <Step
                  label={<FormattedMessage id="story-generation-summary" />}
                  active={goStep == 2}
                  completed={goStep > 2}
                  onClick={() => {
                    setGoStep(2)
                  }}
                />
                <Step
                  label={<FormattedMessage id="story-generated" />}
                  active={goStep == 3}
                  completed={goStep > 3}
                  onClick={() => {
                    setGoStep(3)
                  }}
                />
              </Stepper>

              <Button
                style={{
                  float: 'right',
                  marginBottom: '8%',
                  cursor: 'pointer' }}
                disabled={
                  goStep >= 3 ||
                  (lessonInstance.topic_ids && lessonInstance.topic_ids.length === 0 && goStep == 1 && lessonInstance.learner_ideas === '')
                }
                onClick={() => {
                  setGoStep(goStep + 1)
                  if (goStep === 2 && generatedStory === '') {
                    dispatch(generateStory(lessonInstance))
                  }
                }}
              >
                <FormattedMessage id="next-step" />
              </Button>
            </div>
            {goStep === -1 && <Spinner fullHeight size={60} />}
            {(goStep === 0 || goStep === -1) && (
              <>
                <div style={{ marginTop: '40px' }}>{lessonVocabularyControls}</div>
                <hr />
                <div style={{ marginTop: '40px' }}>{generationComment}</div>
              </>
            )}
            {goStep === 1 && (
              <div>
                <Topics
                  topicInstance={lessonInstance}
                  editable={true}
                  setSelectedTopics={setSelectedTopics}
                  showPerf={true}
                  note={
                    lessonInstance.topic_ids.length === 0
                      ? <FormattedMessage id="note-no-lessons-topic" />
                      : lessonInstance.topic_ids.length === 5
                      ? <FormattedMessage id="note-max-lessons-topic" values={{ count: lessonInstance.topic_ids.length }} />
                      : <FormattedMessage id="note-lessons-topic-count" values={{ count: lessonInstance.topic_ids.length }} />
                      
                  }
                />
              </div>
            )}
            {goStep === 2 && <div>{lessonStartControls}</div>}
            {goStep === 3 && <div>{generatedStoryControl}</div>}
          </div>
          <ScrollArrow />
        </>
      )}
    </div>
  )
}

export default StoryGeneration
