

import React, { useState, useEffect } from 'react'
import { Link, useHistory, useParams } from 'react-router-dom'
import { FormattedMessage } from 'react-intl'
import { Icon} from 'semantic-ui-react'
import { useSelector, useDispatch } from 'react-redux'
import { getStoryAction, updateExerciseTopics, updateTempExerciseTopics } from 'Utilities/redux/storiesReducer'
import Spinner from 'Components/Spinner'
import Topics from 'Components/Topics'

const SetStoryTopics = ({ match }) => {
    const { id } = match.params
    const dispatch = useDispatch()
    const { story, pending } = useSelector(({ stories, locale }) => ({
        story: stories.focused,
        pending: stories.focusedPending,
        locale,
      }))

    const lessonInstance = {
        topic_ids: story?.topics || [],
        instancePending: pending || !story,
    }
    
    useEffect(() => {
        dispatch(getStoryAction(id, 'preview'))
    }, [id])

    const setSelectedTopics = topics => {
        dispatch(updateExerciseTopics(topics, id))
        dispatch(updateTempExerciseTopics(topics, id))
    }

    if(pending || !story) return <Spinner fullHeight />

    return (
        <div className="cont-tall pt-lg cont flex-col auto gap-row-sm ">
            <div class="row">
                <Link to={`/stories/${id}/preview`} className="col-md-8 link-primary">
                    <h3 style={{textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap'}}>
                        <Icon name="arrow left" />
                        {story.title}
                    </h3>
                </Link>
                <h4 className="col-md-4 text-right">
                    <FormattedMessage id="candidate-available" values={{candidate_count: story.candidate_count}}/>
                </h4>
            </div>
            <br />
            <br />
            <Topics
                topicInstance={lessonInstance}
                editable={true}
                setSelectedTopics={setSelectedTopics}
                showPerf={true}
            />
        </div>
    )
}

export default SetStoryTopics