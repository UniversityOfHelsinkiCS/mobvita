import React from 'react'
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'

const EloChart = ({ eloHistory }) => {
  const options = {
    title: { text: 'Your Elo' },
    series: [{ data: eloHistory }],
  }
  return (
    <HighchartsReact
      highcharts={Highcharts}
      options={options}
    />
  )
}

export default EloChart
