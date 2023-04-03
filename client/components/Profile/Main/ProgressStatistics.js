import React from 'react'
import { useSelector } from 'react-redux'
import ProgressStats from '../Progress/ProgressStats'
import moment from 'moment'

const ProgressStatistics = () => {
  const practiceHistory = useSelector(state => state.practiceHistory)
  const { exerciseHistory } = practiceHistory

  const endDate = moment().toDate()

  const startDate = moment(exerciseHistory[0]?.date).toDate()

  return <ProgressStats startDate={startDate} endDate={endDate} />
}

export default ProgressStatistics
