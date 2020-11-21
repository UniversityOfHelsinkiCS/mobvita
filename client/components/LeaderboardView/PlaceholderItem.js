import React from 'react'
import { Placeholder } from 'semantic-ui-react'

const PlaceholderItem = ({ position }) => {
  return (
    <div className="leaderboard-item-container">
      <div className="flex">
        <div
          className="justify-center"
          style={{ width: '2.5rem', fontSize: '1.1rem', paddingRight: '.5rem' }}
        >
          {position}
        </div>
        <Placeholder style={{ minWidth: '15em', alignSelf: 'center' }}>
          <Placeholder.Header>
            <Placeholder.Line length="long" />
          </Placeholder.Header>
        </Placeholder>
      </div>
      <Placeholder style={{ minWidth: '2.5rem', alignSelf: 'center' }}>
        <Placeholder.Header>
          <Placeholder.Line length="very long" />
        </Placeholder.Header>
      </Placeholder>
    </div>
  )
}

export default PlaceholderItem
