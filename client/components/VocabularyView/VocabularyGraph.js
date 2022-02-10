import React from 'react'
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import moment from 'moment'
import { useIntl } from 'react-intl'
import { hiddenFeatures } from 'Utilities/common'
import useWindowDimensions from 'Utilities/windowDimensions'
import { useDispatch, useSelector } from 'react-redux'

const VocabularyGraph = ({ vocabularyData }) => {
  //   const { flashcard, seen, total, now, visit } = useSelector(({ user }) => user.vocabularyData)

  const dispatch = useDispatch()

  if (!vocabularyData) return <div className="mt-xl">Loading...</div>

  const { flashcard, seen, total, visit } = vocabularyData

  const intl = useIntl()
  const smallScreen = useWindowDimensions().width < 640

  //   const storyData = exerciseHistory && exerciseHistory.map(e => [moment(e.date).valueOf(), e.score])
  //   const flashcardData =
  //     flashcardHistory && flashcardHistory.map(e => [moment(e.date).valueOf(), e.score])

  //   const series = [{ name: intl.formatMessage({ id: 'Stories' }), data: storyData }]

  //   if (hiddenFeatures) {
  //     series.push({
  //       name: intl.formatMessage({ id: 'Flashcards' }),
  //       data: flashcardData,
  //       color: '#dc3545',
  //     })
  //   }

  //   const height = smallScreen ? '75%' : '35%'

  const height = '70%'

  const binNumbers = Array.from(Array(10).keys())

  console.log('binNumbers:', binNumbers)
  console.log('total:', total)

  const levels = {
    1250: 'A1',
    1450: 'A2',
    1650: 'B1',
    1850: 'B2',
    2050: 'C1',
    2250: 'C2',
  }

  const options = {
    title: { text: 'Vocabulary chart' },
    // series,
    series: [
      {
        name: 'Total',
        data: total.now,
      },
      {
        name: 'Total (before)',
        data: total[Object.keys(total).filter(key => key !== 'now')[0]],
      },
      //   {
      //     name: 'Visit',
      //     data: visit.now,
      //   },
      //   {
      //     name: 'Visit (before)',
      //     data: visit[Object.keys(visit).filter(key => key !== 'now')[0]],
      //   },
      {
        name: 'Seen',
        data: seen.now,
      },
      {
        name: 'Seen (before)',
        data: seen[Object.keys(seen).filter(key => key !== 'now')[0]],
      },
    ],
    chart: { height },
    credits: { enabled: false },
    allowDecimals: false,
    alignTicks: false,
    // yAxis: [
    //   { title: { text: intl.formatMessage({ id: 'score' }) } },
    //   {
    //     opposite: true,
    //     linkedTo: 0,
    //     gridLineWidth: 0,
    //     tickPositions: Object.keys(levels).map(Number),
    //     labels: {
    //       formatter: function () {
    //         return levels[this.value]
    //       },
    //       style: {
    //         fontSize: '16px',
    //         color: 'slateGrey',
    //       },
    //     },
    //     title: { enabled: false },
    //   },
    // ],
    xAxis: {
      //   type: 'datetime',
      type: 'category',
      //   labels: { format: '{value:%Y/%m/%d}' },
      //   labels: binNumbers,
      //   allowDecimals: false,
      min: -1,
      max: 102,
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

export default VocabularyGraph
