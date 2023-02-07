import React from 'react'
import useWindowDimensions from 'Utilities/windowDimensions'
import { Segment } from 'semantic-ui-react'
import { useSelector } from 'react-redux'

import { getTextStyle, learningLanguageSelector, getMode } from 'Utilities/common'

const LessonPracticeTopicsHelp = (lesson) => {
    const { width } = useWindowDimensions()
    const learningLanguage = useSelector(learningLanguageSelector)

    const get_lesson_performance = (correct_count, total_count) => {
        let correct_perc = 0.0
        if (total_count && total_count !== 0) {
            correct_perc = correct_count / total_count
        }
        return parseFloat(correct_perc).toFixed(2) // * 100
    }

    const get_lesson_performance_style = (correct_count, total_count) => {
        let correct_perc = get_lesson_performance(correct_count, total_count)
        if (correct_perc >= 0.75) return { 'color': 'green' }
        if (correct_perc < 0.75 && correct_perc >= 0.5) return { 'color': 'limegreen' }
        if (correct_perc < 0.5 && correct_perc >= 0.25) return { 'color': 'orange' }
        if (correct_perc < 0.25) return { 'color': 'red' }
        return { 'color': 'black' }
    }

    const topics = lesson?.lesson?.topics ? lesson?.lesson?.topics : []
    let topic_rows = []
    for (let i = 0; i < topics.length; i++) {
        let topic_concepts = topics[i].topic.split(';')

        for (let k = 0; k < topic_concepts.length; k++) {
            if (k === 0) {
                topic_rows.push(
                    <h6
                        className="lesson-item-topics"
                        style={{
                            marginBottom: '.5rem',
                            display: 'inline-flex',
                            width: '100%',
                            color: '#4a5b6c',
                            ...getTextStyle(learningLanguage)
                        }}
                    >
                        <div style={{ width: '6%', textAlign: 'right', marginRight: '5px', 'max-width': '25px', 'min-width': '25px', ...get_lesson_performance_style(topics[i].correct, topics[i].total) }}>
                            {String(Math.round(get_lesson_performance(topics[i].correct, topics[i].total) * 100)).padEnd(3,' ')}
                        </div>
                        <div style={{ width: '3%', textAlign: 'center', 'max-width': '20px', 'min-width': '10px', marginRight: '15px', ...get_lesson_performance_style(topics[i].correct, topics[i].total) }}>
                            {'%'}
                        </div>
                        <div style={{ width: '88%' }}>
                            {topic_concepts[k].charAt(0).toUpperCase() + topic_concepts[k].slice(1)}
                        </div>
                    </h6>
                );
            } else {
                topic_rows.push(
                    <h6
                        className="lesson-item-topics"
                        style={{
                            marginBottom: '.5rem',
                            display: 'inline-flex',
                            width: '100%',
                            color: '#4a5b6c',
                            ...getTextStyle(learningLanguage)
                        }}
                    >
                        <div style={{ width: '6%', textAlign: 'right', marginRight: '5px', 'max-width': '25px', 'min-width': '25px' }}></div>
                        <div style={{ width: '3%', textAlign: 'center', 'max-width': '20px', 'min-width': '10px', marginRight: '15px' }}></div>
                        <div style={{ width: '88%' }}>{topic_concepts[k].charAt(0).toUpperCase() + topic_concepts[k].slice(1)}</div>
                    </h6>
                );
            }
        }
    }

    if (width >= 1024) {
        return (
            <div className="annotations-box">
                <Segment style={{backgroundColor: 'azure'}}>
                    <div
                        className="lesson-title"
                        style={{
                            ...getTextStyle(learningLanguage, 'title'),
                            width: `${'100%'}`,
                            'font-weight': 'bold',
                            'font-size': 'large',
                            'margin-bottom': '15px',
                        }}
                    >
                        {`Lesson ${lesson?.lesson?.syllabus_id}`}
                    </div>
                    <span style={{ overflow: 'hidden', width: '100%' }}>
                        {topic_rows}
                    </span>
                </Segment>
            </div>
        )
    }

    return null
}

export default LessonPracticeTopicsHelp
