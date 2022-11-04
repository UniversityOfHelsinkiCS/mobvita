import React, { useState } from 'react'
import { FormattedMessage } from 'react-intl'
import { Divider, Modal } from 'semantic-ui-react'
import AddLessonPractice from './AddLessonPractice'
import LessonPracticeList from './LessonPracticeList'

const SelectLessonModal = ({ open, setOpen }) => {
  const [lessonPractices, setLessonPractices] = useState([])

  const removePractice = index => {
    setLessonPractices(lessonPractices.filter((practice, pracIndex) => pracIndex !== index))
  }

  const addPractice = practice => {
    setLessonPractices(lessonPractices.concat(practice))
  }

  return (
    <Modal
      dimmer="inverted"
      open={open}
      onClose={() => setOpen(false)}
      closeIcon={{ style: { top: '1rem', right: '2.5rem' }, color: 'black', name: 'close' }}
    >
      <Modal.Header>
        <div>
          <FormattedMessage id="lesson-modal-header" />
        </div>
      </Modal.Header>
      <Modal.Content>
        <div>
          <FormattedMessage id="select-lesson-story" />
        </div>
        <AddLessonPractice addPractice={addPractice} />
        <Divider />
        <LessonPracticeList lessonsPractices={lessonPractices} removePractice={removePractice} />
      </Modal.Content>
    </Modal>
  )
}

export default SelectLessonModal
