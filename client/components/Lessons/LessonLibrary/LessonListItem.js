import React, { useState } from 'react'
import { useHistory } from 'react-router'
import { useDispatch, useSelector } from 'react-redux'
import { Card, Dropdown, Button as SemanticButton, Icon, Popup } from 'semantic-ui-react'
import { Button } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { FormattedMessage } from 'react-intl'
import useWindowDimensions from 'Utilities/windowDimensions'
import { getTextStyle, learningLanguageSelector } from 'Utilities/common'
// import ConfirmationWarning from 'Components/ConfirmationWarning'

const LessonTitle = ({
    lesson
}) => {
    const learningLanguage = useSelector(learningLanguageSelector)
    const topics = lesson.lesson_metadata ? lesson.lesson_metadata.topics.split(";") : []
    let topic_rows = []
    for (let i = 0; i < topics.length; i++) {
        topic_rows.push(
            <h6
                className="lesson-item-topics"
                style={{ 
                    marginBottom: '.5rem', 
                    ...getTextStyle(learningLanguage) 
                }}
            >
                {topics[i]}
            </h6>
        );
    } 

    return (
        <div>
            <span className="space-between" style={{ overflow: 'hidden', width: '100%' }}>
                <Icon color="grey" name="ellipsis vertical" className="lesson-item-dots" />
                <h5
                    className="story-item-title"
                    style={{ marginBottom: '.5rem', width: '100%', ...getTextStyle(learningLanguage) }}
                >
                    {'Lesson ' + lesson.lesson_chapter}
                </h5>
            </span>
            {topic_rows}
        </div>
    )
}

const LessonFunctionsDropdown = ({
    lesson,
    practiceLink
}) => {
    return (
        <SemanticButton.Group>
            <SemanticButton
                as={Link}
                to={practiceLink}
                style={{ backgroundColor: 'rgb(50, 170, 248)', color: 'white' }}
            >
                <FormattedMessage id="practice" />
            </SemanticButton>
            <Dropdown
                className="button icon"
                style={{
                    backgroundColor: 'rgb(50, 170, 248)',
                    color: 'white',
                    borderLeft: '2px solid rgb(81, 138, 248)',
                }}
                floating
                trigger={<React.Fragment />}
            >
                <Dropdown.Menu className="lesson-item-dropdown">
                    <Dropdown.Item
                        text={<FormattedMessage id="practice" />}
                        as={Link}
                        to={practiceLink}
                        icon="pencil alternate"
                    />
                </Dropdown.Menu>
            </Dropdown>
        </SemanticButton.Group>
    )
}

const LessonActions = ({lesson, setLessonModalOpen}) => {
    const { width } = useWindowDimensions()
    const practiceLink = `/lesson/${lesson.lesson_chapter}/practice`
    const hasPracticed = lesson.lesson_instances !== null & lesson.lesson_instances.length > 0

    return (
        <div className="lesson-actions">
            <Link to={practiceLink}>
                <Button variant={'primary'}>
                    <FormattedMessage id={hasPracticed ? "continue-practice" : "start-practice"} />
                </Button>
            </Link>
            <Button variant={'primary'} onClick={() => setLessonModalOpen(true)}>
                <FormattedMessage id={"lesson-setup"} />
            </Button>
        </div>
    )

    // if (width >= 640) {
    //     return (
    //         <div className="lesson-actions">
    //             <Link to={practiceLink}>
    //                 <Button variant={'primary'}>
    //                     <FormattedMessage id={hasPracticed ? "continue-practice" : "start-practice"} />
    //                 </Button>
    //             </Link>
    //             <Button variant={'primary'}>
    //                 <FormattedMessage 
    //                     id={"lesson-setup"} 
    //                     onClick={() => setLessonModalOpen(true)}
    //                 />
    //             </Button>
    //         </div>
    //     )
    // } else {
    //     return (
    //         <LessonFunctionsDropdown
    //             lesson={lesson}
    //             practiceLink={practiceLink}
    //         />
    //     )
    // }
}

const LessonListItem = ({ lesson, setLessonModalOpen }) => {
    const { user: userId } = useSelector(({ user }) => ({ user: user.data.user.oid }))
    const learningLanguage = useSelector(learningLanguageSelector)

    return (
        <Card fluid key={lesson._id} className={'lesson-list-card'}>
            <Card.Content extra className="lesson-card-title-cont">
                <LessonTitle
                    lesson={lesson}
                />
            </Card.Content>
            <Card.Content extra className="lesson-card-actions-cont">
                <LessonActions
                    lesson={lesson}
                    setLessonModalOpen={setLessonModalOpen}
                />
            </Card.Content>
        </Card>
    )
}

export default LessonListItem
