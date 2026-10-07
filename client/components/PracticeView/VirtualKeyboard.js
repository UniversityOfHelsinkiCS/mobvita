import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import Keyboard from 'react-simple-keyboard'
import AppButton from 'Components/AppButton'
import KeyboardIcon from '@mui/icons-material/Keyboard'
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

  // Always a string: react-simple-keyboard reads this bucket as `inputName || 'default'` in
  // setInput/getInput but as `inputName === undefined ? 'default' : inputName` when a key is
  // pressed, so a numeric 0 (the first token of a snippet) would read and write two buckets.
  const inputName = focusedWord?.ID === undefined ? undefined : `${focusedWord.ID}`

  useEffect(() => {
    const { id, ID } = focusedWord
    if (!keyboard || !currentAnswers[`${ID}-${id}`]) return
    keyboard.setInput(currentAnswers[`${ID}-${id}`].users_answer, inputName)
  }, [focusedWord, keyboard, currentAnswers])

  // The on-screen input is the only honest source of truth when a key is pressed, so re-read
  // the text and the selection off it first. Two things otherwise desync and the edit lands at
  // the wrong offset: ExerciseCloze commits to redux on focus/blur only, so physical typing
  // never reaches `currentAnswers` and the keyboard's copy of the text stays behind; and the
  // keyboard tracks the caret from document keyup/mouseup, which a redux-driven re-render does
  // not fire. `beforeInputUpdate` runs before the key is applied, so this lands in time.
  const syncFromLiveInput = instance => {
    if (inputName === undefined) return

    const active = document.activeElement
    const element =
      active?.tagName === 'INPUT' && active.name === inputName
        ? active
        : document.querySelector(`input[name="${inputName}"]`)
    if (!element) return

    instance.setInput(element.value, inputName)
    instance.setCaretPosition(element.selectionStart, element.selectionEnd)
  }

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

  // react-simple-keyboard calls onChange(input, mouseEvent), so a second argument is always
  // there and is never a word: the exercise being typed into can only come from redux.
  const handleAnswerChange = value => {
    const { surface, id, ID, concept, sentence_id, snippet_id } = focusedWord
    // No exercise focused yet, so the keystroke has nothing to be stored against. Writing it
    // anyway put the answer under `undefined-undefined` and posted it as a junk entry.
    if (!id || ID === undefined) return

    const answerKey = `${ID}-${id}`

    dispatch(setTouchedIds(ID))

    const newAnswer = {
      // Only the typed text changes; the rest of the answer is kept as the view's own handler
      // left it, so fields it sets and this one does not (story_id) survive a virtual keystroke.
      [answerKey]: {
        correct: surface,
        id,
        word_id: ID,
        concept,
        sentence_id,
        snippet_id,
        ...currentAnswers[answerKey],
        users_answer: value,
      },
    }

    dispatch(setAnswers(newAnswer))
  }

  return (
    <>
      <KeyboardIcon
        data-cy="onscreen-keyboard"
        onClick={() => setShowKeyboard(!showKeyboard)}
        sx={{ color: '#004085', cursor: 'pointer', mt: '0.2em', fontSize: '3rem' }}
      />
      {showKeyboard && (
        <>
          {layoutsForLanguage.length > 1 &&
            layoutsForLanguage.map(layout => (
              <AppButton key={layout.name} onClick={() => setKeyboardLayout(layout.layout)}>
                {layout.name}
              </AppButton>
            ))}
          <Keyboard
            keyboardRef={k => setKeyboard(k)}
            layout={keyboardLayout}
            layoutName={layoutName}
            inputName={inputName}
            beforeInputUpdate={syncFromLiveInput}
            preventMouseDownDefault
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
