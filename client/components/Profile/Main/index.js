import React from 'react'
import Following from '../Following'
import EloChart from 'Components/HomeView/EloChart'
import MedalSummary from 'Components/HomeView/MedalSummary'
import useWindowDimensions from 'Utilities/windowDimensions'
import { Grid } from 'semantic-ui-react'

const DesktopView = () => {
  return (
    <div>
      <Grid columns={2} divided>
        <Grid.Row>
          <Grid.Column>
            <EloChart />
          </Grid.Column>
          <Grid.Column>
            <Following />
            </Grid.Column>
        </Grid.Row>
      </Grid>
      <div>
        <MedalSummary />
      </div>
    </div>
  )
}

const MobileView = () => {
  return (
    <div>
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