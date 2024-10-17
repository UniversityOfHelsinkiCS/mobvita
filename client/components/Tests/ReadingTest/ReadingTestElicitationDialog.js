import React, { useState, useEffect } from 'react';
import Draggable from 'react-draggable';
import { Icon } from 'semantic-ui-react';
import { useSelector } from 'react-redux';
import { sanitizeHtml } from 'Utilities/common';
import { FormattedMessage, FormattedHTMLMessage, useIntl } from 'react-intl'
import useWindowDimensions from 'Utilities/windowDimensions';


const ReadingTestElicationDialog = ({ question, showElication, submitElication }) => {
    const bigScreen = useWindowDimensions().width >= 700;

    const [selectedConstruct, setSelectedConstruct] = useState(null)

    const submitResponse = () => {
        if (selectedConstruct) {
            submitElication(selectedConstruct)
        }
    }

    const renderElication = () => (
        <Draggable cancel=".interactable">
            <div
                style={{
                    position: 'absolute',
                    left: '0%',
                    width: bigScreen ? "100%" : "100%",
                    transform: 'translate(-50%, -50%)',
                    zIndex: 1000,
                    padding: "1em",
                    background: "white",
                    borderRadius: "1em",
                    boxShadow: '6px 11px 10px 0px rgba(0, 0, 0, 0.5)',
                }}
            >
                <div className='slider-content'>
                    <div className='content-container' style={
                        {
                            overflowY: 'hidden',
                            overflowX: 'hidden',
                            paddingLeft: '1em',
                            paddingRight: '1em',
                            width: '100%'
                        }
                    }>
                        <div className='elicitation-header' style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}>
                            <h3 style={{ textAlign: 'left', margin: 0, paddingLeft: '10px' }}>
                                <FormattedHTMLMessage
                                    id='experimental-elicitation-question'
                                    // values={{
                                    //     b: (chunks) => <b>{chunks}</b>,
                                    //     i: (chunks) => <i>{chunks}</i>,
                                    //     // br: () => <br />,
                                    //     ul: (chunks) => <ul>{chunks}</ul>,
                                    //     li: (chunks) => <li>{chunks}</li>
                                    //   }}
                                />
                            </h3>
                        </div>
                        <div
                            className='slide-container'
                            style={{
                                height: "100%",
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                margin: "10px"
                            }}
                        >
                            {Object.keys(question.question_concept_feedbacks).map((key, index) => (
                                <button
                                    key={index}
                                    className={`btn ${key === selectedConstruct ? "btn-selected" : ""}`}
                                    style={{
                                        margin: "5px",
                                        width: "100%",
                                        padding: "10px"
                                    }}
                                    onClick={() => setSelectedConstruct(key)}
                                >
                                    {question.question_concept_feedbacks[key].elicitation_message}
                                </button>
                            ))}
                            <button
                                type="submit"
                                className="btn btn-primary"
                                onClick={submitResponse}
                                disabled={selectedConstruct == null}
                                style={{
                                    margin: "5px",
                                    width: "100%",
                                    padding: "20px"
                                }}
                            >
                                <FormattedMessage id='elicitation-submit' />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </Draggable>
    );

    return (
        <div style={{ display: 'flex', position: 'relative' }}>
            {showElication && question?.constructs.length > 1 && renderElication()}
        </div>
    );
};

export default ReadingTestElicationDialog;
