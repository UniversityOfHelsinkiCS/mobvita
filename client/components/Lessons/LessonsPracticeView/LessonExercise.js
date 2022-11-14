import React, { useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setFocusedSentence } from 'Utilities/redux/lessonSentencesReducer'
import { getTextStyle, learningLanguageSelector } from 'Utilities/common'
import PracticeText from 'Components/PracticeView/CurrentSnippet/PracticeText'
import { Divider } from 'semantic-ui-react'
import LessonExerciseActions from './LessonExerciseActions'

const LessonExercise = ({ handleInputChange }) => {
  const dispatch = useDispatch()
  const learningLanguage = useSelector(learningLanguageSelector)
  const practiceForm = useRef(null)
  const lessonSentences = useSelector(({ lessonSentences }) => lessonSentences)
  const { focused } = useSelector(({ lessons }) => lessons)
  const { focused: focusedSnippet } = useSelector(({ lessonSentences }) => lessonSentences)

  useEffect(() => {
    dispatch(setFocusedSentence(focused[0]))
  }, [])

  const handleMultiselectChange = () => {
    console.log('hiio hoi')
  }

  console.log('focused ', lessonSentences)

  if (!focusedSnippet) {
    return null
  }

  return (
    <div>
      <form ref={practiceForm}>
        <div style={{ width: '100%' }}>
          <div
            className="practice-container"
            style={getTextStyle(learningLanguage)}
            data-cy="practice-view"
          >
            <PracticeText
              handleAnswerChange={handleInputChange}
              handleMultiselectChange={handleMultiselectChange}
            />
            <Divider />
            <LessonExerciseActions />
          </div>
        </div>
      </form>
    </div>
  )
}

export default LessonExercise