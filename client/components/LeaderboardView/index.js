import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { FormattedMessage } from 'react-intl'
import { Box } from '@mui/material'
import { images } from 'Utilities/common'
import { colors } from 'Assets/mui_theme/designTokens'
import { getLeaderboards } from 'Utilities/redux/leaderboardReducer'
import LeaderboardList from './LeaderboardList'
import LastWeeksWinners from './LastWeeksWinners'
import Spinner from 'Components/Spinner'

// A small section heading: image + muted uppercase label + a subtle divider (replaces the old
// shared Subheader/hr so it sits cleanly inside the cream card).
const SectionTitle = ({ imgSource, imgAlt, translationId }) => (
  <Box sx={{ mt: '1.5em' }}>
    <Box sx={{ display: 'flex', alignItems: 'center', gap: '0.5em', mb: '0.4em' }}>
      {imgSource && <img src={imgSource} alt={imgAlt} height="18" />}
      <span
        style={{
          color: colors.muted,
          fontSize: 12,
          fontWeight: 600,
          textTransform: 'uppercase',
          letterSpacing: 0.5,
        }}
      >
        <FormattedMessage id={translationId} />
      </span>
    </Box>
    <Box sx={{ borderBottom: `1px solid ${colors.border}` }} />
  </Box>
)

const Leaderboard = () => {
  const dispatch = useDispatch()

  const { pending } = useSelector(({ leaderboard }) => leaderboard)

  useEffect(() => {
    dispatch(getLeaderboards())
  }, [])

  return (
    <div className="cont-narrow pb-lg ps-sm auto">
      <Box
        sx={{
          marginTop: '1.5em',
          backgroundColor: colors.card,
          borderRadius: '30px',
          padding: { xs: '1.25em', sm: '1.75em' },
          boxShadow: '0 2px 12px rgba(0, 0, 0, 0.06)',
          color: colors.ink,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 22, fontWeight: 600, color: colors.ink }}>
            <FormattedMessage id="Hours practiced" />
          </span>
          {pending && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: '0.5em' }}>
              <Spinner inline size={24} />
              <span style={{ color: colors.muted, fontSize: 12, fontWeight: 600 }}>
                <FormattedMessage id="Updating" />
              </span>
            </Box>
          )}
        </Box>

        <SectionTitle imgSource={images.trophy01} imgAlt="trophy" translationId="last-weeks-winners" />
        <LastWeeksWinners />

        <SectionTitle
          imgSource={images.users01}
          imgAlt="leaderboard"
          translationId="Top people this week"
        />
        <LeaderboardList amountToShow={25} />
      </Box>
    </div>
  )
}

export default Leaderboard
