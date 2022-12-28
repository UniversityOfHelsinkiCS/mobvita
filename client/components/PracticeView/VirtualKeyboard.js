import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import Keyboard from 'react-simple-keyboard'
import { Button } from 'react-bootstrap'
import { Icon } from 'semantic-ui-react'
import { setTouchedIds, setAnswers } from 'Utilities/redux/practiceReducer'
import { learningLanguageSelector } from 'Utilities/common'
import { keyboardLayouts, keyboardDisplay } from './KeyboardLayouts'

const VirtualKeyboard = () => {
  const learningLanguage = useSelector(learningLanguageSelector)
  const layoutsForLanguage = keyboardLayouts[learningLanguage]

  const [keyboard, setKeyboard] = useState(null)
  const [showKeyboard, setShowKeyboard] = useState(false)
  const [keyboardLayout, setKeyboardLayout] = useState(layoutsForLanguage[0].layout)
  const [layoutName, setLayoutName] = useState('default')
  const [modifiers, setModifiers] = useState({ shift: false, capslock: false, ctrlAlt: false })
  const [buttonTheme, setButtonTheme] = useState([])

  const { focusedWord, currentAnswers } = useSelector(({ practice }) => practice)

  const dispatch = useDispatch()

  useEffect(() => {
    if (!keyboard || !currentAnswers[focusedWord.ID]) return
    keyboard.setInput(currentAnswers[focusedWord.ID].users_answer)
  }, [focusedWord, keyboard, currentAnswers])

  const buildActiveModifersString = () =>
    Object.entries(modifiers)
      .reduce(
        (tempString, [modifier, modifierActive]) =>
          modifierActive ? `{${modifier}} ${tempString}` : tempString,
        ''
      )
      .trim()

  const setCorrectButtonTheme = () => {
    const tempTheme = [{ class: 'virtual-keyboard-ctrl-alt', buttons: '{ctrlAlt}' }]
    const anyModifiersIsActive = Object.values(modifiers).some(modifier => modifier)
    if (anyModifiersIsActive) {
      tempTheme.push({
        class: 'virtual-keyboard-active-key',
        buttons: buildActiveModifersString(),
      })
    }
    setButtonTheme(tempTheme)
  }

  const setCorrectLayout = () => {
    const { shift, capslock, ctrlAlt } = modifiers
    if (ctrlAlt && shift) setLayoutName('ctrlAltShift')
    else if (ctrlAlt) setLayoutName('ctrlAlt')
    else if (capslock && shift) setLayoutName('capsShift')
    else if (capslock) setLayoutName('caps')
    else if (shift) setLayoutName('shift')
    else setLayoutName('default')
  }

  useEffect(() => {
    setCorrectButtonTheme()
    setCorrectLayout()
  }, [modifiers])

  const handleKeyPress = key => {
    if (modifiers.shift) {
      setModifiers({ ...modifiers, shift: false })
    }

    const trimmedKey = key.slice(1, -1)
    if (Object.keys(modifiers).includes(trimmedKey)) {
      setModifiers({
        ...modifiers,
        [trimmedKey]: !modifiers[trimmedKey],
      })
    }
  }

  const handleAnswerChange = (value, word = focusedWord) => {
    const { surface, id, ID, concept, sentence_id, snippet_id } = word
    const word_cue = currentAnswers[`${ID}-${candidateId}`]?.cue

    dispatch(setTouchedIds(ID))

    const newAnswer = {
      [`${ID}-${id}`]: {
        correct: surface,
        users_answer: value,
        cue: word_cue,
        id,
        word_id: ID,
        concept,
        sentence_id,
        snippet_id,
        hintsRequested: currentAnswers[`${ID}-${id}`]?.hintsRequested,
        requestedHintsList: currentAnswers[`${ID}-${id}`]?.requestedHintsList,
        penalties: currentAnswers[`${ID}-${id}`]?.penalties,
      },
    }

    dispatch(setAnswers(newAnswer))
  }

  return (
    <>
      <Icon
        data-cy="onscreen-keyboard"
        style={{ color: '#004085',cursor: 'pointer',marginTop: '0.2em'}}
        name="keyboard"
        size = 'huge'
        onClick={() => setShowKeyboard(!showKeyboard)}
      />
      {showKeyboard && (
        <>
          {layoutsForLanguage.length > 1 &&
            layoutsForLanguage.map(layout => (
              <Button key={layout.name} onClick={() => setKeyboardLayout(layout.layout)}>
                {layout.name}
              </Button>
            ))}
          <Keyboard
            keyboardRef={k => setKeyboard(k)}
            layout={keyboardLayout}
            layoutName={layoutName}
            inputName={focusedWord.ID}
            onChange={handleAnswerChange}
            onKeyPress={handleKeyPress}
            display={keyboardDisplay}
            buttonTheme={buttonTheme}
          />
        </>
      )}
    </>
  )
}

export default VirtualKeyboard
