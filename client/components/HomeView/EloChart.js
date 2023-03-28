import React, { useEffect } from 'react'
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import { useSelector, shallowEqual, useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'
import moment from 'moment-timezone'
import { useIntl } from 'react-intl'
import { Icon } from 'semantic-ui-react'
import { images, hiddenFeatures } from 'Utilities/common'
import { getPracticeHistory } from 'Utilities/redux/practiceHistoryReducer'

const EloChart = ({ width }) => {
  const dispatch = useDispatch()
  const practiceHistory = useSelector(state => state.practiceHistory)
  const { exerciseHistory } = practiceHistory
  const { flashcardHistory } = practiceHistory
  const { streakToday } = practiceHistory

  useEffect(() => {
    dispatch(getPracticeHistory())
  }, [])

  const daysStreaked = useSelector(({ user }) => user.data.user.num_streaked_days)

  //tarkista tuo weekly practice time uudesta apista
  const eloHistory = exerciseHistory.map(exercise => exercise.score)
  const weeklyPracticeTimeHistory = useSelector(({ user }) => user.data.user.weekly_times)
  const intl = useIntl()
  const history = useHistory()

  // if (eloHistory.length === 0) return null

  const filteredHistory = []
  const weeks = weeklyPracticeTimeHistory.map(element => element.week).reverse()

  if (eloHistory.lenght > 0) {
    exerciseHistory.forEach(e => {
      const date = new Date(e.date)
      const week = moment(new Date(date)).week()
      const weekday = moment(new Date(date)).isoWeekday()

      if (weeks.find(element => element === week)) {
        filteredHistory.push({ weekday, score: e.score, week })
      }
    })
  }
  let eloResults = []
  if (exerciseHistory.lenght > 0) {
    eloResults = exerciseHistory && exerciseHistory.map(e => [moment(e.date).valueOf(), e.score])
  }
  let flashcardEloResults = []
  if (flashcardHistory.lenght > 0) {
    flashcardEloResults =
      flashcardHistory && flashcardHistory.map(e => [moment(e.date).valueOf(), e.score])
  }
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
          x: -24,
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
      className="homeview-item tour-progress"
      style={{
        width,
        textAlign: 'center',
        cursor: 'pointer',
        alignSelf: 'flex-start',
        padding: '1em .5em 0em .5em',
      }}
      onClick={() => history.push('/profile/progress')}
    >
      <div className="space-evenly pb-sm">
        {hiddenFeatures && (
          <span>
            <img
              src={images.flame}
              alt="flame"
              width="18px"
              style={{ marginRight: '0.2em' }}
            />
            {daysStreaked}
          </span>
        )}
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
