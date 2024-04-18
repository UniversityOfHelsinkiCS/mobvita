import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux'
import { useParams } from 'react-router-dom'
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
  } from 'Utilities/common'
import { setCurrentMessage, getResponse } from 'Utilities/redux/chatbotReducer' 

const Chatbot = () => {
    const intl = useIntl()
    const dispatch = useDispatch()
    const [preHints, setPreHints] = useState([])
    const [spentHints, setSpentHints] = useState([])
    const [filteredHintsList, setFilteredHintsList] = useState([])
    const [emptyHintsList, setEmptyHintsList] = useState(false)
    const [eloScoreHearts, setEloScoreHearts] = useState([])
    const [requested_hints, setRequestedHints] = useState([])
    const [currentMessage, setCurrentMessage] = useState("")
    const [currentAnswer, setCurrentAnswer] = useState("")
    const { id: storyId } = useParams()
    const { sessionId } = useSelector(({ snippets }) => snippets)
    const { messages, exerciseContext } = useSelector(({ chatbot }) => chatbot)
    const { attempt, currentAnswers, focusedWord: currentWord } = useSelector(({ practice }) => practice)
    const { 
        message: hintMessage, 
        ref, 
        explanation, 
        hint2penalty, 
        hints, 
        listen,
        requested_hints: requestedBEHints,
        ID: wordId,
        sentence_id,
        snippet_id, 
        surface,
    } = currentWord || {}

    const [isCollapsed, setIsCollapsed] = useState(false);


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
        dispatch(getResponse(sessionId, storyId, snippet_id, sentence_id, wordId,
            currentMessage.trim(), formattedContext.trim(), surface.trim()));
        setCurrentMessage("");
    };

    const toggleCollapse = () => setIsCollapsed(!isCollapsed);

    useEffect(() => {
        if(Object.keys(currentWord).length && !listen) {
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
        } else {
            setEloScoreHearts([])
            setSpentHints([])
            setPreHints([])
            setFilteredHintsList([])
            setRequestedHints([])
        }
        
      }, [currentWord, attempt])

    const checkString = hint => {
        const explanationKey = Object.keys(explanation)[0]
        if (hint?.includes(explanationKey)) {
            return <Icon name="info circle" style={{ alignSelf: 'flex-start', marginLeft: '0.5rem' }} />
        }

        return null
    }
    
    const showRefIcon = hint => {
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
    }



    return (
        <div className="chatbot">
            <Button onClick={toggleCollapse} className="chatbot-toggle">
                {isCollapsed ? <Icon name="angle up" /> : <Icon name="angle down" />}
            </Button>
            {!isCollapsed && (
                <>
                    {/* Display current context: BANNER = current exercise LEMMA */}
                    <div 
                        className="context-info" 
                        style={{ 
                            backgroundColor: 'darkblue',
                            paddingLeft: '0.5em',
                            color: 'white',
                        }}
                    >
                        {currentWord && !currentWord.listen && !currentWord.speak && (
                            <div className="context-item flex space-between">
                                <div style={{whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '20em'}}>
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

                    <div className="chatbot-messages">
                        {
                            Object.keys(currentWord).length > 0 && (spentHints.length > 0 || emptyHintsList) && (
                            <div className="message message-bot flex space-between"
                                onMouseDown={handleTooltipClick}>
                            <ul>
                            {hintMessage && attempt === 0 && (
                                <span className="flex">
                                <li dangerouslySetInnerHTML={formatGreenFeedbackText(hintMessage)} />
                                {ref && (
                                    <Icon
                                    name="info circle"
                                    style={{ alignSelf: 'flex-start', marginLeft: '0.5rem' }}
                                    />
                                )}
                                {explanation && (
                                    <Icon
                                    name="info circle"
                                    style={{ alignSelf: 'flex-start', marginLeft: '0.5rem' }}
                                    />
                                )}
                                </span>
                            )}
                            {preHints?.map(hint => (
                                <span className="flex">
                                <li dangerouslySetInnerHTML={formatGreenFeedbackText(hint)} />
                                {ref && showRefIcon(hint) && (
                                    <Icon
                                    name="info circle"
                                    style={{ alignSelf: 'flex-start', marginLeft: '0.5rem' }}
                                    />
                                )}
                                {explanation && checkString(hint)}
                                </span>
                            ))}
                            </ul>
                            {emptyHintsList && preHints?.length < 1 && (
                                <div className="tooltip-hint" style={{ textAlign: 'left' }}>
                                <FormattedMessage id="no-hints-available" />
                                </div>
                            )}
                            </div>
                            )
                        }

                        {messages.map((message, index) => (
                            <div key={index} className={`message message-${message.type}`}>
                                {message.text}
                            </div>
                        ))}
                    </div>
                    {eloScoreHearts == 0 ? (<form onSubmit={handleMessageSubmit} className="chatbot-input-form">
                        <input 
                            type="text" 
                            name="userInput" 
                            placeholder={intl.formatMessage({ id: 'enter-question-to-chatbot' })}
                            value={currentMessage} 
                            onChange={(e) => setCurrentMessage(e.target.value)} 
                        />
                        <Button type="submit" primary>
                            <FormattedMessage id="submit-chat-message" defaultMessage="Send" />
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
