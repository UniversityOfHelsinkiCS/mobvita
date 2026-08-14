// eslint-disable-next-line no-unused-vars
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import AppButton from 'Components/AppButton'
import CustomTooltip from 'Components/CustomTooltip'
import { FormattedMessage } from 'react-intl'
import { useNavigate } from 'react-router-dom'
import { images, cefrNumberToLevel } from 'Utilities/common'
import { colors } from 'Assets/mui_theme/designTokens'
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
    const levelTopics = (lessons || []).reduce((groups, lesson) => {
      const groupName = getLessonLevel(lesson)
      if (!groupName) return groups

      if (!groups[groupName]) {
        groups[groupName] = []
      }
      lesson.topics.forEach(topic => {
        if (!groups[groupName].includes(topic)) {
          groups[groupName].push(topic)
        }
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

  // Sizing for the two stacked menu buttons; the white/border/hover look comes from `variant="card"`.
  const cardSx = {
    width: '70%',
    borderRadius: '16px',
    minHeight: 68,
    fontSize: 18,
    fontWeight: 600,
    gap: '10px',
    '& img': { width: 28, height: 28 },
  }

  return (
    <div
      className="lesson-start-menu-container"
      style={{ backgroundColor: colors.card, borderRadius: 30, padding: 24 }}
    >
      <CustomTooltip title={<FormattedMessage id="lesson-quick-start-info" />}>
        <AppButton
          className="lesson-tour-start-button"
          variant="card"
          type="button"
          onClick={handleStartClick}
          sx={cardSx}
        >
          <img src={images.playColored} alt="" />
          {/* Trailing nbsp so the two labels are equal width and the icons line up vertically. */}
          <span>
            <FormattedMessage id="start-lesson" defaultMessage="Start Lesson" />
            &nbsp;
            {' '}
          </span>
        </AppButton>
      </CustomTooltip>

      <CustomTooltip title={<FormattedMessage id="lesson-customize-info" />}>
        <AppButton
          className="lesson-tour-setup-button"
          variant="card"
          type="button"
          onClick={handleLessonSetupClick}
          sx={cardSx}
        >
          <img src={images.setupColored} alt="" />
          <span>
            <FormattedMessage id="setup-lesson" defaultMessage="Setup Lesson" />
          </span>
        </AppButton>
      </CustomTooltip>
    </div>
  )
}

export default LessonStartMenu
