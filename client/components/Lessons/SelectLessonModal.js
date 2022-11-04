import React, { useState } from 'react'
import { FormattedMessage } from 'react-intl'
import { Divider, Modal } from 'semantic-ui-react'
import { Button } from 'react-bootstrap'
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

  const swapPracticeOrder = (a, b) => {
    const copy = [...lessonPractices]
    copy[a] = lessonPractices[b]
    copy[b] = lessonPractices[a]

    setLessonPractices(copy)
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
        <div style={{ marginBottom: '1rem', fontSize: '1.2rem' }}>
          <FormattedMessage id="select-lesson-story" />
        </div>
        <Divider />
        <AddLessonPractice addPractice={addPractice} />
        <Divider />
        <LessonPracticeList
          lessonsPractices={lessonPractices}
          removePractice={removePractice}
          swapPracticeOrder={swapPracticeOrder}
        />
        <Divider />
        <Button variant="primary" disabled={lessonPractices.length < 1}>
          <FormattedMessage id="create-lesson-btn" />
        </Button>
      </Modal.Content>
    </Modal>
  )
}

export default SelectLessonModal
