import React from 'react'
import { useSelector } from 'react-redux'
import { FormattedMessage } from 'react-intl'
import Achievement from './Achievement'
import Medals from './Medals'

const Achievements = () => {
  const achievements = useSelector(state =>
    state.user.data.user.achievements?.concat({
      name: 'Test achievement',
      level: 5,
      current: 102,
      total: 100,
    })
  )

  return (
    <div className="component-container padding-sides-2">
      <Medals />
      <h2 className="header-3 padding-top-1">
        <FormattedMessage id="Achievements" />
      </h2>
      <hr />
      <div className="achievements">
        {achievements?.map(achievement => (
          <Achievement
            key={achievement.name}
            name={achievement.name}
            level={achievement.level}
            current={achievement.current}
            total={achievement.total}
          />
        ))}
      </div>
    </div>
  )
}

export default Achievements
