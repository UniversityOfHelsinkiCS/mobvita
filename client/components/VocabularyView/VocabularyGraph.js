import React from 'react'
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import moment from 'moment'
import { useIntl, FormattedMessage, FormattedHTMLMessage } from 'react-intl'
import { Checkbox } from 'semantic-ui-react'
import { Button } from 'react-bootstrap'
import useWindowDimensions from 'Utilities/windowDimensions'
import MasteredLegends from './MasteredLegends'
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
  xAxisLength,
  targetCurve,
  element,
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

  const numEncountered = currentPerc.vocab_bins.reduce((prev, curr) => prev + curr.encountered, 0)
  const numRewardable = currentPerc.vocab_bins.reduce((prev, curr) => prev + curr.rewardable, 0)
  const numMastered = currentPerc.vocab_bins.reduce((prev, curr) => prev + curr.mastered, 0)
  const numNotMastered = notMastered.reduce((prev, curr) => prev + curr, 0)

  const { flashcard, seen, total, visit } = vocabularyData
  const newFlashcard = newerVocabularyData.flashcard
  const newSeen = newerVocabularyData.seen
  const newTotal = newerVocabularyData.total
  const newVisit = newerVocabularyData.visit

  const intl = useIntl()
  const smallScreen = useWindowDimensions().width < 640

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
  let toggleOn = false

  const handleToggle = () => {
    console.log('attempting')
    if (element?.current.chart.series[8].userOptions.visible) {
      element.current.chart.series[8].hide()
      element.current.chart.series[9].hide()
      element.current.chart.series[10].hide()
      toggleOn = false
    } else {
      element.current.chart.series[8].show()
      element.current.chart.series[9].show()
      element.current.chart.series[10].show()
      toggleOn = true
    }
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
        name: `${intl.formatMessage({ id: 'not-mastered' })} ${intl.formatMessage({
          id: 'vocabulary-follow-statistic-before',
        })}`,
        id: 'Not Mastered (before)',
        data: notMasteredBefore,
        linkedTo: 'Mastered',
        visible: false,
        stack: 'before',
        color: '#FAA0A0',
      },
      {
        name: `${intl.formatMessage({ id: 'rewardable-words' })} Rewardable ${intl.formatMessage({
          id: 'vocabulary-follow-statistic-before',
        })}`,
        id: 'Mastered (before rewardable)',
        data: previousPerc.vocab_bins.map(v => v.rewardable),
        linkedTo: 'Mastered',
        visible: false,
        color: '#5FBDC2',
        stack: 'before',
      },
      {
        name: `${intl.formatMessage({ id: 'mastered-words' })} Mastered ${intl.formatMessage({
          id: 'vocabulary-follow-statistic-before',
        })}`,
        id: 'Mastered (before)',
        data: previousPerc.vocab_bins.map(v => v.mastered),
        linkedTo: 'Mastered',
        visible: false,
        color: '#90EE90',
        stack: 'before',
      },
      {
        name: `${intl.formatMessage({ id: 'not-mastered' })}`,
        id: 'New Not Mastered',
        data: notMastered,
        visible: false,
        linkedTo: 'Mastered',
        color: '#DC143C',
        stack: 'present',
      },
      {
        name: `${intl.formatMessage({ id: 'rewardable-words' })}`,
        id: 'New Mastered (rewardable)',
        data: currentPerc.vocab_bins.map(v => v.rewardable),
        visible: false,
        linkedTo: 'Mastered',
        color: '#4169e1',
        stack: 'present',
      },
      {
        name: `${intl.formatMessage({ id: 'mastered-words' })}`,
        id: 'New Mastered',
        data: currentPerc.vocab_bins.map(v => v.mastered),
        visible: false,
        color: '#228B22',
        stack: 'present',
      },
      {
        name: `${intl.formatMessage({ id: 'percent-graph' })}`,
        id: 'Percentage',
        data: currentPerc.vocab_bins.map(v => v.mastering_percentage),
        visible: false,
        stack: 'present',
      },
      {
        name: `${intl.formatMessage({ id: 'percent-graph' })} ${intl.formatMessage({
          id: 'vocabulary-follow-statistic-before',
        })}`,
        data: previousPerc.vocab_bins.map(v => v.mastering_percentage),
        id: 'Percentage (before)',
        linkedTo: 'Percentage',
        visible: false,
        stack: 'before',
      },
      {
        name: `${intl.formatMessage({ id: 'target-curve' })}`,
        id: 'Percentage target',
        data: targetCurve,
        linkedTo: 'Percentage',
        type: 'spline',
        visible: false,
      },
    ],
    tooltip: {
      formatter() {
        return (
          `<b>${this.y} ${this.series.userOptions.name}</b>` +
          '<br /> ' +
          `${intl.formatMessage({ id: 'word-group-tooltip' }, { binNum: this.key })}`
        )
      },
    },
    chart: {
      type: graphType.substring(0, 6),
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

    xAxis: {
      type: 'category',
      labels: {
        rotation: 0,
        overflow: true,
        formatter() {
          if ((this.value === 3 && xAxisLength > 100) || (this.value === 2 && xAxisLength < 100)) {
            return `<b>${intl.formatMessage({ id: 'x-axis-simple' })}</b>`
          }
          if (this.value === 96 || (this.value === 48 && xAxisLength < 100)) {
            return `<b>${intl.formatMessage({ id: 'x-axis-difficult' })}</b>`
          }
          if (this.value % 25 === 0) {
            if (xAxisLength <= 50 && this.value === 25) {
              return this.value.toString()
            }
            if (this.value > 0 && this.value < 100) {
              return this.value.toString()
            }
          }

          return ''
        },
      },
      min: -1,
      max: xAxisLength,
    },
    yAxis: {
      title: {
        text: 'words',
      },
      labels: {
        enabled: true,
      },
      endOnTick: false,
    },
    plotOptions: {
      series: {
        allowPointSelect: true,
        shadow: false,
        dataLabels: {
          allowOverlap: false,
        },
        marker: { enabled: true },
        events: {
          legendItemClick() {
            if (this.userOptions.id === 'New Mastered') {
              setGraphType('column mastered')
            } else if (this.userOptions.id === 'Percentage') {
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
    <div>
      {graphType === 'column mastered' && (
        <div className="flex-reverse">
          <MasteredLegends
            numEncountered={numEncountered}
            numRewardable={numRewardable}
            numMastered={numMastered}
            numNotMastered={numNotMastered}
          />
          {/*
          <Checkbox
            toggle
            checked={toggleOn}
            onChange={handleToggle}
            label={`${intl.formatMessage({ id: 'vocab-master-toggle' })}`}
            style={{ marginRight: '.5em' }}
          />
          <span style={{ marginRight: '.5em' }}>
            <Button onClick={handleToggle}>
              <FormattedMessage id="vocab-master-toggle" />
            </Button>
          </span>
          */}
        </div>
      )}
      <HighchartsReact ref={element} highcharts={Highcharts} options={options} />
      <div className="flex-reverse">
        <Button onClick={handleToggle}>
          <FormattedMessage id="vocab-master-toggle" />
        </Button>
      </div>
      <VocabularyTooltips />
    </div>
  )
}

export default VocabularyGraph
