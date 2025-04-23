import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Spinner } from 'react-bootstrap';
import { Button, Icon } from 'semantic-ui-react';
import { useIntl, FormattedMessage } from 'react-intl';
import ReactMarkdown from 'react-markdown'
import './Chatbot.scss';
import {
    getReadingPracticeChatbotResponse,
    getReadingPracticeAgentConversationHistory,
} from 'Utilities/redux/chatbotReducer';

const ReadingPracticeChatBot = () => {
    const intl = useIntl();
    const dispatch = useDispatch();
    const [currentMessage, setCurrentMessage] = useState("");
    const [isCollapsed, setIsCollapsed] = useState(false); // Collapse state

    const { 
        readingTestSessionId: session_id, 
        currentReadingTestQuestion: current_reading_test_question,
        attempt_and_feedbacks,
    } = useSelector(({ tests }) => tests);

    const { messages, isWaitingForResponse, isLoadingHistory } = useSelector(({ chatbot }) => chatbot);

    // Fetch conversation history when the chatbot starts
    useEffect(() => {
        if (session_id && current_reading_test_question?.question_id) {
            dispatch(getReadingPracticeAgentConversationHistory(session_id, current_reading_test_question.question_id));
        }
    }, [session_id, current_reading_test_question, dispatch]);

    const handleMessageSubmit = (event) => {
        event.preventDefault();
        if (currentMessage.trim() === '') return;
        dispatch(
            getReadingPracticeChatbotResponse(
                session_id,
                current_reading_test_question.question_id,
                attempt_and_feedbacks,
                currentMessage
            )
        );
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
                                <div key={index} className={`message message-${message.type}`}  style={{display: 'block'}}>
                                    {message.text ? <ReactMarkdown children={message.text} /> : <FormattedMessage id="Error rendering message" />}
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

export default ReadingPracticeChatBot;