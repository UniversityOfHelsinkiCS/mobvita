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

const getLatestCompletedSentence = text => {
  const matches = getCompletedSentenceMatches(text)
  const match = matches[matches.length - 1]

  if (!match) return null

  return {
    text: match[0].trim(),
    startIndex: match.index,
    endIndex: match.index + match[0].length,
    context: matches
      .slice(Math.max(matches.length - 4, 0), -1)
      .map(contextMatch => contextMatch[0].trim())
      .join(' '),
  }
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

  const handleChange = e => {
    const nextText = e.target.value
    const completedSentence = getLatestCompletedSentence(nextText)

    setText(nextText)

    if (!completedSentence) {
      setLatestCompletedSentence('')
      setBubbleOpen(false)
      setBubbleAnchor(null)
      setCorrectionKey('')
      setHighLightedWords([])
      return
    }

    const nextCorrectionKey = getWritingCorrectionKey(completedSentence)

    if (nextCorrectionKey !== correctionKey) {
      setHighLightedWords([])
    }

    setLatestCompletedSentence(completedSentence.text)
    setCorrectionKey(nextCorrectionKey)
    updateBubblePosition(e.target, completedSentence)
    setBubbleOpen(true)

    if (!correctionsByKey[nextCorrectionKey]) {
      dispatch(checkWritingCorrection({
        language: WRITING_LANGUAGE,
        text: completedSentence.text,
        context: completedSentence.context,
      }))
    }
  }

  const handleScroll = () => {
    const textarea = textareaRef.current
    const completedSentence = getLatestCompletedSentence(text)

    if (!textarea || !completedSentence || !bubbleOpen) return

    updateBubblePosition(textarea, completedSentence)
  }

  return (
    <Box className="essay-writing-input-area">
      <TextField
        fullWidth
        multiline
        minRows={12}
        value={text}
        onChange={handleChange}
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
