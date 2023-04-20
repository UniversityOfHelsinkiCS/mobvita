import React from 'react'
import { Grid, GridColumn } from 'semantic-ui-react'
import EloChart from 'Components/HomeView/EloChart'
import MedalSummary from 'Components/HomeView/MedalSummary'
import useWindowDimensions from 'Utilities/windowDimensions'
import Following from '../Following'
import ProgressStatistics from './ProgressStatistics'
import ProfileInfo from './ProfileInfo'
import ProfileStreakInfo from './ProfileStreakInfo'
import { UserLevel } from './UserLevelInfo'
import { XpBar } from './UserLevelInfo'

const DesktopView = () => {
  return (
    <div className="cont ps-nm">
      <Grid columns={2} divided>
        <Grid.Column className="flex-col gap-row-nm">
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

          <ProgressStatistics />
          <EloChart />
          <MedalSummary />
        </Grid.Column>
        <Grid.Column>
          <Following />
        </Grid.Column>
      </Grid>
    </div>
  )
}

/* const MobileView = () => {
  return (
    <div>
      <ProfileInfo />
      <ProfileStreakInfo />
      {hiddenFeatures && <UserLevelInfo />}
      <ProgressStatistics />
      <div className="flex-col" style={{ gap: '1.5em', marginBottom: '.5em' }}>
        <EloChart width="100%" />
        <MedalSummary />
      </div>
      <Following />
    </div>
  )
}
*/

const MobileView = () => {
  return (
    <div className="cont ps-nm">
      <Grid columns={1} divided>
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
      </Grid>
      <div className="pt-nm">
        <ProfileStreakInfo />
        <ProgressStatistics />
      </div>
      <div className="flex-col" style={{ gap: '1.5em', marginBottom: '.5em' }}>
        <EloChart width="100%" />
        <MedalSummary />
      </div>
      <Following />
    </div>
  )
}

const Main = () => {
  const { width } = useWindowDimensions()
  const bigScreen = width >= 700
  return <>{bigScreen ? <DesktopView /> : <MobileView />}</>
}

export default Main
