import React, { useState, useMemo, useCallback } from 'react'
import { createPortal } from 'react-dom'
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import { useIntl } from 'react-intl'
import { hiddenFeatures } from 'Utilities/common'
import FormControlLabel from '@mui/material/FormControlLabel'
import AppSwitch from 'Components/ui/AppSwitch'
import useWindowDimensions from 'Utilities/windowDimensions'
import MasteredLegends from './MasteredLegends'
import Spinner from 'Components/Spinner'
import CustomTooltip from 'Components/CustomTooltip'
import FormattedHTMLMessage from 'Components/FormattedHTMLMessage'
import { colors } from 'Assets/mui_theme/designTokens'
import { vocabularySeries, LEGEND_HINT_ATTR } from 'Utilities/chartTheme'

// The legend label that belongs to each explanation, so the portal can restore the text Highcharts
// measured the item with.
const LEGEND_LABEL_IDS = {
  'overview-vocabulary-explanation': 'mastered-words',
  'vocabulary-total-explanation': 'vocabulary-total',
  'vocabulary-flashcard-explanation': 'vocabulary-flashcard',
}

const VocabularyGraph = ({
  vocabularyData,
  vocabularyPending,
  newerVocabularyData,
  newerVocabularyPending,
  graphType,
  setGraphType,
  xAxisLength,
  element,
}) => {  if (vocabularyPending || newerVocabularyPending) return <Spinner fullHeight spinnerColor={colors.ink} size={60} />

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
        vocabBins[i].encountered - vocabBins[i].mastered - vocabBins[i].rewardable,
      )
    }

    return initList
  }

  const notMastered = getNotMasteredData(currentPerc.vocab_bins)

  // Memoize the aggregate reduces so they only recompute when the underlying
  // bins change, instead of on every render.
  const { numEncountered, numRewardable, numMastered, numNotMastered } = useMemo(() => {
    const bins = currentPerc?.vocab_bins
    return {
      numEncountered: bins?.reduce((prev, curr) => prev + curr.encountered, 0),
      numRewardable: bins?.reduce((prev, curr) => prev + curr.rewardable, 0),
      numMastered: bins?.reduce((prev, curr) => prev + curr.mastered, 0),
      numNotMastered: notMastered?.reduce((prev, curr) => prev + curr, 0),
    }
  }, [currentPerc, notMastered])

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
            color: vocabularySeries.notMastered.barBefore,
          },
          {
            name: `${intl.formatMessage({ id: 'rewardable-words' })} ${intl.formatMessage({
              id: 'vocabulary-follow-statistic-before',
            })}`,
            id: 'Mastered (before rewardable)',
            data: previousPerc?.vocab_bins?.map(v => v.rewardable),
            linkedTo: 'Mastered',
            visible: false,
            color: vocabularySeries.rewardable.barBefore,
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
            color: vocabularySeries.mastered.barBefore,
            stack: 'before',
          },
          {
            name: `${intl.formatMessage({ id: 'not-mastered' })}`,
            id: 'Overview (not mastered)',
            data: notMastered,
            linkedTo: 'Mastered',
            color: vocabularySeries.notMastered.bar,
            stack: 'present',
          },
          {
            name: `${intl.formatMessage({ id: 'rewardable-words' })}`,
            id: 'Overview (rewardable)',
            data: currentPerc?.vocab_bins?.map(v => v.rewardable),
            linkedTo: 'Mastered',
            color: vocabularySeries.rewardable.bar,
            stack: 'present',
          },
          {
            name: `${intl.formatMessage({ id: 'mastered-words' })}`,
            id: 'Overview',
            data: currentPerc?.vocab_bins?.map(v => v.mastered),
            color: vocabularySeries.mastered.bar,
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
            color: vocabularySeries.mastered.barBefore,
            visible: false,
            stack: 'before',
          },
          {
            name: `${intl.formatMessage({ id: 'percent-graph' })}`,
            id: 'Curr Percentage',
            data: currentPerc.vocab_bins.map(v => v.mastering_percentage),
            color: vocabularySeries.mastered.bar,
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
            color: vocabularySeries.notMastered.barBefore,
          },
          {
            name: `${intl.formatMessage({ id: 'rewardable-words' })} ${intl.formatMessage({
              id: 'vocabulary-follow-statistic-before',
            })}`,
            id: 'Mastered (before rewardable)',
            data: previousPerc?.vocab_bins?.map(v => v.rewardable),
            linkedTo: 'Mastered',
            visible: false,
            color: vocabularySeries.rewardable.barBefore,
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
            color: vocabularySeries.mastered.barBefore,
            stack: 'before',
          },
          {
            name: `${intl.formatMessage({ id: 'not-mastered' })}`,
            id: 'Overview (not mastered)',
            data: notMastered,
            linkedTo: 'Mastered',
            color: vocabularySeries.notMastered.bar,
            stack: 'present',
          },
          {
            name: `${intl.formatMessage({ id: 'rewardable-words' })}`,
            id: 'Overview (rewardable)',
            data: currentPerc?.vocab_bins?.map(v => v.rewardable),
            linkedTo: 'Mastered',
            color: vocabularySeries.rewardable.bar,
            stack: 'present',
          },
          {
            name: `${intl.formatMessage({ id: 'mastered-words' })}`,
            id: 'Overview',
            data: currentPerc?.vocab_bins?.map(v => v.mastered),
            color: vocabularySeries.mastered.bar,
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
            color: vocabularySeries.mastered.barBefore,
            visible: false,
            stack: 'before',
          },
        ],
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

  // Each explanation hangs off the legend entry it describes, rather than a separate row of icons
  // repeating the same three labels below the chart.
  //
  // Highcharts owns the legend markup, so the hint cannot simply wrap a React element. With
  // `useHTML` the labels are real DOM nodes, which lets us render CustomTooltip into them through a
  // portal — that keeps Highcharts in charge of what the legend shows and how it is laid out, while
  // the hint itself is the app's own tooltip: styled like every other one, and obeying the user's
  // "show tooltips" setting (and the new-user default) instead of a bare browser `title`.
  const legendExplanations = {
    Overview: 'overview-vocabulary-explanation',
    Total: 'vocabulary-total-explanation',
    Flashcard: 'vocabulary-flashcard-explanation',
  }

  const [legendHints, setLegendHints] = useState([])

  const syncLegendHints = useCallback(chart => {
    const found = Array.from(
      chart.container.querySelectorAll(`[${LEGEND_HINT_ATTR}]`)
    ).map(node => ({ node, explanationId: node.dataset.legendExplanation }))

    setLegendHints(prev => {
      const unchanged =
        prev.length === found.length && prev.every((p, i) => p.node === found[i].node)
      if (unchanged) return prev
      // Highcharts sized the item from the text it rendered; hand the node over to React now that
      // the measuring is done, so the label is not printed twice.
      found.forEach(({ node }) => {
        node.textContent = ''
      })
      return found
    })
  }, [])

  const chartBase = {
    // Reused by every `setOptions` below: a legend click replaces `chart` wholesale, so both the
    // transparent background and the render hook that finds the legend labels have to travel with
    // it or they are silently lost after the first switch.
    type: 'column',
    backgroundColor: 'transparent',
    events: {
      render() {
        syncLegendHints(this)
      },
    },
  }

  const [options, setOptions] = useState({
    accessibility: { enabled: false },
    title: '',
    series,
    legend: {
      useHTML: true,
      labelFormatter() {
        const explanationId = legendExplanations[this.userOptions.id]
        if (!explanationId) return this.name
        // The text is emitted so Highcharts can measure the item; React replaces it on the next
        // commit with the same text wrapped in a tooltip.
        return `<span ${LEGEND_HINT_ATTR}="${explanationId}">${this.name}</span>`
      },
    },
    tooltip: {
      formatter() {
        return (
          `<b>${
            this.series.userOptions.id.includes('Percentage')
              ? `${parseFloat((this.y * 100).toFixed(1))}%`
              : this.y
          } ${this.series.userOptions.name}</b>` +
          '<br /> ' +
          // `ignoreTag` for the same reason FormattedHTMLMessage passes it: the message contains
          // literal <b> markup, and without it react-intl treats that as a rich-text element,
          // fails to find a `b` formatter, and returns the raw pattern — braces and all.
          `${intl.formatMessage(
            { id: 'word-group-tooltip' },
            { binNum: this.key },
            { ignoreTag: true }
          )}`
        )
      },
    },
    chart: chartBase,
    allowDecimals: false,
    alignTicks: false,

    xAxis: {
      type: 'category',
      // Opt out of the shared theme's vertical gridlines: this axis has one tick per word bin, so
      // a gridline per tick would draw ~100 lines across the plot.
      gridLineWidth: 0,
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
                chart: chartBase,
              })
            } else if (this.userOptions.id === 'Curr Percentage') {
              setGraphType('column')
              setOptions({
                ...options,
                chart: chartBase,
              })
            } else {
              setGraphType('area')
              setOptions({
                ...options,
                chart: { ...chartBase, type: 'area' },
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
      {/* CustomTooltip rendered into the legend labels Highcharts drew. When the user has tooltips
          switched off it returns the label bare, so the legend is unaffected. */}
      {legendHints.map(({ node, explanationId }) =>
        createPortal(
          <CustomTooltip
            title={<FormattedHTMLMessage id={explanationId} tagName="div" />}
            placement="top"
          >
            <span className="vocabulary-legend-label">
              {intl.formatMessage({ id: LEGEND_LABEL_IDS[explanationId] })}
            </span>
          </CustomTooltip>,
          node,
          explanationId
        )
      )}
      <div className="vocabulary-graph-footer">
        {(graphType === 'column mastered' || graphType === 'column') && (
          <FormControlLabel
            control={
              <AppSwitch
                checked={toggleOn}
                onChange={graphType === 'column' ? handlePercentageToggle : handleToggle}
                slotProps={{
                  input: {
                    'data-cy':
                      graphType === 'column'
                        ? 'vocabulary-graph-percentage-toggle'
                        : 'vocabulary-graph-mastered-toggle',
                  },
                }}
              />
            }
            label={intl.formatMessage({ id: 'vocab-master-toggle' })}
            sx={{ flexShrink: 0, mr: 0 }}
          />
        )}
      </div>
    </div>
  )
}

export default VocabularyGraph
