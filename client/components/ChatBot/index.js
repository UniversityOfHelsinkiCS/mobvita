import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux'
import { useParams } from 'react-router-dom'
import { Spinner } from 'react-bootstrap'
import { Button, Icon } from 'semantic-ui-react';
import { useIntl, FormattedMessage } from 'react-intl';
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
    getResponse, 
    // getConversationHistory,
    setConversationHistory
} from 'Utilities/redux/chatbotReducer'
import {
    setSnippetChatHistory
} from 'Utilities/redux/snippetsReducer'

const Chatbot = () => {
    const intl = useIntl()
    const dispatch = useDispatch()
    const [hintMessageIdx, setHintMessageIdx] = useState(0)
    const [preHints, setPreHints] = useState([])
    const [spentHints, setSpentHints] = useState([])
    const [filteredHintsList, setFilteredHintsList] = useState([])
    const [emptyHintsList, setEmptyHintsList] = useState(false)
    const [eloScoreHearts, setEloScoreHearts] = useState([])
    const [requested_hints, setRequestedHints] = useState([])
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
        message: hintMessage, 
        ref, 
        explanation, 
        hint2penalty, 
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


    const handleMessageSubmit = (event) => {
        event.preventDefault(); 
        if (exerciseContext.trim() === '' || currentMessage.trim() === '') return;
        let formattedContext = `Exercise context: ${exerciseContext}`;
        formattedContext += "\n\nExpected answer: " + currentWord.surface
        if (hints && hints.length > 0) {
            const formattedHints = hints.map(hint => `- ${hint}`);
            formattedContext += "\n\nProvided hints:\n" + formattedHints.join("\n");
        }
        if (currentAnswer){
            formattedContext += "\n\nStudent's answer: " + currentAnswer
        }
        dispatch(
            getResponse(
                session_id, 
                storyid, 
                snippet_id, 
                sentence_id, 
                wordId,
                currentMessage.trim(), 
                formattedContext.trim(), 
                surface.trim()
            )
        );
        setCurrentMessage("");
    };

    const toggleCollapse = () => setIsCollapsed(!isCollapsed);

    useEffect(() => {
        if(Object.keys(currentWord).length && !listen && !speak) {
            let totalRequestedHints = []
            const { requestedHintsList, user_answer } = currentAnswers[`${currentWord.ID}-${currentWord.id}`] || {}
            totalRequestedHints = (requestedBEHints || [])
            totalRequestedHints = totalRequestedHints.concat((requestedHintsList || []).filter(hint => !totalRequestedHints.includes(hint)))
            setEloScoreHearts(Array.from({length: hints ? hints.length - totalRequestedHints.length : 0}, (_, i) => i + 1))
            setSpentHints(Array.from({length: requestedHintsList ? requestedHintsList.length : 0}, (_, i) => i + 1))
            setCurrentAnswer(user_answer)
            if (hintMessage && !hints && !totalRequestedHints) {
                setPreHints([])
            } else if (attempt !== 0) {
                setFilteredHintsList(hints || [])
                setPreHints(totalRequestedHints)
            } else {
                setFilteredHintsList(hints?.filter(hint => hint !== hintMessage))
                setPreHints(totalRequestedHints)
            }
            setRequestedHints(totalRequestedHints)
            setValidToChat(true)
        } else {
            setEloScoreHearts([])
            setSpentHints([])
            setPreHints([])
            setFilteredHintsList([])
            setRequestedHints([])
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

    /* ??? move to CSS */
    const info_circle_style = { alignSelf: 'flex-start', marginLeft: '0.5rem' }

    const checkHintForExplanation = hint => {
        const explanationKey = Object.keys(explanation)[0]
        if (hint?.includes(explanationKey)) {
          return true
        }
        return false
    }
    
    const showReferenceIcon = hint => {
      if (Object.keys(ref).find(key => hint.includes(key))) {
        return true
      }
      return false
    }
    
    const handlePreHints = () => {
      if (
          (!hints && !requested_hints) ||
          (filteredHintsList.length < 1 && requested_hints.length < 1) ||
          hints?.length < 1
        ) {
          setEmptyHintsList(true)
          handleHintRequest()
        } else {
          const newHintList = preHints.concat(
            filteredHintsList[preHints.length - requested_hints?.length]
          )
          setPreHints(newHintList)
          handleHintRequest(newHintList)
        }
    }

    const handleTooltipClick = () => {
    if (ref) {
        const requestedRefs = {}
        const refKeys = Object.keys(ref)
        for (let i = 0; i < refKeys.length; i++) {
        for (let j = 0; j < preHints.length; j++) {
            if (!requestedRefs[refKeys[i]] && preHints[j].includes(refKeys[i])) {
            requestedRefs[refKeys[i]] = ref[refKeys[i]]
            }
        }
        }
        if (Object.keys(requestedRefs).length > 0) {
        dispatch(setReferences(requestedRefs))
        }
    }

    if (explanation) {
        const requestedExplanations = {}
        const explKeys = Object.keys(explanation)

        for (let i = 0; i < explKeys.length; i++) {
        for (let j = 0; j < preHints.length; j++) {
            if (!requestedExplanations[explKeys[i]] && preHints[j].includes(explKeys[i])) {
            requestedExplanations[explKeys[i]] = explanation[explKeys[i]]
            }
        }
        }
        if (Object.keys(requestedExplanations).length > 0) {
        dispatch(setExplanation(requestedExplanations))
        }
    }
    }

    const handleHintRequest = newHintList => {
        const newRequestNum = preHints.length + 1
        const penalties = newHintList
            ?.filter(hint => hint2penalty[hint])
            .map(hint => hint2penalty[hint])
        dispatch(incrementHintRequests(`${currentWord.ID}-${currentWord.id}`, newRequestNum, newHintList, penalties))

        setSpentHints(spentHints.concat(1))
        setEloScoreHearts(eloScoreHearts.slice(0, -1))
        setHintMessageIdx(messages.length > 0 ? messages.length : 0);
    }

    console.log("HintMessageIdx", hintMessageIdx)

  return (
    <div className="chatbot">
      <Button onClick={toggleCollapse} className="chatbot-toggle"
              style={{background: "mistyrose", margin: 0}}>
        {isCollapsed ?
         <Icon name="angle up" size='large' /> :
         <Icon name="angle down" size='large' />}
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
                {hintMessageIdx == 0 && Object.keys(currentWord).length > 0
                 && (spentHints.length > 0 || emptyHintsList) && (
                  <div className="message message-bot flex space-between"
                       onMouseDown={handleTooltipClick}>
                    <ul>
                      {hintMessage && attempt === 0 && (
                        <span className="flex Hints ZERO">
                          <li dangerouslySetInnerHTML={formatGreenFeedbackText(hintMessage)} />
                          {/*show ONLY ONE (i) if either references or explanation exists*/
                            (ref || explanation) && (
                            <Icon name="info circle" style={info_circle_style} />
                          )}
                        </span>
                      )}
                      {preHints?.map((hint, index) => (
                        <span key={index} className="flex PreHints ZERO">
                          <li dangerouslySetInnerHTML={formatGreenFeedbackText(hint)} />
                          {/*show ONLY ONE (i) if either references or explanation exists*/
                            (ref && showReferenceIcon(hint)
                             || explanation && checkHintForExplanation(hint))
                              && (<Icon name="info circle" style={info_circle_style} />)}
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
                    {/******** ??? this must be for MESSAGE-USER ? ********/}
                    {/******** ??? MESSAGE-USER + MESSAGE-BOT: what other types? ********/}
                    <div key={index} className={`message message-${message.type}`}>
                      {message.text}
                    </div>
                    {/******** ??? this must be for MESSAGE-BOT ? ********/}
                    {(index === hintMessageIdx - 1 && hintMessageIdx > 0)
                     && Object.keys(currentWord).length > 0
                     && (spentHints.length > 0 || emptyHintsList) && (
                      <div className="message message-bot flex space-between"
                           onMouseDown={handleTooltipClick}>
                        <ul>
                          {hintMessage && attempt === 0 && (
                            <span className="flex Hints nonZERO">
                              <li dangerouslySetInnerHTML={formatGreenFeedbackText(hintMessage)} />
                              {/* content to show AFTER message at index hintMessageIdx */}
                              {(ref || explanation) && (
                                <Icon 
                                  name="info circle"
                                  style={{ alignSelf: 'flex-start', marginLeft: '0.5rem' }}
                                />
                              )}
                            </span>
                          )}
                          {/******** ??? why are prehints here ? ********/}
                          {preHints?.map((hint, index) => (
                            <span key={index} className="flex PreHints nonZERO">
                              <li dangerouslySetInnerHTML={formatGreenFeedbackText(hint)} />
                              {(ref && showReferenceIcon(hint)
                                || explanation && checkHintForExplanation(hint))
                               && (<Icon name="info circle" style={info_circle_style} />)}
                            </span>
                          ))}
                        </ul>
                      </div>
                    )}
                  </>
                ))}
              </>
            )}
          </div>
          {/******************* OUT OF feedback: allow CHATTING *******************/}
          {eloScoreHearts == 0 ?
           (<form onSubmit={handleMessageSubmit} className="chatbot-input-form">
              <input 
                type="text" 
                name="userInput" 
                placeholder={intl.formatMessage({ id: 'enter-question-to-chatbot' })}
                value={currentMessage} 
                disabled={!validToChat || isWaitingForResponse}
                onChange={(e) => setCurrentMessage(e.target.value)} 
              />
              <Button type="submit" primary disabled={!validToChat || isWaitingForResponse}>
                {isWaitingForResponse ? <Spinner animation="border" variant="white" size="sm" /> : <FormattedMessage id="submit-chat-message" defaultMessage="Send" />}
              </Button>
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

export default Chatbot;