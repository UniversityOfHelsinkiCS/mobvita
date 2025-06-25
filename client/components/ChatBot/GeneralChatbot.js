import React, { useState, useEffect } from 'react';
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

console.log("ReactMarkdown:", ReactMarkdown);

const GeneralReadingChatBot = () => {
    const intl = useIntl();
    const dispatch = useDispatch();
    const [currentMessage, setCurrentMessage] = useState("");

    const { messages, isWaitingForResponse, isLoadingHistory, isOpen } = useSelector(({ chatbot }) => chatbot);

    // Fetch conversation history when chatbot starts
    useEffect(() => {
        dispatch(getGeneralAgentConversationHistory());
    }, []);

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

    const handleSuggestedMessage = message => {
        dispatch(getGeneralChatbotResponse(message));
    }

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
                                    <div key={index} className={`message message-${message.type}`}  style={{display: 'block'}}>
                                        {message.text ? <ReactMarkdown children={message.text} /> : <FormattedMessage id="Error rendering message" />}
                                    </div>
                                ))}
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
                            {isWaitingForResponse ? (
                                <Spinner animation="border" variant="warning" />
                            ) : (
                                <FormattedMessage id="submit-chat-message" defaultMessage="Send" />
                            )}
                        </Button>
                        <div className="chatbot-suggestions">
                            <Button type="button" basic disabled={isWaitingForResponse} onClick={() => handleSuggestedMessage('What to do next?')}>
                                <FormattedMessage id="chatbot-message-suggestion-next-steps" />
                            </Button>
                            <Button type="button" basic disabled={isWaitingForResponse} onClick={() => handleSuggestedMessage('How am I doing?')}>
                                <FormattedMessage id="chatbot-message-suggestion-performance" />
                            </Button>
                        </div>
                    </form>
                </>
      )}
        </div>
    );
};

export default GeneralReadingChatBot;