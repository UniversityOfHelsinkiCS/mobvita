import Highcharts from 'highcharts'
import { colors, font } from 'Assets/mui_theme/designTokens'

/**
 * Design-system skin for every Highcharts chart in the app.
 *
 * Applied once through `Highcharts.setOptions`, which Highcharts merges *under* each chart's own
 * options — so a chart keeps anything it sets explicitly (its own series colours, a custom tooltip
 * `formatter`, an axis it hides) and only inherits the chrome it does not care about.
 *
 * Deliberately NOT set here:
 *   legend.enabled - styling is shared, but whether a chart shows a legend at all stays local: the
 *                    vocabulary graph drives its whole view off legend clicks.
 *   axis titles    - each chart decides whether its axes need naming; only the styling is shared.
 */
/**
 * Vocabulary graph palette. The mastery bars are semantic — the "before" stack has to stay readable
 * next to the "present" one, and the copy names the hues ("blue cards", "green → mastered words"),
 * so the red/blue/green families are fixed; only the exact tones are the design system's.
 *
 * `bar` fills the stacked columns; `text` is the same hue darkened for the figures under the chart,
 * which sit on cream and need the contrast. Values without a token beside them are derived.
 */
export const vocabularySeries = {
  notMastered: {
    bar: '#E08A8A', // derived — colors.error lightened; it is usually the largest segment
    barBefore: '#F2CFCF', // derived
    text: '#B83A3A', // the danger-hover tone AppButton already uses
  },
  rewardable: {
    bar: colors.blueHover,
    barBefore: '#CBE3F5', // derived — blueHover washed out
    text: '#4A7FA8', // derived — blueHover darkened for body text
  },
  mastered: {
    bar: colors.progressLabel,
    barBefore: '#C6DCC3', // derived — progressLabel washed out
    text: '#5F7F4E', // derived — progressLabel darkened for body text
  },
  target: colors.folderIconStroke,
}

/**
 * Marker attribute a chart can put on a `useHTML` label so React can find the node and render into
 * it. Highcharts parses label HTML through its AST and deletes any attribute that is not on
 * `AST.allowedAttributes` (`class` and `id` are; `data-*` is not), so it has to be registered —
 * which is the extension point Highcharts documents for exactly this.
 */
export const LEGEND_HINT_ATTR = 'data-legend-explanation'

const AXIS_LABEL = { color: colors.muted, fontSize: '13px' }

const applyChartTheme = () => {
  if (!Highcharts.AST.allowedAttributes.includes(LEGEND_HINT_ATTR)) {
    Highcharts.AST.allowedAttributes.push(LEGEND_HINT_ATTR)
  }

  return Highcharts.setOptions({
    // Series without an explicit `color` cycle through the DS palette instead of Highcharts' own.
    colors: [colors.blue, colors.green, colors.alert, colors.progressLabel, colors.folderIconStroke],

    chart: {
      // The panel behind the chart supplies the surface colour.
      backgroundColor: 'transparent',
      style: { fontFamily: font.family },
    },

    title: {
      style: { color: colors.ink, fontSize: '15px', fontWeight: '600' },
    },

    subtitle: {
      style: { color: colors.muted, fontSize: '13px' },
    },

    credits: { enabled: false },

    xAxis: {
      lineWidth: 0,
      tickWidth: 0,
      gridLineWidth: 1,
      gridLineColor: colors.cardBorder,
      title: { style: AXIS_LABEL },
      labels: {
        style: AXIS_LABEL,
        // Never stack two labels on top of each other: drop ticks rather than overlap, and only
        // tilt when there is genuinely no room.
        overflow: 'justify',
        autoRotation: [0, -20, -45],
      },
      // Scale the label to the tick unit a datetime axis lands on. A single fixed format is what
      // made the timeline and XP axes collide — every tick rendered a full `2024/03/12`.
      dateTimeLabelFormats: {
        day: '%e %b',
        week: '%e %b',
        month: "%b '%y",
        year: '%Y',
      },
    },

    yAxis: {
      gridLineColor: colors.cardBorder,
      gridLineDashStyle: 'Dash',
      labels: { style: AXIS_LABEL },
      title: { style: AXIS_LABEL },
    },

    // Centred under the plot, with round swatches that match the tooltip's dot.
    legend: {
      align: 'center',
      verticalAlign: 'bottom',
      borderWidth: 0,
      itemDistance: 20,
      squareSymbol: true,
      symbolRadius: 5,
      symbolHeight: 10,
      symbolWidth: 10,
      itemStyle: { color: colors.ink, fontWeight: '500', fontSize: '13px' },
      itemHoverStyle: { color: colors.muted },
      itemHiddenStyle: { color: colors.emptyState },
    },

    // White rounded card with a soft shadow. `useHTML` is what lets the point row carry the round
    // series swatch; charts that supply their own `formatter` keep the card and replace the text.
    tooltip: {
      useHTML: true,
      backgroundColor: '#ffffff',
      borderWidth: 0,
      borderRadius: 12,
      shadow: { color: 'rgba(45, 44, 42, 0.18)', offsetX: 0, offsetY: 4, opacity: 0.18, width: 8 },
      padding: 12,
      style: { color: colors.ink, fontSize: '13px' },
      xDateFormat: '%A, %b %e at %I:%M:%S %p',
      headerFormat: `<div style="color:${colors.muted};margin-bottom:6px">{point.key}</div>`,
      pointFormat:
        '<span style="display:inline-block;width:9px;height:9px;border-radius:50%;' +
        'background:{series.color};margin-right:8px"></span>' +
        `<span style="color:${colors.ink}">{series.name}:</span> ` +
        `<b style="color:${colors.ink};margin-left:4px">{point.y}</b>`,
      footerFormat: '',
    },

    plotOptions: {
      series: {
        lineWidth: 2,
        marker: { symbol: 'circle', radius: 5, lineWidth: 0 },
        // Highcharts draws a line-plus-marker swatch for line series by default; a rectangle is
        // what `symbolRadius` rounds into the dot above.
        legendSymbol: 'rectangle',
      },
    },
  })
}

// Applied on import rather than from the app entry: every chart component imports this module, so
// the theme is guaranteed to be in place before Highcharts builds a chart, whatever the load order.
applyChartTheme()
