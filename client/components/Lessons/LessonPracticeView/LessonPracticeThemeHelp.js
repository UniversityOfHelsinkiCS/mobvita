import React, { useState, useEffect } from 'react'
import useWindowDimensions from 'Utilities/windowDimensions'
import { Paper } from '@mui/material'
import CheckIcon from '@mui/icons-material/Check'
import { useSelector, useDispatch } from 'react-redux'
import { FormattedMessage, useIntl } from 'react-intl'
import { getTextStyle, learningLanguageSelector, getMode } from 'Utilities/common'
import { getLessonTopics } from 'Utilities/redux/lessonsReducer'

const LessonPracticeThemeHelp = ({selectedThemes, always_show=false, }) => {
    const { width } = useWindowDimensions()
    const learningLanguage = useSelector(learningLanguageSelector)
    let theme_rows = []
    for (let i = 0; i < selectedThemes.length; i++) {
        theme_rows.push(
            <h6
                key={i}
                className="lesson-themes"
                style={{
                    marginBottom: '.5rem',
                    display: 'inline-flex',
                    width: '100%',
                    color: '#4a5b6c',
                    ...getTextStyle(learningLanguage)
                }}
            >
                <div style={{ width: '6%', textAlign: 'right', marginRight: '5px', maxWidth: '25px', minWidth: '25px' }}></div>
                <div style={{ width: '3%', textAlign: 'center', maxWidth: '20px', minWidth: '10px', marginRight: '15px' }}>
                    <CheckIcon fontSize="small" />
                </div>
                <div style={{ width: '88%' }}>
                    { /* why capitalize? 
                         selectedThemes[i].charAt(0).toUpperCase() +
                         selectedThemes[i].slice(1) */
                        
                    }
                    <FormattedMessage id={selectedThemes[i]}/>
                </div>
            </h6>
        );
    }

    let segment_style = {
        backgroundColor: 'azure'
    }
    if (always_show){
        segment_style['height'] = '100%'
    }

    if (width >= 900 || always_show) {
        return (
            <div className="lesson-topic-box">
                <Paper sx={{ padding: '1em' }} style={segment_style}>
                    <div
                        className="lesson-title"
                        style={{
                            ...getTextStyle(learningLanguage, 'title'),
                            width: `${'100%'}`,
                            fontWeight: 'bold',
                            fontSize: 'large',
                            marginBottom: '15px',
                        }}
                    >
                        <FormattedMessage id={'selected-lesson-themes'} />
                    </div>
                    <span
                        style={{ overflow: 'hidden', width: '100%' }}
                        data-cy="lesson-practice-themes-list"
                    >
                        {theme_rows}
                    </span>
                </Paper>
            </div>
        )
    }

    return null
}

export default LessonPracticeThemeHelp
