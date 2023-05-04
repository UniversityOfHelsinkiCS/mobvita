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

  const dataFormat = (data) => {
    return data.map(e => {
      // check if the year has 53 weeks
      const numOfWeeksInYear = moment().year(e.year).isoWeeksInYear()
      if (numOfWeeksInYear === 53 && e.weeks === 53) {
        e.week = 1
        e.year++
      }

      const timestamp = moment().year(e.year).week(e.week).startOf('isoWeek').valueOf()
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
    title: { text: intl.formatMessage({ id: 'practiced-time-chart' }) },
    series,
    chart: { height },
    legend: { enabled: false },
    credits: { enabled: false },
    tooltip: {
      formatter() {
        // eslint-disable-next-line react/no-this-in-sfc
        return `${this.y}, ${moment(this.x).format('w/Y')}`
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
        type: 'datetime',
        labels: {
          formatter: function () {
            return moment(this.value).format('w/Y');
          }
        },
        min: moment(startDate, 'DD-MM-YYYY').startOf('isoWeek').valueOf(),
        max: moment(endDate, 'DD-MM-YYYY').startOf('isoWeek').valueOf(),
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