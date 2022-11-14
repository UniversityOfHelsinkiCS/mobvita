import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getExerciseLesson } from 'Utilities/redux/lessonsReducer'
import { Segment } from 'semantic-ui-react'
import { useParams } from 'react-router'
import useWindowDimensions from 'Utilities/windowDimensions'
import ProgressBar from 'Components/PracticeView/CurrentSnippet/ProgressBar'
import CurrentSnippet from './CurrentSnippet'

const LessonsPracticeView = () => {
  const dispatch = useDispatch()
  const lessons = useSelector(({ lessons }) => lessons)
  const { focused } = lessons
  const { id } = useParams()
  const { width } = useWindowDimensions()
  const smallScreen = width < 700

  useEffect(() => {
    dispatch(getExerciseLesson(id))
  }, [])

  if (!focused) {
    return null
  }

  const handleAnswerChange = () => {
    console.log('hooi')
  }

  console.log('foc ', focused)
 
  return (
    <div className="cont-tall pt-sm flex-col space-between">
      <div className="justify-center">
        <div className="cont">
          <Segment>
            <div className="progress-bar-cont" style={{ top: smallScreen ? '.25em' : '3.25em' }}>
              {/*<ProgressBar
              
  />*/}
            </div>
            <CurrentSnippet handleInputChange={handleAnswerChange} />
          </Segment>
        </div>
      </div>
    </div>
  )
}

export default LessonsPracticeView

