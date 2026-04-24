import React, { useEffect, useState, useRef } from 'react'
import { isEmpty } from 'lodash'
import { Icon, Popup, Placeholder, PlaceholderLine, Button } from 'semantic-ui-react'
import { useIntl, FormattedMessage, FormattedHTMLMessage } from 'react-intl'
import ReactMarkdown from 'react-markdown'
import { lemmatizer } from 'lemmatizer'
import { useSelector, useDispatch } from 'react-redux'
import { getTranslationAction, setWords, changeTranslationStageAction, clearTranslationAction } from 'Utilities/redux/translationReducer'
import { incrementHintRequests, setReferences, setExplanation } from 'Utilities/redux/practiceReducer'
import {
  learningLanguageSelector,
  dictionaryLanguageSelector,
  useLearningLanguage,
  useDictionaryLanguage,
  getTextStyle,
  flashcardColors,
  formatGreenFeedbackText,
  composeExerciseContext,
  hiddenFeatures
} from 'Utilities/common'
import { Speaker } from 'Components/DictionaryHelp/dictComponents'
import WordNestModal from 'Components/WordNestModal'
import { recordFlashcardAnswer } from 'Utilities/redux/flashcardReducer'
import ChatActionMenu from './ChatActionMenu'
import Lemma from 'Components/DictionaryHelp/Lemma'
import RobotIcon from './RobotIcon'
import {
    setFocusedWord,
    mcExerciseTouched,
} from 'Utilities/redux/practiceReducer'
import {
    getPracticeChatbotResponse,
    setConversationHistory,
    setCurrentContext,
} from 'Utilities/redux/chatbotReducer'
import {
    setSnippetChatHistory
} from 'Utilities/redux/snippetsReducer'
import { setHelperSidebarOpen, toggleHelperSidebar, setHelperSidebarTab } from 'Utilities/redux/helperSidebarReducer'
import { getWordNestAction } from 'Utilities/redux/wordNestReducer'
import ChatbotSuggestions from 'Components/ChatBot/ChatbotSuggestions'
import Spinner from 'Components/Spinner'

import './CombinedChatbot.scss'

const CombinedChatbot = ({inWordNestModal, clue}) => {

  const dispatch = useDispatch()
  const intl = useIntl()

  const { focusedWord } = useSelector(({ practice }) => practice)

  const { attempt, currentAnswers, focusedWord: currentWord } = useSelector(({ practice }) => practice)
  const { messages, isWaitingForResponse, isLoadingHistory } = useSelector(({ chatbot }) => chatbot)
  const snippets = useSelector(({ snippets }) => snippets)
  const { session_id, storyid, chat_history } = useSelector(({ snippets }) => ({
      session_id: snippets.focused?.session_id,
      storyid: snippets.focused?.storyid,
      chat_history: snippets.focused_snippet_chat_history
  }))
  
  const translationState = useSelector(({ translation }) => translation)
  const {data: translationData} = useSelector(({translation}) => translation)
  const translation = Array.isArray(translationData) ? translationData[0] : translationData
  const contextTranslationState = useSelector(({ contextTranslation }) => contextTranslation)

  const learningLanguage = useLearningLanguage()
  const dictionaryLanguage = useDictionaryLanguage()

  const [validToChat, setValidToChat] = useState(false)
  const [eloScoreHearts, setEloScoreHearts] = useState([])
  const [spentHints, setSpentHints] = useState([])
  const [preHints, setPreHints] = useState([])
  const [filteredHintsList, setFilteredHintsList] = useState([])
  const [emptyHintsList, setEmptyHintsList] = useState(false)
  const [currentMessage, setCurrentMessage] = useState("")
  const [hintMessageIdx, setHintMessageIdx] = useState(0)
  const [predefinedChatbotRequests, setPredefinedChatbotRequests] = useState([])

  const [wordNestModalOpen, setWordNestModalOpen] = useState(false)
  const [wordNestChosenWord, setWordNestChosenWord] = useState('')
  const [showContexTranslation, setShowContextTranslation] = useState(false)

  const wordNest = useSelector(({ wordNest }) => wordNest)
  const { data: words } = wordNest
  const { background } = flashcardColors
  const latestMessageRef = useRef(null)
  const { listen, speak } = currentWord || {}
  const isValidExercise = currentWord && Object.keys(currentWord).length > 0 && !listen && !speak
  const helperSidebarState = useSelector(({ helperSidebar }) => helperSidebar)
  const { activeTab: helperActiveTab } = helperSidebarState || {}

  useEffect(() => {
    const hasExerciseWord = currentWord?.ID && Object.keys(currentWord).length > 0
    const hasTranslationData = translationState?.data?.length > 0 || translationState?.surfaceWord?.trim()    
    dispatch(setHelperSidebarOpen(hasExerciseWord || hasTranslationData))
  }, [dispatch, currentWord, translationState.data, translationState.surfaceWord])

  useEffect(() => {
    if (focusedWord && focusedWord.lemmas && learningLanguage) {      
      dispatch(
        getWordNestAction({
        words: focusedWord.lemmas,
        language: learningLanguage,
        })
      )
    }
  }, [focusedWord, dispatch, learningLanguage])

  useEffect(() => {
    if (translation && translation.lemma && learningLanguage) {      
      dispatch(
        getWordNestAction({
        words: translation.lemma,
        language: learningLanguage,
        })
      )
    }
  }, [translation, dispatch, learningLanguage])

  useEffect(() => {
    const surface = translationState.surface || translationState.surfaceWord;
    const exerciseSurface = currentWord?.surface || currentWord?.base;

    if (isValidExercise) {                
      setValidToChat(true);                               
    } 
  
    else if (surface && surface !== exerciseSurface) {                
      setValidToChat(false);                
    }
  }, [translationState.surface, translationState.surfaceWord, currentWord, isValidExercise])

  useEffect(() => {
    const { listen, speak, hints, requested_hints: requestedBEHints } = currentWord || {}        

    if (currentWord && Object.keys(currentWord).length && !listen && !speak) {
      let totalRequestedHints = []
      const { requestedHintsList } = currentAnswers[`${currentWord.ID}-${currentWord.id}`] || {}

      totalRequestedHints = (requestedBEHints || [])
      totalRequestedHints = totalRequestedHints.concat(
        (requestedHintsList || []).filter(hint => !totalRequestedHints.includes(hint))
      )

      setEloScoreHearts(
        Array.from({ length: hints ? hints.filter(hint => !totalRequestedHints.includes(hint)).length : 0 }, (_, i) => i + 1)
      )
      setSpentHints(
        Array.from({ length: requestedHintsList ? requestedHintsList.length : 0 }, (_, i) => i + 1)
      )

      if (attempt !== 0) {
        setFilteredHintsList(hints || [])
        setPreHints(totalRequestedHints)
      } else {
        setFilteredHintsList(hints?.filter(hint => !hints[0]?.message || hint.easy !== hints[0].message.easy))
        setPreHints(totalRequestedHints)
      }
    } else {
      setEloScoreHearts([])
      setSpentHints([])
      setPreHints([])
      setFilteredHintsList([])
    }
  }, [currentWord, attempt])

  useEffect(() => {
    if (currentWord && Object.keys(currentWord).length) {
      const { ID: wordId } = currentWord
      let word_chat_history = []
      if (chat_history && typeof wordId !== 'undefined' && chat_history.hasOwnProperty(wordId.toString())) {
          word_chat_history = chat_history[wordId.toString()]
      }
      dispatch(setConversationHistory(word_chat_history))
    }
  }, [currentWord])

  useEffect(() => {
    latestMessageRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleKnowningClick = (lemma) => {
    const answerDetails = {
      correct: true,
      answer: null,
      exercise: 'knowing',
      hints_shown: 0,
      mode: 'trans',
      lemma,
    }
    dispatch(recordFlashcardAnswer(learningLanguage, dictionaryLanguage, answerDetails))
    dispatch(changeTranslationStageAction(lemma, learningLanguage, dictionaryLanguage, 4))
  }

  const handleNotKnowningClick = (lemma) => {
    const answerDetails = {
      correct: false,
      answer: null,
      exercise: 'knowing',
      hints_shown: 0,
      mode: 'trans',
      lemma,
    }
    dispatch(recordFlashcardAnswer(learningLanguage, dictionaryLanguage, answerDetails))
    dispatch(changeTranslationStageAction(lemma, learningLanguage, dictionaryLanguage, 0))
  }

  const handleHintRequest = (newHintList) => {
    const newRequestNum = preHints.length + 1
    const penalties = newHintList
        ?.filter(hint => hint.penalty)
        .map(hint => hint.penalty)
    dispatch(incrementHintRequests(`${currentWord.ID}-${currentWord.id}`, newRequestNum, newHintList, penalties))
    setSpentHints(prev => [...prev, prev.length + 1])
    setEloScoreHearts(prev => prev.slice(0, -1))
    setHintMessageIdx(messages.length > 0 ? messages.length : 0)
  }

  const handleShowHint = () => {
    const { hints, requested_hints: requestedBEHints } = currentWord || {}
    let totalRequestedHints = (requestedBEHints || [])
    const { requestedHintsList } = currentAnswers[`${currentWord.ID}-${currentWord.id}`] || {}
    totalRequestedHints = totalRequestedHints.concat(
      (requestedHintsList || []).filter(hint => !totalRequestedHints.includes(hint))
    )

    if ((!hints && !preHints) || (filteredHintsList.length < 1 && preHints.length < 1) || hints?.length < 1) {
      setEmptyHintsList(true)
      handleHintRequest()
    } else {
      const newHintList = preHints.concat(filteredHintsList[preHints.length - (requestedBEHints || []).length])
      setPreHints(newHintList)
      handleHintRequest(newHintList)
    }
  }

  const handleTooltipClick = (hint) => {
    if (hint.ref?.length) dispatch(setReferences({[hint.keyword || hint.easy]: hint.ref}))
    if (hint.explanation?.length || hint.meta !== hint.easy) dispatch(setExplanation({
      [hint.keyword || hint.easy]: hint.easy === hint.meta && hint.explanation || [hint.meta, ...(hint.explanation || [])]
    }))
  }

  const handleMessageSubmit = (event) => {
    event.preventDefault()
    const { ID: wordId, sentence_id, snippet_id, choices, hints: wordHints } = currentWord || {}
    if (Object.keys(currentWord).length === 0 || currentMessage.trim() === '') return

    dispatch(
      getPracticeChatbotResponse(
        session_id,
        storyid,
        snippet_id,
        sentence_id,
        wordId,
        currentMessage.trim(),
        "",
        composeExerciseContext(
            snippets.focused?.practice_snippet || [],
            currentWord
        ),
        (wordHints || []).map(hint => hint.easy)
      )
    )
    setCurrentMessage("")
  }
 
  const hasHints = currentWord?.hints?.length > 0 && validToChat
  const showAllHintsUsed = eloScoreHearts.length === 0 && spentHints.length > 0

  const currentLemmas = currentWord?.lemmas?.split('|') || [];
  const isCurrentWordTranslated = 
      (translationState.surfaceWord || translationState.surface) === currentWord?.surface &&
      !translationState.pending &&
      translationState.data?.some(item => currentLemmas.includes(item.lemma));

  const isWordNestAvailableForLemma = lemma =>
    !!lemma &&
    !!words?.[lemma]?.length &&
    !inWordNestModal &&
    !clue &&
    (learningLanguage === 'Russian' || learningLanguage === 'Finnish')

  const showWordNestOption = isWordNestAvailableForLemma(currentWord?.lemmas)
  const showWordNestOptionDictionary = isWordNestAvailableForLemma(
    translationState.surfaceWord || translationState.data?.[0]?.lemma
  )

  const prevId = useRef(currentWord?.ID);
  const prevTransKey = useRef(translationState?.surfaceWord || translationState?.lemmas || '');

  useEffect(() => {
    if (typeof helperActiveTab !== 'undefined') {
      console.log('HelperSidebar activeTab changed:', helperActiveTab)
    }
  }, [helperActiveTab])

  useEffect(() => {
    const currentId = currentWord?.ID
    const transKey = translationState?.surfaceWord || translationState?.lemmas || ''
    const idChanged = typeof prevId.current !== 'undefined' && currentId !== prevId.current
    const transChanged = typeof prevTransKey.current !== 'undefined' && transKey !== prevTransKey.current
    if (idChanged || transChanged) {
      dispatch({ type: 'CLEAR_CONTEXT_TRANSLATION' })
      setShowContextTranslation(false)
    }
    prevId.current = currentId
    prevTransKey.current = transKey
  }, [currentWord?.ID, translationState.surfaceWord, translationState.lemmas, dispatch])

  useEffect(() => {
    if (currentWord && Object.keys(currentWord).length) {
      const { users_answer } = currentAnswers[`${currentWord.ID}-${currentWord.id}`] || {}
      
      const predefinedChatbotMsg = [
        "chatbot-message-suggestion-answer-wrong-reason",
        "chatbot-message-suggestion-analyze-context"
      ]
      
      const requests = predefinedChatbotMsg.map(id => ({
        msgId: id,
        func: getPracticeChatbotResponse(
          session_id,
          storyid,
          currentWord.snippet_id,
          currentWord.sentence_id,
          currentWord.ID,
          intl.formatMessage({ id }).trim(),
          users_answer?.trim() || "",
          composeExerciseContext(snippets.focused?.practice_snippet || [], currentWord),
          (currentWord.hints || []).map(hint => hint.easy)
        )
      }))
      
            setPredefinedChatbotRequests(requests)
    } else {
      setPredefinedChatbotRequests([])
    }
  }, [currentWord, currentAnswers, session_id, storyid, intl])

  const glossCheckLanguage = ['English']

  const highlightTarget = (translation) => {
    if (!translation || !translation['source-segments'] || !translation['target-segments'] || !translation['alignment']) return ''
    const surface = translationState.surfaceWord || currentWord?.surface || ''

    const translated_glosses = (translationState.data || []).map(t => t.glosses || []).flat().map(g => g.toLowerCase())
    const glosses = glossCheckLanguage.includes(dictionaryLanguage) ? [
      ...translated_glosses,
      ...translated_glosses.map(gloss => gloss.includes(' ') && [gloss, ...gloss.split(' '), ...gloss.split(' ').map(g => lemmatizer(g))] || [lemmatizer(gloss)]).flat(),
    ] : [
      ...translated_glosses,
      ...translated_glosses.filter(gloss => gloss.includes(' ')).map(gloss => gloss.split(' ')).flat(),
    ]

    const glossCheck = (p) => (
      !glossCheckLanguage.includes(dictionaryLanguage) ||
      glosses.includes(p.trim().toLowerCase()) || glosses.includes(lemmatizer(p.trim().toLowerCase()))
    )

    const targetSents = []
    const targetSentIds = new Set()

    for (let sentId in translation['source-segments']) {
      const sourceIds = []
      let target = ''
      let p = ''
      let q = []

      const srcSegments = translation['source-segments'][sentId]
      for (let s in srcSegments) {
        const segment = srcSegments[s]
        if (!segment) continue
        const first = segment[0]
        if (first === '▁' || (typeof first === 'string' && first.toLowerCase() === first.toUpperCase())) {
          if (p.length && p === surface) sourceIds.push(...q)
          p = segment.replace('▁', '')
          q = [s]
        } else {
          p += segment
          q.push(s)
        }
      }
      if (p.length && p === surface) sourceIds.push(...q)

      // get target ids
      let targetIds = []
      try {
        targetIds = sourceIds.map(s => translation['alignment'][sentId] && translation['alignment'][sentId][s]).flat().filter(x => typeof x !== 'undefined')
      } catch (e) {
        targetIds = []
      }

      // build target string
      p = ''
      q = []
      const tgtSegments = translation['target-segments'][sentId]
      for (let s in tgtSegments) {
        const segment = tgtSegments[s]
        if (!segment) continue
        const first = segment[0]
        if (first === '▁' || (typeof first === 'string' && first.toLowerCase() === first.toUpperCase())) {
          if (p.trim().length && targetIds.filter(x => q.includes(x)).length && glossCheck(p)) {
            target += '<b>' + p + '</b>'
            targetSentIds.add(sentId)
          } else
            target += p
          p = segment.replace('▁', ' ')
          q = [s]
        } else {
          p += segment
          q.push(s)
        }
      }

      if (p.length && targetIds.filter(x => q.includes(x)).length && glossCheck(p)) {
        target += '<b>' + p + '</b>'
        targetSentIds.add(sentId)
      } else target += p

      targetSents.push(target.trim())
    }

    if (targetSentIds.size) {
      return [...targetSentIds].sort().map(sentId => targetSents[sentId]).join(' ')
    }
    return targetSents.join(' ')
  }

  const renderContextTranslationContent = () => {
    const d = contextTranslationState.data
    if (!d) return null
    if (typeof d === 'string') return <div className="context-translation-content" dangerouslySetInnerHTML={{ __html: d }} />
    // Prefer alignment-based highlight when available
    if (d['alignment'] && d['source-segments'] && d['target-segments']) {
      const html = highlightTarget(d)
      return <div className="context-translation-content" dangerouslySetInnerHTML={{ __html: html }} />
    }
    if (d.translation) return <div className="context-translation-content" dangerouslySetInnerHTML={{ __html: d.translation }} />
    if (d['target-sentences']) return (
      <div className="context-translation-content">
        {d['target-sentences'].map((s, i) => (
          <p key={i} dangerouslySetInnerHTML={{ __html: s }} />
        ))}
      </div>
    )
    return (
      <div className="context-translation-content">
        <pre style={{ whiteSpace: 'pre-wrap' }}>{JSON.stringify(d, null, 2)}</pre>
      </div>
    )
  }

  return (
    <div className="combined-chatbot">          
      {(learningLanguage === 'Russian' || learningLanguage === 'Finnish') && (
        <WordNestModal
          wordToCheck={wordNestChosenWord}
          setWordToCheck={setWordNestChosenWord}
          open={wordNestModalOpen}
          setOpen={setWordNestModalOpen}
          storyWord={translationState.surfaceWord || currentWord?.surface}
        />
      )}

      <div className="ai-assistant-header">
        <RobotIcon className="ai-header-icon" size={24} />
        <h3 className="ai-header-title">
            <FormattedMessage id="chatbot-toggle-label" />
        </h3>
      </div>

      { currentWord && isEmpty(currentWord) && translationState && isEmpty(translationState.data) && isEmpty(translationState.surfaceWord) && (
        <div className="first-message">
          <div className="message message-bot">
            <FormattedMessage id="chatbox-initial-instruction" />
          </div>
        </div>          
      )}
      {/* Exercise block */}
      { helperActiveTab === 'exercise' && (            
        <div className="chatbot-content">
          <div className="chatbot-header">                 
            <Popup
              content={
                <span style={{ whiteSpace: 'nowrap' }}>
                    <FormattedMessage
                        id="chatbot-hints-left"
                        defaultMessage="You have {count} hints left."
                        values={{ count: eloScoreHearts.length }}
                    />
                </span>
              }
              position="top center"
              trigger={
                <div className="bulbs-container"
                  onClick={showAllHintsUsed ? undefined : handleShowHint}
                  style={{ cursor: showAllHintsUsed ? 'default' : 'pointer' }}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                  if ((e.key === 'Enter' || e.key === ' ') && !showAllHintsUsed) {
                    e.preventDefault();
                    handleShowHint();
                  }
                  }}>
                  {eloScoreHearts.map(heart => (
                    <Icon key={`lit-${heart}`} size="small" name="lightbulb" />
                  ))}
                  {spentHints.map(hint => (
                    <Icon key={`spent-${hint}`} size="small" name="lightbulb outline" />
                  ))}
                </div>
              }
            />

            <h4 className="current-word">
                {currentWord.choices?.length ? currentWord.choices.join('/') : currentWord.base}
            </h4>
            <ChatActionMenu 
              handleShowHint={handleShowHint} 
              hasHints={hasHints} 
              showAllHintsUsed={showAllHintsUsed}
              handleShowWordNest={() => {
                  setWordNestChosenWord(currentWord?.lemmas);
                  setWordNestModalOpen(true);
              }}
              showWordNestOption={showWordNestOption}
              lemma={currentWord?.lemmas}
              wordNestChosenWord={wordNestChosenWord}
              setWordNestChosenWord={setWordNestChosenWord}
              wordNestModalOpen={wordNestModalOpen}
              setWordNestModalOpen={setWordNestModalOpen}
              storyWord={translationState.surfaceWord || currentWord?.surface}
              popupMessageId="explain-wordnest-modal"
              setShowContextTranslation={setShowContextTranslation}
              showContexTranslation={showContexTranslation}
              predefinedChatbotRequests={predefinedChatbotRequests}
              validToChat={validToChat}
            />
          </div>
          
          <div className="chatbot-messages-container">
            {isLoadingHistory ? (
              <div style={{ display: 'flex', justifyContent: 'center', padding: '20px' }}>
                  <Spinner inline />
              </div>
            ) : (
                  <>                    
                    {isCurrentWordTranslated && (
                        <>
                          {translationState.pending ? (
                              <div className="message message-bot">
                                <span className="loading-text">Loading translation...</span>
                              </div>
                          ) : (
                              translationState.data?.map((translated, idx) => (                                                
                                <div  
                                  key={translated.URL || translated.lemma || idx} 
                                  className="translation-lemma-card" style={{
                                  padding: '0.5em',
                                  borderRadius: '8px',
                                  backgroundColor: translated.stage !== undefined
                                      ? `${flashcardColors.background[translated.stage]}4D`
                                      : '#f9f9f9',
                                }}>
                                  <Lemma
                                    lemma={translated.lemma}
                                    handleKnowningClick={() => handleKnowningClick(translated.lemma)}
                                    handleNotKnowningClick={() => handleNotKnowningClick(translated.lemma)}
                                    userUrl={translated.user_URL}
                                    inflectionRef={translated.ref}
                                    preferred={translated.preferred}
                                  />
                                  {translated.glosses && translated.glosses.length > 0 && (
                                    <ul className="translation-glosses">
                                      {translated.glosses.map((gloss, i) => (
                                        <li key={i}>{gloss}</li>
                                      ))}
                                    </ul>
                                  )}                                                       
                                </div>                                      
                              ))
                          )}
                        </>
                      )}
                      
                      {messages.length === 0 && spentHints.length === 0 && !emptyHintsList && (
                        <div className="message message-bot">
                          <FormattedMessage 
                            id="click-to-action-menu" 
                            defaultMessage="Click the {icon} menu for more options"
                            values={{
                              icon: <Icon name="ellipsis vertical" style={{ verticalAlign: 'middle' }} />
                            }}
                          />
                        </div>
                      )}

                      { showContexTranslation && (
                        <div className="context-translation-box">                          
                          {contextTranslationState.pending ? <Spinner inline /> : (
                                                      (contextTranslationState.data ? renderContextTranslationContent() : (window?.location?.hostname === 'localhost' || window?.location?.hostname === '127.0.0.1') ? (
                                                        <div className="context-translation-content">
                                                          <p>{contextTranslationState.lastTrans || translationState.surfaceWord || ''}</p>
                                                        </div>
                                                      ) : null)
                                                    )}
                          
                        </div>
                    )}
                      
                      {hintMessageIdx === 0 && (spentHints.length > 0 || emptyHintsList) && (
                        <>                              
                          {currentWord.hint2penalty && attempt === 0 && (
                            <div className="message message-bot message-hint">
                              <div className="hint-item">
                                <Icon name="lightbulb" className="hint-bulb" />
                                <span dangerouslySetInnerHTML={formatGreenFeedbackText(currentWord.hint2penalty.easy)} />
                                {(currentWord.hint2penalty.ref?.length || currentWord.hint2penalty.explanation?.length) && (
                                  <Icon
                                      name="info circle"
                                      className="hint-info-icon"
                                      onMouseDown={() => handleTooltipClick(currentWord.hint2penalty)}
                                  />
                                )}
                              </div>
                            </div>
                            )}
                            
                            {preHints?.map((hint, index) => (
                              <div key={index} className="message message-bot message-hint">
                                <div className="hint-item">
                                  <Icon name="lightbulb" className="hint-bulb" />
                                  <span dangerouslySetInnerHTML={formatGreenFeedbackText(hint.easy)} />
                                  {(hint.ref?.length || hint.explanation?.length || hint.meta !== hint.easy) && (
                                    <Icon
                                      name="info circle"
                                      className="hint-info-icon"
                                      onMouseDown={() => handleTooltipClick(hint)}
                                    />
                                  )}
                                </div>
                              </div>
                            ))}
                        </>
                      )}

                      {/* Chat Messages */}
                      {messages.map((message, index) => (
                          <div
                              ref={index === messages.length - 1 ? latestMessageRef : null}
                              key={index}
                              className={`message message-${message.type}`}
                              style={{ display: 'block' }}
                          >
                              {message.text ? (
                                  <ReactMarkdown children={message.text} />
                              ) : (
                                  <FormattedMessage id="Error rendering message" />
                              )}
                          </div>
                      ))}

                      {/* Hint Messages (after first attempt) */}
                      {hintMessageIdx > 0 && (spentHints.length > 0 || emptyHintsList) && (
                          <>
                              {currentWord.hint2penalty && attempt === 0 && (
                                  <div className="message message-bot message-hint">
                                      <div className="hint-item">
                                          <Icon name="lightbulb" className="hint-bulb" />
                                          <span dangerouslySetInnerHTML={formatGreenFeedbackText(currentWord.hint2penalty.easy)} />
                                          {(currentWord.hint2penalty.ref?.length || currentWord.hint2penalty.explanation?.length) && (
                                              <Icon
                                                  name="info circle"
                                                  className="hint-info-icon"
                                                  onMouseDown={() => handleTooltipClick(currentWord.hint2penalty)}
                                              />
                                          )}
                                      </div>
                                  </div>
                              )}
                              {preHints?.map((hint, index) => (
                                <div key={index} className="message message-bot message-hint">
                                  <div className="hint-item">
                                    <Icon name="lightbulb" className="hint-bulb" />
                                    <span dangerouslySetInnerHTML={formatGreenFeedbackText(hint.easy)} />
                                    {(hint.ref?.length || hint.explanation?.length || hint.meta !== hint.easy) && (
                                        <Icon
                                          name="info circle"
                                          className="hint-info-icon"
                                          onMouseDown={() => handleTooltipClick(hint)}
                                        />
                                    )}
                                  </div>
                                </div>
                              ))}
                          </>
                      )}

                      {isWaitingForResponse && (
                        <div className="message message-bot">
                          <Spinner inline />
                        </div>
                      )}
                      
                      {false && isCurrentWordTranslated && (
                          <>
                              {translationState.pending ? (
                                  <div className="message message-bot">
                                      <span className="loading-text">Loading translation...</span>
                                  </div>
                              ) : (
                                  translationState.data?.map((translated, idx) => (                                                
                                    <div  
                                        key={translated.URL || translated.lemma || idx} 
                                        className="translation-lemma-card" style={{
                                        padding: '0.5em',
                                        borderRadius: '8px',
                                        backgroundColor: translated.stage !== undefined
                                            ? `${flashcardColors.background[translated.stage]}4D`
                                            : '#f9f9f9',
                                    }}>
                                      <Lemma
                                          lemma={translated.lemma}
                                          handleKnowningClick={() => handleKnowningClick(translated.lemma)}
                                          handleNotKnowningClick={() => handleNotKnowningClick(translated.lemma)}
                                          userUrl={translated.user_URL}
                                          inflectionRef={translated.ref}
                                          preferred={translated.preferred}
                                      />
                                      {translated.glosses && translated.glosses.length > 0 && (
                                          <ul className="translation-glosses">
                                              {translated.glosses.map((gloss, i) => (
                                                  <li key={i}>{gloss}</li>
                                              ))}
                                          </ul>
                                      )}                                                       
                                    </div>                                      
                                  ))
                              )}
                          </>
                      )}
                  </>
              )}
          </div>                    
          <div className="chatbot-input-area">
            {(showAllHintsUsed || !hasHints) && (
              <form onSubmit={handleMessageSubmit} className="chatbot-input-form">
                <input
                  type="text"
                  name="userInput"
                  placeholder={intl.formatMessage({ id: 'enter-question-to-chatbot' })}
                  value={currentMessage}
                  disabled={!validToChat || isWaitingForResponse}
                  onChange={(e) => setCurrentMessage(e.target.value)}
                />
                <Button type="submit" primary disabled={!validToChat || isWaitingForResponse}>
                  <FormattedMessage id="submit-chat-message" defaultMessage="Send" />
                </Button>
                <ChatbotSuggestions
                  predefinedChatbotRequests={[]}
                  disabled={!validToChat || isWaitingForResponse}
                />
              </form>
            )}
          </div>                    
        </div>                 
      )}
            
      { helperActiveTab ===  'translation' &&  (          
        <div className="dictionary-content">                    
          {translationState.pending ? (
            <div style={{ padding: '1em' }}>
              <div className="flex space-between" style={{ marginBottom: '1em' }}>
                <div style={{ height: '10px', width: '80px' }}>
                  <Placeholder><PlaceholderLine /></Placeholder>
                </div>
              </div>
              {[1, 2, 3].map(line => (
                <div key={line} style={{ marginBottom: '1em' }}>
                  <Placeholder>
                    <PlaceholderLine />
                    <PlaceholderLine width="50%" />
                  </Placeholder>
                </div>
              ))}
            </div>
          ) : (
            <>            
            {translationState.surfaceWord && (
              <div className="chatbot-header" style={{ marginBottom: '1em' }}>
                <div className="bulbs-container" style={{ opacity: 0, pointerEvents: 'none' }}>
                    {/* Empty container to maintain alignment */}
                </div>
                <h4 className="current-word">
                    {translationState.maskSymbol || translationState.surfaceWord}
                </h4>
                <ChatActionMenu mode="dictionary" 
                  handleShowWordNest={() => {                
                      const lemmaToCheck = translationState.surfaceWord || translationState.data?.[0]?.lemma;
                      setWordNestChosenWord(lemmaToCheck);
                      setWordNestModalOpen(true);
                  }}
                  showWordNestOption={showWordNestOptionDictionary}
                  lemma={translationState.surfaceWord || translationState.data?.[0]?.lemma}
                  wordNestChosenWord={wordNestChosenWord}
                  setWordNestChosenWord={setWordNestChosenWord}
                  wordNestModalOpen={wordNestModalOpen}
                  setWordNestModalOpen={setWordNestModalOpen}
                  storyWord={translationState.surfaceWord || currentWord?.surface}
                  popupMessageId="explain-wordnest-modal"
                  buttonStyle={{ background: 'none', marginTop: '0.5rem' }}
                  setShowContextTranslation={setShowContextTranslation}
                />
              </div>
            )}
            <div className="inline-translation">
            {/* Surface Word with Speaker (existing) */}
            {translationState.surfaceWord &&
            translationState.surfaceWord !== (translationState.data?.[0]?.lemma) && (
                <div style={{ paddingBottom: '0.5em', ...getTextStyle(learningLanguage) }}>
                    <Popup
                        content={<FormattedHTMLMessage id="explain-speaker-surface" />}
                        trigger={<Speaker word={translationState.surfaceWord} />}
                    />
                    <span style={{ color: '#2185D0' }}>
                        {translationState.maskSymbol || translationState.surfaceWord}
                    </span>
                </div>
            )}

            {/* Translation Results */}               

                {translationState.data && translationState.data.length > 0 ? (
            translationState.data.map((translated, idx) => (
                <div
                    key={translated.URL || translated.lemma || idx}
                    style={{
                        marginBottom: '1em',
                        padding: '0.5em',
                        borderRadius: '8px',
                        // Dynamic background color based on flashcard stage
                        backgroundColor: translated.stage !== undefined
                            ? `${flashcardColors.background[translated.stage]}4D`
                            : '#f9f9f9',
                    }}
                >
                    {/* 1. Use the Lemma Component for the header (Speaker + Word + Icons) */}
                    <Lemma
                        lemma={translated.lemma}
                        handleKnowningClick={() => handleKnowningClick(translated.lemma)}
                        handleNotKnowningClick={() => handleNotKnowningClick(translated.lemma)}
                        userUrl={translated.user_URL}
                        inflectionRef={translated.ref}
                        preferred={translated.preferred}
                    />

                    {/* 2. Render the Glosses (Translations) below the Lemma */}
                    {translated.glosses && translated.glosses.length > 0 && (
                        <ul style={{
                            listStyle: 'disc',
                            paddingLeft: '1.5em',
                            color: 'slateGrey',
                            fontStyle: 'italic',
                            marginTop: '0.5rem'
                        }}>
                            {translated.glosses.map((gloss, i) => (
                                <li key={i}>{gloss}</li>
                            ))}
                        </ul>
                    )}                                    
                </div>            
            ))
        ) : (
            <p className="no-translation-text">No translation found.</p>
        )}
            </div>
            { showContexTranslation && (
              <div className="context-translation-box">                          
                {contextTranslationState.pending ? <Spinner inline /> : (
                                            (contextTranslationState.data ? renderContextTranslationContent() : (window?.location?.hostname === 'localhost' || window?.location?.hostname === '127.0.0.1') ? (
                                              <div className="context-translation-content">
                                                <p>{contextTranslationState.lastTrans || translationState.surfaceWord || ''}</p>
                                              </div>
                                            ) : null)
                                          )}                
          </div>
          )}
        </>
        )}              
        </div>
        )}            
    </div>
  )
}

export default CombinedChatbot