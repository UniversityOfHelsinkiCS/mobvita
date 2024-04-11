import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux'

import { Button, Icon } from 'semantic-ui-react';
import { FormattedMessage } from 'react-intl';
import './Chatbot.css';

import { setCurrentMessage, getResponse } from 'Utilities/redux/chatbotReducer' 

const Chatbot = () => {
    const dispatch = useDispatch()
    const { messages, currentMessage, currentWord, currentContext } = useSelector(({ chatbot }) => chatbot)
    const [isCollapsed, setIsCollapsed] = useState(false);

    const onChangeCurrentMessage = (value) => {
        dispatch(setCurrentMessage(value));
    }

    const handleMessageSubmit = (event) => {
        event.preventDefault(); 
        if (currentMessage.trim() === '') return;
        dispatch(getResponse(currentMessage.trim(), currentContext.trim()));
        dispatch(setCurrentMessage(""));
    };

    const toggleCollapse = () => setIsCollapsed(!isCollapsed);

    return (
        <div className="chatbot">
            <Button onClick={toggleCollapse} className="chatbot-toggle">
                {isCollapsed ? <Icon name="angle up" /> : <Icon name="angle down" />}
            </Button>
            {!isCollapsed && (
                <>
                    <div className="chatbot-messages">
                        {messages.map((message, index) => (
                            <div key={index} className={`message message-${message.type}`}>
                                {message.text}
                            </div>
                        ))}
                    </div>
                    {/* Displaying currentWordId and currentSnippetId */}
                    <div 
                        className="context-info" 
                        style={{ 
                            backgroundColor: 'green',
                            marginLeft: '0.5em',
                            marginRight: '0.5em',
                            paddingLeft: '0.5em',
                            color: 'white',
                        }}
                    >
                        {currentWord && (
                            <div className="context-item">
                                {currentWord}
                            </div>
                        )}
                    </div>
                    <form onSubmit={handleMessageSubmit} className="chatbot-input-form">
                        <input 
                            type="text" 
                            name="userInput" 
                            value={currentMessage} 
                            onChange={(e) => onChangeCurrentMessage(e.target.value)} 
                        />
                        <Button type="submit" primary>
                            <FormattedMessage id="submit-chat-message" defaultMessage="Send" />
                        </Button>
                    </form>
                </>
            )}
        </div>
    );
};

export default Chatbot;
