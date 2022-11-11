import React, { useState } from 'react'
import { Button } from 'react-bootstrap'
import { FormattedMessage } from 'react-intl'
import { Dropdown } from 'semantic-ui-react'

const AddLessonPractice = ({ addPractice }) => {
  const [practiceToAdd, setPracticeToAdd] = useState('lesson-grammar-practice')

  const practiceOptions = [
    {
      key: '0',
      text: <FormattedMessage id="lesson-grammar-practice" />,
      value: 'lesson-grammar-practice',
    },
    {
      key: '1',
      text: <FormattedMessage id="lesson-listening-practice" />,
      value: 'lesson-listening-practice',
    },
    {
      key: '2',
      text: <FormattedMessage id="lesson-crossword" />,
      value: 'lesson-crossword',
    },
    {
      key: '3',
      text: <FormattedMessage id="lesson-competition" />,
      value: 'lesson-competition',
    },
  ]

  return (
    <div className="row-flex">
      <Dropdown
        style={{ width: '220px' }}
        text={<FormattedMessage id={practiceToAdd} />}
        selection
        fluid
        options={practiceOptions}
        onChange={(_, { value }) => setPracticeToAdd(value)}
      />
      <div style={{ margin: '.5rem' }}>
        <Button variant="primary" onClick={() => addPractice(practiceToAdd)}>
          <FormattedMessage id="add-lesson-practice-btn" />
        </Button>
      </div>
    </div>
  )
}

export default AddLessonPractice