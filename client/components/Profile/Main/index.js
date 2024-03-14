import React from 'react'
import { Grid } from 'semantic-ui-react'
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
      <Grid columns={2} divided>
        {!teacherView && (<Grid.Column className="flex-col gap-row-nm">
          <Grid.Row>
            <div className="prof-info">
              <ProfileInfo />
            </div>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column><UserLevel /></Grid.Column>
            <Grid.Column>
              <div className="xp-bar"><XpBar /></div>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <ProfileStreakInfo />
          </Grid.Row>
        </Grid.Column>)}
        <Grid.Column>
          <ProgressStatistics />
          <EloChart />
          <MedalSummary />
        </Grid.Column>
      </Grid>
    </div>
  )
}

const MobileView = ({teacherView}) => {
  return (
    <div className="cont ps-nm">
      {!teacherView && (<Grid columns={1} divided>
        <Grid.Column className="flex-col gap-row-nm">
          <Grid.Column>
           <div className="prof-info">
              <ProfileInfo />
            </div>
          </Grid.Column>
          <Grid.Row className="ps-nm">
            <Grid.Column><UserLevel /></Grid.Column>
            <Grid.Column>
              <div className="xp-bar"><XpBar /></div>
            </Grid.Column>
          </Grid.Row>
        </Grid.Column>
      </Grid>)}
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

const Main = ({teacherView}) => {
  const { width } = useWindowDimensions()
  const bigScreen = width >= 700
  return <>{bigScreen ? <DesktopView teacherView={teacherView} /> : <MobileView teacherView={teacherView} />}</>
}

export default Main
