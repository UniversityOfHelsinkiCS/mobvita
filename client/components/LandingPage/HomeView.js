import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { FormattedMessage } from 'react-intl'
import { Button } from 'semantic-ui-react'
import { images } from 'Utilities/common'
import { getSelf } from 'Utilities/redux/userReducer'

import PracticeModal from './PracticeModal'
import EloChart from './EloChart'
// import StoryAddition from 'Components/StoryAddition'

const PracticeButton = props => (
  <Button
    fluid
    color="black"
    inverted
    style={{
      backgroundImage: `url(${images.practiceNow})`,
      height: '13em',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    }}
    {...props}
  >
    <FormattedMessage id="PRACTICE_NOW" />
  </Button>
)

const HomeView = () => {
  const currentLanguage = window.location.pathname.split('/')[2]
  const eloHistory = useSelector(({ user }) => user.data.user.exercise_history
    .filter(exercise => exercise.language.toLowerCase() === currentLanguage)
    .map(exercise => exercise.score))

  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(getSelf())
  }, [])

  return (
    <div>
      <h4>MobVita</h4>
      <EloChart eloHistory={eloHistory} />
      <PracticeModal trigger={<PracticeButton />} />
    </div>
  )
}

export default HomeView
