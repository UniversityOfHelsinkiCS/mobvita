import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Spinner } from 'react-bootstrap';
import { Button, Icon } from 'semantic-ui-react';
import ReactMarkdown from 'react-markdown';
import { useIntl, FormattedMessage } from 'react-intl';
import './Chatbot.scss';
import {
    getGeneralAgentConversationHistory,
    getGeneralChatbotResponse,
} from 'Utilities/redux/chatbotReducer';
import ChatbotSuggestions from './ChatbotSuggestions'

console.log("ReactMarkdown:", ReactMarkdown);

const GeneralReadingChatBot = () => {
    const intl = useIntl();
    const dispatch = useDispatch();
    const [currentMessage, setCurrentMessage] = useState("");

    const { messages, isWaitingForResponse, isLoadingHistory, isOpen } = useSelector(({ chatbot }) => chatbot);
    const latestMessageRef = useRef(null)
    const predefinedChatbotRequests = [
        "chatbot-message-suggestion-next-steps",
        "chatbot-message-suggestion-performance"
    ].map(msgId => ({
        msgId,
        func: getGeneralChatbotResponse(intl.formatMessage({ id: msgId }))
    }));
    // Fetch conversation history when chatbot starts
    useEffect(() => {
        dispatch(getGeneralAgentConversationHistory());
    }, []);

    const scrollToLatestMessage = () => latestMessageRef.current?.scrollIntoView({ behavior: 'smooth' })

    useEffect(() => {
        scrollToLatestMessage()
    }, [messages])

    // Add a static "init" message from the bot if there are no messages yet
    const initialMessage = {
        text: <FormattedMessage id="general-chatbot-init-mess" values={{ language: intl.locale }} />,
        type: 'bot',
    };

    const handleMessageSubmit = (event) => {
        event.preventDefault();
        if (currentMessage.trim() === '') return;
        dispatch(getGeneralChatbotResponse(currentMessage));
        setCurrentMessage("");
    };

    const toggleCollapse = () => {
        dispatch({ type: 'TOGGLE_CHATBOT' })
    };

    return (
        <div className="chatbot">
            {/* Collapse Button */}
            <Button 
                onClick={toggleCollapse} 
                className="chatbot-toggle" 
                style={{ background: "mistyrose", margin: 0 }}
            >
                <div>
                    <FormattedMessage id="chatbot-toggle-label" />
                    {!isOpen ? (
                        <Icon name="angle up" size="large" />
                    ) : (
                        <Icon name="angle down" size="large" />
                    )}
                </div>
            </Button>

            {isOpen && (
                <>
                    <div className="chatbot-messages">
                        {isLoadingHistory ? (
                            <Spinner animation="border" variant="info" className="spinner-history" />
                        ) : (
                            <>
                                {/* Display initial static bot message if no messages are present */}
                                {messages.length === 0 && (
                                    <div className="message message-bot">
                                        {initialMessage.text}
                                    </div>
                                )}

                                {/* Display other messages */}
                                {messages.map((message, index) => (
                                    <div ref={index === messages.length - 1 ? latestMessageRef : null} key={index} className={`message message-${message.type}`}  style={{display: 'block'}}>
                                        {message.text ? <ReactMarkdown children={message.text} /> : <FormattedMessage id="Error rendering message" />}
                                    </div>
                                ))}
                                {isWaitingForResponse && (
                                    <div style={{ display: 'flex', justifyContent: 'center', margin: '20px 0 10px' }}>
                                        <Spinner animation="border" variant="info" />
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                    <form onSubmit={handleMessageSubmit} className="chatbot-input-form">
                        <input
                            type="text"
                            name="userInput"
                            placeholder={intl.formatMessage({ id: 'enter-question-to-chatbot' })}
                            value={currentMessage}
                            disabled={isWaitingForResponse}
                            onChange={(e) => setCurrentMessage(e.target.value)}
                        />
                        <Button type="submit" primary disabled={isWaitingForResponse}>
                            <FormattedMessage id="submit-chat-message" defaultMessage="Send" />
                        </Button>
                        <ChatbotSuggestions
                            isWaitingForResponse={isWaitingForResponse}
                            predefinedChatbotRequests={predefinedChatbotRequests}
                        />
          </form>
        </>
      )}
        </div>
    );
};

export default GeneralReadingChatBot;