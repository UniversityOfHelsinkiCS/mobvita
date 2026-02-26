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
  xAxisLength,
  element,
}) => {
  //   const { flashcard, seen, total, now, visit } = useSelector(({ user }) => user.vocabularyData)
  if (vocabularyPending || newerVocabularyPending)
    return (
      <Spinner fullHeight size={60} />
    )

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
  const [toggleOn, setToggleOn] = useState(false)
  const intl = useIntl()
  const smallScreen = useWindowDimensions().width < 640

  const getTargetCurve = () => {
    let initTarget = []
    const B2 = newerVocabularyData.target_mastering_curves.B2.params

    for (let i = 0; i < currentPerc?.vocab_bins.length; i++) {
      initTarget = initTarget.concat(B2.B / (B2.C * i + B2.D))
    }
    return initTarget
  }

  const getNotMasteredData = vocabBins => {
    let initList = []

    for (let i = 0; i < vocabBins?.length; i++) {
      initList = initList.concat(
        vocabBins[i].encountered - vocabBins[i].mastered - vocabBins[i].rewardable
      )
    }

    return initList
  }

  const notMastered = getNotMasteredData(currentPerc.vocab_bins)

  const numEncountered = currentPerc?.vocab_bins?.reduce((prev, curr) => prev + curr.encountered, 0)
  const numRewardable = currentPerc?.vocab_bins?.reduce((prev, curr) => prev + curr.rewardable, 0)
  const numMastered = currentPerc?.vocab_bins?.reduce((prev, curr) => prev + curr.mastered, 0)
  const numNotMastered = notMastered?.reduce((prev, curr) => prev + curr, 0)

  const [series, setSeries] = useState(
    hiddenFeatures
      ? [
          {
            name: `${intl.formatMessage({ id: 'not-mastered' })} ${intl.formatMessage({
              id: 'vocabulary-follow-statistic-before',
            })}`,
            id: 'Not Mastered (before)',
            data: getNotMasteredData(previousPerc?.vocab_bins),
            linkedTo: 'Mastered',
            visible: false,
            stack: 'before',
            color: '#FAA0A0',
          },
          {
            name: `${intl.formatMessage({ id: 'rewardable-words' })} ${intl.formatMessage({
              id: 'vocabulary-follow-statistic-before',
            })}`,
            id: 'Mastered (before rewardable)',
            data: previousPerc?.vocab_bins?.map(v => v.rewardable),
            linkedTo: 'Mastered',
            visible: false,
            color: '#5FBDC2',
            stack: 'before',
          },
          {
            name: `${intl.formatMessage({ id: 'mastered-words' })} ${intl.formatMessage({
              id: 'vocabulary-follow-statistic-before',
            })}`,
            id: 'Mastered (before)',
            data: previousPerc?.vocab_bins?.map(v => v.mastered),
            linkedTo: 'Mastered',
            visible: false,
            color: '#90EE90',
            stack: 'before',
          },
          {
            name: `${intl.formatMessage({ id: 'not-mastered' })}`,
            id: 'Overview (not mastered)',
            data: notMastered,
            linkedTo: 'Mastered',
            color: '#DC143C',
            stack: 'present',
          },
          {
            name: `${intl.formatMessage({ id: 'rewardable-words' })}`,
            id: 'Overview (rewardable)',
            data: currentPerc?.vocab_bins?.map(v => v.rewardable),
            linkedTo: 'Mastered',
            color: '#4169e1',
            stack: 'present',
          },
          {
            name: `${intl.formatMessage({ id: 'mastered-words' })}`,
            id: 'Overview',
            data: currentPerc?.vocab_bins?.map(v => v.mastered),
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
            data: previousPerc?.vocab_bins?.map(v => v.mastering_percentage),
            id: 'Percentage (before)',
            linkedTo: 'Percentage',
            color: '#90EE90',
            visible: false,
            stack: 'before',
          },
          {
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
            data: getTargetCurve(),
            linkedTo: 'Percentage',
            type: 'spline',
            visible: false,
          },
        ]
      : [
          {
            name: `${intl.formatMessage({ id: 'not-mastered' })} ${intl.formatMessage({
              id: 'vocabulary-follow-statistic-before',
            })}`,
            id: 'Not Mastered (before)',
            data: getNotMasteredData(previousPerc?.vocab_bins),
            linkedTo: 'Mastered',
            visible: false,
            stack: 'before',
            color: '#FAA0A0',
          },
          {
            name: `${intl.formatMessage({ id: 'rewardable-words' })} ${intl.formatMessage({
              id: 'vocabulary-follow-statistic-before',
            })}`,
            id: 'Mastered (before rewardable)',
            data: previousPerc?.vocab_bins?.map(v => v.rewardable),
            linkedTo: 'Mastered',
            visible: false,
            color: '#5FBDC2',
            stack: 'before',
          },
          {
            name: `${intl.formatMessage({ id: 'mastered-words' })} ${intl.formatMessage({
              id: 'vocabulary-follow-statistic-before',
            })}`,
            id: 'Mastered (before)',
            data: previousPerc?.vocab_bins?.map(v => v.mastered),
            linkedTo: 'Mastered',
            visible: false,
            color: '#90EE90',
            stack: 'before',
          },
          {
            name: `${intl.formatMessage({ id: 'not-mastered' })}`,
            id: 'Overview (not mastered)',
            data: notMastered,
            linkedTo: 'Mastered',
            color: '#DC143C',
            stack: 'present',
          },
          {
            name: `${intl.formatMessage({ id: 'rewardable-words' })}`,
            id: 'Overview (rewardable)',
            data: currentPerc?.vocab_bins?.map(v => v.rewardable),
            linkedTo: 'Mastered',
            color: '#4169e1',
            stack: 'present',
          },
          {
            name: `${intl.formatMessage({ id: 'mastered-words' })}`,
            id: 'Overview',
            data: currentPerc?.vocab_bins?.map(v => v.mastered),
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
            data: previousPerc?.vocab_bins?.map(v => v.mastering_percentage),
            id: 'Percentage (before)',
            linkedTo: 'Percentage',
            color: '#90EE90',
            visible: false,
            stack: 'before',
          },
          /*
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
      data: getTargetCurve(),
      linkedTo: 'Percentage',
      type: 'spline',
      visible: false,
    },
    */
        ]
  )

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
    if (toggleOn) {
      handleHide(copySeries[10], 10)
      setSeries(copySeries)
      setToggleOn(false)
    } else {
      handleShow(copySeries[10], 10)

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
            this.series.userOptions.id.includes('Percentage')
              ? `${parseFloat((this.y * 100).toFixed(1))}%`
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
            setToggleOn(false)
            if (this.userOptions.id === 'Overview') {
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
      {graphType === 'column mastered' && numEncountered > 0 && (
        <div className="flex-reverse">
          <MasteredLegends
            numEncountered={numEncountered}
            numRewardable={numRewardable}
            numMastered={numMastered}
            numNotMastered={numNotMastered}
          />
        </div>
      )}
      <HighchartsReact ref={element} highcharts={Highcharts} options={options} />
      <div className="flex-reverse">
        {graphType === 'column mastered' && (
          <span>
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
          <span>
            <Checkbox
              toggle
              checked={toggleOn}
              onChange={handlePercentageToggle}
              label={`${intl.formatMessage({ id: 'vocab-master-toggle' })}`}
              style={{ marginRight: '.5em' }}
            />
          </span>
        )}
        <span style={{ marginRight: graphType === 'column mastered' ? '.1em' : '10em' }}>
          <VocabularyTooltips graphType={graphType} />
        </span>
      </div>
    </div>
  )
}

export default VocabularyGraph
