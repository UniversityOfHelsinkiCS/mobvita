/* eslint-disable no-nested-ternary */
import React from 'react'
import { FormattedMessage } from 'react-intl'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import CloseIcon from '@mui/icons-material/Close'

const ChangePracticeOrderArrows = ({ index, pracLength, swapPracticeOrder }) => {
  // console.log(index, ' and  ', pracLength - 1)
  return index === 0 ? (
    <KeyboardArrowDownIcon
      style={{
        cursor: 'pointer',
        marginBottom: '.25em',
        color: 'black',
      }}
      fontSize="large"
      data-cy={`lesson-practice-move-down-${index}`}
      onClick={() => swapPracticeOrder(index, index + 1)}
    />
  ) : index < pracLength - 1 ? (
    <>
      <KeyboardArrowUpIcon
        style={{
          cursor: 'pointer',
          marginBottom: '.25em',
          color: 'black',
        }}
        fontSize="large"
        data-cy={`lesson-practice-move-up-${index}`}
        onClick={() => swapPracticeOrder(index, index - 1)}
      />
      <KeyboardArrowDownIcon
        style={{
          cursor: 'pointer',
          marginBottom: '.25em',
          color: 'black',
        }}
        fontSize="large"
        data-cy={`lesson-practice-move-down-${index}`}
        onClick={() => swapPracticeOrder(index, index + 1)}
      />
    </>
  ) : (
    <KeyboardArrowUpIcon
      style={{
        cursor: 'pointer',
        marginBottom: '.25em',
        color: 'black',
      }}
      fontSize="large"
      data-cy={`lesson-practice-move-up-${index}`}
      onClick={() => swapPracticeOrder(index, index - 1)}
    />
  )
}
const LessonPracticeList = ({ lessonsPractices, removePractice, swapPracticeOrder }) => {
  return (
    <div style={{ marginBottom: '.5rem' }}>
      {lessonsPractices.length < 1 && <FormattedMessage id="no-practices-yet" />}
      {lessonsPractices.map((practice, index) => (
        <div key={`${practice}-${index}`} className="flex space-between" style={{ marginTop: '.5rem' }}>
          <div className="flex">
            <b style={{ marginRight: '1rem' }}>{index + 1}.</b>
            <FormattedMessage id={practice} />
          </div>
          <div>
            {lessonsPractices.length > 1 && (
              <ChangePracticeOrderArrows
                index={index}
                pracLength={lessonsPractices.length}
                swapPracticeOrder={swapPracticeOrder}
              />
            )}
            <CloseIcon
              style={{
                cursor: 'pointer',
                marginBottom: '.25em',
                color: 'red',
              }}
              fontSize="large"
              data-cy={`lesson-practice-remove-${index}`}
              onClick={() => removePractice(index)}
            />
          </div>
        </div>
      ))}
    </div>
  )
}
export default LessonPracticeList
