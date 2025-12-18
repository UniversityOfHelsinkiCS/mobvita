import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux'
import { useParams } from 'react-router-dom'
import { Spinner } from 'react-bootstrap'
import { Button, Icon } from 'semantic-ui-react';
import { useIntl, FormattedMessage } from 'react-intl';
import ReactMarkdown from 'react-markdown'
import './Chatbot.scss';
import {
    setFocusedWord,
    setReferences,
    setExplanation,
    incrementHintRequests,
    mcExerciseTouched,
} from 'Utilities/redux/practiceReducer'
import {
  formatGreenFeedbackText,
  hiddenFeatures
} from 'Utilities/common'
import { 
    getPracticeChatbotResponse, 
    // getConversationHistory,
    setConversationHistory,
} from 'Utilities/redux/chatbotReducer'
import {
    setSnippetChatHistory
} from 'Utilities/redux/snippetsReducer'
import ChatbotSuggestions from './ChatbotSuggestions'
import { set } from 'lodash';

const PracticeChatbot = () => {
  const intl = useIntl()
  const dispatch = useDispatch()
  const [hintMessageIdx, setHintMessageIdx] = useState(0)
  const [preHints, setPreHints] = useState([])
  const [spentHints, setSpentHints] = useState([])
  const [filteredHintsList, setFilteredHintsList] = useState([])
  const [emptyHintsList, setEmptyHintsList] = useState(false)
  const [eloScoreHearts, setEloScoreHearts] = useState([])
  const [numHints, setNumHints] = useState(0)
  const [currentMessage, setCurrentMessage] = useState("")
  const [currentAnswer, setCurrentAnswer] = useState("")

  const { session_id, storyid, chat_history } = useSelector(({ snippets }) => ({
      session_id: snippets.focused?.session_id,
      storyid: snippets.focused?.storyid,
      // chat_history: snippets.focused?.chat_history
      chat_history: snippets.focused_snippet_chat_history
  }));
  const { messages, exerciseContext, isWaitingForResponse, isLoadingHistory } = useSelector(({ chatbot }) => chatbot)
  const { attempt, currentAnswers, focusedWord: currentWord } = useSelector(({ practice }) => practice)
  const { 
      message: hintMessage, // not in use! keep for compatibility
      hints, 
      listen,
      speak,
      requested_hints: requestedBEHints,
      ID: wordId,
      sentence_id,
      snippet_id, 
      surface,
  } = currentWord || {}

  const [isCollapsed, setIsCollapsed] = useState(false);
  const [validToChat, setValidToChat] = useState(false);
  

  const latestMessageRef = useRef(null)
  const [predefinedChatbotRequests, setPredefinedChatbotRequests] = useState([]);
  const predefinedChatbotMsg = [
    "chatbot-message-suggestion-answer-wrong-reason",
    "chatbot-message-suggestion-analyze-context"
  ]

  const handleMessageSubmit = (event) => {
      event.preventDefault(); 
      if (Object.keys(exerciseContext).length === 0 || currentMessage.trim() === '') return
      
      dispatch(
          getPracticeChatbotResponse(
              session_id, 
              storyid, 
              snippet_id, 
              sentence_id, 
              wordId,
              currentMessage.trim(), 
              currentAnswer.trim(),
              exerciseContext,
              (hints || []).map(hint => hint.easy)
          )
      );
      setCurrentMessage("");
  };

  const toggleCollapse = () => setIsCollapsed(!isCollapsed);

  const scrollToLatestMessage = () => latestMessageRef.current?.scrollIntoView({ behavior: 'smooth' })

  useEffect(() => {
      scrollToLatestMessage()
  }, [messages])

  useEffect(() => {
      if(Object.keys(currentWord).length && !listen && !speak) {
          let totalRequestedHints = []
          const { requestedHintsList, users_answer } = currentAnswers[`${currentWord.ID}-${currentWord.id}`] || {}
          totalRequestedHints = (requestedBEHints || [])
          totalRequestedHints = totalRequestedHints.concat((requestedHintsList || []).filter(hint => !totalRequestedHints.includes(hint)))
          setEloScoreHearts(Array.from({length: hints ? hints.filter(hint => !totalRequestedHints.includes(hint)).length : 0}, (_, i) => i + 1))
          setSpentHints(Array.from({length: requestedHintsList ? requestedHintsList.length : 0}, (_, i) => i + 1))
          setCurrentAnswer(users_answer)
          if (hintMessage && !hints && !totalRequestedHints) {
              setPreHints([])
          } else if (attempt !== 0) {
              setFilteredHintsList(hints || [])
              setPreHints(totalRequestedHints)
          } else {
              setFilteredHintsList(hints?.filter(hint => !hintMessage || hint.easy !== hintMessage.easy))
              setPreHints(totalRequestedHints)
          }
          setValidToChat(true)
      } else {
          setEloScoreHearts([])
          setSpentHints([])
          setPreHints([])
          setFilteredHintsList([])
          setValidToChat(false)
      }
  }, [currentWord, attempt])

  useEffect(() => {
      let word_chat_history = []
      if (chat_history && typeof wordId !== 'undefined' && chat_history.hasOwnProperty(wordId.toString())) {
          word_chat_history = chat_history[wordId.toString()];
      }
    dispatch(setConversationHistory(word_chat_history))
  }, [currentWord])

  useEffect(() => {
      let updatedChatHistory = { ...chat_history };
      updatedChatHistory[wordId] = messages;
      dispatch(setSnippetChatHistory(updatedChatHistory))
  }, [messages])

  useEffect(() => { 
    if (Object.keys(currentWord).length) {
      const { users_answer } = currentAnswers[`${currentWord.ID}-${currentWord.id}`] || {}
      setCurrentAnswer(users_answer)
      setPredefinedChatbotRequests(predefinedChatbotMsg.map(id => (
        {
          msgId: id,
          func: getPracticeChatbotResponse(
            session_id,
            storyid,
            snippet_id,
            sentence_id,
            wordId,
            intl.formatMessage({ id }).trim(),
            users_answer.trim(),
            exerciseContext,
            (hints || []).map(hint => hint.easy)
          )
        }
      )))
    }
  }, [currentAnswers])

  /* ??? move to CSS */
  const info_circle_style = {
      alignSelf: 'flex-start',
      marginLeft: '0.5rem',
      marginTop: '-4px',
      color: '#17a2b8',
      fontSize: 'larger'
  }

  
  const handlePreHints = () => {
    if (
        (!hints && !preHints) ||
        (filteredHintsList.length < 1 && preHints.length < 1) ||
        hints?.length < 1
      ) {
        setEmptyHintsList(true)
        handleHintRequest()
      } else {
        const newHintList = preHints.concat(filteredHintsList[preHints.length - requestedBEHints.length])
        setPreHints(newHintList)
        handleHintRequest(newHintList)
      }
  }

  const handleTooltipClick = (hint) => {
    if (hint.ref?.length) dispatch(setReferences({[hint.keyword || hint.easy]: hint.ref}))
    if (hint.explanation?.length || hint.meta !== hint.easy ) dispatch(setExplanation({
      [hint.keyword || hint.easy]: hint.easy === hint.meta && hint.explanation || [hint.meta, ...(hint.explanation || [])]
    }))
  }

  const handleHintRequest = newHintList => {
      const newRequestNum = preHints.length + 1
      const penalties = newHintList
          ?.filter(hint => hint.penalty)
          .map(hint => hint.penalty)
      dispatch(incrementHintRequests(`${currentWord.ID}-${currentWord.id}`, newRequestNum, newHintList, penalties))

      setSpentHints(spentHints.concat(1))
      setEloScoreHearts(eloScoreHearts.slice(0, -1))
      setHintMessageIdx(messages.length > 0 ? messages.length : 0);
  }


  return (
    <div className="chatbot practice-chatbot">
      <Button
        onClick={toggleCollapse}
        className="chatbot-toggle"
        style={{ background: 'mistyrose', margin: 0 }}
      >
        <div>
          <FormattedMessage id="chatbot-toggle-label" />
          {isCollapsed ? (
            <Icon name="angle up" size="large" />
          ) : (
            <Icon name="angle down" size="large" />
          )}
        </div>
      </Button>
      {!isCollapsed && (
        <>
          {/************ current context BANNER = current exercise LEMMA ************/}
          <div className="chatbot-context-info">
            {validToChat && (
              <div className="flex space-between">
                <div className="chatbot-context-item">
                  {currentWord.choices?.length ? currentWord.choices.join('/') : currentWord.base}
                </div>
                {
                  /* Display lightbulbs */
                  Object.keys(currentWord).length > 0 && (
                    <div>
                      {eloScoreHearts.map(heart => (
                        <Icon size="small" name="lightbulb" style={{ marginLeft: '0.25em' }} />
                      ))}
                      {spentHints.map(hint => (
                        <Icon size="small" name="lightbulb outline" style={{ marginLeft: '0.25em' }} />
                      ))}
                    </div>
                  )
                }
              </div>
            )}
          </div>
          {/************************* BELOW BANNER: BUBBLES *************************/}
          <div className="chatbot-messages">
            {isLoadingHistory ? (
              <Spinner animation="border" variant="info" className="spinner-history" />
            ) : (
              <>
                {/* hintMessageIdx === 0 means FIRST ATTEMPT */}
                {hintMessageIdx == 0 && Object.keys(currentWord).length > 0
                 && (spentHints.length > 0 || emptyHintsList) && (
                  <div className="message message-bot flex space-between">
                    <ul>
                      {hintMessage && attempt === 0 && (
                        <span className="flex debug_Hints debug_ZERO">
                          <li dangerouslySetInnerHTML={formatGreenFeedbackText(hintMessage.easy)} />
                          {/*show ONLY ONE (i) if either references or explanation exists*/
                            (hintMessage.ref?.length || hintMessage.explanation?.length) && (
                            <Icon name="info circle" style={info_circle_style} 
                            onMouseDown={() => handleTooltipClick(hintMessage)}/>
                          )}
                        </span>
                      )}
                      {preHints?.map((hint, index) => (
                        <span key={index} className="flex debug_PreHints debug_ZERO">
                          <li dangerouslySetInnerHTML={formatGreenFeedbackText(hint.easy)} />
                          {/*show ONLY ONE (i) if either references or explanation exists*/
                            (hint.ref?.length || hint.explanation?.length || hint.meta !== hint.easy)
                              && (<Icon name="info circle" style={info_circle_style} 
                              onMouseDown={() => handleTooltipClick(hint)}/>)}
                        </span>
                      ))}
                    </ul>
                  </div>
                )}
                {/***** BUBBLE before exercise is selected: no feedback yet to show *****/}
                {!validToChat && (
                  <div className="message message-bot flex space-between">
                    <FormattedMessage id="chatbox-initial-instruction" />
                  </div>
                )}
                {/******************* iterate over messages=BUBBLES *******************/}
                {messages.map((message, index) => (
                  <>
                    {/********this is for CHATTING: MESSAGE-USER + MESSAGE-BOT ********/}
                    {/******** MESSAGE-USER + MESSAGE-BOT: no other types ********/}
                    <div ref={index === messages.length - 1 ? latestMessageRef : null} key={index} className={`message message-${message.type}`} style={{display: 'block'}}>
                      {message.text ? (
                        <ReactMarkdown children={message.text} />
                      ) : (
                        <FormattedMessage id="Error rendering message" />
                      )}
                    </div>
                    {/******** HINT: this must be for MESSAGE-BOT ********/}
                    {(index === hintMessageIdx - 1 && hintMessageIdx > 0)
                     && Object.keys(currentWord).length > 0
                     && (spentHints.length > 0 || emptyHintsList) && (
                      <div className="message message-bot flex space-between">
                        <ul>
                          {hintMessage && attempt === 0 && (
                            <span className="flex debug_Hints debug_nonZERO">
                              <li dangerouslySetInnerHTML={formatGreenFeedbackText(hintMessage.easy)} />
                              {/* content to show AFTER message at index hintMessageIdx */}
                              {(hintMessage.ref?.length || hintMessage.explanation?.length) && (
                                <Icon 
                                  name="info circle"
                                  style={{ alignSelf: 'flex-start', marginLeft: '0.5rem' }}
                                  onMouseDown={() => handleTooltipClick(hint)}
                                />
                              )}
                            </span>
                          )}
                          {/******** ??? why are prehints here ? ********/}
                          {preHints?.map((hint, index) => (
                            <span key={index} className="flex debug_PreHints debug_nonZERO">
                              <li dangerouslySetInnerHTML={formatGreenFeedbackText(hint.easy)} />
                              {( hint.ref?.length || hint.explanation?.length || hint.meta !== hint.easy)
                               && (<Icon name="info circle" style={info_circle_style} />)}
                            </span>
                          ))}
                        </ul>
                      </div>
                    )}
                  </>
                ))}
                {isWaitingForResponse && (
                  <div style={{ display: 'flex', justifyContent: 'center', margin: '20px 0 10px' }}>
                    <Spinner animation="border" variant="info" />
                  </div>
                )}
              </>
            )}
          </div>
          {/******************* OUT OF feedback: allow CHATTING *******************/}
          {eloScoreHearts == 0 ?
           (<form onSubmit={handleMessageSubmit} className="chatbot-input-form">
                <input 
                    type="text" 
                    name="userInput" 
                    placeholder={intl.formatMessage({id: 'enter-question-to-chatbot'})}
                    value={currentMessage} 
                    disabled={!validToChat || isWaitingForResponse}
                    onChange={(e) => setCurrentMessage(e.target.value)} 
                />
                <Button type="submit" primary disabled={!validToChat || isWaitingForResponse}>
                    {/* isWaitingForResponse
                     ? <Spinner animation="border" variant="warning" />
                     : <FormattedMessage id="submit-chat-message" defaultMessage="Send" />
                    */}
                  <FormattedMessage id="submit-chat-message" defaultMessage="Send" />
                </Button>
              <ChatbotSuggestions
                predefinedChatbotRequests={predefinedChatbotRequests}
                disabled={!validToChat || isWaitingForResponse}
              />
            </form>): (
              <Button primary onMouseDown={handlePreHints}>
                <FormattedMessage id="ask-for-a-hint" />
              </Button>
            )}
        </>
      )}
    </div>
  );
};

export default PracticeChatbot;
