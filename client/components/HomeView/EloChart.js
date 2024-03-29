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
  const { flashcardHistory, daysStreaked } = useSelector(state => state.practiceHistory)
  const { practiceHistory } = useSelector(practiceHistory => practiceHistory)

  useEffect(() => {
    const date_now = moment().toDate()
    const start_query_date = moment('2021-01-01').toDate()
    dispatch(getPracticeHistory(start_query_date, date_now))
  }, [])

  const irtExerciseHistory = practiceHistory.irtExerciseHistory
  const scoreHistory = practiceHistory.irtExerciseHistory.map(exercise => exercise.score)
  const weeklyPracticeTimeHistory = useSelector(({ user }) => user.data.user.weekly_times)
  const intl = useIntl()
  const history = useHistory()

  // if (eloHistory.length === 0) return null

  const filteredHistory = []
  const weeks = weeklyPracticeTimeHistory.map(element => element.week).reverse()

  if (scoreHistory.length > 0) {
    irtExerciseHistory.forEach(e => {
      const date = new Date(e.date)
      const week = moment(new Date(date)).week()
      const weekday = moment(new Date(date)).isoWeekday()

      if (weeks.find(element => element === week)) {
        filteredHistory.push({ weekday, score: e.score, week })
      }
    })
  }
  let scoreResults = []
  if (irtExerciseHistory.lenght > 0) {
    scoreResults = irtExerciseHistory && irtExerciseHistory.map(e => [moment(e.date).valueOf(), e.score])
  }
  let flashcardEloResults = []
  if (flashcardHistory.lenght > 0) {
    flashcardEloResults =
      flashcardHistory && flashcardHistory.map(e => [moment(e.date).valueOf(), e.score])
  }
  // Extend the curve to current day
  if (scoreResults && scoreResults[0]) {
    scoreResults.push([moment().valueOf(), scoreResults[scoreResults.length - 1][1]])
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

  const series = [practicetimes, { data: scoreResults }]
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

  const showStoryScore = irtExerciseHistory && irtExerciseHistory.length > 0
  const showFlashcardScore = hiddenFeatures && flashcardHistory?.length > 0

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
        <span>
          <img
            src={images.flameIcon}
            alt="flame icon"
            width="18px"
            style={{ marginRight: '0.2em' }}
          />
          {daysStreaked}
        </span>

        {showStoryScore && (
          <span>
            <Icon name="star outline" style={{ margin: 0 }} />{' '}
            {irtExerciseHistory[irtExerciseHistory.length - 1].score}
          </span>
        )}
        {showFlashcardScore && (
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
