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

import ReactSlider from 'react-slider'
import { Button } from 'react-bootstrap'
import { Link, useHistory } from 'react-router-dom'
import { Stepper, Step } from 'react-form-stepper';
import { useLearningLanguage, getTextStyle, capitalize } from 'Utilities/common'
import { getLessonTopics } from 'Utilities/redux/lessonsReducer'
import { getMetadata } from 'Utilities/redux/metadataReducer'
import { startLessonsTour } from 'Utilities/redux/tourReducer'
import { lessonsTourViewed, updateGroupSelect, updateLibrarySelect } from 'Utilities/redux/userReducer'
import { generateStory } from 'Utilities/redux/storyGenerationReducer'
import { postStory, setCustomUpload } from 'Utilities/redux/uploadProgressReducer'
import { setNotification } from 'Utilities/redux/notificationReducer'
import styled from 'styled-components'
import useWindowDimensions from 'Utilities/windowDimensions'
import Spinner from 'Components/Spinner'
// import AddStoryModal from 'Components/AddStoryModal'
// import LessonLibrarySearch from './LessonLibrarySearch'

import './LessonLibraryStyles.css';
import { set } from 'lodash'


const StyledMark = (localizedMarkString) => 
  (props) => {
    const StyledMarkSpan = styled.span`
      border-left: 10px solid transparent; 
      border-right: 10px solid transparent; 
      border-top: 15px solid #000; 
      padding: 0;
      &:hover::before {
        content: "${localizedMarkString}" ;
        position: absolute;
        background-color: #333;
        color: #fff;
        padding: 5px 10px;
        border-radius: 4px;
        bottom: 100%;
        left: 50%;
        transform: translateX(-50%);
        opacity: 0.9;
        z-index: 1;
      }
    `
    return <StyledMarkSpan {...props} />
  }

const StoryGeneration = () => {
  const intl = useIntl()
  const { width } = useWindowDimensions()
  const bigScreen = width >= 700
  const learningLanguage = useLearningLanguage()
  const history = useHistory()
  const { pending: userPending, data: userData } = useSelector(({ user }) => user)
  const { teacherView, user } = userData
  const {
    oid: userId,
    has_seen_lesson_tour,
    vocabulary_score,
  } = user
  const {
    pending: metaPending,
    lesson_semantics,
    lesson_topics,
    lessons,
  } = useSelector(({ metadata }) => metadata)
  const { pending: topicPending, topics } = useSelector(({ lessons }) => lessons)
  const { pending: generationPending, text, error } = useSelector(({ storyGeneration }) => storyGeneration)

  const _lesson_sort_criterion = { direction: 'asc', sort_by: 'index' }
  // const smallWindow = useWindowDimensions().width < 520

  const [sorter, setSorter] = useState(_lesson_sort_criterion.sort_by)
  const [sortDirection, setSortDirection] = useState(_lesson_sort_criterion.direction)
  const [goStep, setGoStep] = useState(0)


  const [lessonInstance, setLessonInstance] = useState({
    topic_ids: [],
    vocab_diff: vocabulary_score,
    learner_ideas: '',
    instancePending: false
  })
  const [generatedStory, setGeneratedStory] = useState('')
  const [sliderValue, setSliderValue] = useState(vocabulary_score)
  const [filteredLessons, setFilteredLessons] = useState(lessons);
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
    }
    else if (!generationPending && text) {
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
      vocab_diff: value,
    })
  }

  

  

  const generationComment = (
    <div className="align-center">
      <h5>
        <FormattedMessage id="input-story-generation-comment" />:
      </h5>
      <div className="group-buttons sm lesson-story-topic">
        <div style={{width: "100%", maxWidth: "500px", margin: "auto"}}>
          <textarea
            style={{width: "100%", height: "100px", padding: "10px", borderRadius: "5px", border: "1px solid #ccc", outline: "none", fontSize: "16px"}}
            value={lessonInstance.learner_ideas}
            onChange={e => setLessonInstance({...lessonInstance, learner_ideas: e.target.value})}
          />
        </div>
      </div>
    </div>
  )

  function roundToNearestHalfInt(number) {
    const roundedNumber = Math.round(number);
    if (Math.abs(number - roundedNumber) === 0.5) {
      return roundedNumber + (number > 0 ? 0.5 : -0.5);
    }
    return roundedNumber;
  }

  const getSliderThumbColor = () => {
    if (sliderValue - vocabulary_score > 0 & sliderValue - vocabulary_score <= 0.5) {
      return 'red0-slider'; 
    }
    if (sliderValue - vocabulary_score > 0.5 & sliderValue - vocabulary_score <= 1.0) {
      return 'red1-slider'; 
    }
    if (sliderValue - vocabulary_score > 1.0 & sliderValue - vocabulary_score <= 1.5) {
      return 'red2-slider'; 
    }
    if (sliderValue - vocabulary_score > 1.5) {
      return 'red3-slider'; 
    }

    if (sliderValue - vocabulary_score >= -0.5 & sliderValue - vocabulary_score < 0) {
      return 'green0-slider'; 
    }
    if (sliderValue - vocabulary_score >= -1.0 & sliderValue - vocabulary_score < -0.5) {
      return 'green1-slider'; 
    }
    if (sliderValue - vocabulary_score >= -1.5 & sliderValue - vocabulary_score < -1.0) {
      return 'green2-slider'; 
    }
    if (sliderValue - vocabulary_score < -1.5) {
      return 'green3-slider'; 
    }
    return 'white-slider';
  };
  const sliderThumbClassName = `${getSliderThumbColor()} exercise-density-slider-thumb`;
  const markComp = StyledMark(intl.formatMessage({
      id: 'Recommended vocabulary difficulty' }))
  const lessonVocabularyControls = bigScreen ? (
    <div className="align-center">
      <h5>
        <FormattedMessage id="select-story-vocab-diff" />:
      </h5>

      <div
        className="lesson-vocab-slider-container"
        style={{
          width: "80%",
          marginTop: "30px",
          marginLeft: "auto",
          marginRight: "auto"
        }}
      >
        <ReactSlider
          className="exercise-density-slider lesson-vocab-diff"
          thumbClassName={sliderThumbClassName}
          trackClassName="exercise-density-slider-track"
          onAfterChange={value => handleSlider(value)}
          onSliderClick={value => handleSlider(value)}
          snapDragDisabled={false}
          renderMark={markComp}
          marks={[roundToNearestHalfInt(vocabulary_score)]}
          min={0.8} // 0.8
          max={3.3} // 3.3
          step={0.2}
          value={sliderValue}
        />
        <div className="space-between exercise-density-slider-label-cont bold">
          <span><FormattedMessage id='Easy' /></span>
          <span><FormattedMessage id='Hard' /></span>
        </div>
      </div>
    </div>
  ) : (
    <div className="align-center">
      <h5>
        <FormattedMessage id="select-story-vocab-diff" />:
      </h5>

      <div
        className="lesson-vocab-slider-container"
        style={{
          width: "80%",
          marginTop: "30px",
          marginLeft: "auto",
          marginRight: "auto"
        }}
      >
        <ReactSlider
          className="exercise-density-slider lesson-vocab-diff"
          thumbClassName={sliderThumbClassName}
          trackClassName="exercise-density-slider-track"
          onAfterChange={value => handleSlider(value)}
          onSliderClick={value => handleSlider(value)}
          snapDragDisabled={false}
          renderMark={markComp}
          marks={[roundToNearestHalfInt(vocabulary_score)]}
          min={0.8} // 0.8
          max={3.3} // 3.3
          step={0.02}
          value={sliderValue}
        />
        <div className="space-between exercise-density-slider-label-cont bold">
          <span><FormattedMessage id='Easy' /></span>
          <span><FormattedMessage id='Hard' /></span>
        </div>
      </div>
    </div>
  )
  const lessonGroups = filteredLessons && filteredLessons.reduce((x, y) => {
    (x[y.group] = x[y.group] || []).push(y);
    return x;
  }, {}) || {} // Object.groupBy(filteredLessons, ({group})=> group)
  const handleClick = (e, props) => {
    const { index } = props
    const newIndex = accordionState === index ? -1 : index
    setAccordionState(newIndex)
  }
  
  const lessonReady = lessonInstance.topic_ids && lessonInstance.topic_ids.length > 0
  const lessonReadyColor = lessonReady ? '#0088CB' : '#DB2828'
  let lessonStartControls = (
    <Container>
      <div 
        className='row justify-center align-center'
        style={{
             color: `${lessonReadyColor}`, textAlign: 'center',
             fontWeight: 500,
             margin: '18px', fontSize: 'large'
           }}>
        <div className='col col-12'>
        <FormattedMessage id="story-ready-for-generation" />
        </div>
      </div>
      <div className='row justify-center align-center space-between' style={{ 'display': 'flex' }}>
        <div className='col col-md-5 offset-md-1' style={{padding: 0}}>
          <LessonPracticeTopicsHelp selectedTopics={lessonInstance.topic_ids} always_show={true} />
        </div>
      </div>
      {lessonInstance.learner_ideas && (
        <div className='row justify-center align-center space-between' style={{ 'display': 'flex', marginTop: '40px' }}>
          <div className='col col-md-8'>
            <div className="lesson-topic-box"  style={{width: '100%'}}>
              <Segment style={{backgroundColor: 'azure'}}>
                  <div
                      className="lesson-title"
                      style={{
                          ...getTextStyle(learningLanguage, 'title'),
                          width: `${'100%'}`,
                          fontWeight: 'bold',
                          fontSize: 'large',
                          marginBottom: '15px',
                      }}
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
      topics: lessonInstance.topic_ids,
    }

    dispatch(updateLibrarySelect('private'))
    dispatch(setCustomUpload(true))
    await dispatch(postStory(newStory))
    dispatch(setNotification('processing-story', 'info'))
    history.push('/library')
  }

  const generatedStoryControl = (
    <div className="align-center">
      <div className="group-buttons sm lesson-story-topic">
        <div style={{width: "100%", maxWidth: "800px", margin: "auto"}}>
          {generationPending ? (
            <div className='row justify-center align-center'>
              <Spinner />
              <span style={{
                textAlign: 'center',
                fontWeight: 500,
                margin: '18px',
                fontSize: 'large'
              }}>
                <FormattedMessage id="story-generating" />
              </span>
            </div>
          ): (
            <>
              {!error && text?.length && (<>
                <textarea
                  style={{width: "100%", height: "600px", padding: "10px", borderRadius: "5px", border: "1px solid #ccc", outline: "none", fontSize: "16px"}}
                  value={generatedStory}
                  onChange={e => setGeneratedStory(e.target.value)}
                />
                <div className='row justify-center align-center'>
                  <Button
                    size="big"
                    className="lesson-practice"
                    disabled={
                        !lessonInstance.topic_ids ||
                        lessonInstance.topic_ids.length === 0 ||
                        noResults
                    }
                    style={{
                      fontSize: '1.3em', fontWeight: 500,
                      margin: '0.5em 0', padding: '1rem 0',
                      width: '100%', border: '2px solid #000',
                    }}
                    onClick={() => uploadStory()}
                  >
                    <FormattedMessage id="upload-generated-story" />
                  </Button>
                </div>
              </>)}
              <div className='row justify-center align-center'>
                {(error || !text?.length) && (<span style={{
                  color: 'red', 
                  textAlign: 'center',
                  fontWeight: 500,
                  margin: '18px', 
                  fontSize: 'large'
                }}>
                  <FormattedMessage id='story-generation-error'/>
                </span>)}
                <Button
                  size="big"
                  className="lesson-practice"
                  style={{
                    fontSize: '1.3em', fontWeight: 500,
                    margin: '0.5em 0', padding: '1rem 0',
                    width: '100%', border: '2px solid #000',
                  }}
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

  const noResults = !metaPending && lesson_topics && lesson_topics.length === 0

  topics.sort((a, b) => {
    let dir = 0
    switch (sorter) {
      case 'index':
        dir = a.index > b.index ? 1 : -1
        break
      case 'topic_id':
        dir = a.syllabus_id > b.syllabus_id ? 1 : -1
        break
      default:
        break
    }
    const multiplier = sortDirection === 'asc' ? 1 : -1
    return dir * multiplier
  })

  const setSelectedTopics = topic_ids => {
    setLessonInstance({
      ...lessonInstance,
      topic_ids: topic_ids
    })
  }

  return (
    <div className="cont-tall pt-lg cont flex-col auto gap-row-sm ">

      {metaPending  ? (
        <Placeholder>
          <Placeholder.Line />
        </Placeholder>
      ) :
        noResults ? (
          <div className="justify-center mt-lg" style={{ color: 'rgb(112, 114, 120)' }}>
            <FormattedMessage id="no-lessons-found" />
          </div>
        ) : (
          <>
            <div>
              <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', alignSelf: 'center' }}>
                <Stepper
                  styleConfig={{
                    completedBgColor: '#c6e2ff',
                    activeBgColor: '#003366',
                    inactiveBgColor: '#d2d3d6',
                  }}
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
                    float: 'right', marginBottom: '8%',
                    cursor: 'pointer'
                  }}
                  disabled={ goStep >= 3 || 
                    lessonInstance.topic_ids && lessonInstance.topic_ids.length === 0 && goStep == 1}
                  onClick={() => {
                    setGoStep(goStep + 1)
                    if (goStep === 2 && generatedStory === '') {
                      dispatch(generateStory(lessonInstance))
                    }
                  }}>
                  <FormattedMessage id="next-step" />
                </Button>
              </div>
              { goStep === -1 && (
                <Placeholder>
                  <Placeholder.Line />
                </Placeholder>
              )}
              {(goStep === 0 || goStep === -1) && (
                <>
                    
                    <div style={{marginTop: '40px'}}>
                        {lessonVocabularyControls}
                    </div>
                    <hr/>
                    <div style={{marginTop: '40px'}}>
                      {generationComment}
                    </div>
                </>
              )}
              {goStep === 1 && (
                <div>
                  <Topics
                    topicInstance={lessonInstance}
                    editable={true}
                    setSelectedTopics={setSelectedTopics}
                    showPerf={true}
                  />
                </div>
              )}
              {goStep === 2 && (
                <div>
                  {lessonStartControls}
                </div>
              )}
              {goStep === 3 && (
                <div>
                  {generatedStoryControl}
                </div>
              )}
            </div>
            <ScrollArrow />
          </>
        )}
    </div>
  )
}

export default StoryGeneration
