import {
    DailyStoriesEncouragement,
    DailyStoriesDraggable
} from './SubComponents'
import { useState } from 'react'
import { useSelector } from 'react-redux'
import useWindowDimensions from 'Utilities/windowDimensions'


const Recommender = () => {

    const { cachedStories, pending: metadataPending } = useSelector(({ metadata }) => metadata)
    const [dailyStoriesDraggableIsOpen, setDailyStoriesDraggableIsOpen] = useState(false)
    const bigScreen = useWindowDimensions().width > 700

    const handleDailyStoriesClick = () =>{
        if (dailyStoriesDraggableIsOpen) {
            setDailyStoriesDraggableIsOpen(false)
            return
        }
        setDailyStoriesDraggableIsOpen(true)
    }

    return(
        <>
        <DailyStoriesEncouragement handleDailyStoriesClick = {handleDailyStoriesClick}/>
        <DailyStoriesDraggable 
        cachedStories={cachedStories}
        bigScreen={bigScreen}
        open={dailyStoriesDraggableIsOpen}
        setOpen={setDailyStoriesDraggableIsOpen}/>
        </>
    )
}

export default Recommender