import React from 'react'
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import { useSelector, shallowEqual } from 'react-redux'
import { useHistory } from 'react-router-dom'
import moment from 'moment-timezone'
import { useIntl } from 'react-intl'
import { Icon } from 'semantic-ui-react'
import { images } from 'Utilities/common'

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

  exerciseHistory.forEach((e) => {
    const date = new Date(e.date)
    const week = moment(new Date(date)).week()
    const weekday = moment(new Date(date)).isoWeekday()

    if (weeks.find(element => element === week)) {
      filteredHistory.push({ weekday, score: e.score, week })
    }
  })

  // Code for having a curve with fake data point for each day without data
  // const eloResults = []
  // let previousScore
  // let score = null
  // weeks.forEach((weekNumber) => {
  //   for (let day = 1; day <= 7; day++) {
  //     const element = filteredHistory.find(element => element.week === weekNumber && element.weekday === day)
  //     if (element) {
  //       score = element.score
  //       eloResults.push(score)
  //     } else {
  //       previousScore = score
  //       eloResults.push(null)
  //     }
  //   }
  // })


  // for (let i = 0; i < eloResults.length; i++) { // Replace beginning nulls
  //   if (eloResults[i]) {
  //     for (let j = i; j >= 0; j--) {
  //       eloResults[j] = eloResults[i]
  //     }
  //     break
  //   }
  // }

  // for (let i = 0; i < eloResults.length; i++) { // Fill blank days
  //   if (!eloResults[i]) {
  //     eloResults[i] = eloResults[i - 1]
  //   }
  // }

  const eloResults = exerciseHistory
    && exerciseHistory.map(e => [moment(e.date).valueOf(), e.score])

  const flashcardEloResults = flashcardHistory
    && flashcardHistory.map(e => [moment(e.date).valueOf(), e.score])

  // Extend the curve to current day
  if (eloResults && eloResults[0]) {
    eloResults.push([moment().valueOf(), eloResults[eloResults.length - 1][1]])
  }

  if (flashcardEloResults && flashcardEloResults[0]) {
    flashcardEloResults.push([moment().valueOf(), flashcardEloResults[flashcardEloResults.length - 1][1]])
  }

  const practicetimes = {
    type: 'column',
    yAxis: 1,
    xAxis: 1,
    data: weeklyPracticeTimeHistory.map(element => [element.week, element.practice_time]).reverse(),
  }

  const getFourWeekElo = history => history
    .filter(data => moment(data.date).valueOf() > moment().subtract(4, 'weeks').valueOf())
    .map(data => data.score)

  const getLastEntryBeforeFourWeeks = (history, fourWeekElo) => {
    return fourWeekElo < history
      && history[history.length - fourWeekElo.length - 1]
  }

  const getMinY = (lastEntryBeforeFourWeeks, fourWeekElo) => (lastEntryBeforeFourWeeks
    && lastEntryBeforeFourWeeks.score < Math.min(...fourWeekElo)
    ? Math.floor(lastEntryBeforeFourWeeks.score / 10) * 10
    : Math.floor(Math.min(...fourWeekElo) / 10) * 10)

  const getMaxY = (lastEntryBeforeFourWeeks, fourWeekElo) => (lastEntryBeforeFourWeeks
    && lastEntryBeforeFourWeeks.score > Math.max(...fourWeekElo)
    ? Math.ceil(lastEntryBeforeFourWeeks.score / 10) * 10
    : Math.ceil(Math.max(...fourWeekElo) / 10) * 10)

  const storyFourWeekElo = getFourWeekElo(exerciseHistory)
  const flashcardFourWeekElo = getFourWeekElo(flashcardHistory)

  const storyLastEntryBeforeFourWeeks = getLastEntryBeforeFourWeeks(exerciseHistory, storyFourWeekElo)
  const flashcardLastEntryBeforeFourWeeks = getLastEntryBeforeFourWeeks(flashcardHistory, flashcardFourWeekElo)

  const minY = Math.min(
    getMinY(flashcardLastEntryBeforeFourWeeks, flashcardFourWeekElo),
    getMinY(storyLastEntryBeforeFourWeeks, storyFourWeekElo),
  )

  const maxY = Math.max(
    getMaxY(flashcardLastEntryBeforeFourWeeks, flashcardFourWeekElo),
    getMaxY(storyLastEntryBeforeFourWeeks, storyFourWeekElo),
  )

  // const fourWeekElo = exerciseHistory
  //   .filter(data => moment(data.date).valueOf() > moment().subtract(4, 'weeks').valueOf())
  //   .map(data => data.score)

  // const lastBeforeFourWeeks = fourWeekElo < exerciseHistory
  //   && exerciseHistory[exerciseHistory.length - fourWeekElo.length - 1]

  // const minY = lastBeforeFourWeeks && lastBeforeFourWeeks.score < Math.min(...fourWeekElo)
  //   ? Math.floor(lastBeforeFourWeeks.score / 10) * 10
  //   : Math.floor(Math.min(...fourWeekElo) / 10) * 10

  // const maxY = lastBeforeFourWeeks && lastBeforeFourWeeks.score > Math.max(...fourWeekElo)
  //   ? Math.ceil(lastBeforeFourWeeks.score / 10) * 10
  //   : Math.ceil(Math.max(...fourWeekElo) / 10) * 10


  // const maxElo = Math.max(...eloHistory)
  // const minElo = Math.min(...eloHistory)

  // const maxYTick = maxElo === minElo
  //   ? Math.ceil(maxElo / 10) * 10 + 100
  //   : Math.ceil(maxElo / 10) * 10

  // const minYTick = maxElo === minElo
  //   ? Math.floor(minElo / 10) * 10 - 100
  //   : Math.floor(minElo / 10) * 10

  const options = {
    title: { text: '' },
    series: [practicetimes, { data: eloResults }, { data: flashcardEloResults, color: '#dc3545' }],
    chart: { height: '45%', marginTop: 20 },
    legend: { enabled: false },
    credits: { enabled: false },
    tooltip: {
      formatter() {
        // eslint-disable-next-line react/no-this-in-sfc
        return this.y
      },
    },
    yAxis: [{
      title: { enabled: false },
      min: minY,
      max: maxY,
      endOnTick: false,
      startOnTick: false,
      tickPositions: [maxY, minY],
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
    }],
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
  return (
    <div style={{ textAlign: 'center', width, cursor: 'pointer', alignSelf: 'flex-start' }} onClick={() => history.push('/profile/progress')}>
      <div className="space-evenly padding-bottom-1">
        <span><Icon name="star outline" style={{ margin: 0 }} /> {exerciseHistory[exerciseHistory.length - 1].score}</span>
        <span>
          <img
            src={images.flashcardIcon}
            alt="three cards"
            width="18px"
            style={{ marginRight: '0.2em' }}
          />
          {flashcardHistory[flashcardHistory.length - 1].score}
        </span>
      </div>
      <HighchartsReact
        highcharts={Highcharts}
        options={options}
        allowChartUpdate={false}
      />
    </div>
  )
}

export default EloChart
