import React from 'react'
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import moment from 'moment'
import { useIntl } from 'react-intl'
import { hiddenFeatures } from 'Utilities/common'
import useWindowDimensions from 'Utilities/windowDimensions'
import { useSelector } from 'react-redux'

const XpProgressGraph = ({ startDate, endDate }) => {
  const intl = useIntl()
  const smallScreen = useWindowDimensions().width < 640
  const { xpHistory } = useSelector(({ practiceHistory }) => practiceHistory)

  let xpSum = 0

  const xpData = xpHistory && xpHistory.map(e => [moment(e.date).valueOf(), xpSum += e.xp])

  const series = []
  series.push({ name: 'XP', data: xpData })

  const height = smallScreen ? '75%' : '35%'

  const options = {
    title: { text: intl.formatMessage({ id: 'xp-timeline-chart' }) },
    series,
    chart: { height },
    credits: { enabled: false },
    allowDecimals: false,
    alignTicks: false,
    yAxis: {
      title: { text: 'XP' },
      min: 0,
      max: 1000,
    },
    xAxis: {
      type: 'datetime',
      labels: { format: '{value:%Y/%m/%d}' },
      allowDecimals: false,
      min: moment(startDate).valueOf(),
      max: moment(endDate).valueOf(),
    },
    plotOptions: {
      series: {
        allowPointSelect: true,
        marker: { enabled: true },
        color: '#FF530D'
      },
    },
  }

  return <HighchartsReact highcharts={Highcharts} options={options} />
}

export default XpProgressGraph