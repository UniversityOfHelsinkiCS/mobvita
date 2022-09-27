import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link, useHistory } from 'react-router-dom'
import { Divider, Segment, Header, Checkbox, Dropdown } from 'semantic-ui-react'
import { Button } from 'react-bootstrap'
import { FormattedMessage, useIntl } from 'react-intl'
import useWindowDimensions from 'Utilities/windowDimensions'
import { getStoryAction, getStudentStoryAction } from 'Utilities/redux/storiesReducer'
import { clearTranslationAction } from 'Utilities/redux/translationReducer'
import { resetAnnotations, setAnnotations } from 'Utilities/redux/annotationsReducer'
import { updateShowReviewDiff, updatePreviewExer } from 'Utilities/redux/userReducer'
import { learningLanguageSelector, getTextStyle, getMode } from 'Utilities/common'
import DictionaryHelp from 'Components/DictionaryHelp'
import AnnotationBox from 'Components/AnnotationBox'
import Spinner from 'Components/Spinner'
import TextWithFeedback from 'Components/CommonStoryTextComponents/TextWithFeedback'
import FeedbackInfoModal from 'Components/CommonStoryTextComponents/FeedbackInfoModal'
import ReportButton from 'Components/ReportButton'
import { compose } from 'redux'
import StoryTopics from 'Components/StoryView/StoryTopics'
import Footer from '../Footer'
import ScrollArrow from '../ScrollArrow'

const ReadViews = ({ match }) => {
  const dispatch = useDispatch()
  const intl = useIntl()
  const { width } = useWindowDimensions()
  const mode = getMode()
  const history = useHistory()
  const [showRefreshButton, setShowRefreshButton] = useState(false)
  const [currentStudent, setCurrentStudent] = useState(null)
  const isGroupReview = history.location.pathname.includes('group/review')
  const isGroupPreview = history.location.pathname.includes('group/preview')
  const { show_review_diff, show_preview_exer, oid } = useSelector(({ user }) => user.data.user)
  const { story, pending } = useSelector(({ stories, locale }) => ({
    story: stories.focused,
    pending: stories.focusedPending,
    locale,
  }))

  const bigScreen = width > 700

  const defineFeedback = () => {
    if (mode === 'review') {
      return false
    }
    if (mode === 'preview') {
      return true
    }

    return true
  }
  // console.log('show re ', show_review_diff)
  // console.log('exer preview ', show_preview_exer)

  const [hideFeedback, setHideFeedback] = useState(defineFeedback())
  const [focusedConcept, setFocusedConcept] = useState(null)
  const user = useSelector(state => state.user.data)
  const { progress, storyId } = useSelector(({ uploadProgress }) => uploadProgress)
  const currentGroupId = useSelector(({ user }) => user.data.user.last_selected_group)
  const { groups: totalGroups, pending: groupsPending } = useSelector(({ groups }) => groups)
  const currentGroup = totalGroups.find(group => group.group_id === currentGroupId)
  const dropDownMenuText = currentStudent
    ? `${currentStudent?.userName} (${currentStudent?.email})`
    : 'Choose the student to review'

  const truncateStudentName = studentName => {
    if (studentName.length > 50) {
      return `${studentName.slice(0, 50)}...`
    }

    return studentName
  }
  const ownedStory = oid === story?.owner

  const studentOptions = currentGroup?.students
    .map(student => ({
      key: student._id,
      text: truncateStudentName(`${student?.userName} (${student?.email})`),
      value: JSON.stringify(student), // needs to be string
    }))
    .sort(function (a, b) {
      const textA = a.text.toUpperCase()
      const textB = b.text.toUpperCase()
      return textA < textB ? -1 : textA > textB ? 1 : 0
    })

  const [previewToggleOn, setPreviewToggleOn] = useState(show_preview_exer || false)
  const [showDifficulty, setShowDifficulty] = useState(show_review_diff || false)
  const learningLanguage = useSelector(learningLanguageSelector)
  const { id } = match.params

  const handleStudentChange = value => {
    const parsedValue = JSON.parse(value)
    setCurrentStudent(parsedValue)
    dispatch(getStudentStoryAction(id, currentGroupId, parsedValue._id))
  }

  useEffect(() => {
    if (user?.user.is_teacher) {
      setHideFeedback(false)
    }
    dispatch(getStoryAction(id, mode))
    dispatch(clearTranslationAction())
    dispatch(resetAnnotations())
  }, [])

  useEffect(() => {
    if (story) {
      const storyWords = story.paragraph.flat(1)
      dispatch(setAnnotations(storyWords))
    }
  }, [story])

  useEffect(() => {
    if (progress === 1) {
      setShowRefreshButton(true)
    }
  }, [progress])

  if (!story || pending || !user || groupsPending) return <Spinner fullHeight />

  const showFooter = width > 640
  const url = history.location.pathname
  const processingCurrentStory = id === storyId

  const refreshPage = () => {
    dispatch(getStoryAction(id, mode))
    setShowRefreshButton(false)
  }

  const updateUserReviewDiff = () => {
    dispatch(updateShowReviewDiff(!showDifficulty))
    setShowDifficulty(!showDifficulty)
  }

  const updateUserPreviewExer = () => {
    dispatch(updatePreviewExer(!previewToggleOn))
    setPreviewToggleOn(!previewToggleOn)
    setHideFeedback(!hideFeedback)
  }

  // console.log('story ', story.paragraph)
  // console.log('focused ', focusedConcept)

  return (
    <div className="cont-tall flex-col space-between align-center pt-sm">
      <div className="flex mb-nm">
        <div>
          <Segment data-cy="readmodes-text" className="cont" style={getTextStyle(learningLanguage)}>
            <Header style={getTextStyle(learningLanguage, 'title')}>
              <span className="pr-sm">{story.title}</span>
              <br />
              {story.url && (
                <a
                  href={story.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ fontSize: '1rem', fontWeight: '300' }}
                >
                  <FormattedMessage id="Source" />
                </a>
              )}
            </Header>
            <div className="space-between" style={{ alignItems: 'center' }}>
              <div>
                {mode === 'preview' ? (
                  <Checkbox
                    toggle
                    label={intl.formatMessage({ id: 'show preview' })}
                    checked={previewToggleOn}
                    onChange={updateUserPreviewExer}
                    style={{ paddingTop: '.5em' }}
                  />
                ) : (
                  <Checkbox
                    toggle
                    label={intl.formatMessage({ id: 'show-difficulty-level' })}
                    checked={showDifficulty}
                    onChange={updateUserReviewDiff}
                    style={{ paddingTop: '.5em' }}
                  />
                )}
              </div>
              {isGroupReview && (
                <div className="row-flex" style={{ marginLeft: '3em' }}>
                  <span style={{ marginRight: '.5em' }}>
                    <FormattedMessage id="student" />:{' '}
                  </span>
                  <Dropdown
                    text={dropDownMenuText}
                    selection
                    fluid
                    options={studentOptions}
                    onChange={(_, { value }) => handleStudentChange(value)}
                  />
                </div>
              )}
              {!isGroupPreview && !isGroupReview && (
                <div>
                  {ownedStory && (
                    <Link to={`/stories/${id}/edit`}>
                      <Button style={{ marginRight: '.5em' }} variant="secondary">
                        <FormattedMessage id="edit-story" />
                      </Button>
                    </Link>
                  )}
                  <Link to={`/stories/${id}/listening/practice/`}>
                    <Button style={{ marginRight: '.5em' }} variant="primary">
                      <FormattedMessage id="practice-listening-mode" />
                    </Button>
                  </Link>
                  <Link to={`/stories/${id}/practice/`}>
                    <Button variant="primary">
                      <FormattedMessage id="practice-grammar-mode" />
                    </Button>
                  </Link>
                </div>
              )}
            </div>
            {progress !== 0 && processingCurrentStory && (
              <div className="bold">
                <span style={{ color: 'red' }}>
                  <FormattedMessage id="story-not-yet-processed" />
                </span>
              </div>
            )}
            {showRefreshButton && (
              <div className="flex gap-col-sm align-center">
                <div className="bold">
                  <span style={{ color: 'red' }}>
                    <FormattedMessage id="story-processing-now-finished" />
                  </span>
                </div>
                <Button onClick={refreshPage}>
                  <FormattedMessage id="refresh" />
                </Button>
              </div>
            )}
            <Divider />
            {story.paragraph.map(paragraph => (
              <>
                <TextWithFeedback
                  hideFeedback={!show_preview_exer}
                  showDifficulty={showDifficulty}
                  mode="review"
                  snippet={paragraph}
                  answers={null}
                  focusedConcept={focusedConcept}
                  show_preview_exer
                />
                <br />
                <br />
              </>
            ))}
            <ScrollArrow />
          </Segment>
          {width >= 500 ? (
            <div className="flex-col align-end" style={{ marginTop: '0.5em' }}>
              <ReportButton />
            </div>
          ) : (
            <div style={{ marginBottom: '0.5em' }}>
              <ReportButton />
            </div>
          )}
        </div>
        <div className="dictionary-and-annotations-cont">
          <StoryTopics
            conceptCount={story.concept_count}
            focusedConcept={focusedConcept}
            setFocusedConcept={setFocusedConcept}
          />
          <DictionaryHelp />
          <AnnotationBox />
        </div>
        <FeedbackInfoModal />
      </div>
      {showFooter && <Footer />}
    </div>
  )
}

export default ReadViews
