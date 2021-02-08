import React from 'react'
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import moment from 'moment'
import { useIntl } from 'react-intl'
import { hiddenFeatures } from 'Utilities/common'
import useWindowDimensions from 'Utilities/windowDimensions'

const ProgressGraph = ({ exerciseHistory, flashcardHistory, startDate, endDate }) => {
  const intl = useIntl()
  const smallScreen = useWindowDimensions().width < 640

  const storyData = exerciseHistory && exerciseHistory.map(e => [moment(e.date).valueOf(), e.score])
  const flashcardData =
    flashcardHistory && flashcardHistory.map(e => [moment(e.date).valueOf(), e.score])

  const series = [{ name: intl.formatMessage({ id: 'Stories' }), data: storyData }]

  if (hiddenFeatures) {
    series.push({
      name: intl.formatMessage({ id: 'Flashcards' }),
      data: flashcardData,
      color: '#dc3545',
    })
  }

  const height = smallScreen ? '75%' : '35%'

  const levels = {
    1250: 'A1',
    1450: 'A2',
    1650: 'B1',
    1850: 'B2',
    2050: 'C1',
    2250: 'C2',
  }

  const options = {
    title: { text: '' },
    series,
    chart: { height },
    credits: { enabled: false },
    allowDecimals: false,
    alignTicks: false,
    yAxis: [
      { title: { text: intl.formatMessage({ id: 'score' }) } },
      {
        opposite: true,
        linkedTo: 0,
        gridLineWidth: 0,
        tickPositions: Object.keys(levels).map(Number),
        labels: {
          formatter: function () {
            return levels[this.value]
          },
          style: {
            fontSize: '16px',
            color: 'slateGrey',
          },
        },
        title: { enabled: false },
      },
    ],
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
      },
    },
  }

  return <HighchartsReact highcharts={Highcharts} options={options} />
}

export default ProgressGraph
