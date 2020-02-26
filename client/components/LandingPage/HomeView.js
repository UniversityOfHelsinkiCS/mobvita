import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useHistory } from 'react-router'
import { FormattedMessage } from 'react-intl'
import { Button } from 'react-bootstrap'
import { images, hiddenFeatures } from 'Utilities/common'
import { getSelf } from 'Utilities/redux/userReducer'

import PracticeModal from './PracticeModal'
import EloChart from './EloChart'
// import StoryAddition from 'Components/StoryAddition'

const PracticeButton = props => (
  <Button
    block
    style={{
      backgroundImage: `url(${images.practiceNow})`,
      height: '10em',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    }}
    {...props}
  >
    <FormattedMessage id="practice-now" />
  </Button>
)

const FlashcardsButton = (props) => {
  const history = useHistory()
  const handleClick = () => {
    history.push('/flashcards')
  }

  return (
    <Button
      onClick={handleClick}
      block
      style={{
        backgroundImage: `url(${images.flashcards})`,
        height: '10em',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        color: 'black',
      }}
      {...props}
    >
      <FormattedMessage id="Flashcards" />
    </Button>
  )
}

const HomeView = () => {
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(getSelf())
  }, [])

  return (
    <div>
      <EloChart />
      <PracticeModal trigger={<PracticeButton data-cy="practice-now" />} />
      {hiddenFeatures && <FlashcardsButton />}
      <Button style={{ display: 'none' }} onClick={() => undefun()}>hidden breaking thing</Button>
    </div>
  )
}

export default HomeView
