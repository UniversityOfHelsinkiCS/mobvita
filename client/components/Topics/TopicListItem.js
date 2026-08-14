// eslint-disable-next-line no-unused-vars
import React from 'react'
import { useSelector } from 'react-redux'
import CheckBoxOutlinedIcon from '@mui/icons-material/CheckBoxOutlined'
import AppButton from 'Components/AppButton'
import AppCheckbox from 'Components/ui/AppCheckbox'
import CustomTooltip from 'Components/CustomTooltip'

import { useIntl, FormattedMessage } from 'react-intl'
import { colors } from 'Assets/mui_theme/designTokens'
import { getTextStyle, learningLanguageSelector, ACCESS, useHasAccess } from 'Utilities/common'

import useWindowDimensions from 'Utilities/windowDimensions'

// import ConfirmationWarning from 'Components/ConfirmationWarning'
// import useWindowDimensions from 'Utilities/windowDimensions'

const get_lesson_performance = (correct_count, total_count) => {
  let correct_perc = 0.0
  if (total_count && total_count !== 0) {
    correct_perc = correct_count / total_count
  }
  return parseFloat(correct_perc).toFixed(2) // * 100
}

const get_lesson_performance_style = (correct_count, total_count) => {
  const correct_perc = get_lesson_performance(correct_count, total_count)
  if (correct_perc >= 0.75) return '#008000'
  else if (correct_perc < 0.75 && correct_perc >= 0.5) return '#32cd32'
  else if (correct_perc < 0.5 && correct_perc >= 0.25) return '#ffa500'
  else if (correct_perc < 0.25 && correct_perc > 0) return '#ff0000'
  else return '#000000'
}

const LessonTitle = ({
  lesson,
  lesson_instance,
  selected,
  disabled,
  toggleTopic,
  includeLesson,
  excludeLesson,
  showPerf,
}) => {
  const { width } = useWindowDimensions()
  const bigScreen = width >= 700
  const intl = useIntl()
  const learningLanguage = useSelector(learningLanguageSelector)
  // Topics inside a lesson are high-access only; access <= 1 sees just the lesson name.
  const canSeeTopics = useHasAccess(ACCESS.HIGH)
  const { topics } = useSelector(({ lessons }) => lessons)
  const { lesson_topics: all_topics } = useSelector(({ metadata }) => metadata)

  const topic2info = topics.reduce((obj, topic) => ({ ...obj, [topic.topic_id]: topic }), {})
  const topicId2Name = all_topics.reduce(
    (obj, topic) => ({ ...obj, [topic.topic_id]: topic.topic }),
    {},
  )
  const topic_rows = []
  const lesson_topics = lesson.topics

  const splitAtFirstDash = (text = '') => {
    const match = text.match(/^(.*?)\s*—\s*(.*)$/)
    if (!match) return { title: text.trim(), example: '' }

    return {
      title: match[1].trim(),
      example: match[2].trim(),
    }
  }

  for (let k = 0; k < lesson_topics.length; k++) {
    const correct =
      topic2info[lesson_topics[k]] != undefined ? topic2info[lesson_topics[k]].correct : 0
    const total = topic2info[lesson_topics[k]] != undefined ? topic2info[lesson_topics[k]].total : 0
    const color = { color: get_lesson_performance_style(correct, total) }
    const rawName =
      topicId2Name[lesson_topics[k]].charAt(0).toUpperCase() +
      topicId2Name[lesson_topics[k]].slice(1)

    const { title: topicTitle, example: topicExample } = splitAtFirstDash(rawName)

    topic_rows.push(
      <h6
        key={k}
        className="lesson-item-topics"
        style={{
          marginBottom: '.5rem',
          display: 'inline-flex',
          width: '100%',
          ...getTextStyle(learningLanguage),
        }}
      >
        <span
          display="inline"
          float="left"
          style={{
            width: '4%',
            textAlign: 'right',
            marginRight: '10px',
            maxWidth: '25px',
            minWidth: '25px',
            ...color,
          }}
        >
          <AppCheckbox
            checked={
              lesson_instance != undefined &&
              lesson_instance?.topic_ids != undefined &&
              lesson_instance?.topic_ids?.includes(lesson_topics[k])
            }
            onChange={() => {
              toggleTopic(lesson_topics[k])
            }}
            sx={{ padding: 0 }}
          />
        </span>
        {showPerf && (
          <CustomTooltip
            placement="top"
            permanent
            title={intl.formatMessage({ id: 'lesson-performance-info-tooltip' })}
          >
            <div
              className="lesson-performance"
              style={{
                minWidth: '50px',
                maxWidth: '50px',
              }}
            >
              <span
                float="left"
                style={{
                  display: 'inline-grid',
                  justifyContent: 'end',
                  width: '6%',
                  textAlign: 'right',
                  marginRight: '5px',
                  maxWidth: '25px',
                  minWidth: '25px',
                  verticalAlign: 'top',
                  ...color,
                }}
              >
                {String(Math.round(get_lesson_performance(correct, total) * 100)).padEnd(3, ' ')}
              </span>
              <span
                style={{
                  width: '3%',
                  textAlign: 'center',
                  maxWidth: '20px',
                  minWidth: '18px',
                  verticalAlign: 'top',
                  ...color,
                }}
              >
                %
              </span>
            </div>
          </CustomTooltip>
        )}
        <div className="lesson-content" style={{ width: '80%', marginLeft: '15px' }}>
          <div dangerouslySetInnerHTML={{ __html: topicTitle }} />
          {topicExample ? (
            <div
              style={{ fontWeight: '400' }}
              dangerouslySetInnerHTML={{ __html: `— ${topicExample}` }}
            />
          ) : null}
        </div>
      </h6>,
    )
  }

  return bigScreen ? (
    <div>
      <span className="space-between" style={{ overflow: 'hidden', width: '100%' }}>
        <div style={{ marginBottom: '.5rem', marginRight: 'auto' }}>
          <h5
            className="story-item-title"
            style={{ marginBottom: '.5rem', ...getTextStyle(learningLanguage) }}
            dangerouslySetInnerHTML={{ __html: lesson.name.split('—')[0].trim() }}
          />
        </div>
        <div className="lesson-card-actions-cont">
          <div className="lesson-actions">
            <AppButton
              variant={selected ? 'primary' : 'card'}
              onClick={() => {
                if (selected) {
                  excludeLesson(lesson.ID)
                } else {
                  includeLesson(lesson.ID)
                }
              }}
              disabled={disabled}
              sx={{
                gap: '8px',
                '& svg': { fontSize: 20 },
                // Not-selected: cream fill with an ink border matching the text colour.
                ...(selected
                  ? {}
                  : {
                      backgroundColor: '#F7F0D5',
                      border: `1px solid ${colors.ink}`,
                      '&:hover': { backgroundColor: '#EFE7C6', borderColor: colors.ink },
                    }),
              }}
              style={{
                cursor: !disabled ? 'pointer' : 'not-allowed',
              }}
            >
              <CheckBoxOutlinedIcon />
              <FormattedMessage id="select-all" defaultMessage="Select All" />
            </AppButton>
          </div>
        </div>
      </span>
      {canSeeTopics && <span style={{ overflow: 'hidden', width: '100%' }}>{topic_rows}</span>}
    </div>
  ) : (
    <div>
      <span className="space-between" style={{ overflow: 'hidden', width: '100%' }}>
        <div style={{ marginBottom: '.5rem', marginRight: 'auto' }}>
          <h5
            className="story-item-title"
            style={{
              'overflow-wrap': 'break-word',
              'white-space': 'normal',
              marginBottom: '.5rem',
              ...getTextStyle(learningLanguage),
            }}
          >
            <span dangerouslySetInnerHTML={{ __html: lesson.name.split('—')[0].trim() }} />
            {/* {`${intl.formatMessage({ id: 'topic-singular' })} ${lesson.topic_id}`} */}
          </h5>
        </div>
      </span>
      {canSeeTopics && <span style={{ overflow: 'hidden', width: '100%' }}>{topic_rows}</span>}
      <div className="lesson-card-actions-cont">
        <div className="lesson-actions">
          <AppButton
            variant={selected ? 'primary' : 'card'}
            onClick={() => {
              if (selected) {
                excludeLesson(lesson.ID)
              } else {
                includeLesson(lesson.ID)
              }
            }}
            disabled={disabled}
            sx={{
              gap: '8px',
              '& svg': { fontSize: 20 },
              // Not-selected: cream fill with an ink border matching the text colour.
              ...(selected
                ? {}
                : {
                    backgroundColor: '#F7F0D5',
                    border: `1px solid ${colors.ink}`,
                    '&:hover': { backgroundColor: '#EFE7C6', borderColor: colors.ink },
                  }),
            }}
            style={{
              width: '100%',
              cursor: !disabled ? 'pointer' : 'not-allowed',
            }}
          >
            <CheckBoxOutlinedIcon />
            <FormattedMessage id="select-all" defaultMessage="Select All" />
          </AppButton>
        </div>
      </div>
    </div>
  )
}

const TopicListItem = ({
  lesson,
  lesson_instance,
  selected,
  toggleTopic,
  includeLesson,
  excludeLesson,
  disabled,
  showPerf,
}) => {
  const correct_perc = get_lesson_performance(lesson.correct, lesson.total)
  // Cards sit on a soft cream tint; high-scoring lessons get a green tint instead.
  let backgroundColor = '#F7F0D5'
  if (correct_perc >= 0.8) backgroundColor = '#E2FFE1'
  return (
    <div
      key={lesson.ID}
      className="lesson-list-card"
      style={{
        backgroundColor,
        border: '1px solid #B1D3C2',
        borderRadius: 16,
        padding: '14px 18px',
      }}
    >
      <div className="lesson-card-title-cont">
        <LessonTitle
          lesson={lesson}
          lesson_instance={lesson_instance}
          selected={selected}
          disabled={disabled}
          toggleTopic={toggleTopic}
          includeLesson={includeLesson}
          excludeLesson={excludeLesson}
          showPerf={showPerf}
        />
      </div>
    </div>
  )
}

export default TopicListItem
