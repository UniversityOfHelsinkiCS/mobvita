import React from 'react'
import Following from '../Following'
import EloChart from 'Components/HomeView/EloChart'
import MedalSummary from 'Components/HomeView/MedalSummary'
import useWindowDimensions from 'Utilities/windowDimensions'
import { useSelector } from 'react-redux'
import { Grid } from 'semantic-ui-react'
import { FormattedMessage } from 'react-intl'
import ProgressStats from '../Progress/ProgressStats'
import moment from 'moment'

/* const ProgressStatistics = () => {
  const { data } = useSelector(({ user }) => user.data)
  const { exerciseHistoryGraph } = useSelector(({ user }) => user.data.user.exercise_history)
  console.log(data);
  console.log(exerciseHistoryGraph);
  const startDate = moment(exerciseHistoryGraph[0]?.date).toDate()
  const endDate = Date().toLocaleString()

  console.log(endDate);

  return (
    <ProgressStats startDate={startDate} endDate={endDate} />
  )
} */

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
    <div>
      <Grid columns={2}  divided>
        <Grid.Row>
          <Grid.Column>
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
      <Following />
      <EloChart width="100%" />
      <MedalSummary />
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