import React, { useState, useEffect } from 'react'
import useWindowDimensions from 'Utilities/windowDimensions'
import { Segment, Icon } from 'semantic-ui-react'
import { useSelector, useDispatch } from 'react-redux'
import { FormattedMessage, useIntl } from 'react-intl'
import { getTextStyle, learningLanguageSelector, getMode } from 'Utilities/common'
import { getLessonTopics } from 'Utilities/redux/lessonsReducer'

const LessonPracticeTopicsHelp = ({selectedTopics, always_show=false, }) => {
    const dispatch = useDispatch()
    const { width } = useWindowDimensions()
    const learningLanguage = useSelector(learningLanguageSelector)
    const { topics: lessonTopics } = useSelector(({ lessons }) => lessons)
    const snippets = useSelector(({ snippets }) => snippets)
    const topics = lessonTopics && selectedTopics ? lessonTopics.filter(l => selectedTopics.includes(l.topic_id)) : []
    
    const [collapsed, setCollapsed] = useState(true)

    useEffect(() => {
        dispatch(getLessonTopics())
    }, [snippets.focused])

    const toggleCollapse = () => {
        setCollapsed(!collapsed)
    }

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
    
    let topic_rows = []
    for (let i = 0; i < topics.length; i++) {
        let topic_concepts = topics[i].topic.split(';')

        for (let k = 0; k < topic_concepts.length; k++) {
            const name = (topic_concepts[k].charAt(0).toUpperCase() + topic_concepts[k].slice(1)) //.split('—')[0].trim()
            if (k === 0) {
                topic_rows.push(
                    <h6
                        key={k}
                        className="lesson-item-topics"
                        style={{
                            marginBottom: '.5rem',
                            display: 'inline-flex',
                            width: '100%',
                            color: '#4a5b6c',
                            ...getTextStyle(learningLanguage)
                        }}
                    >
                        <div style={{ width: '6%', textAlign: 'right', marginRight: '5px', maxWidth: '25px', minWidth: '25px', ...get_lesson_performance_style(topics[i].correct, topics[i].total) }}>
                            {String(Math.round(get_lesson_performance(topics[i].correct, topics[i].total) * 100)).padEnd(3,' ')}
                        </div>
                        <div style={{ width: '3%', textAlign: 'center', maxWidth: '20px', minWidth: '10px', marginRight: '15px', ...get_lesson_performance_style(topics[i].correct, topics[i].total) }}>
                            {'%'}
                        </div>
                        <div style={{ width: '88%' }} dangerouslySetInnerHTML={{__html: name}}/>
                    </h6>
                );
            } else {
                topic_rows.push(
                    <h6
                        key={k}
                        className="lesson-item-topics"
                        style={{
                            marginBottom: '.5rem',
                            display: 'inline-flex',
                            width: '100%',
                            color: '#4a5b6c',
                            ...getTextStyle(learningLanguage)
                        }}
                    >
                        <div style={{ width: '6%', textAlign: 'right', marginRight: '5px', maxWidth: '25px', minWidth: '25px' }}></div>
                        <div style={{ width: '3%', textAlign: 'center', maxWidth: '20px', minWidth: '10px', marginRight: '15px' }}></div>
                        <div style={{ width: '88%' }} dangerouslySetInnerHTML={{__html: name}}/>
                    </h6>
                );
            }
        }
    }

    let segment_style = {
        backgroundColor: 'azure'
    }
    if (always_show){
        segment_style['height'] = '100%'
    }

    if (width >= 1024 || always_show) {
        return (
            <div className="lesson-topic-box">
                <Segment style={segment_style}>
                    <div
                        className="lesson-title"
                        style={{
                            ...getTextStyle(learningLanguage, 'title'),
                            width: `${'100%'}`,
                            fontWeight: 'bold',
                            fontSize: 'large',
                            marginBottom: '15px',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                        }}
                    >
                        <FormattedMessage id={'topics-header'} />
                        <Icon
                            name={collapsed ? 'chevron down' : 'chevron up'}
                            onClick={toggleCollapse}
                            style={{ cursor: 'pointer' }}
                        />
                    </div>
                    
                    {!collapsed && (
                        <span style={{ overflow: 'auto', width: '100%' }}>
                            {topic_rows}
                        </span>
                    )}
                </Segment>
            </div>
        )
    } 

    return null
}

export default LessonPracticeTopicsHelp
