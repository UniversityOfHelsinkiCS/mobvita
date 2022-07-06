import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link, useHistory } from 'react-router-dom'
import { Divider, Segment, Header, Checkbox, Icon, Popup, Dropdown } from 'semantic-ui-react'
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
  const isGroupReview = history.location.pathname.includes('group-review')
  const { show_review_diff, show_preview_exer } = useSelector(({ user }) => user.data.user)
  const { story, pending } = useSelector(({ stories, locale }) => ({
    story: stories.focused,
    pending: stories.focusedPending,
    locale,
  }))

  const defineFeedback = () => {
    if (mode === 'review') {
      return false
    }
    if (mode === 'preview') {
      return !show_preview_exer
    }

    return true
  }
  // console.log('show re ', show_review_diff)

  const [hideFeedback, setHideFeedback] = useState(defineFeedback())
  const user = useSelector(state => state.user.data)
  const { progress, storyId } = useSelector(({ uploadProgress }) => uploadProgress)
  const currentGroupId = useSelector(({ user }) => user.data.user.last_selected_group)
  const { groups: totalGroups, pending: groupsPending } = useSelector(({ groups }) => groups)
  const currentGroup = totalGroups.find(group => group.group_id === currentGroupId)
  const dropDownMenuText = currentStudent
    ? `${currentStudent?.userName} (${currentStudent?.email})`
    : 'Choose the student to review'

  const studentOptions = currentGroup?.students
    .map(student => ({
      key: student._id,
      text: `${student?.userName} (${student?.email})`,
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

  const checkboxLabel = () => {
    if (url.endsWith('/preview')) {
      return intl.formatMessage({ id: 'show-exercise-preview' })
    }

    return intl.formatMessage({ id: 'show-feedback' })
  }

  const infoBoxLabel = () => {
    if (url.endsWith('/preview')) {
      return intl.formatMessage({ id: 'preview-mode-info' })
    }

    return intl.formatMessage({ id: 'review-mode-info' })
  }

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

  return (
    <div className="cont-tall flex-col space-between align-center pt-sm">
      <div className="flex mb-nm">
        <div>
          <Segment data-cy="readmodes-text" className="cont" style={getTextStyle(learningLanguage)}>
            <Header style={getTextStyle(learningLanguage, 'title')}>
              <span className="pr-sm">{story.title}</span>
              <br />
              {story.url && (
                <a href={story.url} style={{ fontSize: '1rem', fontWeight: '300' }}>
                  <FormattedMessage id="Source" />
                </a>
              )}
            </Header>
            <div className="space-between" style={{ alignItems: 'center' }}>
              {/* 
              <div style={{ display: 'flex' }}>
                <Checkbox
                  toggle
                  label={checkboxLabel()}
                  checked={!hideFeedback}
                  onChange={() => setHideFeedback(!hideFeedback)}
                  style={{ paddingTop: '.5em' }}
                />
                <Popup
                  content={infoBoxLabel()}
                  trigger={
                    <Icon
                      className="pl-sm"
                      style={{ marginTop: '0.45em' }}
                      name="info circle"
                      color="grey"
                    />
                  }
                />
                */}
              <div>
                {mode === 'preview' ? (
                  <Checkbox
                    toggle
                    label="show preview"
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
              {isGroupReview ? (
                <span style={{ marginLeft: '3em' }}>
                  <FormattedMessage id="student" />:{' '}
                  <Dropdown
                    text={dropDownMenuText}
                    selection
                    fluid
                    options={studentOptions}
                    onChange={(_, { value }) => handleStudentChange(value)}
                  />
                </span>
              ) : (
                <Link to={`/stories/${id}/practice`}>
                  <Button variant="primary">
                    <FormattedMessage id="practice-now" />
                  </Button>
                </Link>
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
                  hideFeedback={hideFeedback}
                  showDifficulty={showDifficulty}
                  mode="review"
                  snippet={paragraph}
                  answers={null}
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
