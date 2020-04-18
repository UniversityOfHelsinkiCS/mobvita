import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import Keyboard from 'react-simple-keyboard'
import { Button } from 'react-bootstrap'
import { Icon } from 'semantic-ui-react'
import { setTouchedIds, setAnswers } from 'Utilities/redux/practiceReducer'
import { RUSphonetic, RUSauthentic } from './KeyboardLayouts'

const RussianKeyboard = () => {
  const [keyboard, setKeyboard] = useState(null)
  const [showKeyboard, setShowKeyboard] = useState(false)
  const [keyboardLayout, setKeyboardLayout] = useState(RUSauthentic)
  const [layoutName, setLayoutName] = useState('default')
  const [shift, setShift] = useState(false)

  const { focusedWord, currentAnswers } = useSelector(({ practice }) => practice)

  const dispatch = useDispatch()

  useEffect(() => {
    if (!keyboard || !currentAnswers[focusedWord.ID]) return
    keyboard.setInput(currentAnswers[focusedWord.ID].users_answer)
  }, [focusedWord, keyboard, currentAnswers])

  const handleKeyPress = (key) => {
    const layout = layoutName === 'default' ? 'shift' : 'default'

    if (key === '{capslock}') {
      setLayoutName(layout)
    } else if (key === '{shift}') {
      setShift(true)
      setLayoutName(layout)
    } else if (shift) {
      setShift(false)
      setLayoutName(layout)
    }
  }

  const handleAnswerChange = (value, word = focusedWord) => {
    const { surface, id, ID, concept } = word

    dispatch(setTouchedIds(ID))

    const newAnswer = {
      [ID]: {
        correct: surface,
        users_answer: value,
        id,
        concept,
      },
    }
    dispatch(setAnswers(newAnswer))
  }

  return (
    <>
      <Icon
        data-cy="onscreen-keyboard"
        style={{ cursor: 'pointer' }}
        name="keyboard"
        size="big"
        onClick={() => setShowKeyboard(!showKeyboard)}
      />
      {showKeyboard && (
        <>
          <Button onClick={() => setKeyboardLayout(RUSauthentic)}>ru-йцуке</Button>
          <Button onClick={() => setKeyboardLayout(RUSphonetic)}>ru-яверт</Button>
          <Keyboard
            keyboardRef={k => setKeyboard(k)}
            layout={keyboardLayout}
            layoutName={layoutName}
            inputName={focusedWord.ID}
            onChange={handleAnswerChange}
            onKeyPress={handleKeyPress}
          />
        </>
      )}
    </>
  )
}

export default RussianKeyboard
