import React from 'react'
import { useSelector } from 'react-redux'
import { Box } from '@mui/material'
import EloChart from 'Components/HomeView/EloChart'
import MedalSummary from 'Components/HomeView/MedalSummary'
import useWindowDimensions from 'Utilities/windowDimensions'
import ProgressStatistics from './ProgressStatistics'
import ProfileInfo from './ProfileInfo'
import ProfileStreakInfo from './ProfileStreakInfo'
import { UserLevel } from './UserLevelInfo'
import { XpBar } from './UserLevelInfo'

const DesktopView = ({teacherView}) => {
  return (
    <div className="cont ps-nm">
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: teacherView ? '1fr' : '1fr 1fr',
          gap: 2,
        }}
      >
        {!teacherView && (
          <Box className="flex-col gap-row-nm">
            <div>
              <div className="prof-info">
                <ProfileInfo />
              </div>
            </div>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Box sx={{ flex: 1 }}><UserLevel /></Box>
              <Box sx={{ flex: 1 }}>
                <div className="xp-bar"><XpBar /></div>
              </Box>
            </Box>
            <div>
              <ProfileStreakInfo />
            </div>
          </Box>
        )}
        <Box
          sx={
            teacherView
              ? undefined
              : { borderLeft: '1px solid rgba(34,36,38,.15)', pl: 2 }
          }
        >
          <ProgressStatistics />
          <EloChart />
          <MedalSummary />
        </Box>
      </Box>
    </div>
  )
}

const MobileView = ({teacherView}) => {
  return (
    <div className="cont ps-nm">
      {!teacherView && (
        <Box className="flex-col gap-row-nm">
          <div>
            <div className="prof-info">
              <ProfileInfo />
            </div>
          </div>
          <Box className="ps-nm" sx={{ display: 'flex', gap: 2 }}>
            <Box sx={{ flex: 1 }}><UserLevel /></Box>
            <Box sx={{ flex: 1 }}>
              <div className="xp-bar"><XpBar /></div>
            </Box>
          </Box>
        </Box>
      )}
      {!teacherView && (<div className="pt-nm">
        <ProfileStreakInfo />
        <ProgressStatistics />
      </div>)}
      {!teacherView && (<div className="flex-col" style={{ gap: '1.5em', marginBottom: '.5em' }}>
        <EloChart width="100%" />
        <MedalSummary />
      </div>)}
    </div>
  )
}

// The open helper sidebar takes 400px (380px + gap) of the window between its bottom-sheet
// breakpoint (≤768px) and the width where it fits beside the page (≥1856px) — see
// `.cont.sidebar-pushed`. Pick the layout from the width left for the content, not the window:
// two columns squeezed into ~390px (a 884px window) overflowed the Progress card.
const SIDEBAR_SPACE = 400

const Main = ({teacherView}) => {
  const { width } = useWindowDimensions()
  const isSidebarOpen = useSelector(state => state.helperSidebar?.isOpen ?? false)
  const sidebarTakesSpace = isSidebarOpen && width > 768 && width < 1856
  const contentWidth = width - (sidebarTakesSpace ? SIDEBAR_SPACE : 0)
  const bigScreen = contentWidth >= 700
  return <>{bigScreen ? <DesktopView teacherView={teacherView} /> : <MobileView teacherView={teacherView} />}</>
}

export default Main
