import React, { useState } from 'react'
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import moment from 'moment'
import { useIntl } from 'react-intl'
import { hiddenFeatures } from 'Utilities/common'
import useWindowDimensions from 'Utilities/windowDimensions'
import { useDispatch, useSelector } from 'react-redux'
import { Checkbox } from 'semantic-ui-react'

const VocabularyGraph = ({ vocabularyData }) => {
  //   const { flashcard, seen, total, now, visit } = useSelector(({ user }) => user.vocabularyData)

  const dispatch = useDispatch()

  if (!vocabularyData) return <div className="mt-xl">Loading...</div>

  const { flashcard, seen, total, visit } = vocabularyData

  const [showSeen, setShowSeen] = useState(true)
  const [showFlashcard, setShowFlashcard] = useState(true)
  const [showVisit, setShowVisit] = useState(true)
  const [showTotal, setShowTotal] = useState(true)

  const intl = useIntl()
  const smallScreen = useWindowDimensions().width < 640

  // const getSeries = () => {
  //   const temp = []

  //   if (showSeen) {
  //     const seenNow = {
  //       name: 'Seen',
  //       data: seen.now,
  //     }
  //     const seenBefore = {
  //       name: 'Seen (before)',
  //       data: seen[Object.keys(seen).filter(key => key !== 'now')[0]],
  //     }
  //     temp.push(seenNow)
  //     temp.push(seenBefore)
  //   }

  //   if (showFlashcard) {
  //     const flashcardNow = {
  //       name: 'Flashcard',
  //       data: flashcard.now,
  //     }
  //     const flashardBefore = {
  //       name: 'Flashcard (before)',
  //       data: flashcard[Object.keys(flashcard).filter(key => key !== 'now')[0]],
  //     }
  //     temp.push(flashcardNow)
  //     temp.push(flashardBefore)
  //   }

  //   if (showVisit) {
  //     const visitNow = {
  //       name: 'Visit',
  //       data: visit.now,
  //     }
  //     const visitBefore = {
  //       name: 'Visit (before)',
  //       data: visit[Object.keys(visit).filter(key => key !== 'now')[0]],
  //     }
  //     temp.push(visitNow)
  //     temp.push(visitBefore)
  //   }
  //   if (showTotal) {
  //     const totalNow = {
  //       name: 'Total',
  //       data: total.now,
  //     }
  //     const totalBefore = {
  //       name: 'Total (before)',
  //       data: total[Object.keys(total).filter(key => key !== 'now')[0]],
  //     }
  //     temp.push(totalNow)
  //     temp.push(totalBefore)
  //   }
  //   return temp
  // }

  // const series = getSeries()

  // const series = [{ name: intl.formatMessage({ id: 'Stories' }), data: storyData }]

  // if (hiddenFeatures) {
  //   series.push({
  //     name: intl.formatMessage({ id: 'Flashcards' }),
  //     data: flashcardData,
  //     color: '#dc3545',
  //   })
  // }

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
        id: 'Total',
        data: total.now,
      },
      {
        name: 'Total (before)',
        data: total[Object.keys(total).filter(key => key !== 'now')[0]],
        linkedTo: 'Total',
      },
      {
        name: 'Visit',
        id: 'Visit',
        data: visit.now,
      },
      {
        name: 'Visit (before)',
        data: visit[Object.keys(visit).filter(key => key !== 'now')[0]],
        linkedTo: 'Visit',
      },
      {
        name: 'Seen',
        id: 'Seen',
        data: seen.now,
      },
      {
        name: 'Seen (before)',
        data: seen[Object.keys(seen).filter(key => key !== 'now')[0]],
        linkedTo: 'Seen',
      },
      {
        name: 'Flashcard',
        id: 'Flashcard',
        data: flashcard.now,
      },
      {
        name: 'Flashcard (before)',
        data: flashcard[Object.keys(flashcard).filter(key => key !== 'now')[0]],
        linkedTo: 'Flashcard',
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
        events: {
          legendItemClick() {
            this.chart.series.forEach(s => {
              s.name.substring(0, 3) !== this.name.substring(0, 3) ? s.hide() : s.show()
            }, this)

            return false
          },
        },
      },
    },
  }

  // const handleCheckBoxClick = (value, func) => {
  //   const categories = [showSeen, showFlashcard, showVisit, showTotal]
  //   let someOtherChecked = false
  //   let currentlyChecked = false

  //   categories.forEach(cat => {
  //     if (cat === value && value) currentlyChecked = true
  //     if (cat !== value && cat === true) someOtherChecked = true
  //   })

  //   if (currentlyChecked && !someOtherChecked) {
  //     console.log('not ok')
  //     return
  //   }
  //   func(!value)
  // }

  return (
    // <>
    //   <div className="flex gap-col-nm">
    //     <Checkbox
    //       label="Seen"
    //       checked={showSeen}
    //       onClick={() => setShowSeen(!showSeen)}
    //       // onClick={() => handleCheckBoxClick(showSeen, setShowSeen)}
    //     />
    //     <Checkbox
    //       label="Flashcard"
    //       checked={showFlashcard}
    //       onClick={() => setShowFlashcard(!showFlashcard)}
    //       // onClick={() => handleCheckBoxClick(showFlashcard, setShowFlashcard)}
    //     />
    //     {/* <Checkbox label="Visit" checked={showVisit} onClick={() => setShowVisit(!showVisit)} /> */}
    //     <Checkbox
    //       label="Visit"
    //       checked={showVisit}
    //       onClick={() => setShowVisit(!showVisit)}
    //       // onClick={() => handleCheckBoxClick(showVisit, setShowVisit)}
    //     />
    //     <Checkbox
    //       label="Total"
    //       checked={showTotal}
    //       onClick={() => setShowTotal(!showTotal)}
    //       // onClick={() => handleCheckBoxClick(showTotal, setShowTotal)}
    //     />
    //   </div>
    <HighchartsReact highcharts={Highcharts} options={options} />
    // </>
  )
}

export default VocabularyGraph
