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
  // const flashcardData =
  //   flashcardHistory && flashcardHistory.map(e => [moment(e.date).valueOf(), e.score])

  const series = []
  series.push({ name: intl.formatMessage({ id: 'Stories' }), data: storyData })

  // if (hiddenFeatures) {
  //   series.push({
  //     name: intl.formatMessage({ id: 'Flashcards' }),
  //     data: flashcardData,
  //     color: '#dc3545',
  //   })
  // }

  const height = smallScreen ? '75%' : '35%'

  // const elo_levels = {
  //   1250: 'A1',
  //   1450: 'A2',
  //   1650: 'B1',
  //   1850: 'B2',
  //   2050: 'C1',
  //   2250: 'C2',
  // }

  const levels = {
    9: 'A1',
    26: 'A2',
    43: 'B1',
    60: 'B2',
    77: 'C1',
    94: 'C2',
  }

  // if (exerciseHistory.length > 0) {
  //   exerciseHistory.sort((a,b) => a.score - b.score);
  //   const max_score = exerciseHistory[exerciseHistory.length - 1]['score']
  //   const min_score = exerciseHistory[0]['score']
  //   const score_gap = max_score - min_score
  //   const graph_max_score = max_score + (20 - score_gap)
  //   const graph_min_score = min_score - (20 - score_gap)
  // } else {
  //   const graph_max_score = 100
  //   const graph_min_score = 0
  // }

  // console.log('exerciseHistory', exerciseHistory)
  const options = {
    title: { text: intl.formatMessage({ id: 'language-level-timeline-chart' }) },
    series,
    chart: { height },
    credits: { enabled: false },
    allowDecimals: false,
    alignTicks: false,
    yAxis: [
      {
        title: { text: intl.formatMessage({ id: 'score' }) },
        min: 0,
        max: 100,
      },
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
