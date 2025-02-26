import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Spinner } from 'react-bootstrap';
import { Button, Icon } from 'semantic-ui-react';
import { useIntl, FormattedMessage } from 'react-intl';
import './Chatbot.scss';
import {
    getGeneralAgentConversationHistory,
    getGeneralChatbotResponse,
} from 'Utilities/redux/chatbotReducer';

const GeneralReadingChatBot = () => {
    const intl = useIntl();
    const dispatch = useDispatch();
    const [currentMessage, setCurrentMessage] = useState("");
    const [isCollapsed, setIsCollapsed] = useState(false); // Collapse state

    const { generalChatbotSessionId: session_id } = useSelector(({ chatbot }) => chatbot);
    const { messages, isWaitingForResponse, isLoadingHistory } = useSelector(({ chatbot }) => chatbot);

    // Fetch conversation history when chatbot starts
    useEffect(() => {
        if (session_id) {
            dispatch(getGeneralAgentConversationHistory(session_id));
        }
    }, [session_id, dispatch]);

    const handleMessageSubmit = (event) => {
        event.preventDefault();
        if (currentMessage.trim() === '') return;
        dispatch(getGeneralChatbotResponse(session_id, currentMessage));
        setCurrentMessage("");
    };

    const toggleCollapse = () => {
        setIsCollapsed(!isCollapsed);
    };

    return (
        <div className="chatbot">
            {/* Collapse Button */}
            <Button 
                onClick={toggleCollapse} 
                className="chatbot-toggle" 
                style={{ background: "mistyrose", margin: 0 }}
            >
                {isCollapsed ? (
                    <Icon name="angle up" size="large" />
                ) : (
                    <Icon name="angle down" size="large" />
                )}
            </Button>

            {!isCollapsed && (
                <>
                    <div className="chatbot-messages">
                        {isLoadingHistory ? (
                            <Spinner animation="border" variant="info" className="spinner-history" />
                        ) : (
                            messages.map((message, index) => (
                                <div key={index} className={`message message-${message.type}`}>
                                    {message.text}
                                </div>
                            ))
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
                    </form>
                </>
            )}
        </div>
    );
};

export default GeneralReadingChatBot;