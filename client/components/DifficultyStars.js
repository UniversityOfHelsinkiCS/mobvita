import React from 'react'
import { Icon } from 'semantic-ui-react'

export default ({ difficulty, size }) => {
  switch (difficulty) {
    case 'high':
      return (
        <div>
          <Icon name="star outline" size={size} style={{ color: 'red' }} />
          <Icon name="star outline" size={size} style={{ color: 'red' }} />
          <Icon name="star outline" size={size} style={{ color: 'red' }} />
        </div>
      )
    case 'average':
      return (
        <div>
          <Icon name="star outline" size={size} style={{ color: 'steelblue' }} />
          <Icon name="star outline" size={size} style={{ color: 'steelblue' }} />
        </div>
      )
    case 'low':
      return (
        <div>
          <Icon name="star outline" size={size} style={{ color: 'forestgreen' }} />
        </div>
      )
    default:
      return <div />
  }
}
