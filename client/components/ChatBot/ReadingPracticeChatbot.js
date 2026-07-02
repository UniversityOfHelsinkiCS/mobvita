import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Button } from 'semantic-ui-react';
import { useIntl, FormattedMessage } from 'react-intl';
import ReactMarkdown from 'react-markdown'
import './Chatbot.scss';
import {
    getReadingPracticeChatbotResponse,
    getReadingPracticeAgentConversationHistory
} from 'Utilities/redux/chatbotReducer';
import ChatbotSuggestions from './ChatbotSuggestions'
import Spinner from 'Components/Spinner'
import RobotIcon from 'Components/PracticeView/RobotIcon'
import AssistentSettings from 'Components/PracticeView/AssistentSettings'

const ReadingPracticeChatBot = ({
    questionDone = false,
    sessionId: sessionIdProp,
    questionId: questionIdProp,
    attemptsAndFeedbacks: attemptsAndFeedbacksProp,
    loadHistory = true,
    translationSlot = null,
}) => {
    const intl = useIntl();
    const dispatch = useDispatch();
    const [currentMessage, setCurrentMessage] = useState("");

    // Defaults to the reading-test `tests` state, but callers (e.g. the story-based
    // ReadingPracticeView, which has no reading-test session) can supply the context via props.
    const tests = useSelector(({ tests }) => tests);
    const session_id = sessionIdProp ?? tests.readingTestSessionId;
    const reading_question_id = questionIdProp ?? tests.currentReadingTestQuestion?.question_id;
    const attempt_and_feedbacks = attemptsAndFeedbacksProp ?? tests.attempt_and_feedbacks;

    const { messages, isWaitingForResponse, isLoadingHistory } = useSelector(({ chatbot }) => chatbot);

    // Word translation is shown inline in the assistant panel (between header and messages) when a
    // story word has been clicked, so the chat input stays pinned to the bottom.
    const { surfaceWord: translationSurfaceWord, pending: translationPending } =
        useSelector(({ translation }) => translation) || {};
    const showTranslation = Boolean(translationSlot && (translationSurfaceWord || translationPending));

    // The assistant only becomes available once the question is done (answered correctly, or
    // after the allowed attempts / feedback). Until then the panel shows but the input is locked.
    const inputDisabled = isWaitingForResponse || !questionDone;

    const latestMessageRef = useRef(null)

    const scrollToLatestMessage = () => latestMessageRef.current?.scrollIntoView({ behavior: 'smooth' })

    const predefinedChatbotRequests = [
        "reading-chatbot-suggestion-explain-answer",
        "reading-chatbot-suggestion-why-others-wrong"
    ].map(msgId => ({
        msgId,
        func: getReadingPracticeChatbotResponse(
            session_id,
            reading_question_id,
            attempt_and_feedbacks,
            intl.formatMessage({ id: msgId })
        )
    }));

    useEffect(() => {
        scrollToLatestMessage()
    }, [messages.length])

    // Fetch conversation history when the chatbot starts
    useEffect(() => {
        if (loadHistory && session_id && reading_question_id) {
            dispatch(getReadingPracticeAgentConversationHistory(session_id, reading_question_id));
        }
    }, [loadHistory, session_id, reading_question_id, dispatch]);

    const handleMessageSubmit = (event) => {
        event.preventDefault();
        if (currentMessage.trim() === '') return;
        dispatch(
            getReadingPracticeChatbotResponse(
                session_id,
                reading_question_id,
                attempt_and_feedbacks,
                currentMessage
            )
        );
        setCurrentMessage("");
    };

    return (
        <div className="chatbot">
            <div className="ai-assistant-header">
                <RobotIcon className="ai-header-icon" size={24} />
                <h3 className="ai-header-title">
                    <FormattedMessage id="chatbot-toggle-label" />
                </h3>
                <AssistentSettings className="settings-icon" />
            </div>
            <div className="chatbot-messages">
                {showTranslation && (
                    <div className="rp-translation-slot" style={{ marginBottom: 10 }}>
                        {translationSlot}
                    </div>
                )}
                {!questionDone ? (
                    // Intro hint — hidden once a translation card is shown or the chatbot unlocks.
                    !showTranslation && (
                        <div className="message message-bot">
                            <FormattedMessage
                                id="reading-chatbot-answer-first"
                                defaultMessage="Click on words to see their translations. The chatbot becomes available once you answer correctly or use all your attempts."
                            />
                        </div>
                    )
                ) : isLoadingHistory ? (
                    <div style={{ display: 'flex', justifyContent: 'center', padding: '20px' }}>
                        <Spinner inline />
                    </div>
                ) : (
                    <>
                        {messages.map((message, index) => (
                            <div
                                ref={index === messages.length - 1 ? latestMessageRef : null}
                                key={index}
                                className={`message message-${message.type}`}
                                style={{ display: 'block' }}
                            >
                                {message.text ? <ReactMarkdown children={message.text} /> : <FormattedMessage id="Error rendering message" />}
                            </div>
                        ))}
                        {isWaitingForResponse && (
                            <div style={{ display: 'flex', justifyContent: 'center', margin: '20px 0 10px' }}>
                                <Spinner inline />
                            </div>
                        )}
                    </>
                )}
            </div>
            <div className="chatbot-input-area">
                <form onSubmit={handleMessageSubmit} className="chatbot-input-form">
                    <input
                        type="text"
                        name="userInput"
                        placeholder={intl.formatMessage({ id: 'enter-question-to-chatbot' })}
                        value={currentMessage}
                        disabled={inputDisabled}
                        onChange={(e) => setCurrentMessage(e.target.value)}
                    />
                    <Button type="submit" primary disabled={inputDisabled}>
                        <FormattedMessage id="submit-chat-message" defaultMessage="Send" />
                    </Button>
                    <ChatbotSuggestions
                        predefinedChatbotRequests={predefinedChatbotRequests}
                        disabled={inputDisabled}
                    />
                </form>
            </div>
        </div>
    );
};

export default ReadingPracticeChatBot;
