import React, { useState, useEffect } from 'react';
import Draggable from 'react-draggable';
import { Icon } from 'semantic-ui-react';
import { FormattedMessage, useIntl } from 'react-intl'
import useWindowDimensions from 'Utilities/windowDimensions';

import ReactSlider from 'react-slider'


const OpenEndedQuestion = ({ idx, question, answer, onAnswerChange }) => {
    const handleInputChange = (event) => {
        onAnswerChange(idx, event.target.value);
    };
  
    return (
        <div className="open-ended-question" style={{padding: '0.5em'}}>
            <label style={{ fontWeight: 'bold' }}><FormattedMessage id={question} /></label>
            <textarea 
                id={idx} 
                value={answer} 
                onChange={handleInputChange}
                style={{
                    width: '100%', 
                    height: '15vh', 
                    fontSize: '16px', 
                    padding: '10px',
                }}
            />
        </div>
    );
};

const UsefulSlider = ({ sliderQuestion, sliderValue, setSliderValue, doNotKnow, setDoNotKnow }) => {
    const handleSliderChange = (value) => {
        setSliderValue(value);
    };
    const marks = Array.from({ length: 11 }, (_, i) => i)
  
    return (
        <div className="slider-and-controls-container" style={{
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'stretch',
            padding: '0.5em'
        }}>
            <label style={{ fontWeight: 'bold' }}><FormattedMessage id={sliderQuestion} /></label>
            <div className="space-between bold" style={{
                display: 'flex',
                alignItems: 'end', 
                justifyContent: 'space-between',
            }}>
                <span style={{ textAlign: 'left' }}><FormattedMessage id='not-useful-at-all' /></span>
                <span style={{ textAlign: 'right' }}><FormattedMessage id='very-useful' /></span>
            </div>
            <div className="useful-slider-container" style={{
                marginBottom: '3em'
            }}>
                <ReactSlider
                    className="useful-slider"
                    thumbClassName="exercise-density-slider-thumb"
                    trackClassName="exercise-density-slider-track"
                    onAfterChange={value => handleSliderChange(value)}
                    onSliderClick={value => handleSliderChange(value)}
                    snapDragDisabled={false}
                    markClassName="exercise-density-slider-mark"
                    marks={marks}
                    min={0}
                    max={10}
                    step={1}
                    value={sliderValue}
                    disabled={doNotKnow}
                />
            </div>
            <div style={{ marginTop: '20px' }}>
                <input 
                    type="checkbox" 
                    id="doNotKnowCheckbox" 
                    className="btn-checkbox" 
                    value={doNotKnow}
                    onChange={() => setDoNotKnow(!doNotKnow)}
                    style={{ marginRight: '0.5em' }}
                />
                <label htmlFor="doNotKnowCheckbox" className="btn-label">
                    <FormattedMessage id='do-not-know' />
                </label>
            </div>
        </div>
    );
};
  

const ReadingTestSelfReflect = ({ currentReadingTestQuestion, prevReadingSet, currentReadingSet, readingSetLength, currentQuestionIdxinSet, questionDone, in_control_grp, in_experimental_grp, receieved_feedback, showSelfReflect, submitSelfReflection }) => {
    const [current, setCurrent] = useState(0);
    const [isEndSetQuestionair, setIsEndSetQuestionair] = useState(false);
    const [endSetSliderDoNotKnow, setEndSetSliderDoNotKnow] = useState(false)
    const [endSetSliderValue, setEndSetSliderValue] = useState(null)

    const [sliderQuestion, setSliderQuestion] = useState("How useful was this feedback?");
    const [openEndedQuestions, setOpenEndedQuestions] = useState([]);
    const [openEndedQuestionAnswers, setOpenEndedQuestionAnswers] = useState([]);

    const bigScreen = useWindowDimensions().width >= 700;

    useEffect(() => {
        setCurrent(0)
        setEndSetSliderDoNotKnow(false)
        setEndSetSliderValue(null)
        setSliderQuestion("How useful was this feedback?")
        setOpenEndedQuestions([])
        setOpenEndedQuestionAnswers([])
    }, [currentQuestionIdxinSet, questionDone, currentReadingSet, prevReadingSet])

    useEffect(() => {
        let open_ended_questions = []
        let sliderQuestion = "experimental-after-first-mediation-slider-question"
        if (in_experimental_grp){
            if (currentQuestionIdxinSet < readingSetLength - 1 && receieved_feedback > 0 && questionDone){
                open_ended_questions = [
                    "experimental-after-first-mediation-open-ended-question"
                ]
                sliderQuestion = "experimental-after-first-mediation-slider-question"
                setIsEndSetQuestionair(false)
            } 
            else if (prevReadingSet !== currentReadingSet && receieved_feedback > 0) {
                open_ended_questions = [
                    "experimental-end-of-set-open-ended-question-a",
                    "experimental-end-of-set-open-ended-question-b",
                    "experimental-end-of-set-open-ended-question-c"
                ]
                sliderQuestion = "experimental-after-last-item-slider-question"
                setIsEndSetQuestionair(true)
            } else {
                open_ended_questions = []
            }
        } else if (in_control_grp && !in_experimental_grp && receieved_feedback == 0 && prevReadingSet !== currentReadingSet){
            open_ended_questions = [
                "control-end-of-set-open-ended-question-a",
                "control-end-of-set-open-ended-question-b",
                "control-end-of-set-open-ended-question-c"
            ]
            setIsEndSetQuestionair(true)
        } else {
            open_ended_questions = []
        }

        setSliderQuestion(sliderQuestion);
        setOpenEndedQuestions(open_ended_questions);
        setOpenEndedQuestionAnswers(open_ended_questions.map(() => null));
    }, [
        currentReadingSet, currentQuestionIdxinSet, 
        in_control_grp, in_experimental_grp, 
        receieved_feedback, showSelfReflect, submitSelfReflection
    ]);

    const handleAnswerChange = (index, newValue) => {
        const updatedAnswers = [...openEndedQuestionAnswers];
        updatedAnswers[index] = newValue;
        setOpenEndedQuestionAnswers(updatedAnswers);
    };

    const self_reflection_questions = openEndedQuestions.map((question, index) => {
        return {
            component: OpenEndedQuestion,
            props: {
                idx: index,
                question: question,
                answer: openEndedQuestionAnswers[index], 
                onAnswerChange: (idx, newValue) => handleAnswerChange(idx, newValue)
            }
        };
    });
    if (in_experimental_grp){
        const endSetUsefulSliderComponent = {
            component: UsefulSlider,
            props: {
                sliderQuestion: sliderQuestion,
                sliderValue: endSetSliderValue, 
                setSliderValue: setEndSetSliderValue,
                doNotKnow: endSetSliderDoNotKnow,
                setDoNotKnow: setEndSetSliderDoNotKnow
            }
        };
        self_reflection_questions.unshift(endSetUsefulSliderComponent);
    }
    
    const submitResponse = () => {
        const open_ended_questions_with_responses = openEndedQuestions.map((question, index) => ({
            question: question,
            answer: openEndedQuestionAnswers[index] || ''
        }));
        submitSelfReflection({
            "open_ended_questions": open_ended_questions_with_responses,
            "feedback_usefulness": endSetSliderValue,
            "question_set": prevReadingSet,
            "group_type": in_experimental_grp ? "experimental" : "control",
            "receieved_feedback": receieved_feedback,
            "is_end_set_questionair": isEndSetQuestionair,
            "question_id": currentReadingTestQuestion.question_id,
        })
    }

    const nextSlide = () => {
        if (self_reflection_questions && self_reflection_questions.length > 0) {
            setCurrent(current === self_reflection_questions.length - 1 ? 0 : current + 1);
        }
    };

    const prevSlide = () => {
        if (self_reflection_questions && self_reflection_questions.length > 0) {
            setCurrent(current === 0 ? self_reflection_questions.length - 1 : current - 1);
        }
    };

    const goToSlide = (index) => {
        if (self_reflection_questions && self_reflection_questions.length > 0 && index >= 0 && index < self_reflection_questions.length) {
            setCurrent(index);
        }
    }

    const renderReflection = () => (
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
                    <button
                        className='left-arrow'
                        onClick={prevSlide}
                        onTouchEnd={prevSlide}
                        disabled={self_reflection_questions.length==0 || current == 0}
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
                        <div className='self-reflection-header' style={{
                            display: 'flex', 
                            justifyContent: 'space-between', 
                            alignItems: 'center'
                        }}>
                            <h3 style={{ textAlign: 'left', margin: 0 }}>
                                <FormattedMessage id='reading-test-self-reflection-header' />
                            </h3>
                            <button 
                                type="submit" 
                                className="btn btn-primary" 
                                onClick={submitResponse}
                                disabled={!openEndedQuestionAnswers.every(answer => answer !== null && answer.trim() !== '')}
                            >
                                <FormattedMessage id='self-reflection-submit' />
                            </button>
                        </div>
                        <div
                            className='slide-container'
                            style={{
                                height: "100%",
                                alignItems: "center",
                                margin: "10px"
                            }}
                        >
                            <div className='slide active' key={current}>
                                {
                                    React.createElement(
                                        self_reflection_questions[current]?.component,
                                        { ...self_reflection_questions[current].props, key: current }
                                    )
                                }
                            </div>
                        </div>
                    </div>

                    <button
                        className='right-arrow'
                        onClick={nextSlide}
                        onTouchEnd={nextSlide}
                        disabled={self_reflection_questions.length==0 || current == self_reflection_questions.length - 1}
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
                    {self_reflection_questions.map((_, index) => (
                        <span
                            key={index}
                            className={index === current ? 'dot active' : 'dot'}
                            onClick={() => goToSlide(index)}
                            onTouchEnd={() => goToSlide(index)}
                        ></span>
                    ))}
                </div>

                
                {/* <div
                    style={{
                        position: 'absolute',
                        top: '10px',
                        right: '10px',
                        cursor: 'pointer',
                        zIndex: 1001, // Place it above the feedback
                    }}
                    onClick={closeSelfReflect}
                >
                    <Icon name="close" color="black" size="large" />
                </div> */}
            </div>
        </Draggable>
    );

    return (
        <div style={{ display: 'flex', position: 'relative' }}>
            {showSelfReflect && self_reflection_questions.length > 0 && renderReflection()}
        </div>
    );
};

export default ReadingTestSelfReflect;
