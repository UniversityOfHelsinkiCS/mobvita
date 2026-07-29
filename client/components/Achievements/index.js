import React from 'react'
import { useSelector } from 'react-redux'
import { FormattedMessage } from 'react-intl'
import { Box } from '@mui/material'
import { colors } from 'Assets/mui_theme/designTokens'
import Achievement from './Achievement'
import Medals from './Medals'

const Achievements = () => {
  const achievements = useSelector(state => state.user.data.user.achievements)

  return (
    <div className="cont auto pb-lg ps-nm">
      <Box
        sx={{
          mt: '1.5em',
          backgroundColor: colors.card,
          borderRadius: '30px',
          padding: { xs: '1.25em', sm: '1.75em' },
        }}
      >
        <Medals />
        <h2 className="header-3 pt-sm">
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
      </Box>
    </div>
  )
}

export default Achievements
