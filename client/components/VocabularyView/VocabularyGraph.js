import React from 'react'
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import moment from 'moment'
import { useIntl } from 'react-intl'
import useWindowDimensions from 'Utilities/windowDimensions'
import { Icon, Popup } from 'semantic-ui-react'
import VocabularyTooltips from './VocabularyTooltips'

const VocabularyGraph = ({
  vocabularyData,
  vocabularyPending,
  newerVocabularyData,
  newerVocabularyPending,
  graphType,
  setGraphType,
  notMastered,
  notMasteredBefore,
  endWords,
  targetCurve,
}) => {
  //   const { flashcard, seen, total, now, visit } = useSelector(({ user }) => user.vocabularyData)

  if (vocabularyPending || newerVocabularyPending) return <div className="mt-xl">Loading...</div>

  if (
    !vocabularyData ||
    vocabularyData?.length < 1 ||
    !newerVocabularyData ||
    newerVocabularyData?.length < 1
  ) {
    return <div>No data to show</div>
  }

  const currentPerc = newerVocabularyData.mastering_percentage
  const previousPerc = vocabularyData.mastering_percentage

  const { flashcard, seen, total, visit } = vocabularyData
  const newFlashcard = newerVocabularyData.flashcard
  const newSeen = newerVocabularyData.seen
  const newTotal = newerVocabularyData.total
  const newVisit = newerVocabularyData.visit

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

  const levels = {
    1250: 'A1',
    1450: 'A2',
    1650: 'B1',
    1850: 'B2',
    2050: 'C1',
    2250: 'C2',
  }

  const options = {
    title: '',
    // series,'
    series: [
      {
        name: intl.formatMessage({ id: 'vocabulary-total' }),
        id: 'Total',
        data: newTotal,
      },
      {
        name: `${intl.formatMessage({ id: 'vocabulary-total' })} ${intl.formatMessage({
          id: 'vocabulary-follow-statistic-before',
        })}`,
        id: 'Total (before)',
        data: total,
        linkedTo: 'Total',
      },
      {
        name: intl.formatMessage({ id: 'vocabulary-seen' }),
        id: 'Seen',
        data: newSeen,
        visible: false,
      },
      {
        name: `${intl.formatMessage({ id: 'vocabulary-seen' })} ${intl.formatMessage({
          id: 'vocabulary-follow-statistic-before',
        })}`,
        id: 'Seen (before)',
        data: seen,
        linkedTo: 'Seen',
        visible: false,
      },
      {
        name: intl.formatMessage({ id: 'vocabulary-visit' }),
        id: 'Visit',
        data: newVisit,
        visible: false,
      },
      {
        name: `${intl.formatMessage({ id: 'vocabulary-visit' })} ${intl.formatMessage({
          id: 'vocabulary-follow-statistic-before',
        })}`,
        id: 'Visit (before)',
        data: visit,
        linkedTo: 'Visit',
        visible: false,
      },
      {
        name: intl.formatMessage({ id: 'vocabulary-flashcard' }),
        id: 'Flashcard',
        data: newFlashcard,
        visible: false,
      },
      {
        name: `${intl.formatMessage({ id: 'vocabulary-flashcard' })} ${intl.formatMessage({
          id: 'vocabulary-follow-statistic-before',
        })}`,
        id: 'Flashcard (before)',
        data: flashcard,
        linkedTo: 'Flashcard',
        visible: false,
      },
      {
        name: 'Not Mastered',
        id: 'New Not Mastered',
        data: notMastered,
        visible: false,
        linkedTo: 'Mastered',
        color: '#DC143C',
        stack: 'present',
      },
      {
        name: 'Mastered',
        id: 'New Mastered',
        data: newFlashcard,
        visible: false,
        color: '#228B22',
        stack: 'present',
      },
      {
        name: `Not Mastered ${intl.formatMessage({
          id: 'vocabulary-follow-statistic-before',
        })}`,
        id: 'New Not Mastered (before)',
        data: notMasteredBefore,
        linkedTo: 'Mastered',
        visible: false,
        stack: 'before',
        color: '#FAA0A0',
      },
      {
        name: `Mastered ${intl.formatMessage({
          id: 'vocabulary-follow-statistic-before',
        })}`,
        id: 'New Mastered (before)',
        data: flashcard,
        linkedTo: 'Mastered',
        visible: false,
        color: '#90EE90',
        stack: 'before',
      },
      {
        name: 'Percentage',
        id: 'Percentage',
        data: currentPerc.vocab_bins.map(v => v.mastering_percentage),
        visible: false,
        stack: 'present',
      },
      {
        name: `Percentage ${intl.formatMessage({
          id: 'vocabulary-follow-statistic-before',
        })}`,
        data: previousPerc.vocab_bins.map(v => v.mastering_percentage),
        id: 'Percentage (before)',
        linkedTo: 'Percentage',
        visible: false,
        stack: 'before',
      },
      {
        name: 'Percentage target',
        id: 'Percentage target',
        data: targetCurve,
        linkedTo: 'Percentage',
        type: 'spline',
        visible: false,
      },
    ],
    chart: {
      type: graphType,
      /*
      events: {
        load: function () {
          var chart = this,
            legend = chart.legend;

            for (var i = 0, len = legend.allItems.length; i < len; i++) {
                (function(i) {
                    var item = legend.allItems[i].legendItem;
                    item.on('mouseover', function (e) {
                        setTestState(true)
                        console.log("mouseover" + i);
                    }).on('mouseout', function (e) {
                        setTestState(false)
                        console.log("mouseout" + i);
                    });
                })(i);
            }

        },
      },
      */
    },
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
      max: endWords < 200 && graphType === 'column' ? 50 : 102,
    },
    plotOptions: {
      series: {
        allowPointSelect: true,
        marker: { enabled: true },
        events: {
          legendItemClick() {
            if (this.userOptions.id === 'New Mastered' || this.userOptions.id === 'Percentage') {
              setGraphType('column')
            } else {
              setGraphType('area')
            }
            this.chart.series.forEach(s => {
              s.userOptions.id.substring(0, 3) !== this.userOptions.id.substring(0, 3)
                ? s.hide()
                : s.show()
            }, this)

            return false
          },
        },
      },
      column: {
        stacking: 'normal',
      },
    },
  }

  return (
    <>
      {graphType === 'column' && (
        <div className="flex-reverse">
          <Popup
            content={<div>Tooltip</div>}
            trigger={
              <Icon
                style={{ paddingRight: '0.75em', marginBottom: '0.5em', marginRight: '2em' }}
                name="info circle"
                color="grey"
              />
            }
          />
        </div>
      )}
      <HighchartsReact highcharts={Highcharts} options={options} />
      <VocabularyTooltips />
    </>
    // </>
  )
}

export default VocabularyGraph
