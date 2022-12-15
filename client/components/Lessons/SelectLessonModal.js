import React, { useState, useEffect } from 'react'
import { Button } from 'react-bootstrap'
import { useHistory } from 'react-router'
import { FormattedMessage } from 'react-intl'
import { useDispatch, useSelector } from 'react-redux'
import { Divider, Modal, Dropdown } from 'semantic-ui-react'

import { useLearningLanguage } from 'Utilities/common'
import { getMetadata } from 'Utilities/redux/metadataReducer'
import { clearExerciseState } from 'Utilities/redux/lessonExercisesReducer'
import { getLessonActiveInstance, setLessonInstance } from 'Utilities/redux/lessonInstanceReducer'


const SelectLessonModal = ({ open, setOpen, lesson_syllabus_id }) => {
  const dispatch = useDispatch()
  const learningLanguage = useLearningLanguage()

  const { metadata_pending, lesson_semantics  } = useSelector(({ metadata }) => metadata)
  const { pending, lesson_instance  } = useSelector(({ lessonInstance }) => lessonInstance)

  const [lessonSemanticTopic, setlessonSemanticTopic] = useState('All')
  const [semanticOptions, setSemanticOptions] = useState([])
  
  useEffect(() => {
    dispatch(clearExerciseState())
    if (!lesson_semantics) {
      dispatch(getMetadata(learningLanguage))
    }
  }, [])

  useEffect(() => {
    if (lesson_syllabus_id){
      dispatch(getLessonActiveInstance(lesson_syllabus_id))
    }
  }, [lesson_syllabus_id])

  useEffect(() => {
    if (!metadata_pending && lesson_semantics) {
      let semantic_topic_options = []
      lesson_semantics.forEach(topic => {
        semantic_topic_options.push({
          key: topic,
          text: <FormattedMessage id={topic} />,
          value: topic,
        })
      }); 
      setSemanticOptions(semantic_topic_options)
    }
  }, [lesson_semantics])

  useEffect(() => {
    setlessonSemanticTopic(lesson_instance && lesson_instance?.semantic ? lesson_instance.semantic : 'All')
  }, [lesson_instance])

  const handleSaveLessonInstance = () => {
    if (lesson_instance) {
      lesson_instance['semantic'] = lessonSemanticTopic
      console.log('lesson_instance', lesson_instance)
      dispatch(setLessonInstance(lesson_instance?.lesson_id, lesson_instance))
      setOpen(false)
    }
  }

  if (!pending && lesson_instance) {
    return (
      <Modal
        dimmer="inverted"
        open={open}
        onClose={() => setOpen(false)}
        closeIcon={{ style: { top: '1rem', right: '2.5rem' }, color: 'black', name: 'close' }}
      >
        <Modal.Header>
          <div>
            <FormattedMessage id="lesson-setup" />
          </div>
        </Modal.Header>
        <Modal.Content>

          <div style={{ marginBottom: '1rem', fontSize: '1.2rem' }}>
            <FormattedMessage id="select-lesson-semantic-topic" />
          </div>
          <div className="row-flex">
            <Dropdown
              style={{ width: '220px' }}
              text={<FormattedMessage id={lessonSemanticTopic} />}
              selection
              fluid
              options={semanticOptions}
              onChange={(_, { value }) => setlessonSemanticTopic(value)}
            />
          </div>
          <Divider />

          <div style={{ marginBottom: '1rem', fontSize: '1.2rem' }}>
            <FormattedMessage id="lesson-activities" />
          </div>
          {lesson_instance?.activities?.map((activity, index) => (
            <div>{`${index + 1}. ${activity.activity}`}</div>
          ))}

          {/* <LessonPracticeList
            lessonsPractices={lessonSemanticTopics}
            removePractice={() => { }}
            swapPracticeOrder={() => { }}
          /> */}
          <Divider />

          <div style={{ margin: '.5rem' }}>
            <Button variant="primary" onClick={() => handleSaveLessonInstance()}>
              <FormattedMessage id="save-lesson" />
            </Button>
          </div>

          {/* <Link to={`/lessons/test`}> */}
          {/* <Button variant="primary" disabled={lessonSemanticTopics.length < 1}>
            <FormattedMessage id="create-lesson-btn" />
          </Button> */}
          {/* </Link> */}

          {/* {lessonId && (
            <>
              <Divider />
              <Button
                variant="primary"
                onClick={() => history.push(`/lesson/${lessons[0].lesson_id}/practice`)}
              >
                TEST EXERCISE
              </Button>
            </>
          )} */}
        </Modal.Content>
      </Modal>
    )
  } else {
    return (
      null
    )
  }
}

export default SelectLessonModal
