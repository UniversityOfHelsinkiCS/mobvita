import React, { useState, useEffect } from 'react'
import { Modal, Popup, Icon, Divider } from 'semantic-ui-react'
import { useDispatch, useSelector } from 'react-redux'
import { Collapse } from 'react-collapse'
import DictionaryHelp from 'Components/DictionaryHelp'
import { getTranslationAction } from 'Utilities/redux/translationReducer'
import { getWordNestAction, getLinkedWordNestAction } from 'Utilities/redux/wordNestReducer'
import { learningLanguageSelector, speak, voiceLanguages, sanitizeHtml } from 'Utilities/common'
import useWindowDimensions from 'Utilities/windowDimensions'
import { FormattedMessage, useIntl } from 'react-intl'
import ReportButton from 'Components/ReportButton'
import AdditionalInfoToggle from './AdditionalInfoToggle'

const NestWord = ({ wordNest, hasSeveralRoots, wordToCheck, showMoreInfo, children }) => {
  const dispatch = useDispatch()
  const {
    word,
    raw,
    rank,
    ancestors,
    others,
    general_ref: generalRef,
    part_of_compound: partOfCompound,
    translation_lemmas: translationLemmas,
  } = wordNest
  const learningLanguage = useSelector(learningLanguageSelector)
  const { resource_usage, autoSpeak } = useSelector(state => state.user.data.user)
  const dictionaryLanguage = useSelector(({ user }) => user.data.user.last_trans_language)
  const voice = voiceLanguages[learningLanguage]
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
    if (autoSpeak === 'always' && voice) speak(surface, voice, 'dictionary', resource_usage)

    dispatch(
      getTranslationAction({
        learningLanguage,
        wordLemmas: lemma,
        dictionaryLanguage,
      })
    )
  }

  const handleNestLinkClick = word => {
    dispatch(
      getLinkedWordNestAction({
        word,
        language: learningLanguage,
      })
    )
  }

  const wordStyle = getWordStyle(word)
  const morphemeBoundaryRegex = /[{}()[\]\-/]+/g
  const removeExtraDotRegex = /(^⋅)|(⋅$)|[<>]+/g
  const hyphenCleanupRegex = /(⋅=)|(=⋅)/g
  const cleanedWord = (word.startsWith('-') && '-' || '') + raw
    .replace(morphemeBoundaryRegex, '⋅')
    .replace(removeExtraDotRegex, '')
    .replace(hyphenCleanupRegex, '-')
    .replace(/«(.*?)»/g, '<u>$1</u>')
    .replace('=', '-')
  // Don't print these words. They are very rare or might even not exist

  if (others.includes('---') || others.includes('???') || rank >= 50000) return null

  const additionalInfo = others //?.map(e => e.replace(/[\s]+/g, ''))
  const additionalInfoCleaned = additionalInfo?.filter(
    e => !e.includes('---') && !e.includes('!!!')
  )
  const additionalInfoString = additionalInfoCleaned.join('  ')
  const linkedNests = partOfCompound.concat(generalRef)
  const linkedNestsCleaned = linkedNests?.map(e => e.trim().replace(/;/g, ''))

  return (
    <div className="wordnest">
      {ancestors.length === 0 && hasSeveralRoots && <Divider style={{ width: '95%' }} />}
      <div className="wordnest-row">
        <div style={{ display: 'flex', flex: 1 }}>
          <span
            onClick={() => handleWordClick(word, translationLemmas || word)}
            onKeyPress={() => setOpen(!open)}
            role="button"
            tabIndex="0"
          >
            <span
              className="wordnest-word"
              style={wordStyle}
              dangerouslySetInnerHTML={sanitizeHtml(cleanedWord)}
            />{' '}
          </span>

          {linkedNestsCleaned.map(nestLink => (
            <span
              key={nestLink}
              className="wordnest-additional-info wordnest-link"
              onClick={() => handleNestLinkClick(nestLink)}
              onKeyPress={() => setOpen(!open)}
              role="button"
              tabIndex="0"
            >
              ⇒ {nestLink}
            </span>
          ))}

          {showMoreInfo && additionalInfoCleaned.length > 0 && (
            <span className="wordnest-additional-info">{additionalInfoString}</span>
          )}
        </div>
      </div>
      <Collapse isOpened={open}>{children}</Collapse>
    </div>
  )
}

const NestBranch = ({
  wordNest,
  wordToCheck,
  hasSeveralRoots,
  showMoreInfo,
  children,
  ...props
}) => {
  return (
    <NestWord
      wordNest={wordNest}
      hasSeveralRoots={hasSeveralRoots}
      wordToCheck={wordToCheck}
      showMoreInfo={showMoreInfo}
      {...props}
    >
      {children}
    </NestWord>
  )
}

const WordNest = ({ wordNest, hasSeveralRoots, wordToCheck, showMoreInfo }) => {
  return (
    <NestBranch
      wordToCheck={wordToCheck}
      key={`${wordNest.word}-${wordNest.children?.length}`}
      wordNest={wordNest}
      hasSeveralRoots={hasSeveralRoots}
      showMoreInfo={showMoreInfo}
    >
      {wordNest.children &&
        wordNest.children?.map((n, index) => (
          <WordNest
            key={`${wordNest.word}-${index}`}
            wordNest={n}
            hasSeveralRoots={hasSeveralRoots}
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

const WordNestModal = ({ open, setOpen, wordToCheck, setWordToCheck }) => {
  const intl = useIntl()
  const dispatch = useDispatch()
  const learningLanguage = useSelector(learningLanguageSelector)
  const { data: nests } = useSelector(({ wordNest }) => wordNest)
  
  const { width: windowWidth, height: windowHeight } = useWindowDimensions()
  const smallWindow = windowWidth < 1024

  const [modalTitle, setModalTitle] = useState()
  const [showMoreInfo, setShowMoreInfo] = useState(false)
  const [previousCheckedWord, setPreviousCheckedWord] = useState('')
  const words = nests && nests[wordToCheck] || nests && nests[previousCheckedWord] || []
  const rootLemmas = words?.filter(e => e.parents?.length === 0)
  const secondRootLemmas = words?.filter(e => rootLemmas?.length && 
    rootLemmas?.some(r => e.parents?.includes(r.nest_id)))
  const hasSeveralRoots = rootLemmas?.length > 1 && rootLemmas?.length > 1 || secondRootLemmas?.length > 1
  const hasAdditionalInfo = words.some(word => word.others?.length > 0)
  const wordNest = makeWordNest(rootLemmas?.length > 1 && rootLemmas || secondRootLemmas, words)

  const formatModalTitle = () => [...new Set(rootLemmas?.map(w => w.word))]?.join(', ')

  const handleModalclose = () => {
    setWordToCheck('-')
    setOpen(false)
  }

  useEffect(() => {
    setShowMoreInfo(false)
    if (wordToCheck) setModalTitle(formatModalTitle())
  }, [open])

  useEffect(() => {
    setModalTitle(formatModalTitle())
  }, [rootLemmas])

  useEffect(() => {
    if (wordToCheck) {
      const nestLemmas = nests && nests[previousCheckedWord]?.map(w => w.word) || []

      if (!nestLemmas?.includes(wordToCheck)) {
        setPreviousCheckedWord(wordToCheck)
        dispatch(
          getWordNestAction({
            words: wordToCheck,
            language: learningLanguage,
          })
        )
      }
    }
  }, [wordToCheck])

  return (
    <Modal open={open} centered={false} dimmer="blurring" size="large" onClose={handleModalclose}>
      <Modal.Header className="bold" as="h2">
        <div className="space-between" style={{ alignItems: 'center' }}>
          <span>
            <Popup
              content={intl.formatMessage({ id: 'wordnest-info-text' })}
              trigger={<Icon name="info circle" size="small" />}
            />
            <FormattedMessage id="nest" />: {modalTitle}{' '}
          </span>

          {!smallWindow && hasAdditionalInfo && (
            <AdditionalInfoToggle showMoreInfo={showMoreInfo} setShowMoreInfo={setShowMoreInfo} />
          )}
          <Icon onClick={handleModalclose} size="small" name="close" />
        </div>
      </Modal.Header>
      <Modal.Content>
        {!smallWindow ? (
          <div className="space-between">
            <div
              className="wordnest-cont"
              style={{
                maxHeight: windowHeight * 0.85,
              }}
            >
              {wordNest?.map((n, index) => (
                <WordNest
                  key={`${n.word}-${index}`}
                  wordNest={n}
                  hasSeveralRoots={hasSeveralRoots}
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
                <WordNest
                  key={`${n.word}-${index}`}
                  wordNest={n}
                  hasSeveralRoots={hasSeveralRoots}
                  wordToCheck={wordToCheck}
                />
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
