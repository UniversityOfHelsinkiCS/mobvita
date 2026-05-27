import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Button } from 'react-bootstrap'
import { Tooltip } from '@mui/material'
import { FormattedMessage } from 'react-intl'
import { useNavigate } from 'react-router-dom'
import { images, cefrNumberToLevel } from 'Utilities/common'
import { setLessonInstance, setLessonStep } from 'Utilities/redux/lessonInstanceReducer'

import './LessonStartMenuStyles.scss'

const getLessonLevel = lesson => {
  if (!lesson.group) return null

  const group = String(lesson.group)

  return group.startsWith('4') ? '4' : group
}

const LessonStartMenu = ({ setOpen }) => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const {
    grade,
    current_cefr: currentCefr,
    vocabulary_score: vocabularyScore,
  } = useSelector(state => state.user.data.user)
  const { lessons, lesson_semantics: lessonSemantics } = useSelector(({ metadata }) => metadata)

  const recommendedGrammarBaseLevel =
    cefrNumberToLevel(currentCefr) || cefrNumberToLevel(grade) || 1
  const recommendedGrammarLevel =
    recommendedGrammarBaseLevel === 4 ? 4 : Number(`${recommendedGrammarBaseLevel}.1`)

  const getTopicsByLevel = () => {
    const levelTopics = lessons.reduce((groups, lesson) => {
      const groupName = getLessonLevel(lesson)
      if (!groupName) return groups

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
      topic_ids: getTopicsByLevel()[recommendedGrammarLevel],
    }
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
      <Tooltip title={<FormattedMessage id="lesson-quick-start-info" />}>
        <Button
          className="lesson-tour-start-button"
          variant="primary"
          type="button"
          onClick={handleStartClick}
        >
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
      </Tooltip>

      <Tooltip title={<FormattedMessage id="lesson-customize-info" />}>
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
      </Tooltip>
    </div>
  )
}

export default LessonStartMenu
