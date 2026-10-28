import React from 'react'
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import 'Utilities/chartTheme'
import dayjs from 'dayjs'
import isoWeek from 'dayjs/plugin/isoWeek'
import weekOfYear from 'dayjs/plugin/weekOfYear'
import isoWeeksInYear from 'dayjs/plugin/isoWeeksInYear'
import isLeapYear from 'dayjs/plugin/isLeapYear'
import advancedFormat from 'dayjs/plugin/advancedFormat'
import { useIntl } from 'react-intl'
import useWindowDimensions from 'Utilities/windowDimensions'

// Week numbers, ISO weeks and the `w` format token, as moment provided them for this chart.
for (const plugin of [isoWeek, weekOfYear, isoWeeksInYear, isLeapYear, advancedFormat]) {
  dayjs.extend(plugin)
}

const HoursProgressChart = ({ practiceTimeHistory, startDate, endDate }) => {
  const intl = useIntl()
  const smallScreen = useWindowDimensions().width < 700

  const height = smallScreen ? '75%' : '35%'

  const dataFormat = (data) => {
    return data.map(e => {
      // check if the year has 53 weeks
      const numOfWeeksInYear = dayjs().year(e.year).isoWeeksInYear()
      if (numOfWeeksInYear === 53 && e.weeks === 53) {
        e.week = 1
        e.year++
      }

      const timestamp = dayjs().year(e.year).week(e.week).startOf('isoWeek').valueOf()
      const value = Math.round(e.time * 10) / 10
      return [timestamp, value]
    })
  }

  const practicetimes = {
    type: 'column',
    yAxis: 1,
    xAxis: 1,
    data: practiceTimeHistory && dataFormat(practiceTimeHistory)
  }

  const series = [practicetimes]

  const options = {
    accessibility: { enabled: false },
    title: { text: intl.formatMessage({ id: 'practiced-time-chart' }) },
    series,
    chart: { height },
    legend: { enabled: false },
    tooltip: {
      formatter() {
        // eslint-disable-next-line react/no-this-in-sfc
        return `${this.y}, ${dayjs(this.x).format('w/YYYY')}`
      },
    },
    yAxis: [
      {
        // eslint-disable-next-line
        tickPositioner: function () {
          // eslint-disable-next-line
          return [Math.floor(this.dataMin / 10) * 10, Math.ceil(this.dataMax / 10) * 10]
        },
        visible: false
      },
      {
        title: {
          text: intl.formatMessage({ id: 'Practiced hours' }),
        },
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
        },
        type: 'datetime',
        labels: {
          formatter: function () {
            return dayjs(this.value).format('w/YYYY');
          }
        },
        min: dayjs(startDate).startOf('isoWeek').valueOf(),
        max: dayjs(endDate).startOf('isoWeek').valueOf(),
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