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
    tooltip: {
      formatter() {
        // eslint-disable-next-line react/no-this-in-sfc
        return this.y
      },
    },
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
    <div style={{ textAlign: 'center' }}>
      <span style={{ display: 'inline-block', paddingBottom: '1em' }}>{`Your current ELO: ${eloHistory[eloHistory.length - 1]}`}</span>
      <HighchartsReact
        highcharts={Highcharts}
        options={options}
      />
    </div>
  )
}

export default EloChart
