import React from 'react'
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import { useSelector, shallowEqual } from 'react-redux'
import { useHistory } from 'react-router-dom'
import moment from 'moment-timezone'
import { useIntl } from 'react-intl'
import { Icon } from 'semantic-ui-react'
import { images, hiddenFeatures } from 'Utilities/common'

const EloChart = ({ width }) => {
  const { exerciseHistory, flashcardHistory } = useSelector(({ user }) => {
    const exerciseHistory = user.data.user.exercise_history
    const flashcardHistory = user.data.user.flashcard_history
    return { exerciseHistory, flashcardHistory }
  }, shallowEqual)
  const eloHistory = exerciseHistory.map(exercise => exercise.score)
  const weeklyPracticeTimeHistory = useSelector(({ user }) => user.data.user.weekly_times)
  const intl = useIntl()
  const history = useHistory()

  if (eloHistory.length === 0) return null

  const filteredHistory = []
  const weeks = weeklyPracticeTimeHistory.map(element => element.week).reverse()

  exerciseHistory.forEach(e => {
    const date = new Date(e.date)
    const week = moment(new Date(date)).week()
    const weekday = moment(new Date(date)).isoWeekday()

    if (weeks.find(element => element === week)) {
      filteredHistory.push({ weekday, score: e.score, week })
    }
  })

  const eloResults =
    exerciseHistory && exerciseHistory.map(e => [moment(e.date).valueOf(), e.score])

  const flashcardEloResults =
    flashcardHistory && flashcardHistory.map(e => [moment(e.date).valueOf(), e.score])

  // Extend the curve to current day
  if (eloResults && eloResults[0]) {
    eloResults.push([moment().valueOf(), eloResults[eloResults.length - 1][1]])
  }

  if (flashcardEloResults && flashcardEloResults[0]) {
    flashcardEloResults.push([
      moment().valueOf(),
      flashcardEloResults[flashcardEloResults.length - 1][1],
    ])
  }

  const practicetimes = {
    type: 'column',
    yAxis: 1,
    xAxis: 1,
    data: weeklyPracticeTimeHistory.map(element => [element.week, element.practice_time]).reverse(),
  }

  const series = [practicetimes, { data: eloResults }]
  if (hiddenFeatures) series.push({ data: flashcardEloResults, color: '#dc3545' })

  const options = {
    title: { text: '' },
    series,
    chart: { height: '45%', marginTop: 20 },
    legend: { enabled: false },
    credits: { enabled: false },
    tooltip: {
      formatter() {
        // eslint-disable-next-line react/no-this-in-sfc
        return this.y
      },
    },
    yAxis: [
      {
        title: { enabled: false },
        // eslint-disable-next-line
        tickPositioner: function () {
          // eslint-disable-next-line
          return [Math.floor(this.dataMin / 10) * 10, Math.ceil(this.dataMax / 10) * 10]
        },
      },
      {
        title: {
          text: intl.formatMessage({ id: 'Practiced hours' }),
          rotation: 0,
          align: 'high',
          offset: 32,
          y: -10,
          reserveSpace: false,
          style: {
            direction: 'rtl',
            whiteSpace: 'nowrap',
          },
        },
        opposite: true,
      },
    ],
    xAxis: [
      { visible: false, min: moment().subtract(4, 'weeks').valueOf() },
      {
        visible: true,
        title: {
          text: intl.formatMessage({ id: 'Week' }),
          align: 'low',
          offset: 8,
          x: -42,
        },
        tickInterval: 1,
      },
    ],
    plotOptions: {
      series: {
        groupPadding: 0,
        pointPadding: 0,
        borderWidth: 0,
      },
      line: { marker: { enabled: false } },
    },
  }

  const showStoryElo = exerciseHistory && exerciseHistory.length > 0
  const showFlashcardElo = hiddenFeatures && flashcardHistory?.length > 0

  return (
    <div
      style={{ textAlign: 'center', width, cursor: 'pointer', alignSelf: 'flex-start' }}
      onClick={() => history.push('/profile/progress')}
    >
      <div className="space-evenly padding-bottom-1">
        {showStoryElo && (
          <span>
            <Icon name="star outline" style={{ margin: 0 }} />{' '}
            {exerciseHistory[exerciseHistory.length - 1].score}
          </span>
        )}
        {showFlashcardElo && (
          <span>
            <img
              src={images.flashcardIcon}
              alt="three cards"
              width="18px"
              style={{ marginRight: '0.2em' }}
            />
            {flashcardHistory[flashcardHistory.length - 1].score}
          </span>
        )}
      </div>
      <HighchartsReact highcharts={Highcharts} options={options} allowChartUpdate={false} />
    </div>
  )
}

export default EloChart
