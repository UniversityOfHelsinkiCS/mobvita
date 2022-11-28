import React, { useState, useEffect } from 'react'
import { FormattedMessage } from 'react-intl'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router'
import { getLessons } from 'Utilities/redux/lessonsReducer'
import { Divider, Modal } from 'semantic-ui-react'
import { Button } from 'react-bootstrap'
import { hiddenFeatures } from 'Utilities/common'
import AddLessonPractice from './AddLessonPractice'
import LessonPracticeList from './LessonPracticeList'

const SelectLessonModal = ({ open, setOpen }) => {
  const history = useHistory()
  const dispatch = useDispatch()
  const { lessons } = useSelector(({ lessons }) => lessons)
  const [lessonPractices, setLessonPractices] = useState([])
  const lessonId = lessons[0]?.lesson_id
  useEffect(() => {
    dispatch(getLessons())
  }, [])

  const removePractice = index => {
    setLessonPractices(lessonPractices.filter((practice, pracIndex) => pracIndex !== index))
  }

  const addPractice = practice => {
    setLessonPractices(lessonPractices.concat(practice))
  }
  // console.log(' lessons ', lessons)

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
        {/* <Link to={`/lessons/test`}> */}
          <Button variant="primary" disabled={lessonPractices.length < 1}>
            <FormattedMessage id="create-lesson-btn" />
          </Button>
        {/* </Link> */}
        {hiddenFeatures && lessonId && (
          <>
            <Divider />
            <Button
              variant="primary"
              onClick={() => history.push(`/lesson/${lessons[0].lesson_id}/practice`)}
            >
              TEST EXERCISE
            </Button>
          </>
        )}
      </Modal.Content>
    </Modal>
  )
}

export default SelectLessonModal
