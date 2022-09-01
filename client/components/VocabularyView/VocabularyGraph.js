import React, { useState } from 'react'
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import { useIntl } from 'react-intl'
import { hiddenFeatures } from 'Utilities/common'
import { Checkbox } from 'semantic-ui-react'
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
  const [toggleOn, setToggleOn] = useState(false)
  const intl = useIntl()
  const smallScreen = useWindowDimensions().width < 640

  const height = '70%'
  console.log('chart ', graphType)
  const binNumbers = Array.from(Array(10).keys())
  const levels = {
    1250: 'A1',
    1450: 'A2',
    1650: 'B1',
    1850: 'B2',
    2050: 'C1',
    2250: 'C2',
  }
  // let toggleOn = false
  const [series, setSeries] = useState([
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
      linkedTo: 'Mastered',
      color: '#DC143C',
      stack: 'present',
    },
    {
      name: `${intl.formatMessage({ id: 'rewardable-words' })}`,
      id: 'New Mastered (rewardable)',
      data: currentPerc.vocab_bins.map(v => v.rewardable),
      linkedTo: 'Mastered',
      color: '#4169e1',
      stack: 'present',
    },
    {
      name: `${intl.formatMessage({ id: 'mastered-words' })}`,
      id: 'New Mastered',
      data: currentPerc.vocab_bins.map(v => v.mastered),
      color: '#228B22',
      stack: 'present',
    },
    {
      name: intl.formatMessage({ id: 'vocabulary-total' }),
      id: 'Total',
      data: newTotal,
      visible: false,
    },
    {
      name: `${intl.formatMessage({ id: 'vocabulary-total' })} ${intl.formatMessage({
        id: 'vocabulary-follow-statistic-before',
      })}`,
      id: 'Total (before)',
      data: total,
      linkedTo: 'Total',
      visible: false,
    },
    /* 
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
    */
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
      name: `${intl.formatMessage({ id: 'percent-graph' })} ${intl.formatMessage({
        id: 'vocabulary-follow-statistic-before',
      })}`,
      data: previousPerc.vocab_bins.map(v => v.mastering_percentage),
      id: 'Percentage (before)',
      linkedTo: 'Percentage',
      color: '#90EE90',
      visible: false,
      stack: 'before',
    },
    hiddenFeatures && {
      name: `${intl.formatMessage({ id: 'percent-graph' })}`,
      id: 'Curr Percentage',
      data: currentPerc.vocab_bins.map(v => v.mastering_percentage),
      color: '#228B22',
      visible: false,
      stack: 'present',
    },
    {
      name: `${intl.formatMessage({ id: 'target-curve' })}`,
      id: 'Curr Percentage target',
      data: targetCurve,
      linkedTo: 'Percentage',
      type: 'spline',
      visible: false,
    },
  ])

  const handleHide = (s, index) => {
    s.visible = false
    element.current.chart.series[index].hide()
  }

  const handleShow = (s, index) => {
    s.visible = true
    element.current.chart.series[index].show()
  }

  const handleToggle = () => {
    const copySeries = [...series]
    if (toggleOn) {
      handleHide(copySeries[0], 0)
      handleHide(copySeries[1], 1)
      handleHide(copySeries[2], 2)

      setSeries(copySeries)
      setToggleOn(false)
    } else {
      handleShow(copySeries[0], 0)
      handleShow(copySeries[1], 1)
      handleShow(copySeries[2], 2)

      setSeries(copySeries)
      setToggleOn(true)
    }
  }

  const handlePercentageToggle = () => {
    const copySeries = [...series]
    if (element?.current.chart.series[10].userOptions.visible) {
      handleHide(copySeries[10], 10)
      setSeries(copySeries)
      setToggleOn(false)
    } else {
      handleShow(copySeries[14], 14)

      setSeries(copySeries)
      setToggleOn(true)
    }
  }

  const [options, setOptions] = useState({
    title: '',
    series,
    tooltip: {
      formatter() {
        return (
          `<b>${
            this.series.userOptions.id.substring(0, 10) === 'Percentage'
              ? `${(this.y * 100).toFixed(2)}%`
              : this.y
          } ${this.series.userOptions.name}</b>` +
          '<br /> ' +
          `${intl.formatMessage({ id: 'word-group-tooltip' }, { binNum: this.key })}`
        )
      },
    },
    chart: {
      type: 'column',
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
          /*
          if (this.value % 25 === 0) {
            if (xAxisLength <= 50 && this.value === 25) {
              return this.value.toString()
            }
            if (xAxisLength > 50 && this.value > 0 && this.value < 100) {
              return this.value.toString()
            }
          }
          */
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
            // console.log('toggle at click ', toggleOn)
            setToggleOn(false)
            if (this.userOptions.id === 'New Mastered') {
              setGraphType('column mastered')
              setOptions({
                ...options,
                chart: {
                  type: 'column',
                },
              })
            } else if (this.userOptions.id === 'Curr Percentage') {
              setGraphType('column')
              setOptions({
                ...options,
                chart: {
                  type: 'column',
                },
              })
            } else {
              setGraphType('area')
              setOptions({
                ...options,
                chart: {
                  type: 'area',
                },
              })
            }
            const copySeries = [...series]
            copySeries.forEach((s, index) => {
              s.id.substring(0, 3) !== this.userOptions.id.substring(0, 3)
                ? handleHide(s, index)
                : handleShow(s, index)
            }, this)
            setSeries(copySeries)

            return false
          },
        },
      },
      column: {
        stacking: 'normal',
      },
    },
  })

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
        </div>
      )}
      {/* 
      {graphType === 'column' && (
        <div className="flex-reverse">
          <Checkbox
            toggle
            checked={toggleOn}
            onChange={handlePercentageToggle}
            label={`${intl.formatMessage({ id: 'vocab-master-toggle' })}`}
            style={{ marginRight: '.5em' }}
          />
        </div>
      )}
      */}
      <HighchartsReact ref={element} highcharts={Highcharts} options={options} />
      <VocabularyTooltips />
      {graphType === 'column mastered' && (
        <span className="flex-reverse">
          <Checkbox
            toggle
            checked={toggleOn}
            onChange={handleToggle}
            label={`${intl.formatMessage({ id: 'vocab-master-toggle' })}`}
            style={{ marginRight: '.5em' }}
          />
        </span>
      )}
      {graphType === 'column' && (
        <span className="flex-reverse">
          <Checkbox
            toggle
            checked={toggleOn}
            onChange={handlePercentageToggle}
            label={`${intl.formatMessage({ id: 'vocab-master-toggle' })}`}
            style={{ marginRight: '.5em' }}
          />
        </span>
      )}
    </div>
  )
}

export default VocabularyGraph
