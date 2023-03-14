import React, { useState } from 'react'
import DailyStoriesDraggable from './SubComponents/DailyStoriesDraggable'
import DailyStoriesEncouragement from './SubComponents/DailyStoriesEncouragement'
import LeaderboardEncouragement from './SubComponents/LeaderboardEncouragement'
import { useSelector, useDispatch } from 'react-redux'
import useWindowDimensions from 'Utilities/windowDimensions'
import Draggable from 'react-draggable'
import { Icon } from 'semantic-ui-react'
import { closeEncouragement } from 'Utilities/redux/encouragementsReducer'



const Recommender = () => {
    
    const { cachedStories, pending: metadataPending } = useSelector(({ metadata }) => metadata)
    const { open } = useSelector(({encouragement}) => encouragement)
    const [dailyStoriesDraggableIsOpen, setDailyStoriesDraggableIsOpen] = useState(false)
    const bigScreen = useWindowDimensions().width > 700
    const dispatch = useDispatch()

    const handleDailyStoriesClick = () =>{
        if (dailyStoriesDraggableIsOpen) {
            setDailyStoriesDraggableIsOpen(false)
            return
        }
        setDailyStoriesDraggableIsOpen(true)
    }

    const handleCloseClick = () => {
        dispatch(closeEncouragement())
    }

    if (open) {
        return(
            <>
            <Draggable cancel='.interactable'>
                <div className={bigScreen ? 'draggable-encouragement' : 'draggable-encouragement-mobile'}>
                    <Icon
                        className="interactable"
                        style={{
                            cursor: 'pointer',
                            marginBottom: '.25em',
                        }}
                        size="large"
                        name="close"
                        onClick={handleCloseClick}
                    />
                    <LeaderboardEncouragement />
                    <DailyStoriesEncouragement handleDailyStoriesClick = {handleDailyStoriesClick}/>
                </div>
            </Draggable>
            <DailyStoriesDraggable 
                cachedStories={cachedStories}
                bigScreen={bigScreen}
                open={dailyStoriesDraggableIsOpen}
                setOpen={setDailyStoriesDraggableIsOpen}
            />
            </>
                )
    } else {
        return(null)
    }
}

export default Recommender