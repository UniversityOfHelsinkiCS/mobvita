import React, { useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Box, TextField } from '@mui/material'

import {
  checkWritingCorrection,
  getWritingCorrectionKey,
} from 'Utilities/redux/writingCorrectionReducer'
import CorrectionSuggestionPopper from './CorrectionSuggestionPopper'

const sentenceMatchRegex = /[^.!?]+[.!?]+/g
const WRITING_LANGUAGE = 'Finnish'
const textareaMirrorProperties = [
  'borderBottomWidth',
  'borderLeftWidth',
  'borderRightWidth',
  'borderTopWidth',
  'boxSizing',
  'fontFamily',
  'fontSize',
  'fontStyle',
  'fontWeight',
  'letterSpacing',
  'lineHeight',
  'paddingBottom',
  'paddingLeft',
  'paddingRight',
  'paddingTop',
  'textTransform',
  'width',
  'wordSpacing',
]

const getCompletedSentenceMatches = text => Array.from(text.matchAll(sentenceMatchRegex))

const getCompletedSentences = text => {
  const matches = getCompletedSentenceMatches(text)

  return matches.map((match, index) => ({
    text: match[0].trim(),
    startIndex: match.index,
    endIndex: match.index + match[0].length,
    context: matches
      .slice(Math.max(index - 3, 0), index)
      .map(contextMatch => contextMatch[0].trim())
      .join(' '),
  }))
}

const getLatestCompletedSentence = text => {
  const sentences = getCompletedSentences(text)
  return sentences[sentences.length - 1] || null
}

const cursorIsInsideSentence = (sentence, cursorIndex) => (
  cursorIndex >= sentence.startIndex && cursorIndex <= sentence.endIndex
)

const getCompletedSentenceAtIndex = (text, cursorIndex) => (
  getCompletedSentences(text).find(sentence => cursorIsInsideSentence(sentence, cursorIndex)) || null
)

const getCompletedSentenceNearIndex = (text, cursorIndex) => (
  getCompletedSentenceAtIndex(text, cursorIndex) ||
  getCompletedSentenceAtIndex(text, Math.max(cursorIndex - 1, 0))
)

const getUpdatedPendingSentence = (text, pendingSentence) => {
  if (!pendingSentence) return null

  return getCompletedSentenceAtIndex(text, pendingSentence.startIndex) ||
    getCompletedSentenceAtIndex(text, Math.max(pendingSentence.endIndex - 1, 0))
}

const getTextareaIndexRect = (textarea, textIndex) => {
  const computedStyle = window.getComputedStyle(textarea)
  const mirror = document.createElement('div')
  const marker = document.createElement('span')

  textareaMirrorProperties.forEach(property => {
    mirror.style[property] = computedStyle[property]
  })

  mirror.style.left = '-9999px'
  mirror.style.overflow = 'hidden'
  mirror.style.position = 'absolute'
  mirror.style.top = '0'
  mirror.style.visibility = 'hidden'
  mirror.style.whiteSpace = 'pre-wrap'
  mirror.style.overflowWrap = 'break-word'

  mirror.textContent = textarea.value.slice(0, textIndex)
  marker.textContent = '\u200b'
  mirror.appendChild(marker)
  document.body.appendChild(mirror)

  const textareaRect = textarea.getBoundingClientRect()
  const lineHeight = Number.parseFloat(computedStyle.lineHeight) ||
    Number.parseFloat(computedStyle.fontSize) ||
    16
  const rect = new DOMRect(
    textareaRect.left + marker.offsetLeft - textarea.scrollLeft,
    textareaRect.top + marker.offsetTop + lineHeight - textarea.scrollTop,
    0,
    0,
  )

  document.body.removeChild(mirror)
  return rect
}

const EssayTextInput = () => {
  const dispatch = useDispatch()
  const [text, setText] = useState('')
  const [bubbleOpen, setBubbleOpen] = useState(false)
  const [bubbleAnchor, setBubbleAnchor] = useState(null)
  const [latestCompletedSentence, setLatestCompletedSentence] = useState('')
  const [correctionKey, setCorrectionKey] = useState('')
  const [highlightedWords, setHighLightedWords] = useState([])
  const textareaRef = useRef(null)
  const correctionSentenceRef = useRef(null)
  const pendingEditedSentenceRef = useRef(null)
  const textRef = useRef('')
  const correctionsByKey = useSelector(state => state.writingCorrection.correctionsByKey)
  const correctionEntry = correctionsByKey[correctionKey]

  const updateBubblePosition = (textarea, completedSentence) => {
    const sentenceStartRect = getTextareaIndexRect(textarea, completedSentence.startIndex)
    const sentenceEndRect = getTextareaIndexRect(textarea, completedSentence.endIndex)
    const rect = new DOMRect(sentenceStartRect.x, sentenceEndRect.y, 0, 0)

    setBubbleAnchor({
      contextElement: textarea,
      getBoundingClientRect: () => rect,
    })
  }

  const clearCorrectionState = () => {
    setLatestCompletedSentence('')
    setBubbleOpen(false)
    setBubbleAnchor(null)
    setCorrectionKey('')
    setHighLightedWords([])
    correctionSentenceRef.current = null
  }

  const openCorrectionForSentence = (sentence, textarea) => {
    const nextCorrectionKey = getWritingCorrectionKey(sentence)

    correctionSentenceRef.current = sentence
    setLatestCompletedSentence(sentence.text)
    setCorrectionKey(nextCorrectionKey)
    updateBubblePosition(textarea, sentence)
    setBubbleOpen(true)

    if (!correctionsByKey[nextCorrectionKey]) {
      dispatch(checkWritingCorrection({
        language: WRITING_LANGUAGE,
        text: sentence.text,
        context: sentence.context,
      }))
    }
  }

  const queueEditedSentence = sentence => {
    pendingEditedSentenceRef.current = sentence
    setLatestCompletedSentence(sentence.text)
    setBubbleOpen(false)
    setBubbleAnchor(null)
    setCorrectionKey('')
    setHighLightedWords([])
    correctionSentenceRef.current = null
  }

  const commitPendingEditedSentence = textarea => {
    const pendingSentence = pendingEditedSentenceRef.current

    if (!pendingSentence || !textarea) return false

    const updatedSentence = getUpdatedPendingSentence(textRef.current, pendingSentence)
    pendingEditedSentenceRef.current = null

    if (!updatedSentence) {
      clearCorrectionState()
      return false
    }

    openCorrectionForSentence(updatedSentence, textarea)
    return true
  }

  const handleChange = e => {
    const previousText = textRef.current
    const nextText = e.target.value
    const cursorIndex = e.target.selectionStart
    const pendingSentence = pendingEditedSentenceRef.current

    setText(nextText)
    textRef.current = nextText

    if (pendingSentence) {
      const updatedPendingSentence = getUpdatedPendingSentence(nextText, pendingSentence)

      if (!updatedPendingSentence) {
        setBubbleOpen(false)
        setBubbleAnchor(null)
        setCorrectionKey('')
        setHighLightedWords([])
        return
      }

      if (updatedPendingSentence && cursorIsInsideSentence(updatedPendingSentence, cursorIndex)) {
        queueEditedSentence(updatedPendingSentence)
        return
      }

      pendingEditedSentenceRef.current = null

      openCorrectionForSentence(updatedPendingSentence, e.target)
      return
    }

    const completedSentenceAtCursor = getCompletedSentenceNearIndex(nextText, cursorIndex)
    const completedSentence = completedSentenceAtCursor || getLatestCompletedSentence(nextText)

    if (!completedSentence) {
      clearCorrectionState()
      return
    }

    const previousCompletedSentenceAtCursor = getCompletedSentenceNearIndex(
      previousText,
      Math.min(cursorIndex, previousText.length),
    )

    if (previousCompletedSentenceAtCursor && completedSentenceAtCursor) {
      queueEditedSentence(completedSentenceAtCursor)
      return
    }

    const nextCorrectionKey = getWritingCorrectionKey(completedSentence)

    if (nextCorrectionKey !== correctionKey) {
      setHighLightedWords([])
    }

    pendingEditedSentenceRef.current = null
    openCorrectionForSentence(completedSentence, e.target)
  }

  const handleScroll = () => {
    const textarea = textareaRef.current
    const completedSentence = correctionSentenceRef.current

    if (!textarea || !completedSentence || !bubbleOpen) return

    updateBubblePosition(textarea, completedSentence)
  }

  const handleSelect = e => {
    const pendingSentence = pendingEditedSentenceRef.current

    if (!pendingSentence) return

    const updatedPendingSentence = getUpdatedPendingSentence(textRef.current, pendingSentence)

    if (
      updatedPendingSentence &&
      cursorIsInsideSentence(updatedPendingSentence, e.target.selectionStart)
    ) {
      pendingEditedSentenceRef.current = updatedPendingSentence
      return
    }

    commitPendingEditedSentence(e.target)
  }

  const handleBlur = () => {
    commitPendingEditedSentence(textareaRef.current)
  }

  return (
    <Box className="essay-writing-input-area">
      <TextField
        fullWidth
        multiline
        minRows={12}
        value={text}
        onBlur={handleBlur}
        onChange={handleChange}
        onSelect={handleSelect}
        inputProps={{ onScroll: handleScroll }}
        inputRef={textareaRef}
        placeholder="Write your Finnish text here..."
        variant="outlined"
        className="essay-writing-input"
        data-cy="essay-writing-input"
      />
      <CorrectionSuggestionPopper
        anchorEl={bubbleAnchor}
        correctionEntry={correctionEntry}
        highlightedWords={highlightedWords}
        open={bubbleOpen}
        sentence={latestCompletedSentence}
        setHighLightedWords={setHighLightedWords}
      />
    </Box>
  )
}

export default EssayTextInput
