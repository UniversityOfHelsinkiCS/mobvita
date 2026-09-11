import React from 'react'
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import 'Utilities/chartTheme'
import moment from 'moment'
import { useIntl } from 'react-intl'
import useWindowDimensions from 'Utilities/windowDimensions'
import { colors } from 'Assets/mui_theme/designTokens'

const XpProgressGraph = ({ xpHistory, startDate, endDate }) => {
  const intl = useIntl()
  const smallScreen = useWindowDimensions().width < 700

  let xpSum = 0

  const xpData = xpHistory && xpHistory.map(e => [moment(e.date).valueOf(), (xpSum += e.xp)])

  const series = []
  series.push({ name: 'XP', data: xpData })

  const height = smallScreen ? '75%' : '35%'

  const options = {
    accessibility: { enabled: false },
    title: { text: intl.formatMessage({ id: 'xp-timeline-chart' }) },
    series,
    chart: { height, spacingBottom: 8 },
    allowDecimals: false,
    alignTicks: false,
    yAxis: {
      title: { text: 'XP' },
      min: 0,
      max: xpSum + 10,
    },
    xAxis: {
      type: 'datetime',
      allowDecimals: false,
      min: moment(startDate).valueOf(),
      max: moment(endDate).valueOf(),
    },
    plotOptions: {
      series: {
        allowPointSelect: true,
        marker: { enabled: true },
        color: colors.alert,
      },
    },
  }

  return <HighchartsReact highcharts={Highcharts} options={options} />
}

export default XpProgressGraph
