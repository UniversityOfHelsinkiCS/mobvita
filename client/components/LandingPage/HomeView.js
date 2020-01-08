import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { FormattedMessage } from 'react-intl'
import { Button } from 'semantic-ui-react'
import { images } from 'Utilities/common'
import PracticeModal from 'Components/LandingPage/PracticeModal'
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
  return (
    <div>
      <h4>MobVita</h4>
      <div>GRAPH</div>
      <PracticeModal trigger={<PracticeButton />} />
    </div>
  )
}

export default HomeView
