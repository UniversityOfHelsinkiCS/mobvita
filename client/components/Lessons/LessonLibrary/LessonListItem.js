import React, { useState } from 'react'
import { useHistory } from 'react-router'
import { useDispatch, useSelector } from 'react-redux'
import { Card, Dropdown, Button as SemanticButton, Icon, Popup } from 'semantic-ui-react'
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

const LessonTitle = ({ lesson }) => {
  const intl = useIntl()
  const learningLanguage = useSelector(learningLanguageSelector)
  const topic_rows = []
  const topic_concepts = lesson.topic.split(';')
  for (let k = 0; k < topic_concepts.length; k++) {
    if (k === 0) {
      const color = {color: get_lesson_performance_style(lesson.correct, lesson.total)}
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
                width: '6%',
                textAlign: 'right',
                marginRight: '5px',
                maxWidth: '25px',
                minWidth: '25px',
                ...color
              }}
            >
              {String(
                Math.round(get_lesson_performance(lesson.correct, lesson.total) * 100)
              ).padEnd(3, ' ')}
            </span>
            <span
              style={{
                width: '3%',
                textAlign: 'center',
                maxWidth: '20px',
                minWidth: '10px',
                marginRight: '7px',
                ...color
              }}
            >
              %
            </span>
          </div>
          <div className="lesson-content" style={{ width: '88%' }}>
            {topic_concepts[k].charAt(0).toUpperCase() + topic_concepts[k].slice(1)}
          </div>
        </h6>
      )
    } else {
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
          <div
            style={{
              width: '6%',
              textAlign: 'right',
              marginRight: '5px',
              maxWidth: '25px',
              minWidth: '25px',
            }}
          />
          <div
            style={{
              width: '3%',
              textAlign: 'center',
              maxWidth: '20px',
              minWidth: '10px',
              marginRight: '7px',
            }}
          />
          <div style={{ width: '88%' }}>
            {topic_concepts[k].charAt(0).toUpperCase() + topic_concepts[k].slice(1)}
          </div>
        </h6>
      )
    }
    
  }

  return (
    <div>
      <span className="space-between" style={{ overflow: 'hidden', width: '100%' }}>
        <Icon color="grey" name="ellipsis vertical" className="lesson-item-dots" />
        <h5
          className="story-item-title"
          style={{ marginBottom: '.5rem', width: '100%', ...getTextStyle(learningLanguage) }}
        >
          {`${intl.formatMessage({ id: 'topic-singular' })} ${lesson.topic_id}`}
          {/* <sup>
                        <b style={{color:'red'}}>&beta;</b>
                    </sup> */}
        </h5>
      </span>
      <span style={{ overflow: 'hidden', width: '100%' }}>{topic_rows}</span>
    </div>
  )
}

const LessonListItem = ({ topic: lesson, selected, toggleTopic, includeLesson, exludeLesson, disabled }) => {
  const correct_perc = 0.5// get_lesson_performance(topic.correct, topic.total)
  let backgroundColor = '#ffffff'
  if (correct_perc >= 0.75) backgroundColor = '#32cd3233'
  console.log('LessonListItem topic', lesson)
  return (
    <Card 
      fluid 
      key={lesson.ID} 
      className="lesson-list-card" 
      style={{backgroundColor: backgroundColor}}
    >
      <Card.Content extra className="lesson-card-title-cont">
        <LessonTitle lesson={lesson} />
      </Card.Content>
      <Card.Content extra className="lesson-card-actions-cont">
        <div className="lesson-actions">
          <Button 
            className="choose-topic" 
            variant={selected ? 'primary' : 'outline-primary'}
            onClick={()=> toggleTopic(lesson.ID)}
            disabled={disabled}
            style={{cursor: !disabled
              ? 'pointer'
              : 'not-allowed'}}
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
