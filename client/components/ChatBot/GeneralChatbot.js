import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { Button, Icon } from 'semantic-ui-react';
import ReactMarkdown from 'react-markdown';
import { useIntl, FormattedMessage } from 'react-intl';
import './Chatbot.scss';
import {
    sendGeneralDialogue,
    removeDialogue,
} from 'Utilities/redux/dialoguesReducer';
import ChatbotSuggestions from './ChatbotSuggestions'
import Spinner from 'Components/Spinner'
import RobotIcon from 'Components/PracticeView/RobotIcon'
import AssistentSettings from 'Components/PracticeView/AssistentSettings'

const GeneralReadingChatBot = () => {
    const intl = useIntl();
    const dispatch = useDispatch();
    const [currentMessage, setCurrentMessage] = useState("");

    // Each URL keeps its own dialogue thread (Profile tabs included). Items live in the
    // dialogues store across navigation; we filter by scope instead of clearing. Threads are
    // frontend-only for the session — sends still POST to the backend, but we don't read the
    // shared backend history back in (it's one global thread and would leak across views).
    const scope = useLocation().pathname;
    const items = useSelector(({ dialogues }) => dialogues.items);
    const isWaitingForResponse = useSelector(({ dialogues }) => !!dialogues.pending[scope]);
    const messages = items.filter(i => i.scope === scope && i.type === 'chatbot-message');

    const latestMessageRef = useRef(null)
    const predefinedChatbotRequests = [
        "chatbot-message-suggestion-next-steps",
        "chatbot-message-suggestion-performance"
    ].map(msgId => ({
        msgId,
        func: sendGeneralDialogue(intl.formatMessage({ id: msgId }), scope)
    }));

    const scrollToLatestMessage = () => latestMessageRef.current?.scrollIntoView({ behavior: 'smooth' })

    useEffect(() => {
        scrollToLatestMessage()
    }, [messages.length])

    // Add a static "init" message from the bot if there are no messages yet
    const initialMessage = {
        text: <FormattedMessage id="general-chatbot-init-mess" values={{ language: intl.locale }} />,
        type: 'bot',
    };

    const handleMessageSubmit = (event) => {
        event.preventDefault();
        if (currentMessage.trim() === '') return;
        dispatch(sendGeneralDialogue(currentMessage, scope));
        setCurrentMessage("");
    };

    const toggleCollapse = () => {
        dispatch({ type: 'TOGGLE_CHATBOT' })
    };

    return (
        <div className="chatbot">
            <div className="ai-assistant-header">
                <RobotIcon className="ai-header-icon" size={24} />
                <h3 className="ai-header-title">
                    <FormattedMessage id="chatbot-toggle-label" />
                </h3>                
            </div>                
            <div className="chatbot-messages">
                {/* Display initial static bot message if no messages are present */}
                {messages.length === 0 && (
                    <div className="message message-bot">
                        {initialMessage.text}
                    </div>
                )}

                {/* Display other messages */}
                {messages.map((message, index) => (
                    <div ref={index === messages.length - 1 ? latestMessageRef : null} key={message.id} className={`message message-${message.role}`}  style={{display: 'block'}}>
                        {message.removable && (
                            <Icon
                                name="close"
                                color="grey"
                                className="dialogue-remove"
                                onClick={() => dispatch(removeDialogue(message.id))}
                            />
                        )}
                        {message.text ? <ReactMarkdown children={message.text} /> : <FormattedMessage id="Error rendering message" />}
                    </div>
                ))}
                {isWaitingForResponse && (
                    <div style={{ display: 'flex', justifyContent: 'center', margin: '20px 0 10px' }}>
                        <Spinner inline />
                    </div>
                )}
            </div>
            <div className="chatbot-input-area">
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
                    predefinedChatbotRequests={predefinedChatbotRequests}
                    disabled={isWaitingForResponse}
                />
            </form>      
        </div>
    </div>
    );
};

export default GeneralReadingChatBot;