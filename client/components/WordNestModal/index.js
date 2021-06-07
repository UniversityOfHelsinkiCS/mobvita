import React, { useState, useEffect } from 'react'
import { Modal, Popup, Icon } from 'semantic-ui-react'
import { useDispatch, useSelector } from 'react-redux'
import { Collapse } from 'react-collapse'
import DictionaryHelp from 'Components/DictionaryHelp'
import { getTranslationAction } from 'Utilities/redux/translationReducer'
import { getWordNestAction } from 'Utilities/redux/wordNestReducer'
import {
  learningLanguageSelector,
  speak,
  respVoiceLanguages,
  hiddenFeatures,
} from 'Utilities/common'
import useWindowDimensions from 'Utilities/windowDimensions'
import { FormattedMessage, useIntl } from 'react-intl'
import ReportButton from 'Components/ReportButton'
import AdditionalInfoToggle from './AdditionalInfoToggle'

const NestWord = ({ wordNest, wordToCheck, showMoreInfo, children }) => {
  const dispatch = useDispatch()
  const { word, raw, rank, others } = wordNest
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

    if (!rank) return { color: '#56e3ff' }
    if (rank < 2000) return { color: '#000000' }
    if (rank < 4000) return { color: '#0f066f' }
    if (rank < 8000) return { color: '#0045a4' }
    if (rank < 16000) return { color: '#007acc' }
    if (rank >= 16000) return { color: '#00afe8' }
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
  const morphemeBoundaryRegex = /[{}()[\]\-/]+/g
  const removeExtraDotRegex = /(^⋅)|(⋅$)|[<>]+/g
  const hyphenCleanupRegex = /(⋅=)|(=⋅)/g
  const cleanedWord = raw
    .replace(morphemeBoundaryRegex, '⋅')
    .replace(removeExtraDotRegex, '')
    .replace(hyphenCleanupRegex, '-')
    .replace(/«(.*?)»/g, '<u>$1</u>')
    .replace('=', '-')

  // Don't print these words. They are very rare or might even not exist
  if (others.includes('---')) return null

  const additionalInfo = others?.map(e => e.replace(/,[\s]+/g, ''))
  const additionalInfoCleaned = additionalInfo?.filter(e => !e.includes('---'))
  const additionalInfoString = additionalInfoCleaned.join(', ')

  return (
    <div className="wordnest">
      <div className="wordnest-row">
        <div style={{ display: 'flex', flex: 1 }}>
          <span
            onClick={() => handleWordClick(word, word)}
            onKeyPress={() => setOpen(!open)}
            role="button"
            tabIndex="0"
          >
            <span
              className="wordnest-word"
              style={wordStyle}
              dangerouslySetInnerHTML={{ __html: cleanedWord }}
            />{' '}
            {showMoreInfo && additionalInfoCleaned.length > 0 && (
              <span className="wordnest-additional-info">{additionalInfoString}</span>
            )}
          </span>
        </div>
      </div>
      <Collapse isOpened={open}>{children}</Collapse>
    </div>
  )
}

const NestBranch = ({ wordNest, children, wordToCheck, showMoreInfo, ...props }) => {
  return (
    <NestWord wordToCheck={wordToCheck} wordNest={wordNest} showMoreInfo={showMoreInfo} {...props}>
      {children}
    </NestWord>
  )
}

const WordNest = ({ wordNest, wordToCheck, showMoreInfo }) => {
  return (
    <NestBranch
      wordToCheck={wordToCheck}
      key={`${wordNest.word}-${wordNest.children?.length}`}
      wordNest={wordNest}
      showMoreInfo={showMoreInfo}
    >
      {wordNest.children &&
        wordNest.children?.map((n, index) => (
          <WordNest
            key={`${wordNest.word}-${index}`}
            wordNest={n}
            wordToCheck={wordToCheck}
            showMoreInfo={showMoreInfo}
          />
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
  const { width: windowWidth, height: windowHeight } = useWindowDimensions()
  const smallWindow = windowWidth < 1024
  const [modalTitle, setModalTitle] = useState()
  const [showMoreInfo, setShowMoreInfo] = useState(false)
  const rootLemmas = words?.filter(e => e.parents?.length === 0)
  const wordNest = makeWordNest(rootLemmas, words)
  const intl = useIntl()

  useEffect(() => {
    setShowMoreInfo(false)
    if (wordToCheck) {
      const rootForms = rootLemmas?.map(w => w.word)
      const uniqueRootForms = [...new Set(rootForms)]
      setModalTitle(uniqueRootForms?.join(', '))
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

  return (
    <Modal
      open={open}
      centered={false}
      dimmer="blurring"
      size="large"
      onClose={() => setOpen(false)}
    >
      <Modal.Header className="bold" as="h2">
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span>
            {hiddenFeatures && (
              <Popup
                content={intl.formatMessage({ id: 'wordnest-info-text' })}
                trigger={<Icon name="info circle" size="small" />}
              />
            )}
            <FormattedMessage id="nest" />: {modalTitle}{' '}
          </span>

          {!smallWindow && hiddenFeatures && (
            <AdditionalInfoToggle showMoreInfo={showMoreInfo} setShowMoreInfo={setShowMoreInfo} />
          )}
        </div>
      </Modal.Header>
      <Modal.Content>
        {!smallWindow ? (
          <div className="space-between">
            <div
              style={{
                maxHeight: windowHeight * 0.85,
                overflowY: 'auto',
                padding: '1em 6em 1em 1em',
              }}
            >
              {wordNest?.map((n, index) => (
                <WordNest
                  key={`${n.word}-${index}`}
                  wordNest={n}
                  wordToCheck={wordToCheck}
                  showMoreInfo={showMoreInfo}
                />
              ))}
            </div>
            <div
              style={{
                display: 'flex',
                flexFlow: 'column',
                justifyContent: 'space-between',
                gap: '2em',
              }}
            >
              <DictionaryHelp inWordNestModal />
              <div className="align-self-end">
                <ReportButton />
              </div>
            </div>
          </div>
        ) : (
          <div>
            <div>
              <DictionaryHelp inWordNestModal />
            </div>
            <div
              style={{
                maxHeight: windowHeight * 0.4,
                overflowY: 'auto',
              }}
            >
              {wordNest?.map((n, index) => (
                <WordNest key={`${n.word}-${index}`} wordNest={n} wordToCheck={wordToCheck} />
              ))}
            </div>
            <hr />
            <div>
              <ReportButton extraClass="auto-top" />
            </div>
          </div>
        )}
      </Modal.Content>
    </Modal>
  )
}

export default WordNestModal
