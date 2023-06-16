import React, { useState } from 'react'
import { useHistory } from 'react-router'
import { useDispatch, useSelector } from 'react-redux'
import { Card, Dropdown, Button as SemanticButton, Icon, Popup, Checkbox } from 'semantic-ui-react'
import { Button } from 'react-bootstrap'

import { useIntl, FormattedMessage } from 'react-intl'
import { getTextStyle, learningLanguageSelector } from 'Utilities/common'

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

const LessonTitle = ({ lesson, toggleTopic, includeLesson, excludeLesson }) => {
  const intl = useIntl()
  const learningLanguage = useSelector(learningLanguageSelector)
  const { topics } = useSelector(({ lessons }) => lessons)
  const { lesson: lesson_instance } = useSelector(({ lessonInstance }) => lessonInstance)

  let topic2info = {}
  for (let topic of topics) {
    let { topic_id } = topic;
    if (!topic2info.hasOwnProperty(topic_id)) {
      topic2info[topic_id] = topic;
    }
  }

  const topic_rows = []
  const lesson_topics = lesson.topics
  for (let k = 0; k < lesson_topics.length; k++) {
    const color = {
      color: get_lesson_performance_style(
        topic2info[lesson_topics[k]].correct, topic2info[lesson_topics[k]].total)
    }
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
        <div className="lesson-performance">
          <span
            display="inline"
            float="left"
            style={{
              width: '4%',
              textAlign: 'right',
              marginRight: '5px',
              maxWidth: '25px',
              minWidth: '25px',
              ...color
            }}
          >
            <Checkbox
              checked={lesson_instance.topic_ids.includes(lesson_topics[k])}
              onChange={() => {toggleTopic(lesson_topics[k])}}
            />
          </span>
          <span
            display="inline"
            float="left"
            style={{
              width: '6%',
              textAlign: 'right',
              marginRight: '5px',
              maxWidth: '25px',
              minWidth: '25px',
              'vertical-align': 'top',
              ...color
            }}
          >
            {String(
              Math.round(
                get_lesson_performance(
                  topic2info[lesson_topics[k]].correct, 
                  topic2info[lesson_topics[k]].total
                ) * 100
              )
            ).padEnd(3, ' ')}
          </span>
          <span
            style={{
              width: '3%',
              textAlign: 'center',
              maxWidth: '20px',
              minWidth: '10px',
              marginRight: '7px',
              'vertical-align': 'top',
              ...color
            }}
          >
            %
          </span>
        </div>
        <div className="lesson-content" style={{ width: '88%' }}>
          {lesson_topics[k].charAt(0).toUpperCase() + lesson_topics[k].slice(1)}
        </div>
      </h6>
    )
  }

  return (
    <div>
      <span className="space-between" style={{ overflow: 'hidden', width: '100%' }}>
        <Icon color="grey" name="ellipsis vertical" className="lesson-item-dots" />
        <h5
          className="story-item-title"
          style={{ marginBottom: '.5rem', width: '100%', ...getTextStyle(learningLanguage) }}
        >
          {`${lesson.name}`}
          {/* {`${intl.formatMessage({ id: 'topic-singular' })} ${lesson.topic_id}`} */}
          {/* <sup>
                        <b style={{color:'red'}}>&beta;</b>
                    </sup> */}
        </h5>
      </span>
      <span style={{ overflow: 'hidden', width: '100%' }}>{topic_rows}</span>
    </div>
  )
}

function calculateLowestScore(topics) {
  if (topics.length === 0) {
    return { score: 0, correct: 0, total: 0 }
  }

  const { score, correct, total } = topics.reduce((lowest, topic) => {
    const currentScore = topic.correct / topic.total;
    if (currentScore < lowest.score) {
      return { score: currentScore, correct: topic.correct, total: topic.total };
    }
    return lowest;
  }, { score: topics[0].correct / topics[0].total, correct: topics[0].correct, total: topics[0].total });

  return { score, correct, total };
}

const LessonListItem = ({ lesson, selected, toggleTopic, includeLesson, excludeLesson, disabled }) => {
  const { topics } = useSelector(({ lessons }) => lessons)
  const lowestScore = calculateLowestScore(topics.filter(topic => topic.lessons.includes(lesson.ID)))
  const correct_perc = get_lesson_performance(lowestScore.correct, lowestScore.total)
  let backgroundColor = '#ffffff'
  if (correct_perc >= 0.75) backgroundColor = '#32cd3233'
  return (
    <Card
      fluid
      key={lesson.ID}
      className="lesson-list-card"
      style={{ backgroundColor: backgroundColor }}
    >
      <Card.Content extra className="lesson-card-title-cont">
        <LessonTitle 
          lesson={lesson} 
          toggleTopic={toggleTopic}
          includeLesson={includeLesson}
          excludeLesson={excludeLesson}
        />
      </Card.Content>
      <Card.Content extra className="lesson-card-actions-cont">
        <div className="lesson-actions">
          <Button
            className="choose-topic"
            variant={selected ? 'primary' : 'outline-primary'}
            onClick={() => {
              if (selected) {
                excludeLesson(lesson.ID)
              } else {
                includeLesson(lesson.ID)
              }
            }}
            disabled={disabled}
            style={{
              cursor: !disabled
                ? 'pointer'
                : 'not-allowed'
            }}
          >
            {selected &&
              (<><Icon name="check" /><FormattedMessage id="included-in-lesson" /></>) ||
              <FormattedMessage id="include-into-lesson" />}
          </Button>
        </div>
      </Card.Content>
    </Card>
  )
}

export default LessonListItem
