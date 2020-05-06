import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import Keyboard from 'react-simple-keyboard'
import { Button } from 'react-bootstrap'
import { Icon } from 'semantic-ui-react'
import { setTouchedIds, setAnswers } from 'Utilities/redux/practiceReducer'
import { learningLanguageSelector } from 'Utilities/common'
import { keyboardLayouts } from './KeyboardLayouts'

const VirtualKeyboard = () => {
  const learningLanguage = useSelector(learningLanguageSelector)
  const layoutsForLanguage = keyboardLayouts[learningLanguage]

  const [keyboard, setKeyboard] = useState(null)
  const [showKeyboard, setShowKeyboard] = useState(false)
  const [keyboardLayout, setKeyboardLayout] = useState(layoutsForLanguage[0].layout)
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
          {layoutsForLanguage.length > 1
            && layoutsForLanguage.map(layout => (
              <Button key={layout.name} onClick={() => setKeyboardLayout(layout.layout)}>
                {layout.name}
              </Button>
            ))
          }
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

export default VirtualKeyboard
