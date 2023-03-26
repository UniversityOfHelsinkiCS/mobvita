import React, { shallowEqual } from 'react'
import ProgressStats from '../Progress/ProgressStats'
import moment from 'moment'
import { useSelector } from 'react-redux'

const ProgressStatistics = () => {

  const {
    exerciseHistory: exerciseHistoryGraph
  } = useSelector(({ user }) => {
    const exerciseHistory = user.data.user.exercise_history
    return {
      exerciseHistory
    }
  }, shallowEqual)

  const originalEndPoint =
    exerciseHistoryGraph?.length > 0
      ? moment(exerciseHistoryGraph[exerciseHistoryGraph.length - 1]?.date)
          .add(1, 'days')
          .toDate()
      : moment().toDate()

  const getStartDate = () => {
    const firstPractice = moment(exerciseHistoryGraph[0]?.date).toDate()
    const sixMonthsAgo = moment(originalEndPoint).subtract(6, 'months').toDate()

    if (firstPractice < sixMonthsAgo) {
      return sixMonthsAgo
    }

    return firstPractice
  }

  const startDate = null
  const endDate = null

  return (
    <ProgressStats startDate={startDate} endDate={endDate} />
  )
} 

export default ProgressStatistics