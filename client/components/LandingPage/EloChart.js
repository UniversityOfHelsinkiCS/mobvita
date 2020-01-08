import React from 'react'
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'

const EloChart = ({ eloHistory }) => {
  if (eloHistory.length === 0) return null

  const maxElo = Math.max(...eloHistory)
  const minElo = Math.min(...eloHistory)

  const options = {
    title: { text: '' },
    series: [{ data: eloHistory }],
    chart: { height: '35%' },
    legend: { enabled: false },
    credits: { enabled: false },
    yAxis: {
      title: { enabled: false },
      max: maxElo,
      min: minElo,
      endOnTick: false,
      startOnTick: false,
      tickAmount: 2,
    },
    // xAxis: { labels: { enabled: false } },
  }
  return (
    <HighchartsReact
      highcharts={Highcharts}
      options={options}
    />
  )
}

export default EloChart
