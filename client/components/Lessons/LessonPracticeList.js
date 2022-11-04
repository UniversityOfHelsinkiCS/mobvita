/* eslint-disable no-nested-ternary */
import React from 'react'
import { FormattedMessage } from 'react-intl'
import { Icon } from 'semantic-ui-react'

const ChangePracticeOrderArrows = ({ index, pracLength }) => {
  // console.log(index, ' and  ', pracLength - 1)
  return index === 0 ? (
    <Icon
      style={{
        cursor: 'pointer',
        marginBottom: '.25em',
        color: 'black',
      }}
      size="large"
      name="angle down"
    />
  ) : index < pracLength - 1 ? (
    <>
      <Icon
        style={{
          cursor: 'pointer',
          marginBottom: '.25em',
          color: 'black',
        }}
        size="large"
        name="angle up"
      />
      <Icon
        style={{
          cursor: 'pointer',
          marginBottom: '.25em',
          color: 'black',
        }}
        size="large"
        name="angle down"
      />
    </>
  ) : (
    <Icon
      style={{
        cursor: 'pointer',
        marginBottom: '.25em',
        color: 'black',
      }}
      size="large"
      name="angle up"
    />
  )
}

const LessonPracticeList = ({ lessonsPractices, removePractice }) => {
  return (
    <div style={{ marginBottom: '.5rem' }}>
      {lessonsPractices.length < 1 && <FormattedMessage id="no-practices-yet" />}
      {lessonsPractices.map((practice, index) => (
        <div className="flex space-between" style={{ marginTop: '.5rem' }}>
          <div className="flex">
            <b style={{ marginRight: '1rem' }}>{index + 1}.</b>
            <FormattedMessage id={practice} />
          </div>
          <div>
            {lessonsPractices.length > 1 && (
              <ChangePracticeOrderArrows index={index} pracLength={lessonsPractices.length} />
            )}
            <Icon
              style={{
                cursor: 'pointer',
                marginBottom: '.25em',
                color: 'red',
              }}
              size="large"
              name="close"
              onClick={() => removePractice(index)}
            />
          </div>
        </div>
      ))}
    </div>
  )
}
export default LessonPracticeList
