import FormattedHTMLMessage from 'Components/FormattedHTMLMessage';
import React, { useState, useEffect } from 'react'
import { Divider } from '@mui/material'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import { useDispatch, useSelector } from 'react-redux'
import AppDialog from 'Components/ui/AppDialog'
import { colors } from 'Assets/mui_theme/designTokens'
import DictionaryHelp from 'Components/DictionaryHelp'
import { getNestTranslationAction } from 'Utilities/redux/translationReducer'
import { getWordNestAction, getLinkedWordNestAction } from 'Utilities/redux/wordNestReducer'
import { dictionaryLanguageSelector, learningLanguageSelector, speak, voiceLanguages, sanitizeHtml } from 'Utilities/common'
import { FormattedMessage, useIntl } from 'react-intl';
import CustomTooltip from 'Components/CustomTooltip'
import NestToggle from './NestToggle'
import './WordNestModal.scss'
import { autoSpeakOn } from 'Utilities/practiceSpeech'

// Click handler for a nest word: speaks it and shows it in the nest's own dictionary pane.
const useNestWordClick = () => {
  const dispatch = useDispatch()
  const learningLanguage = useSelector(learningLanguageSelector)
  const { resource_usage, auto_speak: autoSpeak } = useSelector(state => state.user.data.user)
  const dictionaryLanguage = useSelector(({ user }) => user.data.user.last_trans_language)
  const voice = voiceLanguages[learningLanguage]

  return (surface, lemma) => {
    if (autoSpeakOn(autoSpeak) && voice) speak(surface, voice, 'dictionary', resource_usage)
    dispatch(getNestTranslationAction({ learningLanguage, wordLemmas: lemma, dictionaryLanguage }))
  }
}

// One nest row: the word (or its markup), links to related nests and its child rows.
const NestWord = ({ wordNest, hasSeveralRoots, wordToCheck, showMoreInfo, children }) => {
  const dispatch = useDispatch()
  const handleWordClick = useNestWordClick()
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
  const [open, setOpen] = useState(true)

  const getWordStyle = word => {
    if (word === wordToCheck)
      return {
        padding: '0.15em',
        border: '1.8px solid #388A3D',
        borderRadius: '10px',
        backgroundColor: '#E6FCE7',
      }

    if (!rank) return { color: '#db2828', fontStyle: 'bold' }
    if (rank < 2000) return { color: '#000000' }
    if (rank < 4000) return { color: '#0f066f' }
    if (rank < 8000) return { color: '#0045a4' }
    if (rank < 16000) return { color: '#007acc' }
    if (rank >= 16000) return { color: '#00afe8' }
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
  const cleanedWord =
    ((word.startsWith('-') && '-') || '') +
    raw
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
        <div className="wordnest-row-main">
          <span
            className="wordnest-word-button"
            onClick={() => handleWordClick(word, translationLemmas || word)}
            onKeyPress={() => setOpen(!open)}
            role="button"
            tabIndex="0"
          >
            <span data-cy="wordnest-word" className="wordnest-word" style={wordStyle}>
              {word}
            </span>
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
        {/* Second column: the word split into morphemes (`juoks⋅ija`, `aita#juoksija`). */}
        {showMoreInfo && (
          <span
            className="wordnest-word-button wordnest-word-parts"
            onClick={() => handleWordClick(word, translationLemmas || word)}
            onKeyPress={() => setOpen(!open)}
            role="button"
            tabIndex="0"
          >
            <span
              data-cy="wordnest-word-parts"
              className="wordnest-word"
              style={wordStyle}
              dangerouslySetInnerHTML={sanitizeHtml(cleanedWord)}
            />
          </span>
        )}
      </div>
      {/* Plain render, not react-collapse: its 50ms fixed-height pass flickered on every toggle. */}
      {open && children}
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

// A node's children to show: compounds only when asked for, plain words first, then A–Z.
const visibleChildren = (node, showCompounds) =>
  [...(node.children || [])]
    .filter(c => showCompounds || !c.is_compound)
    .sort((a, b) => {
      if (a.is_compound !== b.is_compound) return a.is_compound ? 1 : -1
      return a.word.localeCompare(b.word)
    })

// A nest node and, recursively, its visible children.
const WordNest = ({ wordNest, hasSeveralRoots, wordToCheck, showMoreInfo, showCompounds }) => {
  return (
    <NestBranch
      wordToCheck={wordToCheck}
      key={`${wordNest.word}-${wordNest.children?.length}`}
      wordNest={wordNest}
      hasSeveralRoots={hasSeveralRoots}
      showMoreInfo={showMoreInfo}
    >
      {visibleChildren(wordNest, showCompounds).map((n, index) => (
        <WordNest
          key={`${wordNest.word}-${index}`}
          wordNest={n}
          hasSeveralRoots={hasSeveralRoots}
          wordToCheck={wordToCheck}
          showMoreInfo={showMoreInfo}
          showCompounds={showCompounds}
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

// Word nest dialog: the nest tree with view toggles on the left, the dictionary on the right.
const WordNestModal = ({
  open,
  setOpen,
  wordToCheck,
  setWordToCheck,
  restoreTranslationOnClose = true,
  ...props
}) => {

  const intl = useIntl()
  const dispatch = useDispatch()
  const handleWordClick = useNestWordClick()
  const learningLanguage = useSelector(learningLanguageSelector)
  const dictionaryLanguage = useSelector(dictionaryLanguageSelector)
  const { data: nests } = useSelector(({ wordNest }) => wordNest)

  const [showMoreInfo, setShowMoreInfo] = useState(false)
  const [previousCheckedWord, setPreviousCheckedWord] = useState('')
  const [showCompounds, setShowCompounds] = useState(false)
  const words = (nests && nests[wordToCheck]) || (nests && nests[previousCheckedWord]) || []
  const rootLemmas = words?.filter(e => e.parents?.length === 0)
  const secondRootLemmas = words?.filter(
    e => rootLemmas?.length && rootLemmas?.some(r => e.parents?.includes(r.nest_id))
  )
  const hasSeveralRoots =
    (rootLemmas?.length > 1 && rootLemmas?.length > 1) || secondRootLemmas?.length > 1
  const wordNest = makeWordNest((rootLemmas?.length > 1 && rootLemmas) || secondRootLemmas, words)
  const wordNestHasCompounds = words.some(w => w.is_compound)
  // A lone top word that repeats the title (TILA → tila) is skipped and its children lead the
  // list, unless none are visible (only compounds, toggle off): then the word stays.
  const repeatsTitle =
    wordNest?.length === 1 &&
    rootLemmas.some(r => r.word.toLowerCase() === wordNest[0].word.toLowerCase())
  const titleChildren = repeatsTitle ? visibleChildren(wordNest[0], showCompounds) : []
  const topNodes = titleChildren.length > 0 ? titleChildren : wordNest

  // Title roots are uppercase headings (СПОРТ); their lemma is the same-named child (спорт).
  const titleRoots = [...new Map(rootLemmas.map(r => [r.word, r])).values()].map(root => {
    const lower = root.word.toLowerCase()
    const child = words.find(
      w => w.parents?.includes(root.nest_id) && w.word.toLowerCase() === lower,
    )
    return { word: root.word, lemma: child?.translation_lemmas || child?.word || lower }
  })

  // Closes the nest; the story's cards were never touched, so only the chosen word resets.
  const handleModalclose = () => {
    if (restoreTranslationOnClose) setWordToCheck(props.storyWord || '')

    setOpen(false)
  }


  useEffect(() => {
    setShowMoreInfo(false)
  }, [open])

  useEffect(() => {
    if (wordToCheck) {
      const nestLemmas = (nests && nests[previousCheckedWord]?.map(w => w.word)) || []

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

  useEffect(() => {
    if (!open) return
    if (!wordToCheck || wordToCheck === '-') return

    dispatch(
      getNestTranslationAction({
        learningLanguage,
        wordLemmas: wordToCheck,
        dictionaryLanguage,
      })
    )
  }, [open, wordToCheck, learningLanguage, dictionaryLanguage, dispatch])

  return (
    <AppDialog
      open={open}
      onClose={handleModalclose}
      maxWidth="md"
      data-cy="wordnest-modal"
      closeDataCy="wordnest-close"
      paperSx={{ width: 872, maxWidth: 'calc(100% - 64px)' }}
      titleSx={{ p: 0 }}
      contentSx={{ p: 0, overflow: 'hidden', display: 'flex' }}
      closeSx={{ top: 14, right: 12 }}
    >
      <div className="wordnest-layout">
        <div className="wordnest-main">
          <div className="wordnest-main-header">
            <h2 className="wordnest-title">
              <span className="wordnest-title-label">
                <FormattedMessage id="nest" />:
              </span>
              <span className="wordnest-title-root">
                {titleRoots.map((root, index) => (
                  <React.Fragment key={root.word}>
                    {index > 0 && ', '}
                    <span
                      className="wordnest-title-word"
                      data-cy="wordnest-title-word"
                      onClick={() => handleWordClick(root.lemma, root.lemma)}
                      onKeyDown={e => e.key === 'Enter' && handleWordClick(root.lemma, root.lemma)}
                      role="button"
                      tabIndex="0"
                    >
                      {root.word}
                    </span>
                  </React.Fragment>
                ))}
              </span>
              <CustomTooltip title={intl.formatMessage({ id: 'wordnest-info-text' })}>
                <span className="wordnest-title-info">
                  <InfoOutlinedIcon sx={{ fontSize: 18, color: colors.muted }} />
                </span>
              </CustomTooltip>
            </h2>
            {words.length > 0 && (
              <div className="wordnest-toggles">
                <NestToggle
                  dataCy="wordnest-additional-info-toggle"
                  checked={showMoreInfo}
                  onChange={() => setShowMoreInfo(!showMoreInfo)}
                  label={intl.formatMessage({ id: 'show-additional-info' })}
                />
                {wordNestHasCompounds && (
                  <NestToggle
                    dataCy="wordnest-compounds-toggle"
                    checked={showCompounds}
                    onChange={() => setShowCompounds(!showCompounds)}
                    label={<FormattedHTMLMessage id="word-nest-show-compounds-label" />}
                  />
                )}
              </div>
            )}
          </div>
          {/* One list: compounds sort under the basic words; markup is the only second column. */}
          <div className="wordnest-list">
            {topNodes?.map((n, index) => (
              <WordNest
                key={`${n.word}-${index}`}
                wordNest={n}
                hasSeveralRoots={hasSeveralRoots}
                wordToCheck={wordToCheck}
                showMoreInfo={showMoreInfo}
                showCompounds={showCompounds}
              />
            ))}
          </div>
        </div>
        <div className="wordnest-dictionary">
          <DictionaryHelp inWordNestModal />
        </div>
      </div>
    </AppDialog>
  )
}

export default WordNestModal
