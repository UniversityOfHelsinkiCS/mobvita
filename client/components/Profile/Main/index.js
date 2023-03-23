import React from 'react'
import Following from '../Following'
import EloChart from 'Components/HomeView/EloChart'
import MedalSummary from 'Components/HomeView/MedalSummary'

const Main = () => {
  return (
    <>
      <Following />
      <EloChart width="100%" />
      <MedalSummary />
    </>
  )
}

export default Main