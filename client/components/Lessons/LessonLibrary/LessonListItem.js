import React, { useState } from 'react'
import { useHistory } from 'react-router'
import { useDispatch, useSelector } from 'react-redux'
import { Card, Dropdown, Button as SemanticButton, Icon, Popup, Checkbox } from 'semantic-ui-react'
import { Button } from 'react-bootstrap'

import { useIntl, FormattedMessage } from 'react-intl'
import { getTextStyle, learningLanguageSelector } from 'Utilities/common'

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

const LessonTitle = ({ lesson, selected, disabled, toggleTopic, includeLesson, excludeLesson }) => {
  const { width } = useWindowDimensions()
  const bigScreen = width >= 700
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
    const correct = topic2info[lesson_topics[k]] != undefined ? topic2info[lesson_topics[k]].correct : 0
    const total = topic2info[lesson_topics[k]] != undefined ? topic2info[lesson_topics[k]].total : 0
    const color = {color: get_lesson_performance_style(correct, total)}
    const name = topic2info[lesson_topics[k]].topic.charAt(0).toUpperCase() + topic2info[lesson_topics[k]].topic.slice(1)
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
        <div className="lesson-performance" 
          style={{
            minWidth: '90px',
            maxWidth: '95px',
          }}
        >
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
              checked={lesson_instance != undefined && lesson_instance?.topic_ids != undefined && lesson_instance?.topic_ids?.includes(lesson_topics[k])}
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
              verticalAlign: 'top',
              ...color
            }}
          >
            {String(
              Math.round(
                get_lesson_performance(correct, total) * 100
              )
            ).padEnd(3, ' ')}
          </span>
          <span
            style={{
              width: '3%',
              textAlign: 'center',
              maxWidth: '20px',
              minWidth: '18px',
              verticalAlign: 'top',
              ...color
            }}
          >
            %
          </span>
          <span
            title={intl.formatMessage({ id: 'lesson-performance-info-tooltip' })}
            style={{
              cursor: 'pointer',
              display: 'inline-block',
              marginLeft: '5px',
              marginRight: '7px',
              verticalAlign: 'top',
            }}
          >
            <Icon name="info circle" />
          </span>
        </div>
        <div 
          className="lesson-content"
          style={{ width: '80%' }} 
          dangerouslySetInnerHTML={{ __html: name }}
        />
      </h6>
    )
  }

  return (
    bigScreen ? (
      <div>
        <span className="space-between" style={{ overflow: 'hidden', width: '100%' }}>
          <Icon color="grey" name="ellipsis vertical" className="lesson-item-dots" />
          <div style={{ marginBottom: '.5rem', marginRight: 'auto' }}>
            <h5
              className="story-item-title"
              style={{ marginBottom: '.5rem', ...getTextStyle(learningLanguage) }}
            >
              {`${lesson.name.split('—')[0].trim()}`}
              {/* {`${intl.formatMessage({ id: 'topic-singular' })} ${lesson.topic_id}`} */}
            </h5>
          </div>
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
        </span>
        <span style={{ overflow: 'hidden', width: '100%' }}>{topic_rows}</span>
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
                marginBottom: '.5rem', ...getTextStyle(learningLanguage) 
              }}
            >
              <Icon color="grey" name="ellipsis vertical" className="lesson-item-dots" />
              {`${lesson.name.split('—')[0].trim()}`}
              {/* {`${intl.formatMessage({ id: 'topic-singular' })} ${lesson.topic_id}`} */}
            </h5>
          </div>
          
        </span>
        <span style={{ overflow: 'hidden', width: '100%' }}>{topic_rows}</span>
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
                width: '100%',
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
      </div>
    )
  )
}

const LessonListItem = ({ lesson, selected, toggleTopic, includeLesson, excludeLesson, disabled }) => {
  const correct_perc = get_lesson_performance(lesson.correct, lesson.total)
  let backgroundColor = '#ffffff'
  if (correct_perc >= 0.80) backgroundColor = '#E2FFE1'
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
          selected={selected}
          disabled={disabled}
          toggleTopic={toggleTopic}
          includeLesson={includeLesson}
          excludeLesson={excludeLesson}
        />
      </Card.Content>
    </Card>
  )
}

export default LessonListItem
