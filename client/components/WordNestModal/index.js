import React, { useState, useEffect } from 'react'
import { Modal } from 'semantic-ui-react'
import { useDispatch, useSelector } from 'react-redux'
import { Collapse } from 'react-collapse'
import DictionaryHelp from 'Components/DictionaryHelp'
import { getTranslationAction } from 'Utilities/redux/translationReducer'
import { getWordNestAction } from 'Utilities/redux/wordNestReducer'
import { learningLanguageSelector, speak, respVoiceLanguages } from 'Utilities/common'
import useWindowDimensions from 'Utilities/windowDimensions'
import { FormattedMessage } from 'react-intl'

const NestWord = ({ wordNest, wordToCheck, children }) => {
  const dispatch = useDispatch()
  const { word, raw, ancestors, others } = wordNest
  const learningLanguage = useSelector(learningLanguageSelector)
  const autoSpeak = useSelector(({ user }) => user.data.user.auto_speak)
  const dictionaryLanguage = useSelector(({ user }) => user.data.user.last_trans_language)
  const voice = respVoiceLanguages[learningLanguage]
  const [open, setOpen] = useState(true)

  const getWordStyle = word => {
    if (word === wordToCheck)
      return {
        padding: '0.15em',
        border: '1.8px solid #388A3D',
        borderRadius: '10px',
        backgroundColor: '#E6FCE7',
      }
    if (others.includes('---')) return { color: '#ffd7d1' }
    if (ancestors?.length === 0) return { color: '#013A70', marginTop: '1em' }
    if (ancestors?.length % 2 === 0) return { color: '#3C9DFA' }
    return { color: '#026CD1' }
  }

  const handleWordClick = (surface, lemma) => {
    if (autoSpeak === 'always' && voice) speak(surface, voice)

    dispatch(
      getTranslationAction({
        learningLanguage,
        wordLemmas: lemma,
        dictionaryLanguage,
      })
    )
  }

  const wordStyle = getWordStyle(word)
  const MorphemeBoundaryRegex = /[{}()[\]\-/]+/g
  const RemoveExtraDotsRegex = /(^⋅)|(⋅$)|[<>]+/g
  const cleanedWord = raw
    .replace(MorphemeBoundaryRegex, '⋅')
    .replace(RemoveExtraDotsRegex, '')
    .replace(/«/g, '<b>')
    .replace(/»/g, '</b>')
    .replace('=', '-')

  return (
    <div className="wordnest">
      <div className="wordnest-row">
        <div style={{ display: 'flex', flex: 1 }}>
          <span
            className="wordnest-word"
            style={wordStyle}
            onClick={() => handleWordClick(word, word)}
            onKeyPress={() => setOpen(!open)}
            role="button"
            tabIndex="0"
          >
            <span dangerouslySetInnerHTML={{ __html: cleanedWord }} />
          </span>
        </div>
      </div>
      <Collapse isOpened={open}>{children}</Collapse>
    </div>
  )
}

const NestBranch = ({ wordNest, children, wordToCheck, ...props }) => {
  return (
    <NestWord wordToCheck={wordToCheck} wordNest={wordNest} {...props}>
      {children}
    </NestWord>
  )
}

const WordNest = ({ wordNest, wordToCheck }) => {
  return (
    <NestBranch
      wordToCheck={wordToCheck}
      key={`${wordNest.word}-${wordNest.children?.length}`}
      wordNest={wordNest}
    >
      {wordNest.children &&
        wordNest.children?.map((n, index) => (
          <WordNest key={`${wordNest.word}-${index}`} wordNest={n} wordToCheck={wordToCheck} />
        ))}
    </NestBranch>
  )
}

const makeWordNest = (parents, wordsWithIDs) =>
  parents?.map(parent => {
    const children =
      parent.children && wordsWithIDs?.filter(c => parent.children.includes(c.nest_id))
    const cleanConcept = {
      ...parent,
      children: makeWordNest(children, wordsWithIDs),
    }
    return cleanConcept
  })

const WordNestModal = ({ open, setOpen, wordToCheck }) => {
  const dispatch = useDispatch()
  const learningLanguage = useSelector(learningLanguageSelector)
  const { data: words } = useSelector(({ wordNest }) => wordNest)
  const { width: windowWidth } = useWindowDimensions()
  const smallWindow = windowWidth < 1024
  const [modalTitle, setModalTitle] = useState()

  useEffect(() => {
    if (wordToCheck) {
      setModalTitle(wordToCheck)
    }
  }, [open])

  useEffect(() => {
    if (wordToCheck) {
      const nestLemmas = words?.map(w => w.word)

      if (!nestLemmas?.includes(wordToCheck)) {
        dispatch(
          getWordNestAction({
            word: wordToCheck,
            language: learningLanguage,
          })
        )
      }
    }
  }, [wordToCheck])

  const NestRootLemmas = words?.filter(e => e.parents?.length === 0)
  const wordNest = makeWordNest(NestRootLemmas, words)

  return (
    <Modal
      open={open}
      centered={false}
      dimmer="blurring"
      size="large"
      closeIcon={{ style: { top: '1.0535rem', right: '1rem' }, color: 'black', name: 'close' }}
      onClose={() => setOpen(false)}
    >
      <Modal.Header className="bold" as="h2">
        <FormattedMessage id="nest" />: {modalTitle}
      </Modal.Header>
      <Modal.Content>
        {!smallWindow ? (
          <div style={{ paddingLeft: '1em', display: 'flex', justifyContent: 'space-between' }}>
            <div>
              {wordNest?.map((n, index) => (
                <WordNest key={`${n.word}-${index}`} wordNest={n} wordToCheck={wordToCheck} />
              ))}
            </div>
            <div>
              <DictionaryHelp inWordNestModal />
            </div>
          </div>
        ) : (
          <div>
            <div>
              <DictionaryHelp inWordNestModal />
            </div>
            <div>
              {wordNest?.map((n, index) => (
                <WordNest key={`${n.word}-${index}`} wordNest={n} wordToCheck={wordToCheck} />
              ))}
            </div>
          </div>
        )}
      </Modal.Content>
    </Modal>
  )
}

export default WordNestModal
