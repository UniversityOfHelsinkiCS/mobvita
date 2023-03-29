import React from 'react'
import Following from '../Following'
import EloChart from 'Components/HomeView/EloChart'
import MedalSummary from 'Components/HomeView/MedalSummary'
import useWindowDimensions from 'Utilities/windowDimensions'
import { useSelector } from 'react-redux'
import { Grid } from 'semantic-ui-react'
import { FormattedMessage } from 'react-intl'
import ProgressStatistics from './ProgressStatistics'

const UsernameField = () => {
  const { username } = useSelector(({ user }) => user.data.user)
  return (
    <>
      <span className="sm-label">
        <FormattedMessage id="username" />
      </span>
      <p className="account-info-item">{username}</p>
    </>
  )
}

const DesktopView = () => {
  return (
    <div className="cont ps-nm">
      <Grid columns={2}  divided>
        <Grid.Row>
          <Grid.Column className="flex-col gap-row-nm">
            <UsernameField />
            <EloChart />
            <MedalSummary />
          </Grid.Column>
          <Grid.Column>
            <Following />
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </div>
  )
}

const MobileView = () => {
  return (
    <div>
      <UsernameField />
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
  return (
    <>
    {bigScreen ? (
      <DesktopView />
    ) : (
      <MobileView />
    )}
    </>
  )
}

export default Main