import useWindowDimensions from 'Utilities/windowDimensions'
import React, { useState } from 'react'

import BlueCardsTestEncouragement from '../Encouragements/BlueCardsTestEncouragement'
import PracticeCompletedEncouragement from '../Encouragements/PracticeCompletedEncouragement'

const MessageDialog = ({ setShow, continueAction, storyId, storyTitle, blueCardCount }) => {
  const bigScreen = useWindowDimensions().width > 700
  const [messageIndex, setMessageIndex] = useState(0)

  return (
    <div className={bigScreen ? 'draggable-encouragement' : 'draggable-encouragement-mobile'} style={{ height: '446.5px' }}>
      <div className="col-flex">
        {messageIndex === 0 && (
          <PracticeCompletedEncouragement
            continueAction={continueAction}
            practiceType="story"
            setMessageIndex={setMessageIndex}
            setShow={setShow}
          />
        )}
        {messageIndex === 1 && (
          <BlueCardsTestEncouragement
            setShow={setShow}
            storyId={storyId}
            storyTitle={storyTitle}
            blueCardCount={blueCardCount}
          />
        )}
      </div>
    </div>
  )
}

export default MessageDialog
