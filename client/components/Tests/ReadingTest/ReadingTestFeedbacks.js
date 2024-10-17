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
        const filteredSlidesArray = [];
        feedbacks.forEach((slide, index) => {
            if (slide != undefined) {
                filteredSlidesArray.push(slide);
            }
        });
        setFilteredSlides(filteredSlidesArray);
        setLength(filteredSlidesArray.length);
        setCurrent(filteredSlidesArray.length - 1);
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
                                {current === 0 && filteredSlides[current][0] !== "Correct!" && (
                                    <div style={{ marginBottom: "0.5em", fontStyle: "italic", color: "gray" }}>
                                        <FormattedHTMLMessage
                                            id="first-time-meta-help-message"
                                            values={{
                                                b: (chunks) => <b>{chunks}</b>,
                                                i: (chunks) => <i>{chunks}</i>,
                                                br: () => <br />,
                                                ul: (chunks) => <ul>{chunks}</ul>,
                                                li: (chunks) => <li>{chunks}</li>
                                              }}
                                        />
                                    </div>
                                )}
                                <hr />
                                <FormattedHTMLMessage
                                    id={filteredSlides[current]} 
                                    defaultMessage={filteredSlides[current]} 
                                    values={{
                                        b: (chunks) => <b>{chunks}</b>,
                                        i: (chunks) => <i>{chunks}</i>,
                                        br: () => <br />,
                                        ul: (chunks) => <ul>{chunks}</ul>,
                                        li: (chunks) => <li>{chunks}</li>
                                      }}
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
