import React from 'react'
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import moment from 'moment'
import { useIntl } from 'react-intl'
import useWindowDimensions from 'Utilities/windowDimensions'


const HoursProgressChart = ({ practiceTimeHistory, startDate, endDate }) => {
  const intl = useIntl()
  const smallScreen = useWindowDimensions().width < 700

  const height = smallScreen ? '75%' : '35%'

  const practicetimes = {
    type: 'column',
    yAxis: 1,
    xAxis: 1,
    data: practiceTimeHistory && practiceTimeHistory.map(e => [moment(e.week).valueOf(), Math.round(e.time * 10) / 10])
  }

  const series = [practicetimes]

  console.log(practiceTimeHistory)

  const options = {
    title: { text: intl.formatMessage({ id: 'practiced-time-chart' }) },
    series,
    chart: { height },
    legend: { enabled: false },
    credits: { enabled: false },
    tooltip: {
      formatter() {
        // eslint-disable-next-line react/no-this-in-sfc
        return this.y
      },
    },
    yAxis: [
      {
        title: { enabled: false },
        // eslint-disable-next-line
        tickPositioner: function () {
          // eslint-disable-next-line
          return [Math.floor(this.dataMin / 10) * 10, Math.ceil(this.dataMax / 10) * 10]
        },
      },
      {
        title: {
          text: intl.formatMessage({ id: 'Practiced hours' }),
          rotation: 0,
          align: 'high',
          offset: 32,
          y: -10,
          reserveSpace: false,
          style: {
            direction: 'rtl',
            whiteSpace: 'nowrap',
          },
        },
        opposite: true,
      },
    ],
    xAxis: [
      {
        visible: false,
      },
      {
        visible: true,
        title: {
          text: intl.formatMessage({ id: 'Week' }),
          align: 'low',
          offset: 8,
          x: -24,
        },
        tickInterval: 1,
        min: moment(startDate).week().valueOf(),
        max: moment(endDate).week().valueOf(),
      },
    ],
    plotOptions: {
      series: {
        groupPadding: 0,
        pointPadding: 0,
        borderWidth: 0,
        animation: false
      },
      line: { marker: { enabled: false } },
    },
  }

  return <HighchartsReact highcharts={Highcharts} options={options} />
}

export default HoursProgressChart