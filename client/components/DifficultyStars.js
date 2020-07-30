import React from 'react'
import { Icon } from 'semantic-ui-react'

export default ({ difficulty, size }) => {
  switch (difficulty) {
    case 3:
    case 'high':
      return (
        <div>
          <Icon name="star outline" size={size} style={{ color: 'red' }} />
          <Icon name="star outline" size={size} style={{ color: 'red' }} />
          <Icon name="star outline" size={size} style={{ color: 'red' }} />
        </div>
      )
    case 2:
    case 'average':
      return (
        <div>
          <Icon name="star outline" size={size} style={{ color: 'steelblue' }} />
          <Icon name="star outline" size={size} style={{ color: 'steelblue' }} />
        </div>
      )
    case 1:
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
