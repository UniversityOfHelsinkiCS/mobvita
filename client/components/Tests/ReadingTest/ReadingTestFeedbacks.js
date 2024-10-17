import React, { useState, useEffect } from 'react';
import Draggable from 'react-draggable';
import { Icon } from 'semantic-ui-react';
import { useSelector } from 'react-redux';
import { sanitizeHtml } from 'Utilities/common';
import { FormattedMessage, FormattedHTMLMessage, useIntl } from 'react-intl'
import useWindowDimensions from 'Utilities/windowDimensions';


const ReadingTestFeedbacks = ({ showFeedbacks, closeFeedbacks }) => {
    const { feedbacks } = useSelector(({ tests }) => tests);
    const [current, setCurrent] = useState(0);
    const [length, setLength] = useState(undefined);
    const [filteredSlides, setFilteredSlides] = useState([]);

    const bigScreen = useWindowDimensions().width >= 700;

    useEffect(() => {
        console.log(feedbacks)
        const filteredSlidesArray = [];
        feedbacks.forEach((slide, index) => {
            if (slide != undefined) {
                if (typeof slide === 'string') {
                    filteredSlidesArray.push(slide.replace(/<br\s*\/?>/g, '\n'));
                } else {
                    
                    console.warn('Expected slide to be a string but received:', slide);
                }
            }
        });
        setFilteredSlides(filteredSlidesArray);
        setLength(filteredSlidesArray.length);
        setCurrent(filteredSlidesArray.length - 1);
        console.log("filteredSlidesArray", filteredSlidesArray)
    }, [feedbacks]);

    const nextSlide = () => {
        if (length != undefined && length > 0) {
            setCurrent(current === length - 1 ? 0 : current + 1);
        }
    };

    const prevSlide = () => {
        if (length != undefined && length > 0) {
            setCurrent(current === 0 ? length - 1 : current - 1);
        }
    };

    const goToSlide = (index) => {
        if (length != undefined && length > 0 && index >= 0 && index < length) {
            setCurrent(index);
        }
    }

    const renderFeedback = () => (
        <Draggable cancel=".interactable">
            <div
                style={{
                    position: 'absolute',
                    top: '40%',
                    left: '-10%',
                    width: bigScreen ? "60%" : "100%",
                    transform: 'translate(-50%, -50%)',
                    zIndex: 1000,
                    padding: "1em",
                    background: "white",
                    borderRadius: "1em",
                    boxShadow: '6px 11px 10px 0px rgba(0, 0, 0, 0.5)',
                }}
            >
                <div className='slider-content'>
                    <button
                        className='left-arrow'
                        onClick={prevSlide}
                        onTouchEnd={prevSlide}
                        disabled={filteredSlides.length == 0}
                        style={{ fontSize: '2.5em' }}
                    >
                        <Icon
                            className='left-arrow'
                            name={'chevron left'}
                            style={{ cursor: 'pointer' }}
                        />
                    </button>

                    <div className='content-container' style={
                        {
                            overflowY: 'hidden',
                            overflowX: 'hidden',
                            paddingLeft: '1em',
                            paddingRight: '1em',
                            paddingTop: '1.5em',
                            width: '100%'
                        }
                    }>
                        <div
                            className='slide-container'
                            style={{
                                display: "flex",
                                height: "100%",
                                alignItems: "center"
                            }}
                        >
                            <div className='slide active' key={current}>
                                {current === 0 && filteredSlides[current] !== "correct-answer-to-question" && (
                                    <div style={{ marginBottom: "0.5em", fontStyle: "italic", color: "gray" }}>
                                        <FormattedHTMLMessage
                                            id="first-time-meta-help-message"
                                        />
                                        <hr />
                                    </div>
                                )}
                                <FormattedHTMLMessage
                                    id={filteredSlides[current]} 
                                />
                            </div>
                        </div>
                    </div>

                    <button
                        className='right-arrow'
                        onClick={nextSlide}
                        onTouchEnd={nextSlide}
                        disabled={filteredSlides.length == 0}
                        style={{ fontSize: '2.5em' }}
                    >
                        <Icon
                            className='right-arrow'
                            name={'chevron right'}
                            style={{ cursor: 'pointer' }}
                        />
                    </button>
                </div>
                <div className='pagination'>
                    {filteredSlides.map((_, index) => (
                        <span
                            key={index}
                            className={index === current ? 'dot active' : 'dot'}
                            onClick={() => goToSlide(index)}
                            onTouchEnd={() => goToSlide(index)}
                        ></span>
                    ))}
                </div>


                <div
                    style={{
                        position: 'absolute',
                        top: '10px',
                        right: '10px',
                        cursor: 'pointer',
                        zIndex: 1001, // Place it above the feedback
                    }}
                    onClick={closeFeedbacks}
                >
                    <Icon name="close" color="black" size="large" />
                </div>
            </div>
        </Draggable>
    );

    return (
        <div style={{ display: 'flex', position: 'relative' }}>
            {showFeedbacks && feedbacks.length > 0 && renderFeedback()}
        </div>
    );
};

export default ReadingTestFeedbacks;
