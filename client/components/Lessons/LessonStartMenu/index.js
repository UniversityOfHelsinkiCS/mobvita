import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { CardGroup, CardContent, Card, Icon, Popup } from 'semantic-ui-react'
import { Button, Tooltip, OverlayTrigger } from 'react-bootstrap'
import { FormattedMessage } from 'react-intl'
import { useNavigate } from 'react-router-dom'
import { images, cefrNumberToLevel } from 'Utilities/common'
import { setLessonInstance, setLessonStep } from 'Utilities/redux/lessonInstanceReducer'
import useWindowDimensions from 'Utilities/windowDimensions'

import './LessonStartMenuStyles.scss'

const LessonStartMenu = ({ setOpen }) => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const {
    grade,
    current_cefr: currentCefr,
    vocabulary_score: vocabularyScore } = useSelector(state => state.user.data.user)
  const { lessons, lesson_semantics: lessonSemantics } = useSelector(({ metadata }) => metadata)

  const bigScreen = useWindowDimensions().width > 1000

  const recommendedGrammarLevel = cefrNumberToLevel(currentCefr) || cefrNumberToLevel(grade) || 1

  const getTopicsByLevel = () => {
    const levelTopics = lessons.reduce((groups, lesson) => {
      const groupName = lesson.group[0]
      if (!groups[groupName]) {
        groups[groupName] = []
      }
      lesson.topics.forEach(topic => {
        groups[groupName].push(topic)
      })
      return groups
    }, {})

    return levelTopics
  }

  const handleStartClick = () => {
    const payload = {
      semantic: lessonSemantics,
      vocab_diff: vocabularyScore,
      topic_ids: getTopicsByLevel()[recommendedGrammarLevel] }
    dispatch(setLessonInstance(payload))
    navigate('/lesson/practice')
    setOpen(false)
  }

  const handleLessonSetupClick = () => {
    dispatch(setLessonStep(0))
    setOpen(false)
  }

  return (
    <div className="lesson-start-menu-container universal-background">
      <OverlayTrigger
        placement="top"
        overlay={
          <Tooltip id="quick-start-tooltip">
            <FormattedMessage id="lesson-quick-start-info" />
          </Tooltip>
        }
      >
        <Button variant="primary" type="button" onClick={handleStartClick}>
          <div className="lesson-menu-button">
            <img
              className="lesson-menu-button-icon"
              src={images.readingBook}
              alt="open book"
              style={{ maxWidth: '46px', maxHeight: '46px' }}
            />
            <span className="lesson-menu-button-text">
              <FormattedMessage id="start" />
            </span>
          </div>
        </Button>
      </OverlayTrigger>

      <OverlayTrigger
        placement="top"
        overlay={
          <Tooltip id="setup-tooltip">
            <FormattedMessage id="lesson-customize-info" />
          </Tooltip>
        }
      >
        <Button
          className="lesson-tour-setup-button"
          variant="secondary"
          type="button"
          onClick={handleLessonSetupClick}
        >
          <div className="lesson-menu-button">
            <img
              className="lesson-menu-button-icon"
              src={images.settingsIcon}
              alt="settings"
              style={{ maxWidth: '36px', maxHeight: '36px' }}
            />
            <span className="lesson-menu-button-text">
              <FormattedMessage id="lesson-setup" />
            </span>
          </div>
        </Button>
      </OverlayTrigger>
    </div>
  )
}

export default LessonStartMenu
